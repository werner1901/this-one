<template>
  <el-container>
    <!--顶部主体-->
    <el-header>
      <!--引入查询面板组件该组件封装基本的查询控制逻辑-->
      <sd-QueryPanel
        :query-model="SystemParamQuery"
        @QueryButtonClick="onBtnFuzzyQueryClick"
      >
        <!--这里在组件是slot 由用户自定义查询条件-->
        <el-form-item label="参数类型" label-width="70px">
          <el-autocomplete
            v-model="SystemParamQuery.paramType"
            class="inline-input"
            :fetch-suggestions="querySearchAsync"
            placeholder="请选择"
            value-key="name"
            @select="handleQueryTypeSelect"
          />
        </el-form-item>
        <el-form-item label="参数项" label-width="60px">
          <el-input v-model="SystemParamQuery.param" style="width: 200px" />
        </el-form-item>
        <el-form-item label="参数值" label-width="60px">
          <el-input v-model="SystemParamQuery.value" style="width: 200px" />
        </el-form-item>
      </sd-QueryPanel>
      <el-row>
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
        <!-- <el-button type="primary" icon="el-icon-share">导入</el-button>
        <el-button type="primary" icon="el-icon-share" @click="exportExcel ">导出</el-button> -->
      </el-row>
    </el-header>
    <!--主要区域容器-->
    <el-main style="margin-top: 70px">
      <!--data show area  -->
      <el-table
        id="rebateSetTable"
        ref="multipleTable"
        v-loading="queryLoading"
        :data="systemParams"
        element-loading-text="Loading"
        fit
        highlight-current-row
        border
        height="500"
        :row-style="iRowStyle"
        :cell-style="iCellStyle"
        :header-row-style="iHeaderRowStyle"
        :header-cell-style="iHeaderCellStyle"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowDoubleClick"
        @select="onRowSelected"
      >
        <el-table-column fixed align="center" width="50" type="selection" />
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="param"
          label="参数项"
        />
        <el-table-column
          align="center"
          prop="value"
          label="参数值"
        />
        <el-table-column
          align="center"
          prop="dictTypeName"
          label="参数类型"
        />
        <!-- <el-table-column
          align="center"
          prop="updatedTime"
          label="修改时间"
          width="200px"
        >
          <template slot-scope="scope">
            <div
              v-if="
                scope.row.updatedTime === null ||
                  scope.row.updatedTime === undefined
              "
            >
              /
            </div>
            <div v-else>
              <i class="el-icon-time" />
              <span style="margin-left: 10px">{{
                generateDatabaseTime(new Date(scope.row.updatedTime))
              }}</span>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column align="center" prop="status" label="启用">
          <template slot-scope="{ row }">
            <el-tag v-if="row.status == 1" size="mini" type="success">
              启用
            </el-tag>
            <el-tag v-if="row.status == 0" size="mini" type="danger">
              停用
            </el-tag>
          </template>
        </el-table-column>
        <!--操作区-->
        <el-table-column
          fixed="right"
          align="center"
          prop="operation"
          label="操作"
          width="300"
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
        background
        :current-page.sync="commonPage.currentPage"
        :page-sizes="[2, 5, 10]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="commonPage.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <sd-FormDialog
        :caption="dialogCaption"
        :visible.sync="dialogVisible"
        width="50%"
        :model="systemParamVO"
        :rules="rules"
        @OkButtonClick="onBtnSaveClick"
        @CancelButtonClick="on"
      >
        <el-form-item label="参数类型" prop="dictTypeName" :span="24">
          <el-col>
            <el-autocomplete
              v-model="systemParamVO.dictTypeName"
              class="inline-input"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              value-key="name"
              @select="handleSelect"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="参数项" prop="param">
          <el-input v-model="systemParamVO.param" />
        </el-form-item>
        <el-form-item label="参数值" prop="value">
          <el-input v-model="systemParamVO.value" />
        </el-form-item>
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
.inline-input {
  width: 100%;
}
</style>
<script>
import {
  add,
  remove,
  modify,
  commonQuery as commonQuerySystemParam,
  fuzzyQuery,
  querySystemParameterById,
  batchRemove,
  batchUpdate
} from '@/api/basedata/systemParam'

