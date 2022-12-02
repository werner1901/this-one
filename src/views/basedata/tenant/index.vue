<!--
 * @Author: abel.zhan
 * @Date: 2020-11-08 17:45:25
 * @LastEditTime: 2022-03-29 15:01:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \sd365-tms-omp-front-end\src\views\basedata\tenant\index.vue
-->

<template>
  <el-container>
    <el-header>
      <!--引入查询面板组件该组件封装基本的查询控制逻辑-->
      <sd-QueryPanel
        :query-model="tenantQuery"
        @QueryButtonClick="onBtnQueryClick"
      >
        <!--这里在组件是slot 由用户自定义查询条件-->
        <el-form-item style="margin-left: -80px" label="名称">
          <el-input v-model="tenantQuery.name" style="width: 200px" />
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="tenantQuery.account" style="width: 200px" />
        </el-form-item>
      </sd-QueryPanel>
    </el-header>
    <el-main>
      <!--action bar area-->
      <div style="margin-bottom: 20px">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="onBtnAddClick"
        >增加</el-button>
        <el-button
          type="primary"
          icon="el-icon-copy-document"
          @click="onBtnCopyClick"
        >复制</el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          @click="onBtnBatchDelete"
        >删除</el-button>
        <el-dropdown
          split-button
          type="primary"
          style="margin-left: 5px; margin-right: 5px; margin-bottom: 5px"
          @command="onDropdownCommand"
        >
          启停控制
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="enable_command">启用</el-dropdown-item>
            <el-dropdown-item command="disable_command">停用</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <!--data show area  -->
      <el-table
        ref="multipleTable"
        v-loading="queryLoading"
        :data="tenants"
        element-loading-text="Loading"
        fit
        highlight-current-row
        border
        height="500"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowDoubleClick"
        @select="onRowSelected"
      >
        <el-table-column align="center" width="40" type="selection" />
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="name"
          label="租户名"
          width="100"
        />
        <el-table-column
          align="center"
          prop="account"
          label="账号"
          width="100"
        />
        <el-table-column align="center" prop="sex" label="性别" width="100">
          <template slot-scope="{ row }">
            <span v-if="row.sex == 0">男</span>
            <span v-if="row.sex == 1">女</span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="birthday"
          label="生日"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          sortable
          align="center"
          prop="tel"
          label="电话"
          width="120"
        />
        <el-table-column align="center" prop="email" label="邮箱" width="140" />
        <el-table-column
          align="center"
          prop="tenantAttr"
          label="租户属性"
          width="100"
        >
          <template slot-scope="{ row }">
            <span v-if="row.tenantAttr == 0">个人用户</span>
            <span v-if="row.tenantAttr == 1">企业用户</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="operation"
          label="状态"
          width="220"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :inactive-value="0"
              :active-value="1"
              inactive-text="停用"
              active-text="启用"
              @change="changeStatus(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <!--操作区-->
        <el-table-column
          align="center"
          prop="operation"
          label="操作"
          width="340"
        >
          <template slot-scope="scope">
            <div>
              <el-button
                id="btnCopy"
                type="primary"
                size="mini"
                @click="onRowBtnCopyClick(scope.$index, scope.row)"
              >复制</el-button>
              <el-button
                id="btnEdit"
                icon="icon-label-edit"
                size="mini"
                @click="onBtnEditClick(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
                id="btnDelete"
                size="mini"
                icon="icon-label-delete"
                type="danger"
                @click="onBtnDeleteClick(scope.$index, scope.row)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
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
      <sd-FormDialog
        :caption="dialogCaption"
        :visible="dialogVisible"
        width="50%"
        :model="tenantVO"
        :rules="rules"
        @OkButtonClick="onBtnSaveClick"
        @CancelButtonClick="dialogVisible = false"
      >
        <el-row>
          <el-col :span="11">
            <el-form-item label="租户名" prop="name">
              <el-input v-model="tenantVO.name" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="账号" prop="account" style="margin-left: 20px">
              <el-input v-model="tenantVO.account" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="密码" prop="password">
              <el-input v-model="tenantVO.password" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="性别" prop="sex" style="margin-left: 20px">
              <el-radio-group v-model="tenantVO.sex">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="tenantVO.email" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="租户属性"
              prop="tenantAttr"
              style="margin-left: 20px"
            >
              <el-select
                v-model="tenantVO.tenantAttr"
                placeholder=""
                value-key="id"
              >
                <el-option
                  v-for="tenantAttr in tenatOptions"
                  :key="tenantAttr.id"
                  :value="tenantAttr.id"
                  :label="tenantAttr.attr"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="生日">
              <!-- <el-input v-model="tenantVO.birthday" placeholder="" /> -->
              <el-date-picker
                v-model="tenantVO.birthday"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="电话" style="margin-left: 20px">
              <el-input v-model="tenantVO.tel" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
      </sd-FormDialog>
    </el-main>
  </el-container>
