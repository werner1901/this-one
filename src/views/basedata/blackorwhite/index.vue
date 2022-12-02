<template>
  <el-container>
    <!-- 顶部查询 -->
    <el-header>
      <div style="margin-left: 20px">
        <el-row>
          <el-form
            :inline="true"
            :model="searchForm"
            @keyup.enter.native="onQuery"
          >
            <el-col :span="6">
              <el-form-item label="黑白名单账号:">
                <el-input
                  v-model="searchForm.blackOrWhiteAccount"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-form-item>
                <el-button
                  type="primary"
                  style="margin-top: 6px"
                  @click="searchFormclick"
                >查询</el-button>
              </el-form-item>
            </el-col>
          </el-form></el-row>
        <el-row>
          <el-button type="primary" @click="addview">新增</el-button>
          <el-button type="danger" @click="deleteSelect()">删除</el-button>
        </el-row>
      </div></el-header>

    <el-main style="margin-top: 60px">
      <!--  -->
      <el-table
        ref="muiltitable"
        :data="BlackorWhitelist"
        style="width: 100%; margin: 20px 0"
        border
        fix
        height="600px"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
          fixed="left"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="序号"
          width="80"
        >
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="blackOrWhiteAccount"
          header-align="center"
          align="center"
          label="黑白名单账号"
          min-width="140"
        />
        <el-table-column
          prop="blackOrWhiteName"
          header-align="center"
          align="center"
          label="黑白名单名字"
        />
        <el-table-column
          prop="note"
          header-align="center"
          align="center"
          label="备注"
          min-width="200"
        />
        <el-table-column
          prop="listSource"
          header-align="center"
          align="center"
          label="名单来源"
        />
        <el-table-column
          prop="startTime"
          header-align="center"
          align="center"
          label="开始时间"
        />
        <el-table-column
          prop="endTime"
          header-align="center"
          align="center"
          label="结束时间"
        />
        <el-table-column
          prop="type"
          header-align="center"
          align="center"
          label="类型"
          width="100"
        />
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="250"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="onRowBtnCopyClick(scope.$index, scope.row)"
            >复制</el-button>
            <el-button
              size="mini"
              @click="UpdateHandle(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="deleteHandle(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="float: left">
        <el-pagination
          :v-model="commonPage"
          :page-count="commonPage.pageCount"
          :page-size="commonPage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="commonPage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <el-dialog
        v-dialogDrag
        title="更新黑白名单信息"
        :visible.sync="updateBlackOrWhiteVisible"
        width="80%"
        :before-close="updateBlackOrWhiteClose"
      >
        <el-form :model="BlackorWhiteVO">
          <el-row>
            <el-col span="8">
              <el-form-item label="账号">
                <el-input
                  v-model="BlackorWhiteVO.blackOrWhiteAccount"
                  style="width: 90%"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col span="10">
              <el-form-item label="用户名">
                <el-input
                  v-model="BlackorWhiteVO.blackOrWhiteName"
                  style="width: 90%"
                  clearable
                  disabled="true"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="8">
              <el-form-item label="类型">
                <el-select v-model="BlackorWhiteVO.type" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="来源">
                <el-select
                  v-model="BlackorWhiteVO.listSource"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in listoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col span="8">
            <el-form-item label="备注">
              <el-input
                v-model="BlackorWhiteVO.note"
                style="width: 90%"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateBlackOrWhiteClose">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        v-dialogDrag
        width="80%"
        title="用户信息"
        :visible.sync="addBlackOrWhiteVisible"
        append-to-body
        :before-close="addBlackOrWhitehandleClose"
      >
        <el-row>
          <el-form
            :inline="true"
            :model="usersearchForm"
            @keyup.enter.native="userQuery"
          >
            <el-col :span="6">
              <el-form-item label="用户账号:">
                <el-input v-model="usersearchForm.code" style="width: 200px" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button
                  type="primary"
                  style="margin-top: 6px"
                  @click="usersearchFormclick"
                >查询</el-button>
              </el-form-item>
            </el-col>
          </el-form></el-row>
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          @click="batchAddClick"
        >批量添加</el-button>
        <el-table
          ref="dialogmuiltitable"
          v-loading="addBlackorWhiteLoading"
          :data="userlist"
          fit
          border
          highlight-current-row
          height="650"
          style="margin: 20px 0"
        >
          <el-table-column fixed align="center" width="50" type="selection" />
          <el-table-column align="center" label="序号" width="55">
            <template slot-scope="scope">
              {{ scope.$index }}
            </template>
          </el-table-column>
          <el-table-column
            sortable
            align="center"
            prop="code"
            label="工号"
            width="120"
          />
          <el-table-column
            align="center"
            prop="name"
            label="用户名"
            width="120"
          />
          <el-table-column
            align="center"
            prop="password"
            label="密码"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            align="center"
            prop="company.name"
            label="所属公司"
            width="120"
          />
          <el-table-column
            align="center"
            prop="department.name"
            label="所属部门"
            width="120"
          />
          <el-table-column
            align="center"
            prop="position.name"
            label="职位"
            width="120"
          />
          <el-table-column align="center" prop="sex" label="性别" width="120" />
          <el-table-column align="center" prop="tel" label="电话" width="120" />
          <el-table-column
            align="center"
            prop="status"
            label="状态"
            width="100"
          />
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
                  type="primary"
                  size="mini"
                  @click="addHandle(scope.row)"
                >加入黑名单</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :v-model="bwcommonPage"
          :page-count="bwcommonPage.pageCount"
          :page-size="bwcommonPage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="bwcommonPage.total"
          @size-change="bwhandleSizeChange"
          @current-change="bwhandleCurrentChange"
        />
      </el-dialog>
      <el-dialog
        v-dialogDrag
        title="插入黑白名单信息"
        :visible.sync="addBlackVisible"
        width="80%"
        :before-close="addBlackClose"
      >
        <el-form :model="BlackorWhiteVO">
          <el-row>
            <el-col span="8">
              <el-form-item label="账号">
                <el-input
                  v-model="userVO.code"
                  style="width: 90%"
                  clearable
                  disabled="true"
                />
              </el-form-item>
            </el-col>
            <el-col span="10">
              <el-form-item label="用户名">
                <el-input
                  v-model="userVO.name"
                  style="width: 90%"
                  clearable
                  disabled="true"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="8">
              <el-form-item label="类型">
                <el-select v-model="BlackorWhiteVO.type" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="来源">
                <el-select
                  v-model="BlackorWhiteVO.listSource"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in listoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-date-picker
            v-model="BlackorWhiteVO.startTime"
            type="datetime"
            placeholder="选择开始时间"
          />
          <el-date-picker
            v-model="BlackorWhiteVO.endTime"
            type="datetime"
            placeholder="选择结束时间"
          />
          <el-col span="8">
            <el-form-item label="备注">
              <el-input
                v-model="BlackorWhiteVO.note"
                style="width: 90%"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addBlackVisible = false">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        v-dialogDrag
        width="50%"
        title="批量插入黑白名单信息"
        :visible.sync="batchaddbwVisible"
        append-to-body
        :before-close="batchadddbwhandleClose"
      >
        <el-form :model="BlackorWhiteVO" label-width="100px" :rules="rules">
          <el-row>
            <el-col span="10">
              <el-form-item label="类型">
                <el-select v-model="BlackorWhiteVO.type" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select> </el-form-item></el-col>
            <el-col span="10">
              <el-form-item label="来源">
                <el-select
                  v-model="BlackorWhiteVO.listSource"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in listoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="8">
              <el-date-picker
                v-model="BlackorWhiteVO.startTime"
                type="datetime"
                placeholder="选择开始时间"
              />
            </el-col>
            <el-col span="8">
              <el-date-picker
                v-model="BlackorWhiteVO.endTime"
                type="datetime"
                placeholder="选择结束时间"
              />
            </el-col>
            <el-col span="8">
              <el-form-item label="备注">
                <el-input
                  v-model="BlackorWhiteVO.note"
                  style="width: 90%"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="batchaddbwVisible = false">取 消</el-button>
          <el-button type="primary" @click="onBtnSavebwClick">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import {
  bwcommonQuery,
  add,
  modify,
  queryblackOrWhiteById,
  remove,
  batchRemove,
  batchUpdate,
  batchadd
} from '@/api/basedata/blackorwhite'
import { generateDatabaseTime } from '@/utils'
import { commonQuery, queryUserById } from '@/api/right/user'

export default {
  data() {
    return {
      options: [
        {
          value: '黑名单',
          label: '黑名单'
        },
        {
          value: '白名单',
          label: '白名单'
        }
      ],
      listoptions: [
        {
          value: '系统',
          label: '系统'
        }
      ],
      dataForm: {},
      BlackorWhitelist: [],
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      bwcommonPage: { total: 10, pageCount: 1, pageSize: 10 },
      userlist: [],
      dialogType: '',
      searchForm: {},
      usersearchForm: {},
      BlackorWhiteVO: {},
      userVO: {},
      batchaddbwVisible: false,
      addBlackVisible: false,
      BlackorWhiteLoading: false,
      addBlackOrWhiteVisible: false,
      updateBlackOrWhiteVisible: false,
      addBlackorWhiteLoading: false
    }
  },
  mounted() {
    this.searchFormclick()
    this.usersearchFormclick()
  },
  methods: {
    testcode() {
      if (this.userVO.code.length !== 0) {
        bwcommonQuery({ blackOrWhiteAccount: this.userVO.code }).then((res) => {
          if (res.data.length !== 0) {
            this.$message.success('用户已经加入黑名单')
          }
        })
      } else return
    },
    onQuery() {
      this.searchFormclick()
    },
    userQuery() {
      this.usersearchFormclick()
    },
    generateDatabaseTime: generateDatabaseTime,
    // 发起查询
    searchFormclick() {
      this.BlackorWhiteLoading = true
      bwcommonQuery(this.searchForm)
        .then((response) => {
          // debugger
          // eslint-disable-next-line no-unused-vars
          const { total, pageNum, pageSize } = response // 如果异常则被axios 的拦截器拦截并且显示错误码和消息
          this.commonPage.total = parseInt(total)
          // this.commonPage.pageCount = pageNum
          // this.commonPage.pageSize = pageSize
          // this.$message.success(response.data.length)
          this.BlackorWhitelist = response.data // 分页信息带回显示
          this.BlackorWhiteLoading = false // 关闭查询
        })
        .catch((error) => {
          console.log(error)
          this.BlackorWhiteLoading = false // 关闭查询
          this.$message.error('网络异常')
        })
    },
    usersearchFormclick() {
      this.addBlackorWhiteLoading = true
      commonQuery(this.usersearchForm)
        .then((response) => {
          // eslint-disable-next-line no-unused-vars
          const { total, pageNum, pageSize } = response // 如果异常则被axios 的拦截器拦截并且显示错误码和消息
          this.bwcommonPage.total = parseInt(total)
          // this.commonPage.pageCount = pageNum
          // this.commonPage.pageSize = pageSize
          this.userlist = response.data // 分页信息带回显示
          this.addBlackorWhiteLoading = false // 关闭查询
        })
        .catch(() => {
          this.addBlackorWhiteLoading = false // 关闭查询
          this.$message.error('网络异常')
        })
    },
    // 添加和编辑方法
    onBtnSaveClick() {
      if (this.dialogType === 'ADD') {
        const blackorwhiteDTO = this.BlackorWhiteVO
        blackorwhiteDTO.userId = this.userVO.id
        blackorwhiteDTO.blackOrWhiteAccount = this.userVO.code
        blackorwhiteDTO.blackOrWhiteName = this.userVO.name
        add(blackorwhiteDTO).then((response) => {
          if (response) {
            this.$message.success('操作成功')
            this.addBlackVisible = false
            this.BlackorWhiteVO = {}
          }
          this.searchFormclick()
        })
      } else if (this.dialogType === 'update') {
        const updateblackorwhitedto = this.BlackorWhiteVO
        modify(updateblackorwhitedto).then((response) => {
          if (response) {
            this.$message.success('操作成功')
            this.updateBlackOrWhiteVisible = false

            this.BlackorWhiteVO = {}
          }
          this.searchFormclick()
        })
      } else if (this.dialogType === 'COPY') {
        const blackorwhiteDTO = this.BlackorWhiteVO
        add(blackorwhiteDTO)
          .then((response) => {
            this.commonResponse = response
            if (this.commonResponse) {
              this.$message.success('复制成功')
              // 查询刷新当前增加数据为第一条
              this.searchFormclick()
            } else {
              this.$message.error('复制失败,不能复制重复的账号!')
              // 查询刷新为原始数据
              this.searchFormclick()
            }
            this.updateBlackOrWhiteVisible = false
          })
          .catch(() => {
            this.dialogType = null
            this.BlackorWhiteVO = null
            this.$message.error('网络异常')
          })
      }
    },

    batchUpdateuserblacklistStatus(arry) {
      batchUpdate(arry)
        .then((res) => {
          if (res) {
            this.$message.success('修改成功')
            this.searchFormclick()
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 删除方法
    deleteHandle(val) {
      // debugger
      this.$confirm('确定要删除吗？', { center: true }).then((res) => {
        remove({ id: val.id, version: val.version }).then((response) => {
          this.$message.success('操作成功')
          this.searchFormclick()
        })
      })
    },
    // 批量删除
    deleteSelect() {
      this.$confirm('确定要删除吗？', { center: true }).then((res) => {
        if (res === 'confirm') {
          batchRemove(this.$refs.muiltitable.selection)
            .then((res) => {
              if (res) {
                this.$message.success('删除成功')
                this.searchFormclick()
              }
            })
            .catch((error) => {
              console.log(error)
              this.$message.error('删除失败')
            })
        }
      })
    },
    /**
     * @description: 选择一行进行复制操作
     * @param {*} index
     * @param {*} row
     * @return {*}
     */
    onRowBtnCopyClick(index, row) {
      // 查询并且展示  然后就是 增加
      if (row != null) {
        this.showblackorwhite(row)
      }
    },
    /**
     * @description: 复制展示对话框
     * @param {*} dictionaryVO
     * @return {*}
     */
    showblackorwhite(BlackorWhiteVO) {
      this.BlackorWhiteVO = BlackorWhiteVO // 初始化
      this.dialogType = 'COPY'
      // this.dialogVisible = false
      // this.copyLaoding = false
      this.updateBlackOrWhiteVisible = true
    },
    batchAddClick() {
      if (this.$refs.dialogmuiltitable.selection.length === 0) {
        this.$message.success('未选中记录')
      } else {
        this.batchaddbwVisible = true
      }
    },
    onBtnSavebwClick() {
      let blackorwhitelist = []
      this.$refs.dialogmuiltitable.selection.map((item) => {
        item.listSource = this.BlackorWhiteVO.listSource
        item.type = this.BlackorWhiteVO.type
        item.startTime = this.BlackorWhiteVO.startTime
        item.endTime = this.BlackorWhiteVO.endTime
        item.note = this.BlackorWhiteVO.note
        item.userId = item.id
        item.blackOrWhiteAccount = item.code
        item.blackOrWhiteName = item.name
        blackorwhitelist.push(item)
      })

      batchadd(blackorwhitelist).then((response) => {
        if (response) {
          this.$message.success('操作成功')
          this.batchaddbwVisible = false
          this.searchFormclick()
          this.BlackorWhiteVO = {}
        }
      })
    },
    addview() {
      this.addBlackOrWhiteVisible = true
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.searchFormclick()
    },
    handleCurrentChange(val) {
      this.searchForm.pageNum = val
      this.searchFormclick()
    },
    bwhandleSizeChange(val) {
      this.usersearchForm.pageNum = val
      this.usersearchFormclick()
    },
    bwhandleCurrentChange(val) {
      this.usersearchForm.pageNum = val
      this.usersearchFormclick()
    },
    UpdateHandle(row) {
      this.dialogType = 'update'
      queryblackOrWhiteById(row.id)
        .then((res) => {
          this.BlackorWhiteVO = res
          this.updateBlackOrWhiteVisible = true
        })
        .catch((error) => {
          console.log(error)
        })
    },
    addHandle(row) {
      this.dialogType = 'ADD'
      queryUserById(row.id)
        .then((res) => {
          this.userVO = res
          this.addBlackVisible = true
        })
        .catch((error) => {
          console.log(error)
        })
    },
    addBlackOrWhitehandleClose() {
      this.addBlackOrWhiteVisible = false
      this.BlackorWhiteVO = {}
    },
    updateBlackOrWhiteClose() {
      this.updateBlackOrWhiteVisible = false
      this.BlackorWhiteVO = {}
    },
    addBlackClose() {
      this.addBlackVisible = false
      this.searchForm()
      this.BlackorWhiteVO = {}
    },
    batchadddbwhandleClose() {
      this.batchaddbwVisible = false
    }
  }
}
</script>