import { queryDictionaryByTypeId } from '@/api/basedata/dictionary'
import { list, info } from '@/api/basedata/dictionary-type'
// eslint-disable-next-line no-unused-vars
import { QueryPanel, FormDialog } from '@/components/SD365UI'
// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'
import { generateDatabaseTime } from '@/utils'
// eslint-disable-next-line no-unused-vars
import dialogdrap from '@/utils/dialogdrap'

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
      isFuzzyQuery: false,
      dictionaryType: {},
      data: { label: '系统评价' },
      SystemParamQuery: { 
        paramType: '', 
        param: '', 
        value: ''
      }, // 查询对象
      CustomerQuery: { name: '', mobile: '' },
      customers: {},
      /**
       * 展示区模型
       */
      systemParams: [], // 从vo取得的客户信息
      dictionary: [],
      // eslint-disable-next-line no-new-object
      systemParamVO: {}, // 显示查询回来的对象
      commonPage: { total: 10, pageCount: 1, pageSize: 10, currentPage: 1 }, // 分页数据对象
      /**
       * 对话框 模型
       */
      dialogCaption: '新增参数信息',
      // eslint-disable-next-line no-undef
      dialogType: 'EDIT', // 标记对话框处于那种状态 或者 ADD
      // eslint-disable-next-line no-undef
      // organizations: [], // for 机构
      // companies: [], // for 公司
      // settleTypeVOS: [], // for 结算类型
      selectValue: '', // 显示用户的选择 以及后台的返回的默认值
      systemParamDTO: {}, // 增加和修改对象
      rules: {
        // 定义当前页面的非空规则这点参考表结构的字段comment规则要求
        dictTypeName: [
          { required: true, message: '请选择参数类型', trigger: 'change' }
        ],
        param: [{ required: true, message: '请输入参数项', trigger: 'blur' }],
        value: [{ required: true, message: '请输入参数值', trigger: 'blur' }]
      }
    }
  },
  computed: {
    dictypename() {
      return this.systemParamVO.dictTypeName
    }
  },
  watch: {
    dictypename(v) {
      if (v === null || v === undefined || (v = v.trim()) === '') {
        this.systemParamVO.paramType = null
      }
    }
  },
  mounted() {
    console.log('mounted..')
    this.initData()
  },
  methods: {
    iRowStyle: function({ row, rowIndex }) {
      return 'height:35px'
    },
    iHeaderRowStyle: function({ row, rowIndex }) {
      return 'height:35px'
    },
    iCellStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'padding:10px'
    },
    iHeaderCellStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'padding:10px'
    },
    generateDatabaseTime: generateDatabaseTime,
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
      this.fuzzyQuery = false
      this.loadSettleType('')

      this.onBtnQueryClick()
    },
    /**
     * @description: 根据页面的下拉框的需要从字典加载数据参数为字典类型
     * @param {*} defaultSelectValue
     * @return {*}
     */
    loadSettleType(defaultSelectValue) {
      commonQuerySystemParam(this.commonPage)
        .then((response) => {
          if (response == null) {
            return
          } else {
            this.customers = response.data
            var tempdata = []
            var flag
            for (var i in this.customers) {
              flag = true
              for (var j in tempdata) {
                if (tempdata[j].paramType === this.customers[i].paramType) {
                  flag = false
                  break
                }
              }
              if (flag) {
                tempdata.push(this.customers[i])
              }
            }
            this.customers = tempdata
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
      querySystemParameterById(row.id).then((response) => {
        // 取得CommonResponse的Body
        if (response != null) {
          // eslint-disable-next-line no-undef
          this.systemParamVO = response
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
     * @description: 用于对VO的 标志值 转 文字的定义 例如仓库类型 状态位需要转化
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
      this.commonPage.currentPage = 1
      this.querySystemParam(
        this.commonPage.pageSize,
        this.commonPage.currentPage
      )
    },

    /**
     * @description: 模糊查询操作
     * @param {*}
     * @return {*}
     */
    onBtnFuzzyQueryClick() {
      this.isFuzzyQuery = true
      this.onBtnQueryClick()
    },

    /**
     * @description:
     * @param {*} pageSize
     * @param {*} pageNum
     * @return {*}
     */
    querySystemParam(pageSize, pageNum) {
      this.dialogVisible = false
      this.queryLoading = true
      this.SystemParamQuery.pageSize = pageSize
      this.SystemParamQuery.pageNum = pageNum
      if (this.isFuzzyQuery) {
        fuzzyQuery(this.SystemParamQuery)
        .then((response) => {
          const { total } = response // 如果异常则被axios 的拦截器拦截并且显示错误码和消息
          this.commonPage.total = parseInt(total)
          this.systemParams = response.data // 分页信息带回显示
          this.queryLoading = false // 关闭查询
        })
        .catch(() => {
          this.queryLoading = false // 关闭查询
          this.$message.error('网络异常')
        })
      } else {
        commonQuerySystemParam(this.SystemParamQuery)
        .then((response) => {
          const { total } = response // 如果异常则被axios 的拦截器拦截并且显示错误码和消息
          this.commonPage.total = parseInt(total)
          this.systemParams = response.data // 分页信息带回显示
          this.queryLoading = false // 关闭查询
        })
        .catch(() => {
          this.queryLoading = false // 关闭查询
          this.$message.error('网络异常')
        })
      }
      this.isFuzzyQuery = false
    },
    /**
     * @description: 点击action bar区 增加按钮弹出对话框
     * @param {*}
     * @return {*}
     */
    onBtnAddClick() {
      // get header from token  load organizations and companies
      // this.copyLaoding = true
      try {
        // 初始化
        this.systemParamVO = {}

        // this.systemParamVO.paramType = this.customers[0].id
        this.dialogType = 'ADD'
        this.dialogVisible = true
        // this.copyLaoding = false
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
      if (rows == null || rows.length === 0) {
        this.$message.error('选择一条进行拷贝')
        return
      }
      if (rows != null && rows.length > 1) {
        this.$message.error('只能选择一条进行拷贝')
        return
      } else {
        this.showSystemParam(rows[0])
      }
    },

    /**
     * @description: 点击action bar区进行批量删除操作
     * @param {*}
     * @return {*}
     */
    onBtnBatchDelete() {
      this.SystemParamQuery = { paramType: '', param: '', value: '' }
      const systemParamVOS = this.$refs.multipleTable.selection
      if (systemParamVOS == null || systemParamVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }

      this.$confirm('是否删除？').then((res) => {
        if (res === 'confirm') {
          const deleteSystempPramDTOS = new Array(systemParamVOS.length)
          for (let i = 0; i < systemParamVOS.length; i++) {
            deleteSystempPramDTOS[i] = {
              id: systemParamVOS[i].id,
              version: systemParamVOS[i].version
            }
          }
          batchRemove(deleteSystempPramDTOS)
            .then((response) => {
              if (response) {
                this.$message.success('删除数据成功')
                this.onBtnQueryClick()
              }
            })
            .catch(() => {
              this.$message.error('网络错误或数据不存在')
            })
        } else {
          this.$message.info('取消操作')
        }
      })
    },
    /**
     * @description: 点击 action bar 区域进行启用和停用控制操作
     * @param {*} status
     * @return {*}
     */
    onDisableRecodClick(status) {
      const systemParamVOS = this.$refs.multipleTable.selection
      if (systemParamVOS == null || systemParamVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }

      const systemParamDTOS = new Array(systemParamVOS.length)
      for (let i = 0; i < systemParamVOS.length; i++) {
        systemParamDTOS[i] = {
          id: systemParamVOS[i].id,
          status: status,
          modifier: this.$store.getters.name
        }
      }
      // eslint-disable-next-line no-array-constructor
      batchUpdate(systemParamDTOS)
        .then((response) => {
          if (response) {
            this.$message.success('操作成功')
            this.querySystemParam(
              this.commonPage.pageSize,
              this.commonPage.currentPage
            )
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
        this.showSystemParam(row)
      }
    },
    /**
     * @description: 点击行的操作区域删除当前行的记录
     * @param {*}
     * @return {*}
     */
    onBtnDeleteClick(index, row) {
      this.SystemParamQuery = { paramType: '', param: '', value: '' }
      const currentSystemParamVO = this.systemParams[index]
      if (currentSystemParamVO == null) {
        this.$message.info('没有对应记录可以编辑')
        return
      }
      this.$confirm('确定删除记录吗').then((result) => {
        // 获取多条ID 调用服务端
        remove(currentSystemParamVO.id, currentSystemParamVO.version)
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

      const currentSystemParamVO = this.systemParams[index]
      if (currentSystemParamVO.id == null) {
        this.$message.info('没有对应记录可以编辑')
        return
      }

      querySystemParameterById(currentSystemParamVO.id)
        .then((response) => {
          // 取得CommonResponse的Body

          if (response != null) {
            this.systemParamVO = response
          } else {
            this.$message.info('没有对应记录可以编辑')
          }
        })
        .catch(() => {
          this.$message.error('网络异常')
          return
        })
      this.dialogType = 'EDIT'
      this.dialogVisible = true
    },

    /**
     * @description: 编辑和修改前从后端查询客户信息的公用客户方法
     * @param {*} systemParamVO
     * @return {*}
     */
    showSystemParam(systemParamVO) {
      this.copyLaoding = true
      // this.loadOrganizations()
      // this.loadCompanies()
      // 调用 api 插入记录并且返回记录
      const selectedSystemParam = systemParamVO

      querySystemParameterById(selectedSystemParam.id)
        .then((response) => {
          // eslint-disable-next-line no-undef
          // 加载下拉框数据 设置下拉框的选项

          this.systemParamVO = response
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
    onBtnSaveClick (source) {
      this.SystemParamQuery = { paramType: '', param: '', value: '' }
      if (this.dialogType === 'ADD') {
        // eslint-disable-next-line no-undef
        const currentSystemParamDTO = this.systemParamVO
        currentSystemParamDTO.creator = this.$store.getters.name
        if (
          currentSystemParamDTO.paramType == null ||
          // eslint-disable-next-line eqeqeq
          currentSystemParamDTO.paramType == undefined
        ) {
          this.$message.error('系统参数类型不存在')
        } else {
          add(currentSystemParamDTO)
            .then((response) => {
              if (response) {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.onBtnQueryClick()
              } else {
                if (this.dictionary.length === 0) {
                  this.$message.error('系统参数类型不存在')
                } else {
                  this.$message.error('系统参数名称重复')
                }
              }
            })
            .catch(() => {
              this.$message.error('网络错误')
            })
        }
      } else if (this.dialogType === 'EDIT') {
        // eslint-disable-next-line no-unused-vars
        this.systemParamDTO = this.systemParamVO
        this.systemParamDTO.modifier = this.$store.getters.name
        if (
          this.systemParamDTO.paramType == null ||
          // eslint-disable-next-line eqeqeq
          this.systemParamDTO.paramType == undefined
        ) {
          this.$message.error('系统参数类型不存在')
        } else {
          modify(this.systemParamDTO)
            .then((response) => {
              // 显示保存成功并且返回
              this.$message.success('操作成功')
              this.dialogVisible = false
              // 查询刷新当前增加数据为第一条
              this.onBtnQueryClick()
            })
            .catch(() => {
              this.$message.error('网络异常')
            })
        }
      } else if (this.dialogType === 'COPY') {
        const currentSystemParamDTO = this.systemParamVO
        console.log(currentSystemParamDTO)
        if (
          currentSystemParamDTO.paramType == null ||
          // eslint-disable-next-line eqeqeq
          currentSystemParamDTO.paramType == undefined
        ) {
          this.$message.error('系统参数类型不存在')
        } else {
          add(currentSystemParamDTO)
            .then((response) => {
              console.log('==>' + response)
              // 显示保存成功并且返回
              if (response) {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.onBtnQueryClick()
              } else {
                this.$message.error('参数项名称重复')
              }
            })
            .catch(() => {
              this.$message.error('网络错误')
            })
        }
      }
    },
    handleSizeChange(val) {
      // this.$message.error()
      this.commonPage.pageSize = val
      this.querySystemParam(val, this.commonPage.pageNum)
      // 初始化查询区域的参数类型内容
      this.loadSettleType('')
    },
    handleCurrentChange(val) {
      this.commonPage.currentPage = val
      this.querySystemParam(this.commonPage.pageSize, val)
      // 初始化查询区域的参数类型内容
      this.loadSettleType('')
    },
    querySearchAsync(queryString, cb) {
      if (queryString === undefined || queryString === null) {
        queryString = ''
      }
      list({ name: queryString, pageSize: 100 })
        .then((response) => {
          if (response == null) {
            return
          } else {
            this.dictionary = response.data
            if (response.data.length === 0) {
              this.systemParamVO.paramType = null
            }
            cb(this.dictionary)
          }
        })
        .catch(() => {
          this.$message.error('网络错误')
        })
    },
    handleSelect(item) {
      info(item.id)
        .then((response) => {
          if (response == null) {
            return
          } else {
            this.systemParamVO.paramType = response.id
          }
        })
        .catch(() => {
          this.$message.error('网络错误')
        })
    },
    handleQueryTypeSelect(item) {
      info(item.id)
        .then((response) => {
          if (response == null) {
            return
          } else {
            this.SystemParamQuery.paramType = response.name
          }
        })
        .catch(() => {
          this.$message.error('网络错误')
        })
    }
  }
}
</script>
