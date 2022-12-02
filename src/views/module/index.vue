<template>
  <el-container>
    <el-header>
      <!--引入查询面板组件该组件封装基本的查询控制逻辑-->
      <sd-QueryPanel
        :query-model="moduleQuery"
        @QueryButtonClick="onBtnQueryClick"
      >
        <!--这里在组件是slot 由用户自定义查询条件-->
        <el-form-item style="margin-left: -50px" label="模块名称">
          <el-input v-model="moduleQuery.name" style="width: 150px" />
        </el-form-item>
      </sd-QueryPanel>
      <!--页面头部增加、删除、启停控制区-->
      <el-row>
        <el-button type="primary" icon="el-icon-plus" @click="onBtnAddClick"
          >增加</el-button
        >
        <el-button type="danger" icon="el-icon-delete" @click="onBtnBatchDelete"
          >删除</el-button
        >
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
      </el-row>
    </el-header>
    <el-main style="margin-top: 0px">
      <!--data show area  -->
      <el-table
        ref="multipleTable"
        v-loading="queryLoading"
        :data="modules"
        element-loading-text="Loading"
        fit
        highlight-current-row
        border
        style="margin-top: 50px"
        :height="tableHeight"
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
          label="模块名称"
        />
        <el-table-column
          v-if="tableColumns[1].show"
          align="center"
          prop="code"
          label="模块编码"
        />
        <el-table-column
          v-if="tableColumns[2].show"
          align="center"
          prop="description"
          label="模块描述"
        />
        <el-table-column
          v-if="tableColumns[3].show"
          align="center"
          prop="edition"
          label="版本"
        />
        <el-table-column
          v-if="tableColumns[4].show"
          align="center"
          prop="subsystem_id"
          label="子系统id"
        />
        <!--        <el-table-column v-if="tableColumns[5].show" align="center" prop="companyId" label="公司id"/>-->
        <!--        <el-table-column v-if="tableColumns[6].show" align="center" prop="orgId" label="机构id"/>-->
        <!--        <el-table-column v-if="tableColumns[7].show" align="center" prop="tenantId" label="租户id"/>-->
        <el-table-column align="center" prop="status" label="启用">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === 1 ? 'success' : 'danger'"
              disable-transitions
            >
              {{ statusFormat(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        <!--    数据行右边的操作区    -->
        <el-table-column
          v-if="!exportStatus"
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
                >编辑</el-button
              >
              <el-button
                id="btnDelete"
                size="mini"
                icon="icon-label-delete"
                type="danger"
                @click="onBtnDeleteClick(scope.$index, scope.row)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--   分页   -->
      <el-pagination
        :v-model="commonPage"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :total="commonPage.total"
        :page-size="commonPage.pageSize"
        :current-page.sync="commonPage.currentPage"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
      <!--      <sd-HideTable-->
      <!--        :visible.sync="hideDialogColumnVisible"-->
      <!--        :table-columns="tableColumns"-->
      <!--        :width="hideTableWidth"-->
      <!--        @hideTableClose="hideTableClose"-->
      <!--        @tableColumnData="tableColumnData"-->
      <!--      />-->
      <sd-FormDialog
        :caption="dialogCaption"
        :visible="dialogVisible"
        width="40%"
        :model="moduleVO"
        :rules="rules"
        @OkButtonClick="onBtnSaveClick"
        @CancelButtonClick="onBtnCancelClick"
      >
        <el-row>
          <el-col :span="20" :offset="2">
            <el-form-item label="模块名称" prop="name">
              <el-input v-model="moduleVO.name" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20" :offset="2">
            <el-form-item label="模块编码" prop="code">
              <el-input v-model="moduleVO.code" placeholder="" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row
          ><el-col :span="20" :offset="2">
            <el-form-item label="版本" prop="edition">
              <el-input
                v-model="moduleVO.edition"
                placeholder=""
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row
          ><el-col :span="20" :offset="2">
            <el-form-item label="子系统" prop="subsystem_id">
              <el-select
                v-model="moduleVO.subsystem_id"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="subSystem in subSystemList"
                  :key="subSystem.id"
                  :label="subSystem.name"
                  :value="subSystem.id"
                />
              </el-select> </el-form-item
          ></el-col>
        </el-row>
        <el-row
          ><el-col :span="20" :offset="2">
            <el-form-item label="描述" prop="description">
              <el-input
                v-model="moduleVO.description"
                placeholder=""
              /> </el-form-item
          ></el-col>
        </el-row>
        <!--          <el-row>-->
        <!--            <el-form-item label="公司id" prop="companyId">-->
        <!--            <el-input v-model="moduleVO.companyId" placeholder="" />-->
        <!--            </el-form-item>-->
        <!--          </el-row>-->
        <!--          <el-row>-->
        <!--            <el-form-item label="机构id" prop="orgId">-->
        <!--            <el-input v-model="moduleVO.orgId" placeholder="" />-->
        <!--            </el-form-item>-->
        <!--          </el-row>-->
        <!--          <el-row>-->
        <!--            <el-form-item label="租户id" prop="tenantId">-->
        <!--            <el-input v-model="moduleVO.tenantId" placeholder="" />-->
        <!--            </el-form-item>-->
        <!--          </el-row>-->
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
  addModule,
  batchUpdateModule,
  commonQuery,
  modifyModule,
  queryModuleById,
  removeBatchModule,
  removeModule,
} from '@/api/org/module'
import * as subSystem from '@/api/right/subSystem'

export default {
  data() {
    // init all model
    return {
      // eslint-disable-next-line no-undef
      queryLoading: false, // 查询进度条控制
      // eslint-disable-next-line no-undef
      updateLoading: false, // 修改进度条控制
      multipleSelection: [],
      dialogVisible: false,
      /**
       * 导出状态false时表格有操作列，true时表格没有操作列
       */
      exportStatus: false,
      /**
       * 查询区模型
       */
      moduleQuery: { name: '' },
      /**
       * 展示区模型
       */
      modules: [], // 从vo取得模块信息
      moduleVO: {},
      commonPage: {
        total: 10,
        pageCount: 1,
        pageSize: 10,
        currentPage: 1,
        pages: 1,
      }, // 分页数据对象
      /**
       * table高度
       */
      tableHeight: 600,
      /**
       * 对话框模型
       */
      dialogCaption: '模块信息',
      dialogType: 'EDIT',
      settleTypeVOS: [],
      selectValue: '',
      moduleDTO: {},
      subSystemList: [],
      rules: {
        name: [{ required: true, message: '请输入模块名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入模块编码', trigger: 'blur' }],
        description: [
          { required: false, message: '请输入模块描述', trigger: 'blur' },
        ],
        edition: [
          { required: true, message: '请输入模块版本', trigger: 'blur' },
        ],
        subsystem_id: [
          { required: true, message: '请选择子系统', trigger: 'blur' },
        ],
        companyId: [
          { required: true, message: '请输入公司id', trigger: 'blur' },
        ],
        orgId: [{ required: true, message: '请输入机构id', trigger: 'blur' }],
        tenantId: [
          { required: true, message: '请输入租户id', trigger: 'blur' },
        ],
      },
      hideDialogColumnVisible: false,
      hideTableWidth: '30%',
      tableColumns: [
        { prop: 'name', label: '模块名称', show: true },
        { prop: 'code', label: '模块编码', show: true },
        { prop: 'description', label: '模块描述', show: true },
        { prop: 'edition', label: '模块版本', show: true },
        { prop: 'subsystem_id', label: '子系统id', show: false },
        { prop: 'companyId', label: '公司id', show: false },
        { prop: 'orgId', label: '机构id', show: false },
        { prop: 'tenantId', label: '租户id', show: false },
      ],
    }
  },
  mounted() {
    console.log('mounted..')
    this.initData()
  },
  methods: {
    initData() {
      this.searchLoading = false
      this.queryLoading = false
      this.updateLoading = false
      this.listLoading = false
      this.onBtnQueryClick()
      this.getSubSystemList()
      // this.parseTableColumnData()
    },
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
      queryModuleById(row.id).then((response) => {
        // 取得CommonResponse的Body
        if (response != null) {
          // eslint-disable-next-line no-undef
          this.moduleVO = response
          // eslint-disable-next-line no-undef
          this.dialogType = 'EDIT'
          // eslint-disable-next-line no-undef
          this.dialogVisible = true
        } else {
          this.$message.info('没有对应记录可以编辑')
        }
      })
    },
    onDropdownCommand(command) {
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
    onDisableRecodClick(status) {
      const moduleVOS = this.$refs.multipleTable.selection
      if (moduleVOS == null || moduleVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }

      const moduleDTOS = new Array(moduleVOS.length)
      for (let i = 0; i < moduleDTOS.length; i++) {
        moduleDTOS[i] = {
          id: moduleVOS[i].id,
          status: status,
          version: moduleVOS[i].version,
        }
      }
      // eslint-disable-next-line no-array-constructor
      batchUpdateModule(moduleDTOS)
        .then((response) => {
          if (response) {
            this.$message.success('操作成功')
            this.queryModule()
          } else {
            this.$message.error('没有找到对应记录更新失败')
          }
        })
        .catch(() => {
          this.$message.error('网络错误')
        })
    },
    onBtnAddClick() {
      try {
        this.moduleVO = {} // 初始化
        // this.loadSettleType('')
        this.dialogType = 'ADD'
        this.dialogVisible = true
      } catch (error) {
        this.$message.error('网络异常')
      }
    },
    /**
     * 业务方法区  按查询区  操作区  展示区  分别组织代码
     */
    onBtnQueryClick() {
      this.queryModule()
      this.commonPage.currentPage = 1
    },
    /**
     * 换页
     * @param val
     */
    handleCurrentChange(val) {
      this.queryModule(this.commonPage.pageSize, val)
    },
    statusFormat(row, column) {
      if (row.status === 1) {
        return '启用'
      } else {
        return '停用'
      }
    },
    queryModule() {
      this.queryLoading = true
      this.moduleQuery.pageSize = this.commonPage.pageSize
      this.moduleQuery.pageNum = this.commonPage.currentPage
      // eslint-disable-next-line no-undef
      commonQuery(this.moduleQuery)
        .then((response) => {
          this.commonPage.total = parseInt(response.total)
          this.commonPage.pages = parseInt(response.pages)
          this.modules = response.data // 分页信息带回显示
          this.queryLoading = false // 关闭查询
        })
        .catch(() => {
          this.queryLoading = false // 关闭查询
          this.$message.error('网络异常')
        })
    },
    /**
     * @description: 获取子系统列表
     * @param {*}
     * @return {*}
     */
    getSubSystemList() {
      subSystem
        .commonQuery({})
        .then((res) => {
          this.subSystemList = res.data
        })
        .catch(() => {
          this.$message.error('子系统列表获取失败')
        })
    },
    /**
     * @description: 对话框点击保存的时候调用此方法方法判断对话框类型是增加还是修改
     * 从而调用相应的接口，操作完成需要调用查询刷新让当前数据显示第一条
     * @param {*} source FormDialg Vue对象
     * @return {*}
     */
    onBtnSaveClick(source) {
      if (this.dialogType === 'ADD') {
        const currentModuleDTO = this.moduleVO
        addModule(currentModuleDTO)
          .then((response) => {
            // 显示保存成功并且返回
            this.$message.success('操作成功')
            this.onBtnQueryClick()
            // this.resetUIToInitStatus()
            this.dialogVisible = false
          })
          .catch(() => {
            this.dialogType = null
            this.moduleVO = null
            this.$message.error('网络异常')
          })
      } else if (this.dialogType === 'EDIT') {
        this.moduleDTO = this.moduleVO
        modifyModule(this.moduleDTO)
          .then((response) => {
            // 显示保存成功并且返回
            this.$message.success('操作成功')

            this.dialogVisible = false
            // 查询刷新当前增加数据为第一条
            this.onBtnQueryClick()
          })
          .catch(() => {
            this.dialogType = null
            this.companyVO = null
            this.$message.error('网络异常')
          })
      }
      // else if (this.dialogType === 'COPY') {
      //   const currentModuleDTO = this.moduleVO
      //   addModule(currentModuleDTO).then(response => {
      //     // 显示保存成功并且返回
      //     if (response) {
      //       this.onBtnQueryClick()
      //       this.$message.success('操作成功')
      //     } else {
      //       this.$message.success('操作失败')
      //     }
      //   }).catch(() => {
      //     this.dialogType = null
      //     this.moduleVO = null
      //     this.$message.error('网络异常')
      //   })
      // }
    },
    /**
     * @description: 对话框区域的点击操作,在这里添加你取消的逻辑
     * @param {*}
     * @return {*}
     */
    onBtnCancelClick() {
      /**
       * 关闭form表单弹出，因为点击添加编辑复制，点击弹窗取消
       * this.dialogVisible是true，页面加载就会弹窗，所以需要关闭
       */
      this.dialogVisible = false
    },
    /**
     * @description: 点击行操作区域的修改按钮弹出窗口并且设置类型
     * @param {*} index
     * @param {*} row
     * @return {*}
     */
    onBtnEditClick(index, row) {
      this.customerVO = row
      const currentmoduleVO = row
      if (currentmoduleVO == null) {
        this.$message.info('没有对应记录可以编辑')
        return
      }
      queryModuleById(currentmoduleVO.id)
        .then((response) => {
          if (response != null) {
            this.moduleVO = response
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
     * 点击行操作区域删除当前的记录
     * @param index
     * @param row
     */
    onBtnDeleteClick(index, row) {
      this.$confirm('确定删除记录吗').then((result) => {
        // 获取多条ID 调用服务端
        removeModule(row.id, row.version)
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
     * 点击顶部区域删除键进行批量删除操作
     */
    onBtnBatchDelete() {
      const moduleVOS = this.$refs.multipleTable.selection
      if (moduleVOS == null || moduleVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }
      const deleteModuleDTOS = new Array(moduleVOS.length)
      for (let i = 0; i < moduleVOS.length; i++) {
        deleteModuleDTOS[i] = {
          id: moduleVOS[i].id,
          version: moduleVOS[i].version,
        }
      }
      this.$confirm('确定删除记录吗').then((result) => {
        removeBatchModule(deleteModuleDTOS)
          .then((response) => {
            if (response) {
              if (
                this.commonPage.pages === this.commonPage.currentPage &&
                deleteModuleDTOS.length === this.modules.length
              ) {
                this.commonPage.currentPage -= 1
              }
              this.queryModule()
              this.$message.success('删除数据成功')
            }
          })
          .catch(() => {
            this.$message.error('网络错误')
          })
      })
    },
    /**
     * 更改页面显示数量
     * @param val
     */
    handleSizeChange(val) {
      this.queryModule(val, 1)
      this.currentPage = 1
    },
  },
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
