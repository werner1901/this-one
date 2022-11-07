<template>
  <el-container>
    <el-header>
      <!--引入查询面板组件该组件封装基本的查询控制逻辑-->
      <sd-QueryPanel
        :query-model="messageQuery"
        @QueryButtonClick="onBtnQueryClick"
      >
        <!--这里在组件是slot 由用户自定义查询条件-->
        <el-form-item label="消息类型">
          <el-input v-model="messageQuery.messageType" style="width: 200px" />
        </el-form-item>
        <el-form-item label="消息内容">
          <el-input
            v-model="messageQuery.messageContent"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="推送渠道">
          <el-input v-model="messageQuery.pushPath" style="width: 200px" />
        </el-form-item>
      </sd-QueryPanel>
      <el-row>
        <el-button type="primary" icon="el-icon-plus" @click="onBtnAddClick"
          >增加</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-copy-document"
          @click="onBtnCopyClick"
          >复制</el-button
        >
        <el-button type="danger" icon="el-icon-delete" @click="onBtnBatchDelete"
          >删除</el-button
        >
        <el-button type="primary" icon="el-icon-share" @click="onBtnBatchPush"
          >推送</el-button
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
      <!--  数据展示区域    -->
      <el-table
        ref="multipleTable"
        v-loading="queryLoading"
        :data="messages"
        element-loading-text="Loading"
        fit
        highlight-current-row
        border
        style="margin-top: 50px"
        :height="tableHeight"
        @selection-change="handleSelectionChange"
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
          prop="messageType"
          label="消息类型"
        />
        <el-table-column
          v-if="tableColumns[1].show"
          sortable
          align="center"
          prop="messageContent"
          label="消息内容"
        />
        <el-table-column
          v-if="tableColumns[2].show"
          sortable
          align="center"
          prop="pushTime"
          label="推送间隔"
        />
        <el-table-column
          v-if="tableColumns[3].show"
          sortable
          align="center"
          prop="pushPath"
          label="推送渠道"
        />
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
        <!--行操作区-->
        <el-table-column
          v-if="!exportStatus"
          align="center"
          prop="operation"
          label="操作"
          width="380"
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
                id="btnPush"
                icon="icon-label-edit"
                size="mini"
                @click="onBtnPushClick(scope.$index, scope.row)"
                >推送</el-button
              >
              <el-button
                id="btnPushRecords"
                icon="icon-label-edit"
                size="mini"
                @click="onBtnPushRecordsClick(scope.$index, scope.row)"
                >查看推送记录</el-button
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
      <!--分页-->
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
      <sd-FormDialog
        :caption="dialogCaption"
        :visible="dialogVisible"
        width="50%"
        :model="messageVO"
        :rules="rules"
        @OkButtonClick="onBtnSaveClick"
        @CancelButtonClick="onBtnCancelClick"
      >
        <el-row>
          <el-form-item label="消息类型" prop="messageType">
            <el-select
              v-model="messageVO.messageType"
              placeholder=""
              value-key="messageType"
            >
              <el-option
                v-for="messageType in msgTypeOptions"
                :key="messageType"
                :value="messageType"
                :label="messageType"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="消息内容" prop="messageContent">
            <el-input v-model="messageVO.messageContent" placeholder="" />
          </el-form-item>
          <el-form-item label="推送间隔" prop="pushTime">
            <el-input v-model="messageVO.pushTime" placeholder="" />
          </el-form-item>
          <el-form-item label="推送渠道" prop="pushPath">
            <el-select
              v-model="messageVO.pushPath"
              placeholder=""
              value-key="pushPath"
            >
              <el-option
                v-for="pushPath in pushPathOptions"
                :key="pushPath"
                :value="pushPath"
                :label="pushPath"
              />
            </el-select>
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
import messageApi from '@/api/org/message'

