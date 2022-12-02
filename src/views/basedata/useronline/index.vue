<template>
  <el-container>
    <el-header>
      <div>
        <el-form
          ref="queryForm"
          :model="queryParams"
          label-width="60px"
          style="margin: 20px 0px"
        >
          <el-row>
            <el-col :span="4">
              <el-form-item label="工号">
                <el-input
                  v-model="queryParams.code"
                  style="width: 200px"
                  placeholder="请输入工号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="姓名">
                <el-input
                  v-model="queryParams.name"
                  style="width: 200px"
                  placeholder="请输入姓名"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="0px">
                <el-button
                  class="primary-button-style"
                  type="primary"
                  icon="el-icon-search"
                  @click="handleQuery"
                >
                  搜索
                </el-button>
                <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-header>
    <el-main>
      <div>
        <el-button type="danger" icon="el-icon-delete" :disabled="!selectItem.length > 0" @click="handleForceLogout">
          强退用户
        </el-button>
        <el-table
          v-loading="loading"
          :data="tableData"
          border
          style="width: 100%; margin-bottom: 20px;margin-top: 20px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />

          <el-table-column label="序号" width="50" type="index" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="code"
            label="工号"
            width="120"
            align="center"
          />
          <el-table-column
            prop="name"
            label="用户名"
            width="100"
            align="center"
          />
          <el-table-column
            label="所属公司"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.company ? scope.row.company.name : '无' }}
            </template>
          </el-table-column>
          <el-table-column
            label="所属租户"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.tenant ? scope.row.tenant.name : '无' }}
            </template>
          </el-table-column>
          <el-table-column
            label="所属部门"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.department ? scope.row.department.name : '无' }}
            </template>
          </el-table-column>
          <el-table-column
            label="所属组织"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.organization ? scope.row.organization.name : '无' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="position.name"
            label="所属职位"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.position ? scope.row.position.name : '无' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="ipaddr"
            label="主机"
            width="120"
            align="center"
          />
          <el-table-column
            prop="browser"
            label="客户端"
            align="center"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            prop="os"
            label="操作系统"
            align="center"
            :show-overflow-tooltip="true"
          />
          <el-table-column prop="loginTime" label="登陆时间" align="center" />
        </el-table>
        <el-pagination
          :v-model="commonPage"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="commonPage.total"
          :page-size="commonPage.pageSize"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :current-page.sync="commonPage.pageNum"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { list, forceLogout } from '@/api/basedata/useronline'

export default {
  data() {
    return {
      /** 遮罩层 */
      loading: false,
      /** 数据 */
      tableData: [],
      /** 查询参数列表 */
      queryParams: {
        name: undefined,
        code: undefined,
        pageNum: 1,
        pageSize: 10
      },
      /** 分页数据 */
      commonPage: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      selectItem: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 分页操作 */
    handleSizeChange(val) {
      this.commonPage.pageSize = val
      this.getList(this.commonPage.pageSize, this.commonPage.pageNum)
    },
    handleCurrentChange(val) {
      this.commonPage.pageNum = val
      this.getList(this.commonPage.pageSize, this.commonPage.pageNum)
    },
    /** 查询登录日志列表 */
    getList(pageSize, pageNum) {
      this.loading = true
      this.queryParams.pageSize = pageSize
      this.queryParams.pageNum = pageNum
      list(this.queryParams).then((res) => {
        this.tableData = res.data
        this.commonPage.total = parseInt(res.total)
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.name = ''
      this.queryParams.code = ''
      this.handleQuery()
    },
    /** 强退按钮操作 */
    handleForceLogout() {
      this.$confirm('是否确认强退选中的用户？')
        .then(() => {
          const ids = this.selectItem.map((item) => item.id)
          const data = ids.join(',')
          return forceLogout({ ids: data })
        })
        .then(() => {
          this.getList()
          this.$message.success('强退成功')
        })
        .catch(() => {
        })
    },
    /** 多选操作 */
    handleSelectionChange(row) {
      this.selectItem = row
    }
  }
}
</script>

<style>
</style>
