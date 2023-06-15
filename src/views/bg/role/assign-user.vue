<template>
  <basedialog
    :title="title"
    :dialogType="dialogType"
    :visible.sync="userdialogVisible"
    @assignUser="assignUser"
  >
    <searchbox boxType="user" @queryUserByName="queryUserByName">
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
    <!--    分页条-->
    <tablepagination
      :page="userPage"
      :paginationType="'user'"
      @getUser="getUser"
    >
    </tablepagination>
  </basedialog>
</template>

<script>
import { assignUser, commonQueryUser } from '@/api/right/role'
import basedialog from './components/base-dialog.vue'
import searchbox from './components/search-box.vue'
import tablepagination from './components/pagination.vue'
export default {
  name: 'assignuser',
  components: { basedialog, searchbox, tablepagination },
  props: {
    roleVo: { type: undefined, required: true, default: [] },
  },
  data() {
    return {
      title: '用户分配',
      dialogType: 'user',
      userdialogVisible: false,
      listLoading: false,
      //角色id列表
      roleIdList: [],
      //用户id列表
      userIdList: [],
      //用户数据
      userData: [],
      //用户的分页信息
      userPage: {
        total: null,
        // 页号
        pageNum: 1,
        // 页大小
        pageSize: 15,

        pages: null,
      },
      selectionData: [],
      //用户查询参数
      userQuery: {},
    }
  },
  methods: {
    getUserSearch() {
      this.userdialogVisible = true
      this.getUser(this.userPage.pageNum)
    },
    /**
     * 用名字查询用户
     */
    queryUserByName() {
      this.userPage.total = null
      this.userPage.pages = null
      this.userPage.pageNum = 1
      this.getUser(this.userPage.pageNum)
    },
    /**
     * 查询用户
     * @param pageNum 当前所处页数
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
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    /**
     * 获得所选行
     */
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

    arrFindObjIndex(arr, obj, key) {
      let index = -1
      arr.forEach((item, idx) => {
        if (item[key] === obj[key]) {
          index = idx
        }
      })
      return index
    },
    /**
     * 用户分配
     */
    assignUser() {
      const userVo = this.$refs.userTable.selection
      if (userVo == null || userVo.length === 0) {
        this.$message.error('至少选择一个用户进行操作')
        return
      }
      for (let i = 0; i < userVo.length; i++) {
        this.userIdList.push(userVo[i].id)
      }
      this.userdialogVisible = false
      const roleVo = this.roleVo
      for (let i = 0; i < roleVo.length; i++) {
        this.roleIdList.push(roleVo[i].id)
      }
      const userRoleDTO = {
        roleIds: this.roleIdList,
        userIds: this.userIdList,
      }
      assignUser(userRoleDTO)
        .then((response) => {
          this.$message({
            message: '分配成功',
            type: 'success',
          })
          this.userIdList = []
          this.roleIdList = []
          // 进行重新加载
          this.$emit('fetchData', 1)
        })
        .catch(() => {
          this.$message({
            message: '分配失败',
            type: 'error',
          })
        })
        .finally(() => {
          this.selectionData = []
        })
    },
  },
}
</script>
