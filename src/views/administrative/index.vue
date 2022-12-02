<!--
 * @Author: abel.han
 * @Date: 2022-7-09 11:45:25
 * @LastEditTime: 2022-07-25 09:38:53
 * @LastEditors: 18059301505 275895816@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \sd365-tms-omp-front-end\src\views\administrative\index.vue
-->

<template>
  <el-container>
    <el-header>
      <!--引入查询面板组件该组件封装基本的查询控制逻辑-->
      <sd-QueryPanel
        class="queryClass"
        :query-model="administrativeQuery"
        @QueryButtonClick="onBtnQueryClick"
      >
        <!--这里在组件是slot 由用户自定义查询条件-->
        <el-form-item label="区域名称">
          <el-input
            v-model="administrativeQuery.name"
            style="
            width: 200px"
            @input="inputPY(customerVO.name)"
          />
        </el-form-item>
        <el-form-item label="助记码">
          <el-input v-model="administrativeQuery.mnemonicCode" style="width: 200px" />
        </el-form-item>
      </sd-QueryPanel>
    </el-header>
    <el-main style="margin-top:-10px; ">
      <!--action bar area-->
      <div style="margin-bottom: 20px;">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="onBtnAddClick"
        >增加</el-button>
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
        <i
          class="el-icon-menu"
          type="primary"
          icon="el-icon-plus"
          style="font-size:30px;color:#409eff;float:right"
          @click="onBtnHideClick"
        />
      </div>

      <!--data show area  -->
      <el-table
        ref="multipleTable"
        v-loading="queryLoading"
        :data="administratives"
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
        <el-table-column align="center" label="序号" width="75">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableColumns[0].show"
          sortable
          align="center"
          prop="name"
          label="区域名称"
          width="130"
        />
        <el-table-column
          v-if="tableColumns[1].show"
          sortable
          align="center"
          prop="code"
          label="区域代码"
          width="150"
        />
        <el-table-column
          v-if="tableColumns[2].show"
          sortable
          align="center"
          prop="mnemonicCode"
          label="助记码"
          width="150"
        />
        <el-table-column
          v-if="tableColumns[3].show"
          sortable
          align="center"
          prop="areaType"
          label="区域类型"
          width="95"
        />
        <el-table-column
          v-if="tableColumns[4].show"
          sortable
          align="center"
          prop="orderNum"
          label="排序号"
          width="95"
        />
        <el-table-column
          v-if="tableColumns[5].show"
          sortable
          align="center"
          prop="remark"
          label="备注"
          width="115"
        />
        <!--操作区-->

        <el-table-column
          align="center"
          prop="status"
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
        <el-table-column
          align="center"
          prop="operation"
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <div>
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
      <!-- <el-pagination
        :v-model="commonPage"
        layout="prev, pager, next"
        :total="commonPage.total"
        :page-count="commonPage.pageCount"
        :page-size="commonPage.pageSize"
      /> -->
      <el-pagination
        background
        :total="commonPage.total"
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="commonPage.pageSize"
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
      <sd-HideTable
        :visible.sync="hideDialogColumnVisible"
        :table-columns="tableColumns"
        :width="hideTableWidth"
        @hideTableClose="hideTableClose"
        @tableColumnData="tableColumnData"
      />
      <sd-FormDialog
        :caption="dialogCaption"
        :visible="dialogVisible"
        width="50%"
        :model="administrativeVO"
        :rules="rules"
        @OkButtonClick="onBtnSaveClick"
        @CancelButtonClick="onBtnCancelClick"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="区域名称" prop="name">
              <el-col :span="22">
                <el-input
                  v-model="administrativeVO.name"
                  @input="inputPY(administrativeVO.name)"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区域代码" prop="code">
              <el-col :span="22">
                <el-input v-model="administrativeVO.code" placeholder="" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="助记码" prop="mnemonicCode">
              <el-col :span="22">
                <el-input
                  v-model="administrativeVO.mnemonicCode"
                  placeholder=""
                  @input="inputAssistantCode($event)"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区域类型" prop="areaType">
              <el-col :span="22">
                <el-input v-model="administrativeVO.areaType" placeholder="" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序号" prop="orderNum">
              <el-col :span="22">
                <el-input v-model="administrativeVO.orderNum" placeholder="" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="address">
              <el-col :span="22">
                <el-input v-model="administrativeVO.remark" placeholder="" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
      </sd-FormDialog>
    </el-main>
  </el-container>
