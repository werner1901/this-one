<!--
 * @Author: abel.zhan
 * @Date: 2020-11-08 17:45:25
 * @LastEditTime: 2022-03-28 23:08:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \sd365-tms-omp-front-end\src\views\basedata\customer\index.vue
-->

<template>
  <el-container>
    <el-header>
      <!--引入查询面板组件该组件封装基本的查询控制逻辑-->
      <sd-QueryPanel
        :query-model="departmentQuery"
        @QueryButtonClick="onBtnQueryClick"
      >
        <!--这里在组件是slot 由用户自定义查询条件-->
        <el-form-item label="部门名称">
          <el-input v-model="departmentQuery.name" style="width: 200px" />
        </el-form-item>
      </sd-QueryPanel>
    </el-header>
    <el-main>
      <!--action bar area-->
      <div style="margin-bottom: 20px">
        <i
          :class="showmuenflag ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"
          class="i-sty"
          @click="showmuen"
        />
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
          type="primary"
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
        <el-button type="primary" icon="el-icon-share">导入</el-button>
        <el-button type="primary" icon="el-icon-share">导出</el-button>
      </div>

      <!--data show area  -->
      <el-table
        ref="multipleTable"
        v-loading="queryLoading"
        :data="departments"
        element-loading-text="Loading"
        fit
        highlight-current-row
        border
        height="500"
        @select="onRowSelected"
      >
        <el-table-column align="center" width="32" type="selection" />
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="name"
          label="部门名称"
          width="95"
        />
        <el-table-column
          sortable
          align="center"
          prop="level"
          label="部门级别"
          width="95"
        />
        <el-table-column
          align="center"
          prop="master"
          label="负责人"
          width="95"
        />
        <el-table-column
          align="center"
          prop="descript"
          label="部门描述"
          width="95"
        />
        <el-table-column
          align="center"
          prop="updatedTime"
          label="更新时间"
          width="95"
        />
        <!--操作区-->
        <el-table-column
          align="center"
          prop="operation"
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <div>
              <el-button
                id="btnCopy"
                icon="el-icon-copy-document"
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
        layout="prev, pager, next"
        :total="commonPage.total"
        :page-count="commonPage.pageCount"
        :page-size="commonPage.pageSize"
      />
      <sd-FormDialog
        :caption="dialogCaption"
        :visible="dialogVisible"
        width="50%"
        :model="customerVO"
        :rules="rules"
        @OkButtonClick="onBtnSaveClick"
      >
        <el-row>
          <el-col :span="11">
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="departmentVO.name" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="部门编号" prop="code">
              <el-input v-model="departmentVO.code" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="部门级别" prop="level">
              <el-input v-model="departmentVO.level" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="负责人" prop="master">
              <el-input v-model="departmentVO.master" />
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
  commonQuery,
  queryDepartmentById
} from '@/api/org/department'
import { queryDictionaryByTypeId } from '@/api/basedata/dictionary'
// eslint-disable-next-line no-unused-vars
import { QueryPanel, FormDialog } from '../../../components/SD365UI'
import store from '../../../store'

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
      departmentQuery: { name: '' },
      customerQuery: { name: '', mobile: '' }, // 查询对象
      /**
       * 展示区模型
       */
      departments: [],
      customers: [], // 从vo取得的客户信息
      // eslint-disable-next-line no-new-object
      departmentVO: { settleTypeDTO: { id: '' }},
      customerVO: { settleTypeDTO: { id: '' }}, // 显示查询回来的对象
      commonPage: { total: 10, pageCount: 1, pageSize: 10 }, // 分页数据对象
      /**
       * 对话框 模型
       */
      dialogCaption: '客户信息',
      // eslint-disable-next-line no-undef
      dialogType: 'EDIT', // 标记对话框处于那种状态 或者 ADD
      // eslint-disable-next-line no-undef
      // organizations: [], // for 机构
      // companies: [], // for 公司
      settleTypeVOS: [], // for 结算类型
      selectValue: '', // 显示用户的选择 以及后台的返回的默认值
      departmentDTO: {},
      customerDTO: {}, // 增加和修改对象
      rules: {
        // 定义当前页面的非空规则这点参考表结构的字段comment规则要求
        //       name: [
        //         { required: true, message: '输入不能为空', trigger: 'blur' }
        // ]
        // code: [
        //   { required: true, message: '输入不能为空', trigger: 'blur' }
        // ],
        // level: [
        //   { required: true, message: '输入不能为空', trigger: 'blur' }
        // ],
        // master: [
        //   { required: true, message: '输入不能为空', trigger: 'blur' }
        // ]
      },
      showmuenflag: true
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
    loadSettleType(defaultSelectValue) {
      queryDictionaryByTypeId(1326439346873696256n)
        .then((response) => {
          if (response == null) {
            return
          } else {
            this.settleTypeVOS = response.data
            this.selectValue = defaultSelectValue
          }
        })
        .catch(() => {
          this.$message.error('网络错误')
        })
    },
    onRowSelected(selection, row) {},
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
      queryDepartmentById(row.id).then((response) => {
        // 取得CommonResponse的Body
        if (response != null) {
          // eslint-disable-next-line no-undef
          this.customerVO = response
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
     * 业务方法区  按查询区  操作区  展示区  分别组织代码
     */

    /**
     * @description: 查询操作
     * @param {*}
     * @return {*}
     */
    onBtnQueryClick() {
      // debugger
      this.queryLoading = true
      this.departmentQuery.pageSize = 10
      this.departmentQuery.pageNum = 1
      commonQuery(this.departmentQuery)
        .then((response) => {
          // eslint-disable-next-line no-unused-vars
          const { total, pageNum, pageSize } = response // 如果异常则被axios 的拦截器拦截并且显示错误码和消息

          this.commonPage.total = total
          this.commonPage.pageCount = pageNum
          this.commonPage.pageSize = pageSize
          this.departments = response.data // 分页信息带回显示
          this.queryLoading = false // 关闭查询
        })
        .catch(() => {
          this.queryLoading = false // 关闭查询
          this.$message.error('网络异常')
        })
      // 将 commonnPage 数据设在到 分页控件
    },

    /**
     * @description: 点击action bar区 增加按钮弹出对话框
     * @param {*}
     * @return {*}
     */
    onBtnAddClick() {
      // get header from token  load organizations and companies
      try {
        this.customerVO = {} // 初始化
        this.loadSettleType('')
        this.dialogType = 'ADD'
        this.dialogVisible = true
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
        this.showCustomer(rows[0])
      }
    },

    /**
     * @description: 点击action bar区进行批量删除操作
     * @param {*}
     * @return {*}
     */
    onBtnBatchDelete() {
      const customerVOS = this.$refs.multipleTable.selection
      if (customerVOS == null || customerVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }
      const deleteCustomerDTOS = new Array(customerVOS.length)
      for (let i = 0; i < customerVOS.length; i++) {
        deleteCustomerDTOS[i] = {
          id: customerVOS[i].id,
          version: customerVOS[i].version
        }
      }
      // batchRemove(deleteCustomerDTOS).then(response => {
      //   if (response) {
      //     this.$message.success('删除数据成功')
      //   }
      // }).catch(() => {
      //   this.$message.error('网络错误')
      // })
    },
    /**
     * @description: 点击 action bar 区域进行启用和停用控制操作
     * @param {*} status
     * @return {*}
     */
    onDisableRecodClick(status) {
      const customerVOS = this.$refs.multipleTable.selection
      if (customerVOS == null || customerVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }

      const customerDTOS = new Array(customerVOS.length)
      for (let i = 0; i < customerVOS.length; i++) {
        customerDTOS[i] = { id: customerVOS[i].id, status: status }
      }
      // eslint-disable-next-line no-array-constructor
      // batchUpdate(customerDTOS).then(response => {
      //   if (response) {
      //     this.$message.success('操作成功')
      //   } else {
      //     this.$message.error('没有找到对应记录更新失败')
      //   }
      // }).catch(() => {
      //   this.$message.error('网络错误')
      // })
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
        this.showCustomer(row)
      }
    },
    /**
     * @description: 点击行的操作区域删除当前行的记录
     * @param {*}
     * @return {*}
     */
    onBtnDeleteClick(index, row) {
      // this.$confirm('确定删除记录吗').then(result => {
      //   // 获取多条ID 调用服务端
      //   console.log(row.id + ':' + row.version)
      //   remove(row.id, row.version).then(response => {
      // if (response) {
      //   this.$message.success('操作成功')
      //   this.onBtnQueryClick()
      // } else {
      //   this.$message.error('操作失败')
      //   this.onBtnQueryClick()
      // }
      //     })
      //     .catch(() => {
      // this.$message.error('网络错误')
      // this.onBtnQueryClick()
      //     })
      // })
    },

    /**
     * @description: 点击行操作区域的修改按钮弹出窗口并且设置类型
     * @param {*} index
     * @param {*} row
     * @return {*}
     */
    onBtnEditClick(index, row) {
      // get header from token  load organizations and companies

      const currentDepartmentVO = this.departments[index]
      if (currentDepartmentVO == null) {
        this.$message.info('没有对应记录可以编辑')
        return
      }
      queryDepartmentById(currentDepartmentVO.id)
        .then((response) => {
          // 取得CommonResponse的Body

          if (response != null) {
            // eslint-disable-next-line no-undef

            this.departmentVO = response
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
      if (this.departmentVO.settleTypeDTO != null) {
        this.loadSettleType(this.departmentVO.settleTypeDTO.id)
      } else {
        this.loadSettleType('') // 没有数据则传入
      }
      this.dialogType = 'EDIT'
      // eslint-disable-next-line no-undef
      this.dialogVisible = true
    },

    /**
     * @description: 编辑和修改前从后端查询客户信息的公用客户方法
     * @param {*} customerVO
     * @return {*}
     */
    showCustomer(customerVO) {
      this.copyLaoding = true
      // this.loadOrganizations()
      // this.loadCompanies()
      // 调用 api 插入记录并且返回记录
      const selectedCustomer = customerVO
      console.log(selectedCustomer)
      queryDepartmentById(selectedCustomer.id)
        .then((response) => {
          // eslint-disable-next-line no-undef
          // 加载下拉框数据 设置下拉框的选项

          this.customerVO = response
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
      this.$message.success('onBtnSaveClick 被回调了 ')
      if (this.dialogType === 'ADD') {
        const currentDepartmentDTO = this.departmentVO
        console.log(currentDepartmentDTO)

        // 操作人员name
        const username = store.getters.name
        currentDepartmentDTO.creator = username

        add(currentDepartmentDTO)
          .then((response) => {
            // 显示保存成功并且返回
            this.$message.success('操作成功')
            // this.resetUIToInitStatus()
            this.dialogVisible = false
            this.onBtnQueryClick()
          })
          .catch(() => {
            this.dialogType = null
            this.customerVO = null
            this.$message.error('网络异常')
          })
      } else if (this.dialogType === 'EDIT') {
        this.departmentDTO = this.departmentVO
        modify(this.departmentDTO)
          .then((response) => {
            // 显示保存成功并且返回
            this.$message.success('操作成功')
            this.dialogVisible = false
            // 查询刷新当前增加数据为第一条
            this.onBtnQueryClick()
          })
          .catch(() => {
            this.dialogType = null
            this.customerVO = null
            this.$message.error('网络异常')
          })
      } else if (this.dialogType === 'COPY') {
        const currentDepartmentDTO = this.departmentVO
        console.log(currentDepartmentDTO)
        add(currentDepartmentDTO)
          .then((response) => {
            console.log('==>' + response)
            // 显示保存成功并且返回
            if (response) {
              this.$message.success('操作成功')
            } else {
              this.$message.success('操作失败')
            }

            // this.resetUIToInitStatus()
            this.dialogVisible = false
            // 查询刷新当前增加数据为第一条
            this.onBtnQueryClick()
          })
          .catch(() => {
            this.dialogType = null
            this.departmentVO = null
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
    },
    showmuen() {
      // debugger
      this.showmuenflag = !this.showmuenflag
    }
  }
}
</script>

<style scoped>
.i-sty {
  cursor: pointer;
}
</style>
