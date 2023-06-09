<template>
  <div>
    <!--右边主体部分-->
    <el-col :span="20">
      <el-card shadow="always" style="margin-left: 3px; border-top: none">
        <!--搜索框-->
        <el-row style="margin-left: 7px; margin-top: -7px">
          <div id="search">
            <el-form :inline="true">
              <el-form-item label="角色名称">
                <el-input
                  v-model="roleQuery.name"
                  placeholder="请输入角色名称"
                />
              </el-form-item>
              <el-button
                style="margin-left: 5px"
                type="primary"
                @click="queryRoleByName"
              >查询</el-button>
            </el-form>
          </div>
        </el-row>
        <!--上方操作链接-->
        <div style="margin-bottom: 20px; margin-top: -0px">
          <el-button
            style="margin-left: 5px"
            type="primary"
            @click=";(adddialogVisible = true), (roleDto.status = 1)"
          ><em class="el-icon-plus">增加</em></el-button>
          <el-button
            style="margin-left: 5px"
            type="danger"
            @click="batchRemoveRole"
          ><em class="el-icon-delete">删除</em></el-button>
          <el-button
            style="margin-left: 5px"
            type="primary"
            @click="getResourceTree"
          ><em class="el-icon-video-play"/>资源分配</el-button>
          <el-button
            style="margin-left: 5px"
            type="primary"
            @click="getUserAll"
          ><em class="el-icon-s-custom">用户分配</em></el-button>
          <el-button
            style="margin-left: 5px"
            type="primary"
            @click="getCompanyAll"
          ><em class="el-icon-s-custom">公司分配</em></el-button>
          <el-button
            style="margin-left: 5px"
            type="primary"
            @click="refreshData"
          ><em class="el-icon-refresh">刷新</em></el-button>
        </div>
        <!--主体表格-->
        <el-table
          ref="roleTable"
          v-loading="listLoading"
          :data="tableData"
          highlight-current-row
          style="width: 100%; margin-top: 10px"
          border
          height="600px"
          @row-dblclick="updateFromInfo"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column align="center" label="序号" width="95">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="角色" width="126" align="center">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="角色编号" align="center">
            <template slot-scope="scope">
              {{ scope.row.code }}
            </template>
          </el-table-column>
          <el-table-column
            label="角色备注"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.remark }}
            </template>
          </el-table-column>
          <el-table-column label="所属公司" align="center">
            <template slot-scope="scope">
              {{ scope.row.companyDTO.name }}
            </template>
          </el-table-column>
          <el-table-column label="所属机构" align="center">
            <template slot-scope="scope">
              {{ scope.row.organizationDTO.name }}
            </template>
          </el-table-column>
          <el-table-column label="启用" align="center">
            <template slot-scope="scope">
              <el-tag size="mini" type="success">
                {{ scope.row.status === 1 ? '启用' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template slot-scope="scope">
              <div>
                <el-button
                  style="margin-left: 5px"
                  size="mini"
                  type="primary"
                  v-clipboard:copy="onCopy(scope.row)"
                  v-clipboard:success="onCopySuccess"
                  v-clipboard:error="onCopyError"
                >复制</el-button>
                <el-button
                  style="margin-left: 5px"
                  size="mini"
                  @click="updateFromInfo(scope.row)"
                >编辑</el-button>
                <el-button
                  style="margin-left: 5px"
                  size="mini"
                  type="danger"
                  @click="removeRole(scope.row)"
                >删除</el-button>
                <el-button
                  style="margin-left: 5px"
                  size="mini"
                  type="warning"
                  @click="permission(scope.row)"
                >查看权限</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页条-->
        <el-pagination
          :v-model="rolePage"
          :current-page.sync="rolePage.pageNum"
          :page-size="rolePage.pageSize"
          :page-sizes="[10, 15, 20, 50, 100, 200]"
          layout="total,sizes,prev, pager, next, jumper"
          :total="rolePage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>
    </el-col>
    <!--  增加的弹框-->
    <sd-FormDialog
      :caption="addTitle"
      :visible="adddialogVisible"
      :model="roleDto"
      :rules="rules"
      width="60%"
      @OkButtonClick="addRole"
      @CancelButtonClick="adddialogVisible = false"
    >
      <el-row>
        <el-col :span="11">
          <el-form-item :span="12" label="角色名称" prop="name">
            <el-input v-model="roleDto.name" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="角色代码" prop="code">
            <el-input v-model="roleDto.code" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="角色备注" prop="remark">
            <el-input v-model="roleDto.remark" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="是否启用">
            <template>
              <el-radio v-model="roleDto.status" :label="1">是</el-radio>
              <el-radio v-model="roleDto.status" :label="0">否</el-radio>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </sd-FormDialog>
    <!--    更新的弹框-->
    <sd-FormDialog
      :caption="updateTitle"
      :visible="updatedialogVisible"
      :model="roleDto"
      :rules="rules"
      width="60%"
      @OkButtonClick="updateRole"
      @CancelButtonClick="updatedialogVisible = false"
    >
      <el-row>
        <el-col :span="11">
          <el-form-item :span="12" label="角色名称" prop="name">
            <el-input v-model="roleDto.name" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="角色代码" prop="code">
            <el-input v-model="roleDto.code" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="角色备注" prop="remark">
            <el-input v-model="roleDto.remark" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="是否启用">
            <template>
              <el-radio v-model="roleDto.status" :label="1">是</el-radio>
              <el-radio v-model="roleDto.status" :label="0">否</el-radio>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </sd-FormDialog>
    <!--用户分配的弹框-->
    <el-dialog
      v-dialogDrag
      title="用户分配"
      :visible.sync="userdialogVisible"
      width="60%"
      length="100%"
      :before-close="handleClose"
    >
      <el-form :inline="true">
        <el-form-item label="用户名称：">
          <el-input v-model="userQuery.name" placeholder="请输入用户名称" />
        </el-form-item>
        <el-button
          style="margin-left: 5px"
          type="primary"
          @click="queryUserByName"
        >查询</el-button>
      </el-form>
      <el-table
        ref="userTable"
        v-loading="listLoading"
        :data="userData"
        selectable
        highlight-current-row
        height="350"
        style="width: 100%"
        @select="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column label="用户工号" align="center">
          <template slot-scope="scope">
            {{ scope.row.code }}
          </template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="公司" align="center" prop="company.name" />
        <el-table-column label="部门" align="center" prop="departmentVO.name" />
      </el-table>
      <!-- 分页条-->
      <el-pagination
        :v-model="userPage"
        :current-page.sync="userPage.pageNum"
        :page-size="userPage.pageSize"
        :page-sizes="[15]"
        layout="total,sizes,prev, pager, next, jumper"
        :total="userPage.total"
        @size-change="handleUserSizeChange"
        @current-change="handleUserDataChange"
      />
      <span slot="footer">
        <el-button
          style="margin-left: 30px"
          @click="cancelUser"
        >取 消</el-button>
        <el-button type="primary" @click="assignUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--资源分配的弹框-->
    <el-dialog
      ref="tree"
      v-dialogDrag
      title="资源分配："
      :visible.sync="resourcedialogVisible"
      width="60%"
      length="100%"
      :before-close="handleClose"
    >
      <div style="overflow: auto; overflow-y: auto">
        <el-card
          v-loading="listLoading"
          shadow="always"
          class="box-card"
          style="overflow: auto"
        >
          <el-tree
            ref="tree"
            node-key="id"
            show-checkbox
            :data="resourceData"
            @node-click="handleNodeClick"
          />
        </el-card>
      </div>
      <span slot="footer">
        <el-button @click="resourcedialogVisible = false">取 消</el-button>
        <el-button v-if="!isReviewPerMission" type="primary" @click="assignResource">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 公司分配的弹框 -->
    <el-dialog
      v-dialogDrag
      title="公司分配"
      :visible.sync="companydialogVisible"
      width="60%"
      length="100%"
      :before-close="handleClose"
    >
      <el-table
        ref="companyTable"
        v-loading="listLoading"
        :data="companyData"
        selectable
        highlight-current-row
        height="350"
        style="width: 100%"
      >
        <el-table-column type="selection" />
        <el-table-column label="公司编号" align="center" prop="code" />
        <el-table-column label="公司名称" align="center" prop="name" />
      </el-table>
      <span slot="footer">
        <el-button
          style="margin-left: 30px"
          @click="cancelCompany"
        >取 消</el-button>
        <el-button type="primary" @click="assignCompany">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  add,
  remove,
  batchRemove,
  modify,
  commonQuery,
  queryRoleById,
  commonQueryUser,
  assignUser,
  selectCompany,
  assignResource,
  queryRoleCompany,
  modifyRoleCompany
} from '@/api/right/role'

import { commonQuery as companyQuery} from '@/api/org/company'
import { treeQuery } from '@/api/right/resource'


export default {
  name: 'Role',
  data: function() {
    return {
      addTitle: '增加角色',
      updateTitle: '修改角色',
      userTitle: '用户分配',
      resourceTitle: '资源分配',
      data: [],
      treeData: [],
      resourceData: [],
      // defaultProps: {
      //   children: 'children',
      //   label: 'name'
      // },
      listLoading: false,
      tableData: [],
      userData: [],
      companyData: [],
      rolePage: {
        total: null,
        // 页号
        pageNum: 1,
        // 页大小
        pageSize: 10,

        pages: null
      },
      userPage: {
        total: null,
        // 页号
        pageNum: 1,
        // 页大小
        pageSize: 15,

        pages: null
      },
      roleQuery: { companyId: '' },
      userQuery: {},
      roleResourceDTO: {},
      roleCompanyDTO: {
        roleIds: [],
        authCompanyIds: []
      },
      userdialogVisible: false,
      resourcedialogVisible: false,
      companydialogVisible: false,
      isReviewPerMission: false,
      // userData: null,
      // resourceTree: [],
      // resourceData: null,
      // userIdList: [],
      // resourceId: [],
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '角色编号不能为空', trigger: 'blur' }
        ],
        remark: [{ required: false, message: '备注不能为空', trigger: 'blur' }],
        companyId: [
          { required: true, message: '所属公司不能为空', trigger: 'change' }
        ]
      },
      adddialogVisible: false,
      updatedialogVisible: false,
      roleVo: {},
      roleDto: {
        name: '',
        code: '',
        remark: '',
        id: '',
        status: '',
        version: '',
        created_by: '',
        companyId: '',
        tenantId: '',
        orgId: ''
      },
      roleIdList: [],
      userIdList: [],
      resourceIdList: [],
      selected: '', // 被选中的行
      resourcedialogType: '',
      selectionData: [], // 保存选中的id
      dialogType: ''
    }
  },
  mounted() {},
  created() {
    this.fetchData(this.rolePage.pageNum)
    this.getCompany()
  },
  methods: {
    onCopy(row) {
      const res = {'角色':row.name,'角色编号':row.code,'角色备注':row.remark,'所属公司':row.companyDTO.name,'所属机构':row.organizationDTO.name}
      const stringifyRes = JSON.stringify(res)
      return stringifyRes
    },
    onCopySuccess() {
      this.$message({
        type: 'success',
        message: '复制成功'
      })
    },
    onCopyError() {
      this.$message({
        type: 'error',
        message: '复制失败'
      })
    },
    transform(list) {
      // var map = {}; var node; var tree = []; var i
      var tree = []
      // var firstNode = []
      // var secondNode = []
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
      // list.map(item => {
      //   if (parseInt(item.parentId) === 1 && item.resourceType === 0) {
      //     tree.push({ label: item.name, id: item.id, children: [] })
      //   }
      // })
      // 存储二级节点
      // list.map(item => {
      //   tree.map(itemParent => {
      //     if (itemParent.id === item.parentId) {
      //
      //       itemParent.children.push({ id: item.id, label: item.name })
      //     }
      //   })
      // })
      // tree.map(itemParent => {
      //   list.map(item => {
      //     if (itemParent.id === item.parentId) {
      //       itemParent.children.push({ id: item.id, label: item.name })
      //     }
      //   })
      // })
      // console.log(tree)

      // for (i = 0; i < list.length; i++) {
      //   map[list[i].id] = list[i]
      //   list[i].children = []
      // }
      // for (i = 0; i < list.length; i += 1) {
      //   node = list[i]
      //   if (node.parentId !== '-1') {
      //     map[node.parentId].children.push(node)
      //   } else {
      //     tree.push(node)
      //   }
      // }
      return tree

      // let map = {};
      // data.forEach(item => {
      //     if (! map[item.id]) {
      //         map[item.id] = item;
      //     }
      // });

      // data.forEach(item => {
      //     if (item.parentId != -1) {
      //         map[item.parentId].children ? map[item.parentId].children.push(item) : map[item.parentId].children = [item];
      //     }
      // });

      // return data.filter(item => {
      //     return item.parentId == -1
      // })
    },
    handleNodeClick() {
      // this.roleQuery.companyId = data.id
      // this.fetchData(1)
      // this.roleQuery = {}
    },
    /**
     * 分页逻辑
     *
     */
    handleSizeChange(val) {
      this.rolePage.pageSize = val
      this.fetchData(this.rolePage.pageNum)
    },
    handleCurrentChange(val) {
      this.fetchData(val)
    },
    handleUserSizeChange(val) {
      this.userPage.pageSize = val
      this.getUser(this.userPage.pageNum)
    },
    handleUserDataChange(val) {
      this.getUser(val)
      this.toggleSelection()
    },
    getCompany() {
      selectCompany()
        .then((response) => {
          this.data = response.data
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '公司查询失败!'
          })
        })
      console.log(this.data)
    },
    // 获取资源树
    getResourceTree() {
      const roleVo = this.$refs.roleTable.selection
      if (roleVo == null || roleVo.length === 0) {
        this.$message.error('至少选择一个角色进行操作')
        return
      }
      this.listLoading = true
      this.isReviewPerMission = false
      this.resourcedialogVisible = true
      const resourceQuery = {}
      resourceQuery.pageSize = 1000
      /**
       *  先查询到所有的资源构建出树
       */
      treeQuery(resourceQuery)
        .then((response) => {
          // this.resourceData = response.data
          console.log('response.data',response.data)
          this.resourceData = this.transform(response.data)
          for (let i = 0; i < roleVo.length; i++) {
            this.roleIdList.push(roleVo[i].id)
          }
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
    // 用户拥有资源的回填
    fillResourceTree(roleId) {
      const resourceQuery = {}
      resourceQuery.pageSize = 1000
      resourceQuery.roleId = roleId
      treeQuery(resourceQuery)
        .then((res) => {
          console.log(res)
          for (let i = 0; i < res.data.length; i++) {
            this.$refs.tree.setChecked(res.data[i].id, true, false)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    /***
     *  取得资源树的信息进行角色对应的资源的分配
     */
    assignResource() {
      const list = this.$refs.tree.getCheckedNodes()
      const listParent = this.$refs.tree.getHalfCheckedKeys()
      // const listParent = this.$refs.tree.data
      listParent.map((item) => {
        this.resourceIdList.push(item)
      })
      this.listLoading = true
      for (let i = 0; i < list.length; i++) {
        this.resourceIdList.push(list[i].id)
      }
      if (this.resourcedialogType === 'REVIEW') {
        this.resourcedialogType = ''
      } else {// 构建角色资源对象
        const roleResourceDTO = {
          roleIds: this.roleIdList,
          resourceIds: this.resourceIdList
        }
        console.log('roleResourceDTO',roleResourceDTO)
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
            this.fetchData(1)
          })
          .catch(() => {
            this.$message({
              message: '分配失败',
              type: 'error'
            })
          }).finally(()=>{
               this.listLoading = false
          })
       
      }

      // this.resourcedialogVisible = false
      // const roleResource = {
      //   resourceId: this.$refs.tree.getCheckedKeys(),
      //   roleId: this.selection
      // }
      // const roleResourceDTO = new RoleResourceDTO(roleResource)
      // this.assignRole(roleResourceDTO).then(response => {
      //   this.$message({
      //     message: '分配成功',
      //     type: 'success'
      //   })
      //   // 进行重新加载
      //   this.fetchData()
      // })
    },
    // 增加角色
    addRole() {
      this.adddialogVisible = false
      this.roleDto.version = '1'
      this.roleDto.createdBy = '2'
      this.roleDto.tenantId = '1'
      this.roleDto.companyId = '1'
      this.roleDto.orgId = '1337376369553833984'
      add(this.roleDto)
        .then((response) => {
          // 新增之后重新加载
          this.fetchData(1)
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 通过名字查询
    queryRoleByName() {
      this.rolePage.total = null
      this.rolePage.pages = null
      this.rolePage.pageNum = 1
      this.fetchData(this.rolePage.pageNum)
    },
    // 批量删除
    batchRemoveRole() {
      const roleVo = this.$refs.roleTable.selection
      if (roleVo == null || roleVo.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }
      const roleDtoS = new Array(roleVo.length)
      for (let i = 0; i < roleVo.length; i++) {
        roleDtoS[i] = {
          id: roleVo[i].id,
          version: roleVo[i].version,
          name:roleVo[i].name,
          code:roleVo[i].code
        }
      }
      if (roleDtoS.length !== 0) {
        this.$confirm('确定删除记录吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            batchRemove(roleDtoS).then((response) => {
              this.fetchData(1)
            })
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.$message({
          message: '请选择需要删除的数据',
          type: 'warning'
        })
      }
    },
    // 删除角色
    removeRole(row) {
      this.$confirm('确定删除记录吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          remove(row.id, row.version,row.name,row.code)
            .then((response) => {
              this.fetchData(1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // copyRole(row) {
    //   this.dialogType = 'copy'
    //   this.updatedialogVisible = true
    //   queryRoleById(row.id)
    //     .then((res) => {
    //       this.roleDto = res
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //     })
      // this.roleDto = row
      // this.selected = row
      // copy(row.id).then(response => {
      //   // this.fetchData(1)
      //   console.log(response)
      //   // debugger
      //   this.$message({
      //     type: 'success',
      //     message: '复制成功!'
      //   })
      // })
      //   .catch(() => {
      //     this.$message({
      //       type: 'error',
      //       message: '复制失败!'
      //     })
      //   })
    // },
    // 修改信息展示
    updateFromInfo(row) {
      this.updatedialogVisible = true
      this.dialogType = 'update'
      queryRoleById(row.id)
        .then((res) => {
          this.roleDto = res
        })
        .catch((err) => {
          console.log(err)
        })
        // this.roleDto = row
        // this.selected = row
    },
    // 修改或编辑角色
    updateRole() {
      if (this.dialogType === 'update') {
        const roleVo = JSON.parse(JSON.stringify(this.roleDto))
        modify(roleVo)
          .then((response) => {
            console.log(response)
            // debugger
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            // 新增之后重新加载
            this.fetchData(1)
            // Just to simulate the time of the request
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '修改失败!'
            })
          })
          .finally(() => {
            this.dialogType = ''
            this.roleVo = null
            this.updatedialogVisible = false
          })
      } else if (this.dialogType === 'copy') {
        this.roleDto.version = '1'
        this.roleDto.createdBy = '2'
        this.roleDto.tenantId = '1'
        this.roleDto.companyId = '1'
        this.roleDto.orgId = '1337376369553833984'
        const roleVo = JSON.parse(JSON.stringify(this.roleDto))
        add(roleVo)
          .then((response) => {
            // 新增之后重新加载
            this.fetchData(1)
            this.$message({
              type: 'success',
              message: '复制成功!'
            })
            // Just to simulate the time of the request
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          })
          .catch(() => {
            this.listLoading = false
          })
          .finally(() => {
            this.dialogType = ''
            this.updatedialogVisible = false
          })
      }
    },

    // 通过name查用户
    queryUserByName() {
      this.userPage.total = null
      this.userPage.pages = null
      this.userPage.pageNum = 1
      this.getUser(this.userPage.pageNum)
    },
    /**
     * 查询出系统用户 
     * @param
     */
    getUser(pageNum) {
      this.listLoading = true
      this.userQuery.total = this.userPage.total
      this.userQuery.pageNum = pageNum
      this.userQuery.pageSize = this.userPage.pageSize
      commonQueryUser(this.userQuery)
        .then((response) => {
          const { total, pageNum, pageSize, pages } = response // 如果异常则被axios 的拦截器拦截并且显示错误码和消息
          this.userPage.total = parseInt(total)
          this.userPage.pages = parseInt(pages)
          this.userData = response.data
          this.listLoading = false
          // debugger
          // setTimeout(() => {
          //   this.listLoading = false
          // }, 1.5 * 1000)
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 分配用户
    assignUser() {
      // 关闭弹窗
      const userVo = this.$refs.userTable.selection
      if (userVo == null || userVo.length === 0) {
        this.$message.error('至少选择一个用户进行操作')
        return
      }
      for (let i = 0; i < userVo.length; i++) {
        this.userIdList.push(userVo[i].id)
      }
      this.userdialogVisible = false
      console.log(this.roleIdList)
      const userRoleDTO = {
        roleIds: this.roleIdList,
        userIds: this.userIdList
      }
      assignUser(userRoleDTO)
        .then((response) => {
          this.$message({
            message: '分配成功',
            type: 'success'
          })
          this.userIdList = []
          this.roleIdList = []
          // 进行重新加载
          this.fetchData(1)
        })
        .catch(() => {
          this.$message({
            message: '分配失败',
            type: 'error'
          })
        })
        .finally(() => {
          this.selectionData = []
        })
    },
    // 取消用户分配
    cancelUser() {
      this.userdialogVisible = false
      this.selectionData = []
    },
    // 查询所有用户
    getUserAll() {
      const roleVo = this.$refs.roleTable.selection
      if (roleVo == null || roleVo.length === 0) {
        this.$message.error('至少选择一个角色进行操作')
        return
      }
      this.userdialogVisible = true
      for (let i = 0; i < roleVo.length; i++) {
        this.roleIdList.push(roleVo[i].id)
      }
      this.getUser(this.userPage.pageNum)
    },
    // 关闭弹窗
    handleClose() {
      this.adddialogVisible = false
      this.updatedialogVisible = false
      this.userdialogVisible = false
      this.resourcedialogVisible = false
      this.companydialogVisible = false
    },
    // eslint-disable-next-line no-dupe-keys,vue/no-dupe-keys
    refreshData() {
      this.fetchData(this.rolePage.pageNum)
    },
    fetchData(pageNum) {
      this.listLoading = true
      this.roleQuery.total = this.rolePage.total
      this.roleQuery.pageNum = pageNum
      this.roleQuery.pageSize = this.rolePage.pageSize
      commonQuery(this.roleQuery)
        .then((response) => {
          const { total, pageNum, pageSize, pages } = response // 如果异常则被axios 的拦截器拦截并且显示错误码和消息
          this.rolePage.total = parseInt(total)
          this.rolePage.pages = parseInt(pages)
          this.tableData = response.data
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
          const roleName = this.$route.query.name
          // 点击角色跳转存在则选中
          if (roleName) {
            const tableDate = this.tableData.find(
              (item) => item.name === roleName
            )
            this.$nextTick(() => {
              this.$refs.roleTable.toggleRowSelection(tableDate, true)
            })
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 查看权限
    permission(row) {
      this.resourcedialogVisible = true
      this.resourcedialogType = 'REVIEW'
      this.isReviewPerMission = true
      const resourceQuery = {}
      resourceQuery.pageSize = 1000
      treeQuery(resourceQuery).then((response) => {
        // this.resourceData = response.data
        console.log(response.data)
        this.resourceData = this.transform(response.data)

        // 查看权限时，所有树节点全部禁用
        this.resourceData = this.disableTreeNode(this.resourceData)

        // this.roleIdList.push(row.id)
        this.fillResourceTree(row.id)
        // debugger
      }).catch(() => {
          this.$message({
            type: 'error',
            message: '权限查询失败!'
          })
        })
    },

    // 禁用所有树节点
    disableTreeNode(data) {
      data.map((item) => {
        this.$set(item, "disabled", true)
        if (item.children && item.children.length > 0){
          item.children = this.disableTreeNode(item.children)
        }
      })
      return data
    },

    // 选择表格
    handleSelectionChange(selection, row) {
      const flag = selection.some((item) => {
        return item.id === row.id
      })
      const index = this.arrFindObjIndex(this.selectionData, row, 'id')
      if (!flag) {
        // selection中不包含row则是取消选中该行
        if (index !== -1) {
          this.selectionData.splice(index, 1)
        }
      } else {
        // selection中不包含row则是选中该行
        if (index === -1) {
          this.selectionData.push(row)
        }
      }
    },
    // 记忆选中表格的checkbox
    toggleSelection() {
      // if (roleVo.length === 1){
      //   this.userData.forEach((user) => {
      //     this.selectionData.forEach((selected) => {
      //       if (user.id === selected.id) {
      //         this.$refs.userTable.toggleRowSelection(user, true)
      //       }
      //     })
      //   })
      // }

      // setTimeout(() => {
      //   this.userData.forEach((user) => {
      //     this.selectionData.forEach((selected) => {
      //       if (user.id === selected.id) {
      //         this.$refs.userTable.toggleRowSelection(user, true)
      //       }
      //     })
      //   })
      // }, 500)
    },
    // 在一个对象数据中寻找某个对象的下标,通过key的值相等，判断数组中是否包含对象
    arrFindObjIndex(arr, obj, key) {
      let index = -1
      arr.forEach((item, idx) => {
        if (item[key] === obj[key]) {
          index = idx
        }
      })
      return index
    },
    // 获取所有公司信息
    getCompanyAll() {
      const roleVo = this.$refs.roleTable.selection
      if (roleVo == null || roleVo.length === 0) {
        this.$message.error('至少选择一个角色进行操作')
        return
      }
      this.companydialogVisible = true
      this.listLoading = true
      companyQuery({}).then(res => {
        this.companyData = res.data
        this.fillCompanyInfo(roleVo)
      })
      .catch(() => {
        this.$message.error('公司信息获取失败')
      })
      .finally(() => {
        this.listLoading = false
      })
    },
    // 将某一角色所属公司填充至table
    fillCompanyInfo(roleVo) {
      if (roleVo.length === 1) {
        // 获取角色对应的授权公司列表
        queryRoleCompany(roleVo[0].id).then(res => {
          const roleAuthCompanyIds = res.authCompanyIds  //授权公司列表
          if (roleAuthCompanyIds) {
            this.$nextTick(() => {
              // 遍历table的数据并进行判断
              this.companyData.forEach(company => {
                // 如果某一行的company_id在该角色对应的授权公司列表中，将其勾选
                if (roleAuthCompanyIds.indexOf(company.id) > -1) {
                  this.$refs.companyTable.toggleRowSelection(company, true)
                }
              })
            })
          }
        })
        .catch(() => {
          this.$message.error("角色所属公司信息获取失败")
        })
      }
    },
    // 为角色分配公司
    assignCompany() {
      this.roleCompanyDTO.roleIds = this.$refs.roleTable.selection.map(role => role.id)
      this.roleCompanyDTO.authCompanyIds = this.$refs.companyTable.selection.map(company => company.id)
      modifyRoleCompany(this.roleCompanyDTO)
      .then(res => {
        if (res) {
          this.cancelCompany()
          this.$message.success("角色所属公司分配成功")
        } else {
          this.$message.error("角色所属公司信息分配失败")
        }
      })
      .catch(() => {
        this.$message.error("角色所属公司信息分配失败")
      })
      .finally(() => {
        this.roleCompanyDTO.roleIds = []
        this.roleCompanyDTO.authCompanyIds = []
      })
    },
    cancelCompany() {
      this.companydialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.clearfix {
  &:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: ' ';
    clear: both;
    height: 0;
  }
}
.box-card {
  height: 500px;
}
</style>