</template>
<style>
</style>
<script>
import {
  addAdministrative,
  removeAdministrative,
  modifyAdministrative,
  queryAdministrativeById,
  commonQuery,
  removeBatchAdministrative,
  status
} from '@/api/administrative/administrative'
import { queryDictionaryByTypeId } from '@/api/basedata/dictionary'
// eslint-disable-next-line no-unused-vars
import { QueryPanel, FormDialog } from '../../components/SD365UI'

import vPinyin from '../../utils/vue-py'
import { querytenantById } from '@/api/org/tenant'
export default {
  data() {
    // init all model
    return {
      // eslint-disable-next-line no-undef
      queryLoading: false, // 查询进度条控制
      // eslint-disable-next-line no-undef
      updateLoading: false, // 修改进度条控制
      // eslint-disable-next-line no-undef
      // copyLaoding: false, // 拷贝一条数据的进度控制
      multipleSelection: [],
      dialogVisible: false,
      /**
       * 查询区模型
       */
      administrativeQuery: { name: '' }, // 查询对象
      /**
       * 展示区模型
       */
      administratives: [], // 从vo取得的 区域信息
      // eslint-disable-next-line no-new-object
      administrativeVO: {}, // 显示查询回来的对象
      commonPage: { total: 10, pageCount: 1, pageSize: 10 }, // 分页数据对象
      currentPage: 1,
      /**
       * 对话框 模型
       */
      dialogCaption: '区域信息',
      // eslint-disable-next-line no-undef
      dialogType: 'EDIT', // 标记对话框处于那种状态 或者 ADD
      settleTypeVOS: [], // for 结算类型
      selectValue: '', // 显示用户的选择 以及后台的返回的默认值
      administrativeDTO: {}, // 增加和修改对象
      rules: {
        // 定义当前页面的非空规则这点参考表结构的字段comment规则要求
        name: [{ required: true, message: '请输入区域名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入区域代码', trigger: 'blur' }],
        mnemonicCode: [
          { required: true, message: '请输入助记码', trigger: 'blur' }
        ],
        areaType: [{ required: true, message: '请输入区域类型', trigger: 'blur' }],
        orderNum: [{ required: true, message: '请输入排序号', trigger: 'blur' }],
        remark: [{ required: false, message: '请输入备注', trigger: 'blur' }]
      },
      hideDialogColumnVisible: false,
      hideTableWidth: '30%',
      tableColumns: [
        { prop: 'name', label: '区域名称', show: true },
        { prop: 'code', label: '区域代码', show: true },
        { prop: 'mnemonicCode', label: '助记码', show: false },
        { prop: 'areaType', label: '区域类型', show: true },
        { prop: 'orderNum', label: '排序号', show: false },
        { prop: 'remark', label: '备注', show: false }
      ]
    }
  },
  mounted() {
    console.log('mounted..')
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

    inputPY(v) {
      this.administrativeVO.mnemonicCode = vPinyin
        .getPinYinFirstCharacter(v, '', true)
        .replace(/\s+/g, '')
    },
    inputAssistantCode(e) {
      this.$forceUpdate()
    },
    /**
     * @description:
     * @return {*}
     */
    initData() {
      this.searchLoading = false
      this.queryLoading = false
      this.updateLoading = false
      this.listLoading = false
      this.onBtnQueryClick()
      // this.parseTableColumnData()
    },
    /**
     * @description: 根据页面的下拉框的需要从字典加载数据参数为字典类型
     * @param {*} defaultSelectValue
     * @return {*}
     */
    loadSettleType(defaultSelectValue) {
      queryDictionaryByTypeId(1326439346873696256)
        .then((response) => {
          if (response) {
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
      queryAdministrativeById(row.id).then((response) => {
        // 取得CommonResponse的Body
        if (response) {
          // eslint-disable-next-line no-undef
          this.administrativeVO = response
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
      const administrativeDTO = {
        id: row.id,
        status: row.status,
        version: row.version
      }
      status(administrativeDTO)
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

    onBtnQueryClick() {
      this.queryAdministrative(this.commonPage.pageSize, 1)
      this.currentPage = 1
    },

    /**
     * 换页
     */
    handleCurrentChange(val) {
      this.queryAdministrative(this.commonPage.pageSize, val)
    },

    /**
     * 更改页面显示数量大小
     */
    handleSizeChange(val) {
      // this.$message.error()
      this.queryAdministrative(val, 1)
      this.currentPage = 1 // 调整默认显示页面
    },
    /**
     * @description: 查询 区域 操作
     * @return {*}
     */
    queryAdministrative(size, num) {
      // console.log('before ')
      //
      this.queryLoading = true
      this.administrativeQuery.pageSize = size
      this.administrativeQuery.pageNum = num
      commonQuery(this.administrativeQuery)
        .then((response) => {
          // eslint-disable-next-line no-unused-vars
          const { total, pageNum, pageSize } = response // 如果异常则被axios 的拦截器拦截并且显示错误码和消息

          this.commonPage.total = parseInt(total)
          this.commonPage.pageCount = parseInt(pageNum)
          this.commonPage.pageSize = size
          this.administratives = response.data // 分页信息带回显示
          this.queryLoading = false // 关闭查询d
        })
        .catch(() => {
          this.queryLoading = false // 关闭查询
          this.$message.error('网络异常')
        })
      // 将 commonnPage 数据设在到 分页控件
    },

    /**
     * @description: 点击action bar区 增加按钮弹出对话框
     * @return {*}
     */
    onBtnAddClick() {
      // get header from token  load organizations and companies
      try {
        this.administrativeVO = {} // 初始化
        // this.loadSettleType('')
        this.dialogType = 'ADD'
        this.dialogVisible = true
      } catch (error) {
        this.$message.error('网络异常')
      }
    },
    /**
     * @description: 点击 action bar 区进行 复制操作
     * @return {*}
     */
    // onBtnCopyClick() {
    //   // get header from token  load organizations and companies
    //   // 如果不是选择一条则提示消息并且返回
    //   const rows = this.$refs.multipleTable.selection
    //   if (rows == null) {
    //     this.$message.error('选择一条进行拷贝')
    //     return
    //   }
    //   if (rows.length > 1) {
    //     this.$message.error('只能选择一条进行拷贝')
    //     return
    //   } else {
    //     this.showCustomer(rows[0])
    //   }
    // },

    /**
     * @description: 点击action bar区进行批量删除操作
     * @return {*}
     */
    onBtnBatchDelete() {
      const administrativeVOS = this.$refs.multipleTable.selection
      if (administrativeVOS == null || administrativeVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }
      const deleteAdministrativeDTOS = new Array(administrativeVOS.length)
      for (let i = 0; i < administrativeVOS.length; i++) {
        deleteAdministrativeDTOS[i] = ({
          id: administrativeVOS[i].id,
          version: administrativeVOS[i].version
        })
      }

      removeBatchAdministrative(deleteAdministrativeDTOS)
      this.$confirm('确定删除记录吗').then((response) => {
        if (response) {
          this.$message.success('删除数据成功')
          this.onBtnQueryClick()
        }
      })
        .catch(() => {
          this.$message.error('删除失败')
        })
    },
    /**
     * @description: 点击 action bar 区域进行启用和停用控制操作
     * @param {*} status
     * @return {*}
     */
    onDisableRecodClick(stat) {
      const administrativeVOS = this.$refs.multipleTable.selection
      if (administrativeVOS == null || administrativeVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }
      const administrativeDTOS = new Array(administrativeVOS.length)
      console.log('len',administrativeVOS.length)
      for (let i = 0; i < administrativeVOS.length; i++) {
        administrativeDTOS[i] = {
          id: administrativeVOS[i].id,
          status: stat,
          version: administrativeVOS[i].version
        }

        status(administrativeDTOS[i])
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
    // onRowBtnCopyClick(index, row) {
    //   // 查询并且展示  然后就是 增加
    //   if (row != null) {
    //     this.showCustomer(row)
    //   }
    // },
    /**
     * @description: 点击行的操作区域删除当前行的记录
     * @return {*}
     */
    onBtnDeleteClick(index, row) {
      this.$confirm('确定删除记录吗').then((result) => {
        // 获取多条ID 调用服务端
        removeAdministrative(row.id, row.version)
          .then((response) => {
            if (response) {
              this.$message.success('操作成功')
              this.handleCurrentChange(this.currentPage)
            } else {
              this.$message.error('操作失败')
              this.handleCurrentChange(this.currentPage)
            }
          })
          .catch(() => {
            this.$message.error('删除失败')
            this.handleCurrentChange(this.currentPage)
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
      const currentAdministrativeVO = this.administratives[index]
      if (currentAdministrativeVO == null) {
        this.$message.info('没有对应记录可以编辑')
        return
      }
      // console.log(currentAdministrativeVO)
      queryAdministrativeById(currentAdministrativeVO.id)
        .then(response => {
          // 取得CommonResponse的Body

          if (response != null) {
            // eslint-disable-next-line no-undef
            this.administrativeVO = response
            // eslint-disable-next-line no-undef
          } else {
            this.$message.info('没有对应记录可以编辑')
          }
        })
        .catch(() => {
          this.$message.error('网络异常')
          return
        })
      this.dialogType = 'EDIT'
      // eslint-disable-next-line no-undef
      this.dialogVisible = true
    },

    /**
     * @description: 编辑和修改前从后端查询客户信息的公用客户方法
     * @return {*}
     */
    showCustomer(administrativeVO) {
      this.copyLaoding = true
      const selectedCustomer = administrativeVO
      console.log(selectedCustomer)
      queryAdministrativeById(selectedCustomer.id)
        .then((response) => {
          // eslint-disable-next-line no-undef
          // 加载下拉框数据 设置下拉框的选项

          this.administrativeVO = response
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
      if (this.dialogType === 'ADD') {
        const currentAdministrativeDTO = this.administrativeVO
        console.log(currentAdministrativeDTO)
        addAdministrative(currentAdministrativeDTO)
          .then((response) => {
            // 显示保存成功并且返回
            this.$message.success('操作成功')
            this.onBtnQueryClick()
            // this.resetUIToInitStatus()
            this.dialogVisible = false
          })
          .catch(() => {
            this.dialogType = null
            this.administrativeVO = null
            this.$message.error('网络异常')
          })
      } else if (this.dialogType === 'EDIT') {
        this.customerDTO = this.administrativeVO
        modifyAdministrative(this.customerDTO)
          .then((response) => {
            // 显示保存成功并且返回
            this.$message.success('操作成功')

            this.dialogVisible = false
            // 查询刷新当前增加数据为第一条
            this.onBtnQueryClick()
          })
          .catch(() => {
            this.dialogType = null
            this.administrativeVO = null
            this.$message.error('网络异常')
          })
      } else if (this.dialogType === 'COPY') {
        const currentAdministrativeDTO = this.administrativeVO
        console.log(currentAdministrativeDTO)
        addAdministrative(currentAdministrativeDTO)
          .then((response) => {
            // 显示保存成功并且返回
            this.$message.success('操作成功')
            // this.resetUIToInitStatus()
            this.dialogVisible = false
          })
          .catch(() => {
            this.dialogType = null
            this.administrativeVO = null
            this.$message.error('网络异常')
          })
      }
    },

    /**
     * @description: 对话框区域的点击操作,在这里添加你取消的逻辑
     * @return {*}
     */
    onBtnCancelClick() {
      this.dialogType = ''
      this.dialogVisible = false
    },
    // 点击隐藏表格事件
    onBtnHideClick() {
      this.hideDialogColumnVisible = true
    },
    hideTableClose(visible) {
      this.hideDialogColumnVisible = visible
    },
    beforeUpdate() {
      // 重新布局表格
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout()
      })
    }
  }
}
</script>
<style scoped>
.queryClass {
  margin-left: -54px;
  margin-top: 10px;
}
.el-header {
  margin-top: 10px;
  margin-bottom: 15px;
}
</style>
