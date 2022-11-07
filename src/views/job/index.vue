<!--
 * @Author: abel.zhan
 * @Date: 2020-11-08 17:45:25
 * @LastEditTime: 2022-03-28 23:09:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \sd365-tms-omp-front-end\src\views\basedata\customer\index.vue
-->

<template>
  <el-container>
    <el-header>
      <!--引入查询面板组件该组件封装基本的查询控制逻辑-->
      <sd-QueryPanel
        class="queryClass"
        :query-model="jobQuery"
        @QueryButtonClick="onBtnQueryClick"
      >
        <!--这里在组件是slot 由用户自定义查询条件-->
        <el-form-item label="任务名称">
          <el-input
            v-model="jobQuery.jobName"
            style="
            width: 200px"
            @input="inputPY(jobVO.jobName)"
          />
        </el-form-item>
        <el-form-item label="任务分组">
          <el-input
            v-model="jobQuery.jobGroup"
            style="
            width: 200px"
            @input="inputPY(jobVO.jobGroup)"
          />
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
          @click="onBtnBatchPauseJob"
        >停止定时器</el-button>
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
        :data="jobs"
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
          prop="jobName"
          label="任务名称"
          width="130"
        />
        <el-table-column
          v-if="tableColumns[1].show"
          sortable
          align="center"
          prop="jobGroup"
          label="任务分组"
          width="150"
        />
        <el-table-column
          v-if="tableColumns[2].show"
          sortable
          align="center"
          prop="description"
          label="任务描述"
          width="150"
        />
        <el-table-column
          v-if="tableColumns[3].show"
          sortable
          align="center"
          prop="targetPath"
          label="调用目标字符串"
          width="95"
        />
        <el-table-column
          v-if="tableColumns[4].show"
          sortable
          align="center"
          prop="cron"
          label="周期表达式"
          width="95"
        />
        <el-table-column
          v-if="tableColumns[5].show"
          sortable
          align="center"
          prop="lastRunTime"
          label="上次运行时间"
          width="200"
        />
        <el-table-column
          v-if="tableColumns[6].show"
          align="center"
          prop="nextRunTime"
          label="下次运行时间"
          width="200"
        />
        <el-table-column prop="status"   label="当前状态" width="100px" show-overflow-tooltip align="center">
                <template scope="scope">                    
                    <p v-if="scope.row.status=='1'">RUN</p>
                    <p v-if="scope.row.status=='0'">STOP</p>               
                </template>
            </el-table-column>
        <!-- <el-table-column align="center" prop="email" label="邮箱" width="95" /> -->
        <!-- <el-table-column align="center" prop="organizationDTO.name" label="机构" width="95" />
        <el-table-column sortable align="center" prop="companyDTO.name" label="公司" width="95" />
        <el-table-column align="center" prop="modifier" label="更新人" width="95" />
        <el-table-column align="center" prop="updatedTime" label="更新时间" width="95" />
        <el-table-column align="center" prop="status" label="状态" width="95" :formatter="statusFormat" /> -->
        <!--操作区-->
        <el-table-column
          align="center"
          prop="operation"
          label="操作"
          width="400"
        >
          <template slot-scope="scope">
            <div>
              <el-button
                id="btnResume"
                icon="icon-label-edit"
                size="mini"
                type="primary"
                @click="onBtnResumeClick(scope.$index, scope.row)"
              >启动</el-button>
              <el-button
                id="btnRunOnce"
                size="mini"
                icon="icon-label-delete"
                @click="onBtnRunOnceClick(scope.$index, scope.row)"
              >runOnce</el-button>
              <el-button
                id="btnEdit"
                size="mini"
                icon="icon-label-edit"
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
        width="80%"
        :model="jobDTO"
        :rules="rules"
        @OkButtonClick="onBtnSaveClick"
        @CancelButtonClick="onBtnCancelClick"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务名称" label-width="80px" prop="jobDTO.jobName">
              <el-col :span="22">
                <el-input
                  v-model="jobDTO.jobName"
                  @input="inputPY(jobDTO.jobName)"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组" prop="jobDTO.jobGroup">
              <el-col :span="6">              
                <el-select v-model="jobDTO.jobGroup" placeholder="">
                  <el-option label="默认" value="默认"></el-option>
                  <el-option label="系统" value="系统"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <el-form-item label="任务描述" prop="jobDTO.description">
              <el-col :span="22">
                <el-input
                  v-model="jobDTO.description"
                />
              </el-col>
            </el-form-item>
        </el-row>
        <el-row>
            <el-form-item label="调用目标字符串" prop="jobDTO.targetPath">
              <el-col :span="22">
                <el-input v-model="jobDTO.targetPath" placeholder="" />
              </el-col>
            </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="周期表达式" prop="jobDTO.cron">
              <el-col :span="22">
                <el-input v-model="jobDTO.cron" placeholder="" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划错误策略" prop="jobDTO.errorTactics">
              <el-col :span="22">
                <el-radio v-model="jobDTO.errorTactics" label="1">错过计划等待本次计划完成后立即执行一次</el-radio>
                <el-radio v-model="jobDTO.errorTactics" label="0">本次执行时间根据上次结束时间重新计算</el-radio>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否并发执行" prop="jobDTO.concurrentState">
              <el-col :span="22">
                <el-radio v-model="jobDTO.concurrentState" label="1">是</el-radio>
                <el-radio v-model="jobDTO.concurrentState" label="0">否</el-radio>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="其他信息">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="jobDTO.otherInfo"/>
          </el-form-item>
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
  addJob,
  removeJob,
  modifyJob,
  commonQuery,
  pauseJob,
  resume,
  runOnce
} from '@/api/job/job'
import { queryDictionaryByTypeId } from '@/api/basedata/dictionary'
// eslint-disable-next-line no-unused-vars
import { QueryPanel, FormDialog } from '../../components/SD365UI'

