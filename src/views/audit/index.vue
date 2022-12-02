<!--
 * @Author: abel.hpl
 * @Date: 2020-11-08 17:45:25
 * @LastEditTime: 2022-02-23 09:09:28
 * @LastEditors: Xnew
 * @Description: In User Settings Edit
 * @FilePath: \sd365-tms-omp-front-end\src\views\audit\index.vue
-->

<template>
  <el-container>
    <el-header>
      <!--引入查询面板组件该组件封装基本的查询控制逻辑-->
      <sd-QueryPanel :query-model="auditQuery" @QueryButtonClick="onBtnQueryClick">
        <!--这里在组件是slot 由用户自定义查询条件-->
        <el-form-item style="margin-left:-80px" label="名称">
          <el-input v-model="auditQuery.name" style="width:200px" />
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="auditQuery.code" style="width:200px" />
        </el-form-item>
      </sd-QueryPanel>
    </el-header>
    <el-main>
      <!--action bar area-->
      <div style="margin-bottom:20px">
        类型：
        <el-button type="primary" @click="onBtnQueryClickUsp">使用简单密码</el-button>
        <el-button type="primary" @click="onBtnQueryClickNup">定期未修改密码</el-button>
        <el-button type="primary" @click="onBtnQueryClickLnl">长期未登录</el-button>
      </div>
      <!--data show area  -->
      <el-table
        ref="multipleTable"
        v-loading="queryLoading"
        :data="audits"
        element-loading-text="Loading"
        fit
        highlight-current-row
        border
        height="500"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column sortable align="center" prop="name" label="用户名" width="150" />
        <el-table-column align="center" prop="code" label="工号" width="150" />
        <el-table-column align="center" prop="result" label="审计结果" width="500"/>
        <el-table-column align="center" prop="updatePwd" label="密码修改时间" width="300" />
        <el-table-column align="center" prop="endLogin" label="最后登录时间" width="300" />
        <el-table-column align="center" prop="status" label="状态" width="100" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="danger">停用</el-tag>
            <el-tag v-else type="success">正常</el-tag>
          </template>
        </el-table-column>
        <!--操作区-->
      </el-table>
      <!---分页-->
      <el-pagination
        :v-model="commonPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="commonPage.total"
        :page-size="commonPage.pageSize"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :current-page.sync="commonPage.currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-main>
  </el-container>
