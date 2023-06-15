<template>
  <div>
    <!--右边主体部分-->
    <el-col :span="20">
      <el-card shadow="always" style="margin-left: 3px; border-top: none">
        <!--搜索框-->
        <searchbox boxType="role" @queryRoleByName="queryRoleByName">
          <el-form-item label="角色名称">
            <el-input v-model="roleQuery.name" placeholder="请输入角色名称" />
          </el-form-item>
        </searchbox>
        <!--上方操作链接-->
        <div style="margin-bottom: 20px; margin-top: -0px">
          <el-button
            style="margin-left: 5px"
            type="primary"
            @click="addFormInfo"
            ><em class="el-icon-plus">增加</em></el-button
          >
          <el-button
            style="margin-left: 5px"
            type="danger"
            @click="batchRemoveRole"
            ><em class="el-icon-delete">删除</em></el-button
          >
          <el-button
            style="margin-left: 5px"
            type="primary"
            @click="getResource"
            ><em class="el-icon-video-play" />资源分配</el-button
          >
          <el-button style="margin-left: 5px" type="primary" @click="getUserAll"
            ><em class="el-icon-s-custom">用户分配</em></el-button
          >
          <el-button
            style="margin-left: 5px"
            type="primary"
            @click="getCompanyAll"
            ><em class="el-icon-s-custom">公司分配</em></el-button
          >
          <el-button
            style="margin-left: 5px"
            type="primary"
            @click="refreshData"
            ><em class="el-icon-refresh">刷新</em></el-button
          >
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
                  @click="copyRole(scope.row)"
                  >复制</el-button
                >
                <el-button
                  style="margin-left: 5px"
                  size="mini"
                  @click="updateFromInfo(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  style="margin-left: 5px"
                  size="mini"
                  type="danger"
                  @click="removeRole(scope.row)"
                  >删除</el-button
                >
                <el-button
                  style="margin-left: 5px"
                  size="mini"
                  type="warning"
                  @click="permission(scope.row)"
                  >查看权限</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页条-->
        <tablepagination
          :page="rolePage"
          :paginationType="'role'"
          @fetchData="fetchData"
        >
        </tablepagination>
      </el-card>
    </el-col>

    <!--  增加的弹框-->
    <addandupdatedialog
      :caption="addTitle"
      :visible.sync="adddialogVisible"
      :model="roleDto"
      width="60%"
      @OkButtonClick="addRole"
      @CancelButtonClick="adddialogVisible = false"
    ></addandupdatedialog>

    <!--    更新的弹框-->
    <addandupdatedialog
      :caption="updateTitle"
      :visible.sync="updatedialogVisible"
      :model="roleDto"
      width="60%"
      @OkButtonClick="updateRole"
      @CancelButtonClick="updatedialogVisible = false"
    ></addandupdatedialog>

    <!--用户分配的弹框-->
    <assignuser :roleVo="roleVo" ref="assignroleuser" @fetchData="fetchData">
    </assignuser>

    <!--资源分配的弹框-->
    <assignresource
      :roleVo="roleVo"
      ref="assignroleresource"
      @fetchData="fetchData"
    >
    </assignresource>
    <!-- 公司分配的弹框 -->
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
  selectCompany,
  copy,
} from '@/api/right/role'

import addandupdatedialog from './components/add-and-update-dialog.vue'
import searchbox from './components/search-box.vue'
import tablepagination from './components/pagination.vue'
import assignresource from './assign-resource.vue'
import assignuser from './assign-user.vue'
import assigncompany from './assign-company.vue'

export default {
  name: 'Role',
  components: {
    addandupdatedialog,
    searchbox,
    tablepagination,
    assignresource,
    assignuser,
    assigncompany,
  },
  data: function () {
    return {
      addTitle: '增加角色',
      updateTitle: '修改角色',
      //初始化时请求公司名单
      companyList: [],
      listLoading: false,
      //主表格的数据
      tableData: [],
      //角色的分页信息
      rolePage: {
        total: null,
        // 页号
        pageNum: 1,
        // 页大小
        pageSize: 10,
        pages: null,
      },
      //角色查询参数
      roleQuery: { companyId: '' },
      //增加弹框是否可见
      adddialogVisible: false,
      //修改弹框是否可见
      updatedialogVisible: false,
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
        orgId: '',
      },
      updatedialogType: '',
      selected: {},
    }
  },
  mounted() {},
  created() {
    this.fetchData(this.rolePage.pageNum)
    this.getCompany()
  },
  methods: {
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
            message: '公司查询失败!',
          })
        })
    },

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
            message: '添加成功!',
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
          name: roleVo[i].name,
          code: roleVo[i].code,
        }
      }
      if (roleDtoS.length !== 0) {
        this.$confirm('确定删除记录吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            batchRemove(roleDtoS).then((response) => {
              this.fetchData(1)
            })
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      } else {
        this.$message({
          message: '请选择需要删除的数据',
          type: 'warning',
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
        type: 'warning',
      })
        .then(() => {
          remove(row.id, row.version, row.name, row.code)
            .then((response) => {
              this.fetchData(1)
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除失败!',
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },

    /**
     * 复制角色
     * @param row 当前所处行
     */
    copyRole(row) {
      this.dialogType = 'copy'
      this.updatedialogVisible = true
      queryRoleById(row.id)
        .then((res) => {
          this.roleDto = res
        })
        .catch((err) => {
          console.log(err)
        })
      this.roleDto = row
      this.selected = row
      copy(row.id)
        .then((response) => {
          this.$message({
            type: 'success',
            message: '复制成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '复制失败!',
          })
        })
    },

    /**
     * 增加角色的弹框信息
     */
    addFormInfo() {
      this.adddialogVisible = true
      this.roleDto = { status: 1 }
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
              message: '修改成功!',
            })
            // 新增之后重新加载
            this.fetchData(1)
            // Just to simulate the time of the request
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '修改失败!',
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
              message: '复制成功!',
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
     * 获得所选角色
     */
    getRoleSelection() {
      this.roleVo = this.$refs.roleTable.selection
      if (this.roleVo == null || this.roleVo.length === 0) {
        this.$message.error('至少选择一个角色进行操作')
        return
      }
    },

    /**
     * 打开资源分配的弹框
     */
    getResource() {
      this.getRoleSelection()
      this.$refs.assignroleresource.getResourceTree()
    },

    /**
     * 打开权限查看
     * @param row 当前所处行
     */
    permission(row) {
      this.$refs.assignroleresource.permission(row)
    },

    /**
     * 打开用户分配的弹框
     */
    getUserAll() {
      this.getRoleSelection()
      this.$refs.assignroleuser.getUserSearch()
    },

    /**
     * 打开公司分配的弹框
     */
    getCompanyAll() {
      this.getRoleSelection()
      this.$refs.assignrolecompany.getCompanySearch()
    },
  },
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
