<template>
  <div>
    <!--右边主体部分-->
    <el-col :span="20">
      <el-card shadow="always" style="margin-left: 3px; border-top: none">
        <!--搜索框-->
        <searchbox
        boxType="role"
        @queryRoleByName="queryRoleByName">
          <el-form-item label="角色名称">
            <el-input
              v-model="roleQuery.name"
              placeholder="请输入角色名称"
            />
          </el-form-item>
        </searchbox>
        <!--上方操作链接-->
        <div style="margin-bottom: 20px; margin-top: -0px">
          <el-button
            style="margin-left: 5px"
            type="primary"
            @click="addFormInfo"
          ><em class="el-icon-plus">增加</em></el-button>
          <el-button
            style="margin-left: 5px"
            type="danger"
            @click="batchRemoveRole"
          ><em class="el-icon-delete">删除</em></el-button>
          <el-button
            style="margin-left: 5px"
            type="primary"
            @click="getResource"
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
        <tablepagination
        :page="rolePage"
        :paginationType="'role'"
        @fetchData="fetchData">
      </tablepagination>
      </el-card>
    </el-col>
    <!--  增加的弹框-->
    <AddAndUpdateDialog
      :caption="addTitle"
      :visible.sync="adddialogVisible"
      :model="roleDto"
      width="60%"
      @OkButtonClick="addRole"
      @CancelButtonClick="adddialogVisible = false"
    ></AddAndUpdateDialog>

    <!--    更新的弹框-->
    <AddAndUpdateDialog
      :caption="updateTitle"
      :visible.sync="updatedialogVisible"
      :model="roleDto"
      width="60%"
      @OkButtonClick="updateRole"
      @CancelButtonClick="updatedialogVisible = false"
    ></AddAndUpdateDialog>

    <!--用户分配的弹框-->
    <!-- <resourcedialog
      :title="'用户分配'"
      dialogType='user'
      :visible.sync="userdialogVisible"
      @assignUser="assignUser"
      >
      <searchbox
        boxType="user"
        @queryUserByName="queryUserByName">
        <el-form-item label="用户名称：">
          <el-input v-model="userQuery.name" placeholder="请输入用户名称" />
        </el-form-item>
        </searchbox>
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
      <tablepagination
        :page="userPage"
        :paginationType="'user'"
        @getUser="getUser">
      </tablepagination>
    </resourcedialog> -->

    <assignuser
      :roleVo="roleVo"
      ref="assignroleuser"
      @fetchData="fetchData"
      >
    </assignuser>

    <!--资源分配的弹框-->
    <!-- <resourcedialog
      :title="'资源分配'"
      dialogType='resource'
      :visible.sync="resourcedialogVisible"
      @assignResource="assignResource"
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
          />
        </el-card>
      </div>
    </resourcedialog> -->
    <assignresource
      :roleVo="roleVo"
      ref="assignroleresource"
      @fetchData="fetchData"
      >
    </assignresource>
    <!-- 公司分配的弹框 -->
    <!-- <resourcedialog
      :title="'公司分配'"
      dialogType='company'
      :visible.sync="companydialogVisible"
      @assignCompany="assignCompany"
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
    </resourcedialog> -->
    <assigncompany
      :roleVo="roleVo"
      ref="assignrolecompany"
      @fetchData="fetchData"
      >
    </assigncompany>
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
import AddAndUpdateDialog from './add-and-update-dialog.vue'
import searchbox from './search-box.vue'
import resourcedialog from './resource-dialog.vue'
import tablepagination from './pagination.vue'
import assignresource from './assign-resource.vue'
import assignuser from './assign-user.vue'
import assigncompany from './assign-company.vue'


