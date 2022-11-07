<template>
  <el-container>
    <el-header>
      <sd-QueryPanel
        class="queryClass"
        label-width="75px"
        :query-model="sysUpgradeLogQuery"
        @QueryButtonClick="onBtnQueryClick"
      >
        <el-form-item label="子系统">
          <el-select
            v-model="sysUpgradeLogQuery.subSystemId"
            style="width: 200px"
            placeholder="请选择子系统"
            clearable
          >
            <el-option
              v-for="(item, index) in subSystemVOS"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日志标题">
          <el-input
            v-model="sysUpgradeLogQuery.title"
            placeholder="请输入日志标题模糊查询"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="升级时间">
          <el-date-picker
            v-model="upgradeDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            unlink-panels
            @change="setQueryDateRange"
          />
        </el-form-item>
      </sd-QueryPanel>
    </el-header>
    <el-container>
      <el-main>
        <div style="margin-bottom: 20px">
          <el-row>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="onBtnAddClick"
            >新增</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="onBtnBatchDelete"
            >删除</el-button>
          </el-row>
        </div>
        <!--data show area  -->
        <el-table
          ref="multipleTable"
          v-loading="queryLoading"
          :data="sysUpgradeLogVOS"
          element-loading-text="Loading"
          fit
          highlight-current-row
          border
          width="100%"
          @selection-change="handleSelectionChange"
          @row-dblclick="handleRowDoubleClick"
        >
          <el-table-column align="center" width="40" type="selection" />
          <el-table-column align="center" label="序号" width="80">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="title"
            label="日志标题"
            width="150"
          />
          <el-table-column
            align="center"
            prop="oldVersion"
            label="前版本号"
            width="130"
          />
          <el-table-column
            align="center"
            prop="newVersion"
            label="新版本号"
            width="130"
          />
          <el-table-column
            align="center"
            prop="subSystemVO.name"
            label="子系统名称"
            width="130"
          />
          <el-table-column
            align="center"
            prop="tenantVO.name"
            label="所属租户"
            width="130"
          />
          <el-table-column
            align="center"
            prop="upgradeTime"
            label="升级时间"
            width="130"
          />
          <el-table-column
            align="center"
            prop="upgradeOperator"
            label="升级操作人员"
            width="130"
          />
          <el-table-column
            align="center"
            prop="upgradeRemark"
            label="更新备注"
            width="130"
          />
          <el-table-column
            align="center"
            prop="operation"
            label="操作"
            width="150"
          >
            <template slot-scope="scope">
              <div>
                <el-button
                  id="btnRead"
                  icon="icon-label-edit"
                  size="mini"
                  @click="onBtnReadClick(scope.$index, scope.row)"
                >查看</el-button>
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
        <el-pagination
          background
          :total="commonPage.total"
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="commonPage.pageSize"
          :current-page.sync="currentPage"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
        <!--添加日志对话框-->
        <el-dialog
          v-dialog-drag
          class="addDialog"
          title="添加升级日志"
          :visible.sync="addDialogVisible"
          width="50%"
          :before-close="onBtnCancelClick"
          :lock-scroll="false"
          :modal="true"
          :close-on-click-modal="false"
          append-to-body
          @close="onBtnCancelClick"
        >
          <el-form
            ref="addFrom"
            :model="addSysUpgradeLogDTO"
            label-position="left"
            :rules="rules"
            label-width="120px"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="子系统" prop="subSystemId">
                  <el-select
                    v-model="addSysUpgradeLogDTO.subSystemId"
                    placeholder="请选择子系统"
                    style="width: 92%"
                  >
                    <el-option
                      v-for="(item, index) in subSystemVOS"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="日志标题" prop="title">
                  <el-input
                    v-model="addSysUpgradeLogDTO.title"
                    placeholder="请输入日志标题"
                    style="width: 92%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="前版本号" prop="oldVersion">
                  <el-input
                    v-model="addSysUpgradeLogDTO.oldVersion"
                    placeholder="请输入前版本号"
                    style="width: 92%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="现版本号" prop="newVersion">
                  <el-input
                    v-model="addSysUpgradeLogDTO.newVersion"
                    placeholder="请输入现版本号"
                    style="width: 92%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="更新备注" prop="upgradeRemark">
                  <el-input
                    v-model="addSysUpgradeLogDTO.upgradeRemark"
                    placeholder="请输入更新备注"
                    style="width: 92%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="操作人员" prop="upgradeOperator">
                  <el-input
                    v-model="addSysUpgradeLogDTO.upgradeOperator"
                    placeholder="请输入操作人员"
                    style="width: 92%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="日志内容" prop="content">
                <el-input
                  v-model="addSysUpgradeLogDTO.content"
                  type="textarea"
                  placeholder="请输入日志内容"
                  maxlength="450"
                  show-word-limit
                />
              </el-form-item>
            </el-row>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button id="btnCancel" @click="onBtnCancelClick">取 消</el-button>
            <el-button
              id="btnOK"
              type="primary"
              @click="onBtnSaveClick('addFrom')"
            >确 定</el-button>
          </span>
        </el-dialog>
        <el-drawer
          title="升级日志"
          :visible.sync="readDialogVisible"
          direction="rtl"
          :before-close="onBtnOKClick"
          size="40%"
        >
          <el-image
            style="width: 100%"
            :src="imgUrl"
            fit="scale-down"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
          <div>
            <el-row type="flex" style="padding: 20px" class="contentBox">
              <el-col :span="4">
                日志标题：
              </el-col>
              <el-col :span="8">
                {{ readSysUpgradeLogVO.title }}
              </el-col>
              <el-col :span="4">
                更新时间：
              </el-col>
              <el-col :span="8">
                <el-tag type="info">{{ readSysUpgradeLogVO.upgradeTime }}</el-tag>
              </el-col>
            </el-row>
            <el-row type="flex" style="padding: 20px">
              <el-col :span="4">
                现版本：
              </el-col>
              <el-col :span="8">
                <el-tag>{{ readSysUpgradeLogVO.newVersion }}</el-tag>
              </el-col>
              <el-col :span="4">
                前版本：
              </el-col>
              <el-col :span="8">
                <el-tag type="info">{{ readSysUpgradeLogVO.oldVersion }}</el-tag>
              </el-col>
            </el-row>
            <el-row type="flex" style="padding: 20px">
              <el-col :span="20" :offset="2">
                <span>
                  {{ readSysUpgradeLogVO.content }}
                </span>
              </el-col>
            </el-row>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              @click="onBtnOKClick()"
            >我了解了</el-button>
          </span>
        </el-drawer>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {
  commonSystemUpgradeLogQuery,
  systemUpgradeLogQueryById,
  latestSystemUpgradeLog,
  addSystemUpgradeLog,
  deleteSystemUpgradeLog,
  deleteBatchSystemUpgradeLog
} from '@/api/right/systemUpgradeLog'
import { commonQuery } from '@/api/right/subSystem'
import jpg from '@/assets/system-upgrade-log-images/sys-upd-log-banner.jpg'
export default {
  data() {
    return {
      queryLoading: false, // 查询进度条控制
      updateLoading: false, // 修改进度条控制
      readLoading: false, // 拷贝x)阅读一条数据的进度控制
      multipleSelection: [],
      addDialogVisible: false,
      readDialogVisible: false,
      imgUrl: jpg,
      /**
       * 查询区模型
       */
      subSystemVOS: [],
      upgradeDateRange: [],
      sysUpgradeLogQuery: {
        tenantId: '1337940702788714496',
        subSystemId: '',
        title: '',
        fromUpgradeTime: '',
        toUpgradeTime: ''
      },
      /**
       * 展示区模型
       */
      sysUpgradeLogVOS: [],

      commonPage: { total: 10, pageCount: 1, pageSize: 10 }, // 分页数据对象
      currentPage: 1,
      /**
       * 对话框模型
       */
      addSysUpgradeLogDTO: {
        subSystemId: '',
        title: '',
        oldVersion: '',
        newVersion: '',
        upgradeRemark: '',
        upgradeOperator: '',
        content: '',
        tenantId: '1337940702788714496'
      },
      readSysUpgradeLogVO: {
        subSystemId: '',
        title: '',
        oldVersion: '',
        newVersion: '',
        upgradeTime: '',
        upgradeRemark: '',
        upgradeOperator: '',
        content: '',
        tenantId: ''
      },
      rules: {
        subSystemId: [{ required: true, message: '请选择子系统', trigger: 'blur' }],
        title: [{ required: true, message: '请输入日志标题', trigger: 'blur' }],
        oldVersion: [{ required: true, message: '请输入前版本', trigger: 'blur' }],
        newVersion: [{ required: true, message: '请输入先版本', trigger: 'blur' }],
        upgradeRemark: [{ required: true, message: '请输入更新备注', trigger: 'blur' }],
        upgradeOperator: [{ required: true, message: '请输入操作人员', trigger: 'blur' }],
        content: [{ required: true, message: '请输入日志内容', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.initData()
    this.onBtnQueryClick()
  },
  methods: {
    // 数据加载
    initData() {
      this.getSubSystemResource()
    },
    getSubSystemResource() {
      this.subSystemVOS = []
      commonQuery(this.sysUpgradeLogQuery.tenantId)
        .then((response) => {
          response.data.map((item) => {
            this.subSystemVOS.push({
              id: item.id,
              name: item.name
            })
          })
        })
        .catch(() => {
          this.$message.error('网络错误，子系统信息获取失败')
        })
    },
    // 界面逻辑
    setQueryDateRange(value) {
      console.log(value)
      if (value == null) {
        this.sysUpgradeLogQuery.fromUpgradeTime = ''
        this.sysUpgradeLogQuery.toUpgradeTime = ''
      } else {
        this.sysUpgradeLogQuery.fromUpgradeTime = value[0]
        this.sysUpgradeLogQuery.toUpgradeTime = value[1]
      }
    },
    onBtnQueryClick() {
      this.querySystemUpgradeLog(this.commonPage.pageSize, 1)
      this.currentPage = 1
    },
    handleCurrentChange(val) {
      this.querySystemUpgradeLog(this.commonPage.pageSize, val)
    },
    handleSizeChange(val) {
      this.querySystemUpgradeLog(val, 1)
      this.currentPage = 1
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onBtnAddClick() {
      Object.keys(this.addSysUpgradeLogDTO)
        .forEach(key => { this.addSysUpgradeLogDTO[key] = '' })
      this.addDialogVisible = true
      this.readDialogVisible = false
    },
    onBtnSaveClick() {
      console.log('onBtnSaveClick调用！')
      console.log(this.addSysUpgradeLogDTO)
      const currentAddSysUpgradeLogDTO = this.addSysUpgradeLogDTO
      console.log(currentAddSysUpgradeLogDTO)
      addSystemUpgradeLog(this.addSysUpgradeLogDTO)
        .then((response) => {
          this.$message.success('操作成功')
          Object.keys(this.addSysUpgradeLogDTO)
            .forEach(key => { this.addSysUpgradeLogDTO[key] = '' })
          this.addDialogVisible = false
          this.onBtnQueryClick()
        })
        .catch(() => {
          this.$message.error('网络异常')
        })
    },
    onBtnCancelClick() {
      Object.keys(this.addSysUpgradeLogDTO)
        .forEach(key => { this.addSysUpgradeLogDTO[key] = '' })
      this.addDialogVisible = false
    },
    // 业务逻辑
    querySystemUpgradeLog(size, num) {
      this.queryLoading = true
      this.sysUpgradeLogQuery.pageSize = size
      this.sysUpgradeLogQuery.pageNum = num
      commonSystemUpgradeLogQuery(this.sysUpgradeLogQuery)
        .then((response) => {
          const { total, pageNum, pageSize } = response
          this.commonPage.total = parseInt(total)
          this.commonPage.pageCount = parseInt(pageNum)
          this.commonPage.pageSize = size
          this.sysUpgradeLogVOS = response.data // 分页信息带回显示
          this.queryLoading = false // 关闭查询
        })
        .catch(() => {
          this.queryLoading = false
          this.$message.error('网络异常，查询失败')
        })
    },
    onBtnBatchDelete() {
      const deleteSysUpgradeLogVOS = this.$refs.multipleTable.selection
      if (deleteSysUpgradeLogVOS.length === 0 || deleteSysUpgradeLogVOS == null) {
        this.$message.error('请至少选择一条进行批量删除操作')
        return
      }
      console.log('deleteSysUpgradeLogVOS')
      console.log(deleteSysUpgradeLogVOS)
      const deleteIdVersionObjs = new Array(deleteSysUpgradeLogVOS.length)
      for (let i = 0; i < deleteSysUpgradeLogVOS.length; i++) {
        deleteIdVersionObjs[i] = {
          id: deleteSysUpgradeLogVOS[i].id,
          version: deleteSysUpgradeLogVOS[i].version
        }
      }
      console.log('deleteIdVersionObjs')
      console.log(deleteIdVersionObjs)
      this.$confirm('确定删除已选日志吗')
        .then(() => {
          deleteBatchSystemUpgradeLog(deleteIdVersionObjs)
            .then((response) => {
              console.log('批量删除response是' + response)
              if (response) {
                this.$message.success('删除日志成功')
                this.onBtnQueryClick()
              } else {
                this.$message.success('删除日志失败')
              }
            })
            .catch(() => {
              this.$message.error('网络错误')
              this.onBtnQueryClick()
            })
        })
        .catch(() => {
          this.$message.error('操作已取消')
        })
    },
    onBtnDeleteClick(index, row) {
      this.$confirm('确定删除日志吗')
        .then(() => {
          deleteSystemUpgradeLog(row.id, row.version)
            .then((response) => {
              console.log('单条删除response是' + response)
              if (response) {
                this.$message.success('删除日志成功')
                this.onBtnQueryClick()
              } else {
                this.$message.success('删除日志失败')
              }
            })
            .catch(() => {
              this.$message.error('网络错误')
              this.onBtnQueryClick()
            })
        })
        .catch(() => {
          this.$message.error('操作已取消')
        })
    },
    onBtnReadClick(index, row) {
      console.log(row.content)
      this.readSysUpgradeLogVO = row
      console.log(this.readSysUpgradeLogVO)
      this.readDialogVisible = true
    },
    // handleRowDoubleClick(index, row) {
    //   console.log(row.content)
    //   this.readSysUpgradeLogVO = row
    //   console.log(this.readSysUpgradeLogVO)
    //   this.readDialogVisible = true
    // },
    onBtnOKClick() {
      this.readDialogVisible = false
      this.readSysUpgradeLogVO = {}
      // Object.keys(this.readSysUpgradeLogVO)
      //   .forEach(key => { this.readSysUpgradeLogVO[key] = '' })
    }
  }
}
</script>

<style scoped>

</style>