import vPinyin from '../../utils/vue-py'
import { stringifyObjArr, parseObjArr, stringifyArr, parseArr } from '../../utils/hideTableColumn'
import { readFileSync } from 'fs'

export default {
  data() {
    // init all model
    return {
      // eslint-disable-next-line no-undef
      queryLoading: false, // 查询进度条控制
      // eslint-disable-next-line no-undef
      updateLoading: false, // 修改进度条控制
      // eslint-disable-next-line no-undef
      multipleSelection: [],
      dialogVisible: false,
      /**
       * 查询区模型
       */
      jobQuery: {
        jobName:'',
        jobGroup:''
      }, // 查询对象
      /**
       * 展示区模型
       */
      jobs: [], // 从vo取得的job信息
      // eslint-disable-next-line no-new-object
      jobVO: {}, // 显示查询回来的对象
      commonPage: { total: 10, pageCount: 1, pageSize: 10 }, // 分页数据对象
      currentPage: 1,
      /**
       * 对话框 模型
       */
      dialogCaption: 'job信息',
      // eslint-disable-next-line no-undef
      dialogType: 'EDIT', // 标记对话框处于那种状态 或者 ADD
      // eslint-disable-next-line no-undef
      // organizations: [], // for 机构
      // companies: [], // for 公司
      settleTypeVOS: [], // for 结算类型
      selectValue: '', // 显示用户的选择 以及后台的返回的默认值
      jobDTO: {
        jobName:'',
        jobGroup:'',
        description:'',
        targetPath:'',
        cron:'',
        errorTactics:'',
        concurrentState:'',
        otherInfo:''
      }, // 增加和修改对象
      rules: {
        // 定义当前页面的非空规则这点参考表结构的字段comment规则要求
        jobName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        jobGroup: [{ required: true, message: '请输入任务分组', trigger: 'blur' }],
        description: [{ required: true, message: '请输入任务描述', trigger: 'blur' }],
        targetPath: [{ required: true, message: '请输入调用目标字符串', trigger: 'blur' }],
        cron: [{ required: true, message: '请输入周期表达式', trigger: 'blur' }],
        errorTactics: [{ required: false, message: '请输入错误策略', trigger: 'blur' }],
        concurrentState: [{ required: true, message: '请输入是否并发执行', trigger: 'blur' }],
        otherInfo: [{ required: true, message: '请输入其他信息', trigger: 'blur' }],
      },
      hideDialogColumnVisible: false,
      hideTableWidth: '30%',
      tableColumns: [
        { prop: 'jobName', label: '任务名称', show: true },
        { prop: 'jobGroup', label: '任务分组', show: true },
        { prop: 'description', label: '任务描述', show: true },
        { prop: 'targetPath', label: '调用目标字符串', show: true },
        { prop: 'cron', label: '周期表达式', show: true },
        { prop: 'lastRunTime', label: '上次运行时间', show: true },
        { prop: 'nextRunTime', label: '下次运行时间', show: true },
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
      this.customerVO.mnemonicCode = vPinyin
        .getPinYinFirstCharacter(v, '', true)
        .replace(/\s+/g, '')
    },
    inputAssistantCode(e) {
      this.$forceUpdate()
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
      commonQuery(row.id).then((response) => {
        // 取得CommonResponse的Body
        if (response) {
          // eslint-disable-next-line no-undef
          this.jobVO = response
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
     * 业务方法区  按查询区  操作区  展示区  分别组织代码
     */

    onBtnQueryClick() {
      this.queryJob(this.commonPage.pageSize, 1)
      this.currentPage = 1
    },

    /**
     * 换页
     */
    handleCurrentChange(val) {
      this.queryJob(this.commonPage.pageSize, val)
    },

    /**
     * 更改页面显示数量大小
     */
    handleSizeChange(val) {
      // this.$message.error()
      this.queryJob(val, 1)
      this.currentPage = 1 // 调整默认显示页面
    },
    /**
     * @description: 查询 job 操作
     * @param {*}
     * @return {*}
     */
    queryJob(size, num) {
      // console.log('before ')
      //
      this.queryLoading = true
      this.jobQuery.pageSize = size
      this.jobQuery.pageNum = num
      commonQuery(this.jobQuery)
        .then((response) => {
          // eslint-disable-next-line no-unused-vars
          const { total, pageNum, pageSize } = response // 如果异常则被axios 的拦截器拦截并且显示错误码和消息

          this.commonPage.total = parseInt(total)
          this.commonPage.pageCount = parseInt(pageNum)
          this.commonPage.pageSize = size
          this.jobs = response.data // 分页信息带回显示
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
     * @param {*}
     * @return {*}
     */
    onBtnAddClick() {
      // get header from token  load organizations and companies
      try {
        this.jobDTO = {} // 初始化
        // this.loadSettleType('')
        this.dialogType = 'ADD'
        this.dialogVisible = true
      } catch (error) {
        this.$message.error('网络异常')
      }
    },
    
    /**
     * @description: 点击 action bar 区域进行停用控制操作
     * @param {*} status
     * @return {*}
     */
      onBtnBatchPauseJob(){
        const jobVOS = this.$refs.multipleTable.selection
        if(jobVOS == null||jobVOS.length === 0){
          this.$message.error('至少选择一条进行操作')
          return
        }
        const pauseJobs = new Array(jobVOS.length)
        for(let i = 0;i<jobVOS.length;i++){
          pauseJobs[i]=({
            id: jobVOS[i].id,
            version: jobVOS[i].version,
            jobName: jobVOS[i].jobName
          })
          pauseJob(pauseJobs[i])
          .then((response) => {
          if (response) {
            this.$message.success('操作成功')
            // 刷新数据
            this.onBtnQueryClick()
          } else {
            this.$message.error('操作失败')
          }
          })
          .catch(() => {
            this.$message.error('网络错误')
          })
        }
    },

    /**
     * ************************
     *  以下开始行内的按钮操作
     */

    /**
     * @description: 点击行的操作区域删除当前行的记录
     * @param {*}
     * @return {*}
     */
    onBtnDeleteClick(index, row) {
      this.$confirm('确定删除记录吗').then((result) => {
        removeJob(row.id, row.version,row.jobName)
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
      // get header from token  load organizations and companies
      const currentJobVO = this.jobs[index]
      // alert(currentjobVO.id)
      if (currentJobVO == null) {
        this.$message.info('没有对应记录可以编辑')
        return
      }
      console.log(currentJobVO)
      this.dialogType = 'EDIT'
      // eslint-disable-next-line no-undef
      this.dialogVisible = true
    },
    /**
     * @description: 点击启动按钮，启动定时任务
     * @param {*} index 
     * @param {*} row 
     */
    onBtnResumeClick(index,row){
      this.$confirm('确定启动吗').then((result) => {
        // 获取多条ID 调用服务端
        console.log(row)
        resume(row)
          .then((response) => {
            if (response) {
              this.$message.success('启动成功')
              this.handleCurrentChange(this.currentPage)
            } else {
              this.$message.error('启动失败')
              this.handleCurrentChange(this.currentPage)
            }
          })
          .catch(() => {
            this.$message.error('操作失败')
            this.handleCurrentChange(this.currentPage)
          })
      })
    },
    /**
     * @description: 点击runOnce，立即执行一次任务
     * @param {*} index 
     * @param {*} row 
     */
    onBtnRunOnceClick(index,row){
      this.$confirm('确定立即运行一次吗').then((result) => {
        runOnce(row)
          .then((response) => {
            if (response) {
              this.$message.success('运行成功')
              this.handleCurrentChange(this.currentPage)
            } else {
              this.$message.error('运行失败')
              this.handleCurrentChange(this.currentPage)
            }
          })
          .catch(() => {
            this.$message.error('操作失败')
            this.handleCurrentChange(this.currentPage)
          })
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
        const currentJobDTO = this.jobDTO
        console.log(currentJobDTO)
        addJob(currentJobDTO)
          .then((response) => {
            // 显示保存成功并且返回
            this.$message.success('操作成功')
            this.onBtnQueryClick()
            // this.resetUIToInitStatus()
            this.dialogVisible = false
          })
          .catch(() => {
            this.dialogType = null
            this.jobDto = null
            this.$message.error('网络异常')
          })
      } else if (this.dialogType === 'EDIT') {
        this.jobDTO = this.jobDTO
        modifyJob(this.jobDTO)
          .then((response) => {
            // 显示保存成功并且返回
            this.$message.success('操作成功')

            this.dialogVisible = false
            // 查询刷新当前增加数据为第一条
            this.onBtnQueryClick()
          })
          .catch(() => {
            this.dialogType = null
            this.jobDTO = null
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