export default {
  name: 'Role',
  components:{AddAndUpdateDialog,searchbox,resourcedialog,tablepagination,assignresource,assignuser,assigncompany},
  data: function() {
    return {
      addTitle: '增加角色',
      updateTitle: '修改角色',
      userTitle: '用户分配',
      resourceTitle: '资源分配',
      //初始化时请求公司名单
      companyList: [],
      // resourceData: [],
      listLoading: false,
      //主表格的数据
      tableData: [],
      //用户数据
      userData: [],
      //公司数据
      companyData: [],
      //角色的分页信息
      rolePage: {
        total: null,
        // 页号
        pageNum: 1,
        // 页大小
        pageSize: 10,

        pages: null
      },
      //用户的分页信息
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
      // resourcedialogVisible: false,
      companydialogVisible: false,
      adddialogVisible: false,
      updatedialogVisible: false,
      isReviewPerMission: false,
      //已选择行的信息
      roleVo: {},
      //行的信息
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
      // resourceIdList: [],
      // resourcedialogType: '',
      selectionData: [], // 保存选中的id
      updatedialogType: ''
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
    /**
     * 处理资源树结构
     * @param list treeQuery请求返回的数组
     * @return 返回处理后的数组结构
     */
    // treeTransform(list) {
    //   var tree = []
    //   // 存储一级节点（系统）
    //   list.map((item) => {
    //     if (parseInt(item.parentId) === -1 && item.resourceType === 2) {
    //       tree.push({ label: item.name, id: item.id, children: [] })
    //     }
    //   })
    //   // 存储二级节点（主菜单）
    //   tree.map((itemParent) => {
    //     list.map((item) => {
    //       if (itemParent.id === item.parentId) {
    //         itemParent.children.push({
    //           id: item.id,
    //           label: item.name,
    //           children: []
    //         })
    //       }
    //     })
    //   })
    //   // 存储三级节点（子菜单）
    //   tree.map((itemParent) => {
    //     itemParent.children.map((itemSecondParent) => {
    //       list.map((item) => {
    //         if (itemSecondParent.id === item.parentId) {
    //           itemSecondParent.children.push({
    //             id: item.id,
    //             label: item.name,
    //             children: []
    //           })
    //         }
    //       })
    //     })
    //   })
    //   // 存储四级节点（请求权限）
    //   tree.map((itemParent) => {
    //     itemParent.children.map((itemSecondParent) => {
    //       itemSecondParent.children.map((itemthirdParent) => {
    //         list.map((item) => {
    //           if (itemthirdParent.id === item.parentId) {
    //             itemthirdParent.children.push({ id: item.id, label: item.name })
    //           }
    //         })
    //       })
    //     })
    //   })
    //   return tree
    // },

    /**
     * 页面初始化时查询公司
     */
    getCompany() {
      selectCompany()
        .then((response) => {
          this.companyList = response.data
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '公司查询失败!'
          })
        })
    },
    /**
     * 构建资源树并预填入资源信息
     */
    // getResourceTree() {
    //   const roleVo = this.$refs.roleTable.selection
    //   if (roleVo == null || roleVo.length === 0) {
    //     this.$message.error('至少选择一个角色进行操作')
    //     return
    //   }
    //   this.listLoading = true
    //   this.isReviewPerMission = false
    //   this.resourcedialogVisible = true
    //   const resourceQuery = {}
    //   resourceQuery.pageSize = 1000
    //   treeQuery(resourceQuery)
    //     .then((response) => {
    //       this.resourceData = this.treeTransform(response.data)
    //       for (let i = 0; i < roleVo.length; i++) {
    //         this.roleIdList.push(roleVo[i].id)
    //       }
    //       // 根据角色的id查询到角色所对应的资源进行打钩
    //       if (roleVo.length === 1) {
    //         this.fillResourceTree(roleVo[0].id)
    //       }
    //     }).catch(() => {
    //       this.$message({
    //         type: 'error',
    //         message: '资源树查询失败!'
    //       })
    //     })
    //     .finally(() => {
    //       this.listLoading = false
    //     })
    // },
    // changeListLoading(loading) {
	  //     	this.listLoading = loading;//在父组件修改值
	  // },
    getResource(){
      this.roleVo = this.$refs.roleTable.selection
      if (this.roleVo == null || this.roleVo.length === 0) {
        this.$message.error('至少选择一个角色进行操作')
        return
      }
      // this.listLoading = true
      // this.resourcedialogVisible = true
      this.$refs.assignroleresource.getResourceTree();
      },
    /**
     * 查询某角色对应的资源
     * @param roleId 所选角色的id
     */
    // fillResourceTree(roleId) {
    //   const resourceQuery = {}
    //   resourceQuery.pageSize = 1000
    //   resourceQuery.roleId = roleId
    //   treeQuery(resourceQuery)
    //     .then((res) => {
    //       console.log(res)
    //       for (let i = 0; i < res.data.length; i++) {
    //         this.$refs.tree.setChecked(res.data[i].id, true, false)
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //     })
    // },
    /**
     * 资源分配
     */
    // assignResource() {
    //   const list = this.$refs.tree.getCheckedNodes()
    //   const listParent = this.$refs.tree.getHalfCheckedKeys()
    //   listParent.map((item) => {
    //     this.resourceIdList.push(item)
    //   })
    //   this.listLoading = true
    //   for (let i = 0; i < list.length; i++) {
    //     this.resourceIdList.push(list[i].id)
    //   }
    //   if (this.resourcedialogType === 'REVIEW') {
    //     this.resourcedialogType = ''
    //   } else {// 构建角色资源对象
    //     const roleResourceDTO = {
    //       roleIds: this.roleIdList,
    //       resourceIds: this.resourceIdList
    //     }
    //     console.log('roleResourceDTO',roleResourceDTO)
    //     // 请求后端接口
    //     assignResource(roleResourceDTO)
    //       .then((response) => {
    //         this.$message({
    //           message: '分配成功',
    //           type: 'success'
    //         })
    //         this.resourcedialogVisible = false
    //         this.resourceIdList = []
    //         this.roleIdList = []
    //         // 进行重新加载
    //         this.fetchData(1)
    //       })
    //       .catch(() => {
    //         this.$message({
    //           message: '分配失败',
    //           type: 'error'
    //         })
    //       }).finally(()=>{
    //            this.listLoading = false
    //       })
    //   }
    // },
    /**
     * 添加角色
     */
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
    /**
     * 用名字来查询角色
     */
    queryRoleByName() {
      this.rolePage.total = null
      this.rolePage.pages = null
      this.rolePage.pageNum = 1
      this.fetchData(this.rolePage.pageNum)
    },
    /**
     * 批量删除角色
     */
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
    /**
     * 单行删除角色
     * @param row 所选中的行
     */
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
    //   this.roleDto = row
    //   this.selected = row
    //   copy(row.id).then(response => {
    //     // this.fetchData(1)
    //     console.log(response)
    //     // debugger
    //     this.$message({
    //       type: 'success',
    //       message: '复制成功!'
    //     })
    //   })
    //     .catch(() => {
    //       this.$message({
    //         type: 'error',
    //         message: '复制失败!'
    //       })
    //     })
    // },

    /**
     * 增加角色的弹框信息
     */
    addFormInfo() {
      this.adddialogVisible = true
      this.roleDto = {status:1}
    },
    /**
     * 修改角色的弹框信息
     * @param row 所选中的行
     */
    updateFromInfo(row) {
      this.updatedialogVisible = true
      this.updatedialogType = 'update'
      queryRoleById(row.id)
        .then((res) => {
          this.roleDto = res
        })
        .catch((err) => {
          console.log(err)
        })
    },
    /**
     * 修改或复制角色
     */
    updateRole() {
      if (this.updatedialogType === 'update') {
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
            this.updatedialogType = ''
            this.roleVo = null
            this.updatedialogVisible = false
          })
      } else if (this.updatedialogType === 'copy') {
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
            this.updatedialogType = ''
            this.updatedialogVisible = false
          })
      }
    },

    /**
     * 用名字查询用户
     */
    // queryUserByName() {
    //   this.userPage.total = null
    //   this.userPage.pages = null
    //   this.userPage.pageNum = 1
    //   this.getUser(this.userPage.pageNum)
    // },
    /**
     * 查询用户
     * @param pageNum 当前所处页数
     */
    // getUser(pageNum) {
    //   this.listLoading = true
    //   this.userQuery.total = this.userPage.total
    //   this.userQuery.pageNum = pageNum
    //   this.userQuery.pageSize = this.userPage.pageSize
    //   commonQueryUser(this.userQuery)
    //     .then((response) => {
    //       const { total, pageNum, pageSize, pages } = response // 如果异常则被axios 的拦截器拦截并且显示错误码和消息
    //       this.userPage.total = parseInt(total)
    //       this.userPage.pages = parseInt(pages)
    //       this.userData = response.data
    //       this.listLoading = false
    //     })
    //     .catch(() => {
    //       this.listLoading = false
    //     })
    // },
    /**
     * 用户分配
     */
    // assignUser() {
    //   const userVo = this.$refs.userTable.selection
    //   if (userVo == null || userVo.length === 0) {
    //     this.$message.error('至少选择一个用户进行操作')
    //     return
    //   }
    //   for (let i = 0; i < userVo.length; i++) {
    //     this.userIdList.push(userVo[i].id)
    //   }
    //   this.userdialogVisible = false
    //   const userRoleDTO = {
    //     roleIds: this.roleIdList,
    //     userIds: this.userIdList
    //   }
    //   assignUser(userRoleDTO)
    //     .then((response) => {
    //       this.$message({
    //         message: '分配成功',
    //         type: 'success'
    //       })
    //       this.userIdList = []
    //       this.roleIdList = []
    //       // 进行重新加载
    //       this.fetchData(1)
    //     })
    //     .catch(() => {
    //       this.$message({
    //         message: '分配失败',
    //         type: 'error'
    //       })
    //     })
    //     .finally(() => {
    //       this.selectionData = []
    //     })
    // },
    /**
     * 查询所有用户
     */
    getUserAll() {
      this.roleVo = this.$refs.roleTable.selection
      if (this.roleVo == null || this.roleVo.length === 0) {
        this.$message.error('至少选择一个角色进行操作')
        return
      }
      this.$refs.assignroleuser.getUserSearch();


      // this.userdialogVisible = true
      // for (let i = 0; i < roleVo.length; i++) {
      //   this.roleIdList.push(roleVo[i].id)
      // }
      // this.getUser(this.userPage.pageNum)
    },
    /**
     * 刷新角色信息
     */
    refreshData() {
      this.fetchData(this.rolePage.pageNum)
    },
    /**
     * 查询角色
     * @param pageNum 当前所处页数
     */
    fetchData(pageNum) {
      this.listLoading = true
      this.roleQuery.total = this.rolePage.total
      this.roleQuery.pageNum = pageNum
      this.roleQuery.pageSize = this.rolePage.pageSize
      commonQuery(this.roleQuery)
        .then((response) => {
          const { total, pageNum, pageSize, pages } = response
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
    /**
     * 方法描述
     * @param 参数名称 参数描述
     * @return 返回值描述
     */
    // permission(row) {
    //   this.resourcedialogVisible = true
    //   this.resourcedialogType = 'REVIEW'
    //   this.isReviewPerMission = true
    //   const resourceQuery = {}
    //   resourceQuery.pageSize = 1000
    //   treeQuery(resourceQuery).then((response) => {
    //     // this.resourceData = response.data
    //     console.log(response.data)
    //     this.resourceData = this.treeTransform(response.data)

    //     // 查看权限时，所有树节点全部禁用
    //     this.resourceData = this.disableTreeNode(this.resourceData)

    //     // this.roleIdList.push(row.id)
    //     this.fillResourceTree(row.id)
    //     // debugger
    //   }).catch(() => {
    //       this.$message({
    //         type: 'error',
    //         message: '权限查询失败!'
    //       })
    //     })
    // },

    /**
     * 方法描述
     * @param 参数名称 参数描述
     * @return 返回值描述
     */
    // disableTreeNode(data) {
    //   data.map((item) => {
    //     this.$set(item, "disabled", true)
    //     if (item.children && item.children.length > 0){
    //       item.children = this.disableTreeNode(item.children)
    //     }
    //   })
    //   return data
    // },

    /**
     * 方法描述
     * @param 参数名称 参数描述
     * @return 返回值描述
     */
    // handleSelectionChange(selection, row) {
    //   const flag = selection.some((item) => {
    //     return item.id === row.id
    //   })
    //   const index = this.arrFindObjIndex(this.selectionData, row, 'id')
    //   if (!flag) {
    //     // selection中不包含row则是取消选中该行
    //     if (index !== -1) {
    //       this.selectionData.splice(index, 1)
    //     }
    //   } else {
    //     // selection中不包含row则是选中该行
    //     if (index === -1) {
    //       this.selectionData.push(row)
    //     }
    //   }
    // },
    // 在一个对象数据中寻找某个对象的下标,通过key的值相等，判断数组中是否包含对象
    /**
     * 方法描述
     * @param 参数名称 参数描述
     * @return 返回值描述
     */
    // arrFindObjIndex(arr, obj, key) {
    //   let index = -1
    //   arr.forEach((item, idx) => {
    //     if (item[key] === obj[key]) {
    //       index = idx
    //     }
    //   })
    //   return index
    // },
    /**
     * 获取所有公司信息
     */
    getCompanyAll() {
      this.roleVo = this.$refs.roleTable.selection
      if (this.roleVo == null || this.roleVo.length === 0) {
        this.$message.error('至少选择一个角色进行操作')
        return
      }
      this.$refs.assignrolecompany.getCompanySearch();
    },
    /**
     * 公司信息预填入
     * @param roleVo 所选行的信息
     */
    // fillCompanyInfo(roleVo) {
    //   if (roleVo.length === 1) {
    //     // 获取角色对应的授权公司列表
    //     queryRoleCompany(roleVo[0].id).then(res => {
    //       const roleAuthCompanyIds = res.authCompanyIds
    //       if (roleAuthCompanyIds) {
    //         this.$nextTick(() => {
    //           // 遍历table的数据并进行判断
    //           this.companyData.forEach(company => {
    //             // 如果某一行的company_id在该角色对应的授权公司列表中，将其勾选
    //             if (roleAuthCompanyIds.indexOf(company.id) > -1) {
    //               this.$refs.companyTable.toggleRowSelection(company, true)
    //             }
    //           })
    //         })
    //       }
    //     })
    //     .catch(() => {
    //       this.$message.error("角色所属公司信息获取失败")
    //     })
    //   }
    // },
    /**
     * 公司分配
     */
    // assignCompany() {
    //   this.roleCompanyDTO.roleIds = this.$refs.roleTable.selection.map(role => role.id)
    //   this.roleCompanyDTO.authCompanyIds = this.$refs.companyTable.selection.map(company => company.id)
    //   modifyRoleCompany(this.roleCompanyDTO)
    //   .then(res => {
    //     if (res) {
    //       this.companydialogVisible = false
    //       this.$message.success("角色所属公司分配成功")
    //     } else {
    //       this.$message.error("角色所属公司信息分配失败")
    //     }
    //   })
    //   .catch(() => {
    //     this.$message.error("角色所属公司信息分配失败")
    //   })
    //   .finally(() => {
    //     this.roleCompanyDTO.roleIds = []
    //     this.roleCompanyDTO.authCompanyIds = []
    //   })
    // }
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