</template>
<style>
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
<script>
import {
  add,
  remove,
  modify,
  commonQueryTenant,
  querytenantById,
  batchUpdate,
  batchRemove,
  status
} from '@/api/org/tenant'
import { queryDictionaryByTypeId } from '@/api/basedata/dictionary'
// eslint-disable-next-line no-unused-vars
import { QueryPanel, FormDialog } from '../../../components/SD365UI'
import dialogdrap from '@/utils/dialogdrap'

export default {
  // filters: {
  //   formatDate: function(value) {
  //     const date = new Date(value)
  //     const y = date.getFullYear()
  //     let MM = date.getMonth() + 1
  //     MM = MM < 10 ? ('0' + MM) : MM
  //     let d = date.getDate()
  //     d = d < 10 ? ('0' + d) : d
  //     let h = date.getHours()
  //     h = h < 10 ? ('0' + h) : h
  //     let m = date.getMinutes()
  //     m = m < 10 ? ('0' + m) : m
  //     let s = date.getSeconds()
  //     s = s < 10 ? ('0' + s) : s
  //     return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
  //   }
  // },
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
      tenantQuery: { name: '', account: '' }, // 查询对象
      /**
       * 展示区模型
       */
      tenants: [], // 从vo取得的客户信息
      // eslint-disable-next-line no-new-object
      tenantVO: {
        //   settleTypeDTO: { id: '' }
        name: '',
        account: '',
        password: '',
        sex: 0,
        email: '',
        tenantAttr: 1,
        birthday: '',
        tel: ''
      }, // 显示查询回来的对象
      tenatOptions: [
        { id: 0, attr: '个人用户' },
        { id: 1, attr: '企业用户' }
      ],
      commonPage: { total: 1000, pageCount: 1, pageSize: 5, currentPage: 1 }, // 分页数据对象
      /**
       * 对话框 模型
       */
      dialogCaption: '租户信息',
      // eslint-disable-next-line no-undef
      dialogType: 'EDIT', // 标记对话框处于那种状态 或者 ADD
      // eslint-disable-next-line no-undef
      // organizations: [], // for 机构
      // companies: [], // for 公司
      // settleTypeVOS: [], // for 结算类型
      selectValue: '', // 显示用户的选择 以及后台的返回的默认值
      tenantDTO: {}, // 增加和修改对象
      rules: {
        // 定义当前页面的非空规则这点参考表结构的字段comment规则要求
        name: [{ required: true, message: '请输入租户名', trigger: 'blur' }],
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        tenantAttr: [
          { required: true, message: '请输入租户属性', trigger: 'blur' }
        ]
      }
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
      this.queryTenant(this.commonPage.pageSize, this.commonPage.currentPage)
    },
    handleCurrentChange(val) {
      this.commonPage.currentPage = val
      this.queryTenant(this.commonPage.pageSize, this.commonPage.currentPage)
    },
    /**
     * @description:
     * @param {*} pageSize
     * @param {*} pageNum
     * @return {*}
     */
    queryTenant(pageSize, currentPage) {
      this.dialogVisible = false
      this.queryLoading = true
      this.tenantQuery.pageSize = pageSize
      this.tenantQuery.pageNum = currentPage
      commonQueryTenant(this.tenantQuery)
        .then((response) => {
          // eslint-disable-next-line no-unused-vars
          const { total, pageNum, pageSize } = response // 如果异常则被axios 的拦截器拦截并且显示错误码和消息

          this.commonPage.total = parseInt(total)
          // this.commonPage.pages = parseInt(response.pages)
          // this.commonPage.currentPage = parseInt(pageNum)
          // if (parseInt(pageSize) > 10) {
          //   this.commonPage.pageSize = 10
          // } else {
          //   this.commonPage.pageSize = parseInt(pageSize)
          // }

          // this.pageIndex = parseInt(pageNum)
          // this.rows = parseInt(total)

          /* this.commonPage.total = total
        this.commonPage.pageCount = pageNum
        this.commonPage.pageSize = pageSize
         */
          this.tenants = response.data // 分页信息带回显示

          this.queryLoading = false // 关闭查询
        })
        .catch(() => {
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
     * @description: 根据页面的下拉框的需要从字典加载数据参数为字典类型
     * @param {*} defaultSelectValue
     * @return {*}
     */
    // loadSettleType(defaultSelectValue) {

    //   queryDictionaryByTypeId(1326439346873696256n).then((response) => {

    //     if (response == null) {
    //       return
    //     } else {
    //       this.settleTypeVOS = response.data
    //       this.selectValue = defaultSelectValue
    //     }
    //   }).catch(() => {
    //     this.$message.error('网络错误')
    //   })
    // },

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
     * @description: 行双击触发编辑方便用户操作
     * @param {*} row 行
     * @param {*} column 列
     * @param {*} event 事件
     * @return {*}
     */
    handleRowDoubleClick(row, column, event) {
      querytenantById(row.id).then((response) => {
        // 取得CommonResponse的Body
        if (response != null) {
          // eslint-disable-next-line no-undef
          this.tenantVO = response
          // eslint-disable-next-line no-undef
          this.dialogType = 'EDIT'
          // eslint-disable-next-line no-undef
          this.dialogVisible = true
        } else {
          this.$message.info('没有对应记录可以编辑')
        }
      })
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
     * 更改单行启用状态
     */
    changeStatus(index, row) {
      const tenantDTO = {
        id: row.id,
        status: row.status,
        version: row.version
      }
      status(tenantDTO)
        .then((response) => {
          if (response) {
            this.$message.success('操作成功')
            this.onBtnQueryClick()
          } else {
            this.$message.success('操作失败')
            this.onBtnQueryClick()
          }
        })
        .catch(() => {
          this.$message.error('网络错误')
        })
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
      this.queryTenant(this.commonPage.pageSize, this.commonPage.currentPage)
    },

    /**
     * @description: 点击action bar区 增加按钮弹出对话框
     * @param {*}
     * @return {*}
     */
    onBtnAddClick() {
      // get header from token  load organizations and companies
      try {
        this.tenantVO = { birthday: new Date() } // 初始化
        // this.loadSettleType('')
        this.dialogVisible = true
        this.dialogType = 'ADD'
      } catch (error) {
        this.$message.error('网络异常')
      }
    },
    /**
     * @description: 点击 action bar 区进行 复制操作
     * @param {*}
     * @return {*}
     */
    onBtnCopyClick() {
      // get header from token  load organizations and companies
      // 如果不是选择一条则提示消息并且返回
      const rows = this.$refs.multipleTable.selection
      if (rows == null) {
        this.$message.error('选择一条进行拷贝')
        return
      }
      if (rows != null && rows.length > 1) {
        this.$message.error('只能选择一条进行拷贝')
        return
      } else {
        this.showtenant(rows[0])
      }
    },
    onBtnCopyClick() {
      // get header from token  load organizations and companies
      // 如果不是选择一条则提示消息并且返回
      const rows = this.$refs.multipleTable.selection
      if (rows == null) {
        this.$message.error('选择一条进行拷贝')
        return
      }
      if (rows != null && rows.length > 1) {
        this.$message.error('只能选择一条进行拷贝')
        return
      } else {
        this.showtenant(rows[0])
      }
    },

    /**
     * @description: 点击action bar区进行批量删除操作
     * @param {*}
     * @return {*}
     */
    onBtnBatchDelete() {
      const tenantVOS = this.$refs.multipleTable.selection
      if (tenantVOS == null || tenantVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }
      const deletetenantDTOS = new Array(tenantVOS.length)
      for (let i = 0; i < tenantVOS.length; i++) {
        deletetenantDTOS[i] = {
          id: tenantVOS[i].id,
          version: tenantVOS[i].version
        }
      }

      this.$confirm('确定删除记录吗')
        .then((response) => {
          if (response) {
            if (response === 'confirm') {
              batchRemove(deletetenantDTOS)
              this.onBtnQueryClick()
              this.$message.success('删除数据成功')
            } else {
              this.$message.info('取消操作')
            }
          }
        })
        .catch(() => {
          this.$message.info('取消操作')
          // this.$message.info('')
        })
    },
    /**
     * @description: 点击 action bar 区域进行启用和停用控制操作
     * @param {*} status
     * @return {*}
     */
    onDisableRecodClick(status) {
      const tenantVOS = this.$refs.multipleTable.selection
      if (tenantVOS == null || tenantVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }

      const tenantDTOS = new Array(tenantVOS.length)
      for (let i = 0; i < tenantVOS.length; i++) {
        tenantDTOS[i] = { id: tenantVOS[i].id, status: status }
      }
      // eslint-disable-next-line no-array-constructor
      batchUpdate(tenantDTOS)
        .then((response) => {
          if (response) {
            this.$message.success('操作成功')
          } else {
            this.$message.error('没有找到对应记录更新失败')
          }
        })
        .catch(() => {
          this.$message.error('网络错误')
        })
    },
    onDropdownCommand(command) {
      console.log(command)
      switch (command) {
        case 'enable_command': {
          this.onDisableRecodClick(1)
          break
        }
        case 'disable_command': {
          this.onDisableRecodClick(0)
          break
        }
      }
    },
    onDropdownCommand(command) {
      console.log(command)
      switch (command) {
        case 'enable_command': {
          this.onDisableRecodClick(1)
          break
        }
        case 'disable_command': {
          this.onDisableRecodClick(0)
          break
        }
      }
    },
    /**
     * ************************
     *  以下开始行内的按钮操作
     */

    /**
     * @description: 选择一行进行复制操作
     * @param {*} index
     * @param {*} row
     * @return {*}
     */
    onRowBtnCopyClick(index, row) {
      // 查询并且展示  然后就是 增加
      if (row != null) {
        this.showtenant(row)
      }
    },
    /**
     * @description: 点击行的操作区域删除当前行的记录
     * @param {*}
     * @return {*}
     */
    onBtnDeleteClick(index, row) {
      const currenttenantVO = this.tenants[index]
      if (currenttenantVO == null) {
        this.$message.info('没有对应记录可以编辑')
        return
      }
      this.$confirm('确定删除记录吗').then((result) => {
        // 获取多条ID 调用服务端
        remove(currenttenantVO.id, currenttenantVO.version)
          .then((response) => {
            this.commonResponse = response
            if (this.commonResponse) {
              this.$message.success('操作成功')
              this.onBtnQueryClick()
            } else {
              this.$message.error('操作失败')
            }
          })
          .catch(() => {
            this.$message.error('网络错误')
          })
      })
    },

    /**
     * @description: 点击行操作区域的修改按钮弹出窗口并且设置类型
     * @param {*} index
     * @param {*} row
     * @return {*}
     */
    onBtnEditClick(index, row) {
      // get header from token  load organizations and companies

      querytenantById(row.id)
        .then((response) => {
          // 取得CommonResponse的Body

          if (response != null) {
            // eslint-disable-next-line no-undef

            this.tenantVO = response;
            // eslint-disable-next-line no-undef
          } else {
            this.$message.info('没有对应记录可以编辑')
          }
        })
        .catch(() => {
          this.$message.error('网络异常')
          return
        })
      // 加载结算类型 设置settleType默认选择项目
      // if (this.tenantVO.settleTypeDTO != null) {
      //   this.loadSettleType(this.tenantVO.settleTypeDTO.id)
      // } else {
      //   this.loadSettleType('') // 没有数据则传入
      // }
      this.dialogType = 'EDIT'
      // eslint-disable-next-line no-undef
      this.dialogVisible = true
    },

    /**
     * @description: 编辑和修改前从后端查询客户信息的公用客户方法
     * @param {*} tenantVO
     * @return {*}
     */
    showtenant(tenantVO) {
      this.copyLaoding = true
      // this.loadOrganizations()
      // this.loadCompanies()
      // 调用 api 插入记录并且返回记录
      const selectedtenant = tenantVO
      console.log(selectedtenant)
      querytenantById(selectedtenant.id)
        .then((response) => {
          // eslint-disable-next-line no-undef
          // 加载下拉框数据 设置下拉框的选项

          this.tenantVO = response
          this.dialogType = 'COPY'
          this.dialogVisible = true
          this.copyLaoding = false
          // 如果修改对话框将更新数据到数据库
        })
        .catch(() => {
          this.$message.error('网络异常')
        })
    },
    /**
     * *************************************
     * 以下为对话框的取消和保存的逻辑区域
     */

    /**
     * @description: 对话框点击保存的时候调用此方法方法判断对话框类型是增加还是修改
     * 从而调用相应的接口，操作完成需要调用查询刷新让当前数据显示第一条
     * @param {*} source FormDialg Vue对象
     * @return {*}
     */
    onBtnSaveClick(source) {
      // debugger
      if (this.dialogType === 'ADD') {
        const currenttenantDTO = this.tenantVO
        // currenttenantDTO.creator = this.$store.getters.name
        // currenttenantDTO.modifier = this.$store.getters.name
        console.log(currenttenantDTO)
        add(currenttenantDTO)
          .then((response) => {
            // debugger
            if (response) {
              // 显示保存成功并且返回
              this.$message.success('操作成功')
              // this.resetUIToInitStatus()
              this.dialogVisible = false
              this.tenantVO = {}
              this.onBtnQueryClick()
            } else {
              this.$message.error('租户名重复')
            }
          })
          .catch(() => {
            // debugger
            this.dialogType = null
            this.tenantVO = null
            this.$message.error('网络异常')
          })
      } else if (this.dialogType === 'EDIT') {
        this.tenantDTO = JSON.parse(JSON.stringify(this.tenantVO))
        // debugger
        this.tenantDTO.modifier = this.$store.getters.name
        modify(this.tenantDTO)
          .then((response) => {
            // 显示保存成功并且返回
            this.$message.success('操作成功')
            this.dialogVisible = false
            // 查询刷新当前增加数据为第一条
            this.onBtnQueryClick()
          })
          .catch(() => {
            this.dialogType = null
            this.tenantVO = null
            this.$message.error('网络异常')
          })
      } else if (this.dialogType === 'COPY') {
        const currenttenantDTO = JSON.parse(JSON.stringify(this.tenantVO))
        console.log(currenttenantDTO)
        add(currenttenantDTO)
          .then((response) => {
            console.log('==>' + response)
            // 显示保存成功并且返回
            if (response) {
              this.$message.success('操作成功')
            } else {
              this.$message.success('租户名称重复')
            }

            // this.resetUIToInitStatus()
            this.dialogVisible = false
            // 查询刷新当前增加数据为第一条
            this.onBtnQueryClick()
          })
          .catch(() => {
            this.dialogType = null
            this.tenantVO = null
            this.$message.error('网络异常')
          })
      }
    },
    /**
     * @description: 对话框区域的点击操作,在这里添加你取消的逻辑
     * @param {*}
     * @return {*}
     */
    onBtnCancelClick() {
      // 需要则这里实现
    }
  }
}
</script>