export default {
  data() {
    return {
      // eslint-disable-next-line no-undef
      queryLoading: false, // 查询进度条控制
      // eslint-disable-next-line no-undef
      updateLoading: false, // 修改进度条控制
      copyLoading: false,
      multipleSelection: [],
      dialogVisible: false,
      /**
       * 导出状态false时表格有操作列，true时表格没有操作列
       */
      exportStatus: false,
      /**
       * 查询区模型
       */
      messageQuery: {
        messageType: '',
        messageContent: '',
        pushTime: '',
        pushPath: '',
      },
      /**
       * 展示区模型
       */
      messages: [], // 从vo取得的 消息信息
      messageVO: {}, // 显示查询回来的对象
      msgTypeOptions: ['自动消息', '手动消息'],
      pushPathOptions: ['系统', '短信', '邮件'],
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
      dialogCaption: '消息内容',
      dialogType: 'EDIT', // 标记对话框处于那种状态 或者 ADD
      settleTypeVOS: [], // for 结算类型
      selectValue: '', // 显示用户的选择 以及后台的返回的默认值
      messageDTO: {}, // 增加和修改对象
      rules: {
        // 定义当前页面的非空规则这点参考表结构的字段comment规则要求
        messageType: [
          { required: true, message: '请输入消息类型', trigger: 'blur' },
        ],
        messageContent: [
          { required: true, message: '请输入消息内容', trigger: 'blur' },
        ],
        pushTime: [
          { required: true, message: '请输入推送间隔分钟数', trigger: 'blur' },
        ],
        pushPath: [
          { required: true, message: '请输入推送渠道', trigger: 'blur' },
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
        { prop: 'messageType', label: '消息类型', show: true },
        { prop: 'messageContent', label: '消息内容', show: true },
        { prop: 'pushTime', label: '推送间隔', show: true },
        { prop: 'pushPath', label: '推送渠道', show: true },
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
      // this.parseTableColumnData()
    },
    handleCurrentChange(val) {
      this.queryMessage(this.commonPage.pageSize, val)
    },
    statusFormat(row, column) {
      if (row.status === 1) {
        return '启用'
      } else {
        return '停用'
      }
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
     * 更改页面显示数量大小
     */
    handleSizeChange(val) {
      // this.$message.error()
      this.queryMessage(val, 1)
      this.currentPage = 1 // 调整默认显示页面
    },
    /**
     * 业务方法区  按查询区  操作区  展示区  分别组织代码
     */
    onBtnQueryClick() {
      this.queryMessage()
      this.commonPage.currentPage = 1
    },
    queryMessage() {
      this.queryLoading = true
      this.messageQuery.pageSize = this.commonPage.pageSize
      this.messageQuery.pageNum = this.commonPage.currentPage
      messageApi
        .commonQuery(this.messageQuery)
        .then((response) => {
          this.commonPage.total = parseInt(response.total)
          this.commonPage.pages = parseInt(response.pages)
          this.messages = response.data // 分页信息带回显示
          this.queryLoading = false // 关闭查询d
        })
        .catch(() => {
          this.queryLoading = false // 关闭查询
          this.$message.error('网络异常')
        })
    },
    onBtnSaveClick() {
      if (this.dialogType === 'ADD') {
        console.log(this.messageVO)
        messageApi
          .add(this.messageVO)
          .then((response) => {
            console.log(this.messageVO)
            if (response) {
              // 显示保存成功并且返回
              this.$message.success('操作成功')
              // this.resetUIToInitStatus()
              this.dialogVisible = false
              this.messageVO = {}
              this.onBtnQueryClick()
            } else {
              this.$message.error('添加失败')
            }
          })
          .catch(() => {
            // debugger
            this.dialogType = null
            this.messageVO = null
            this.$message.error('网络异常')
          })
      } else if (this.dialogType === 'EDIT') {
        this.messageDTO = JSON.parse(JSON.stringify(this.messageVO))
        // debugger
        this.messageDTO.modifier = this.$store.getters.name
        messageApi
          .update(this.messageDTO)
          .then((response) => {
            // 显示保存成功并且返回
            this.$message.success('操作成功')
            this.dialogVisible = false
            // 查询刷新当前增加数据为第一条
            this.onBtnQueryClick()
          })
          .catch(() => {
            this.dialogType = null
            this.messageVO = null
            this.$message.error('网络异常')
          })
      } else if (this.dialogType === 'COPY') {
        const currentMessageDTO = JSON.parse(JSON.stringify(this.messageVO))
        console.log(currentMessageDTO)
        messageApi
          .add(currentMessageDTO)
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
            this.messageVO = null
            this.$message.error('网络异常')
          })
      }
    },
    onBtnAddClick() {
      // get header from token  load organizations and companies
      try {
        this.messageVO = {} // 初始化
        // this.loadSettleType('')
        this.dialogVisible = true
        this.dialogType = 'ADD'
      } catch (error) {
        this.$message.error('网络异常')
      }
    },
    onBtnCopyClick() {
      // 如果不是选择一条则提示消息并且返回
      const rows = this.$refs.multipleTable.selection
      if (rows == null || rows.length == 0) {
        this.$message.error('选择一条进行复制')
      } else if (rows != null && rows.length > 1) {
        this.$message.error('只能选择一条进行复制')
      } else {
        this.showMessage(rows[0])
      }
    },
    showMessage(message) {
      this.copyLoading = true
      console.log(message)
      messageApi
        .commonQuery({ id: message.id })
        .then((response) => {
          this.messageVO = response.data[0]
          this.dialogType = 'COPY'
          this.dialogVisible = true
          this.copyLoading = false
          // 如果修改对话框将更新数据到数据库
        })
        .catch(() => {
          this.$message.error('网络异常')
        })
    },
    onBtnBatchDelete() {
      const messageVOS = this.$refs.multipleTable.selection
      if (messageVOS == null || messageVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }
      const deleteMessageDTOS = new Array(messageVOS.length)
      for (let i = 0; i < messageVOS.length; i++) {
        deleteMessageDTOS[i] = {
          id: messageVOS[i].id,
          version: messageVOS[i].version,
        }
      }

      this.$confirm('确定删除记录吗')
        .then((response) => {
          if (response) {
            if (response === 'confirm') {
              messageApi.batchRemoveMessage(deleteMessageDTOS).then((res) => {
                if (res) {
                  this.$message.success('删除数据成功')
                  this.onBtnQueryClick()
                } else {
                  this.$message.success('删除数据失败')
                }
              })
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
    onBtnBatchPush() {},
    onDisableRecordClick(status) {
      const messageVOS = this.$refs.multipleTable.selection
      if (messageVOS == null || messageVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }

      const messageDTOS = new Array(messageVOS.length)
      for (let i = 0; i < messageVOS.length; i++) {
        messageDTOS[i] = { id: messageVOS[i].id, status: status }
      }
      // eslint-disable-next-line no-array-constructor
      messageApi.batchUpdate(messageDTOS)
        .then((response) => {
          if (response) {
            this.$message.success('操作成功')
            this.onBtnQueryClick()
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
          this.onDisableRecordClick(1)
          break
        }
        case 'disable_command': {
          this.onDisableRecordClick(0)
          break
        }
      }
    },
    onBtnEditClick(index, row) {
      messageApi.commonQuery({id: row.id})
        .then((response) => {
          // 取得CommonResponse的Body

          if (response != null) {
            // eslint-disable-next-line no-undef

            this.messageVO = response.data[0];
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
    onBtnPushClick(index, row) {},
    onBtnPushRecordsClick(index, row) {},
    onBtnDeleteClick(index, row) {
      this.$confirm('确定删除记录吗').then((result) => {
        // 获取多条ID 调用服务端
        messageApi.remove(row.id, row.version)
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
