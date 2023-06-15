<template>
  <resourcedialog
      :title="title"
      :dialogType="dialogType"
      :visible.sync="resourcedialogVisible"
      @assignResource="assignResource"
      >
      <div style="overflow: auto; overflow-y: auto">
        <el-card
          v-loading="listLoading"
          shadow="always"
          style="overflow: auto;height: 500px;"
        >
          <el-tree
            ref="tree"
            node-key="id"
            show-checkbox
            :data="resourceData"
          />
        </el-card>
      </div>
    </resourcedialog>
</template>

<script>
import { assignResource } from '@/api/right/role';
import { treeQuery } from '@/api/right/resource'
import resourcedialog from './resource-dialog.vue'
export default {
  name: "assignresource",
  components:{resourcedialog},
  props: {
    // resourcedialogVisible:{ type: Boolean, default: false },
    roleVo:{ type: undefined, required:true,default:[]},
  },
  data() {
    return {
      title:'资源分配',
      dialogType:'resource',
      resourceIdList:[],
      resourcedialogType: '',
      resourceData: [],
      roleIdList:[],
      isReviewPerMission: false,
      resourcedialogVisible:false,
      listLoading:false
      // roleVo:this.roleVo,
    };
  },
  methods: {
    /**
     * 处理资源树结构
     * @param list treeQuery请求返回的数组
     * @return 返回处理后的数组结构
     */
     treeTransform(list) {
      var tree = []
      // 存储一级节点（系统）
      list.map((item) => {
        if (parseInt(item.parentId) === -1 && item.resourceType === 2) {
          tree.push({ label: item.name, id: item.id, children: [] })
        }
      })
      // 存储二级节点（主菜单）
      tree.map((itemParent) => {
        list.map((item) => {
          if (itemParent.id === item.parentId) {
            itemParent.children.push({
              id: item.id,
              label: item.name,
              children: []
            })
          }
        })
      })
      // 存储三级节点（子菜单）
      tree.map((itemParent) => {
        itemParent.children.map((itemSecondParent) => {
          list.map((item) => {
            if (itemSecondParent.id === item.parentId) {
              itemSecondParent.children.push({
                id: item.id,
                label: item.name,
                children: []
              })
            }
          })
        })
      })
      // 存储四级节点（请求权限）
      tree.map((itemParent) => {
        itemParent.children.map((itemSecondParent) => {
          itemSecondParent.children.map((itemthirdParent) => {
            list.map((item) => {
              if (itemthirdParent.id === item.parentId) {
                itemthirdParent.children.push({ id: item.id, label: item.name })
              }
            })
          })
        })
      })
      return tree
    },
    /**
     * 构建资源树并预填入资源信息
     */
     getResourceTree() {
      // const roleVo = this.$refs.roleTable.selection
      const roleVo = this.roleVo
      this.listLoading = true
      this.isReviewPerMission = false
      this.resourcedialogVisible = true
      const resourceQuery = {}
      resourceQuery.pageSize = 1000
      treeQuery(resourceQuery)
        .then((response) => {
          this.resourceData = this.treeTransform(response.data)
          // for (let i = 0; i < roleVo.length; i++) {
          //   this.roleIdList.push(roleVo[i].id)
          // }
          // 根据角色的id查询到角色所对应的资源进行打钩
          if (roleVo.length === 1) {
            this.fillResourceTree(roleVo[0].id)
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '资源树查询失败!'
          })
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    /**
     * 查询某角色对应的资源
     * @param roleId 所选角色的id
     */
    fillResourceTree(roleId) {
      const resourceQuery = {}
      resourceQuery.pageSize = 1000
      resourceQuery.roleId = roleId
      treeQuery(resourceQuery)
        .then((res) => {
          for (let i = 0; i < res.data.length; i++) {
            this.$refs.tree.setChecked(res.data[i].id, true, false)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    /**
     * 资源分配
     */
     assignResource() {
      const list = this.$refs.tree.getCheckedNodes()
      const listParent = this.$refs.tree.getHalfCheckedKeys()
      listParent.map((item) => {
        this.resourceIdList.push(item)
      })
      this.listLoading=true
      for (let i = 0; i < list.length; i++) {
        this.resourceIdList.push(list[i].id)
      }
      if (this.resourcedialogType === 'REVIEW') {
        this.resourcedialogType = ''
      } else {// 构建角色资源对象
        const roleVo = this.roleVo
        for (let i = 0; i < roleVo.length; i++) {
            this.roleIdList.push(roleVo[i].id)
        }
        const roleResourceDTO = {
          roleIds: this.roleIdList,
          resourceIds: this.resourceIdList
        }
        // 请求后端接口
        assignResource(roleResourceDTO)
          .then((response) => {
            this.$message({
              message: '分配成功',
              type: 'success'
            })
            this.resourcedialogVisible = false
            this.resourceIdList = []
            this.roleIdList = []
            // 进行重新加载
            this.$emit("fetchData", 1)
          })
          .catch(() => {
            this.$message({
              message: '分配失败',
              type: 'error'
            })
          }).finally(()=>{
            this.listLoading=false
          })
      }
    },

    /**
     * 查看权限
     * @param row 所选行
     */
     permission(row) {
      this.resourcedialogVisible = true
      this.resourcedialogType = 'REVIEW'
      this.isReviewPerMission = true
      const resourceQuery = {}
      resourceQuery.pageSize = 1000
      treeQuery(resourceQuery).then((response) => {
        this.resourceData = this.treeTransform(response.data)

        // 查看权限时，所有树节点全部禁用
        this.resourceData = this.disableTreeNode(this.resourceData)

        this.fillResourceTree(row.id)
        // debugger
      }).catch(() => {
          this.$message({
            type: 'error',
            message: '权限查询失败!'
          })
        })
    },

    /**
     * 树节点禁用
     * @param data 处理过的树结构
     * @return 将每个节点禁用
     */
    disableTreeNode(data) {
      data.map((item) => {
        this.$set(item, "disabled", true)
        if (item.children && item.children.length > 0){
          item.children = this.disableTreeNode(item.children)
        }
      })
      return data
    },

  }

};
</script>