</template>
<style>
</style>
<script>
import {
  commonQuery,
  queryAuditByUsp,
  queryAuditByNup,
  queryAuditBylnl
} from '@/api/audit/audit'
export default {
  data() {
    // init all model
    return {
      // eslint-disable-next-line no-undef
      queryLoading: false, // 查询进度条控制
      // eslint-disable-next-line no-undef
      updateLoading: false, // 修改进度条控制
      // eslint-disable-next-line no-undef
      copyLaoding: false, // 拷贝一条数据的进度控制
      multipleSelection: [],
      dialogVisible: false,
      /**
       * 查询区模型
       */
      auditQuery: { name: '', code: '' }, // 查询对象
      /**
       * 展示区模型
       */
      audits: [], // 从vo取得的客户信息
      // eslint-disable-next-line no-new-object
      auditVO: {
        //   settleTypeDTO: { id: '' }
        name: '',
        code: '',
        result: '',
        updatePwd: 0,
        endLogin: 0,
        status: 1
      }, // 显示查询回来的对象
      commonPage: { total: 1000, pageCount: 1, pageSize: 10, currentPage: 1 } // 分页数据对象
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    /**           jf
     *@description: 初始化界面需要使用的基本的模型的数据 包括发起远程查询获取下拉列表的数据
     *  为了避免方法定义过于混乱所以对方法定义顺序约定如下
     *  1 数据加载方法
     *  2 界面逻辑
     *  3 业务方法
     *@author: abel.zhan
     *@date: 2020-10-17 16:59:31
     *@version: v0.0.1
     */
    handleChange(value) {
      console.log(value)
    },
    /**
     * 分页。
     */
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange(val) {
      // this.$message.error()

      this.commonPage.pageSize = val
      this.queryAudit(this.commonPage.pageSize, this.commonPage.currentPage)
    },
    handleCurrentChange(val) {
      this.commonPage.currentPage = val
      this.queryAudit(this.commonPage.pageSize, this.commonPage.currentPage)
    },
    /**
     * @description:
     * @param {*} pageSize
     * @param {*} currentPage
     * @return {*}
     */
    queryAudit(pageSize, currentPage) {
      this.dialogVisible = false
      this.queryLoading = true
      this.auditQuery.pageSize = pageSize
      this.auditQuery.pageNum = currentPage
      commonQuery(this.auditQuery).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息

        this.commonPage.total = parseInt(total)
        this.audits = response.data// 分页信息带回显示

        this.queryLoading = false // 关闭查询
      }).catch(() => {
        this.queryLoading = false // 关闭查询
        this.$message.error('网络异常')
      })
    },
    queryAuditUsp(pageSize, currentPage) {
      this.dialogVisible = false
      this.queryLoading = true
      this.auditQuery.pageSize = pageSize
      this.auditQuery.pageNum = currentPage
      queryAuditByUsp(1).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息

        this.commonPage.total = parseInt(total)
        this.audits = response.data// 分页信息带回显示

        this.queryLoading = false // 关闭查询
      }).catch(() => {
        this.queryLoading = false // 关闭查询
        this.$message.error('网络异常')
      })
    },
    queryAuditNup(pageSize, currentPage) {
      this.dialogVisible = false
      this.queryLoading = true
      this.auditQuery.pageSize = pageSize
      this.auditQuery.pageNum = currentPage
      queryAuditByNup(1).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息

        this.commonPage.total = parseInt(total)
        this.audits = response.data// 分页信息带回显示

        this.queryLoading = false // 关闭查询
      }).catch(() => {
        this.queryLoading = false // 关闭查询
        this.$message.error('网络异常')
      })
    },
    queryAuditLnl(pageSize, currentPage) {
      this.dialogVisible = false
      this.queryLoading = true
      this.auditQuery.pageSize = pageSize
      this.auditQuery.pageNum = currentPage
      queryAuditBylnl(1).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息

        this.commonPage.total = parseInt(total)
        this.audits = response.data// 分页信息带回显示

        this.queryLoading = false // 关闭查询
      }).catch(() => {
        this.queryLoading = false // 关闭查询
        this.$message.error('网络异常')
      })
    },
    /**
     * @description:
     * @param {*}
     * @return {*}
     */
    initData() {
      this.searchLoading = false
      this.queryLoading = false
      this.updateLoading = false
      this.listLoading = false
      this.onBtnQueryClick()
    },
    /**
     * 这个区域开始界面逻辑定义
     *
     */
    /**
     * @description:  行checkbox选择触发
     * @param {*} val
     * @return {*}
     */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * 以下区域为界面对应业务逻辑定义区域
     */
    /**
     * @description: 用于对VO的 标志值 转 文字的定义 例如客户类型 状态位需要转化
     * @param {*} row
     * @param {*} column
     * @return {*}
     */
    statusFormat(row, column) {
      if (row.status === 1) {
        return '启用'
      } else {
        return '停用'
      }
    },
    /**
     * 业务方法区  按查询区  操作区  展示区  分别组织代码
     */

    /**
     * @description: 查询操作
     * @param {*}
     * @return {*}
     */
    onBtnQueryClick() {
      console.log('before ')

      this.commonPage.currentPage = 1
      this.queryAudit(this.commonPage.pageSize, this.commonPage.currentPage)
    },
    onBtnQueryClickUsp() {
      console.log('before ')
      this.commonPage.currentPage = 1
      this.queryAuditUsp(this.commonPage.pageSize, this.commonPage.currentPage)
    },
    onBtnQueryClickNup() {
      console.log('before ')
      this.commonPage.currentPage = 1
      this.queryAuditNup(this.commonPage.pageSize, this.commonPage.currentPage)
    },
    onBtnQueryClickLnl() {
      console.log('before ')
      this.commonPage.currentPage = 1
      this.queryAuditLnl(this.commonPage.pageSize, this.commonPage.currentPage)
    }
  }
}
</script>
