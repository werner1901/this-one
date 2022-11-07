<!--
 * @Author: yangshaoqi
 * @Date: 2020-12-16 21:00
 * @LastEditTime: 2022-06-09 15:05:06
 * @LastEditors: 18059301505 275895816@qq.com
 * @Description: In User Settings Edit
-->

<template>
  <el-container>
    <el-header>
      <el-header>
        <!--引入查询面板组件该组件封装基本的查询控制逻辑-->
        <div class="test">
          <sd-QueryPanel
            :query-model="userQuery"
            @QueryButtonClick="onBtnQueryClick"
          >
            <!--这里在组件是slot 由用户自定义查询条件-->

            <el-form-item label="用户名" label-width="60px">
              <el-input v-model="userQuery.name" style="width: 200px" />
            </el-form-item>
            <el-form-item label="工号" label-width="60px">
              <el-input v-model="userQuery.code" style="width: 200px" />
            </el-form-item>
            <el-form-item label="电话" label-width="60px">
              <el-input v-model="userQuery.tel" style="width: 200px" />
            </el-form-item>
            <el-form-item label="角色" label-width="60px">
              <el-select
                v-model="userQuery.roleId"
                placeholder="请选择"
                style="width: 180%"
              >
                <el-option :value="null">空</el-option>
                <el-option
                  v-for="item in optionsRole"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </sd-QueryPanel>
        </div>
      </el-header>
    </el-header>
    <el-container>
      <el-aside
        style="position: relative; top: 20px"
        :width="showmuenflag ? '0px' : '190px'"
      >
        <el-menu :collapse="showmuenflag">
          <el-col :span="24">
            <el-card shadow="always" style="height: 100%">
              <div slot="header" class="clearfix;">
                <em
                  class="el-icon-menu"
                  style="height: 22px"
                  @click="showmuenflag = !showmuenflag"
                >子系统管理</em>
              </div>
              <!-- <el-tree :data="data" :props="defaultProps" /> -->

              <el-tree
                :data="data"
                :props="defaultProps"
                accordion
                :highlight-current="true"
                @node-click="handleNodeClick"
              />
            </el-card>
          </el-col>
        </el-menu>
      </el-aside>

      <el-container>
        <el-main>
          <!--action bar area-->
          <div>
            <!-- <el-button
             class=""
              @click="showmuen"
            >0222222222</el-button> -->

            <!-- <i style="margin-left:-15px" class="iconfont icon-liebiao" @click="showmuen" /> -->
            <i
              :class="
                showmuenflag ? 'el-icon-arrow-right' : 'el-icon-arrow-left'
              "
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
              type="danger"
              icon="el-icon-delete"
              @click="onBtnBatchDelete"
            >删除</el-button>
            <el-dropdown
              split-button
              type="primary"
              style="margin: 0 10px"
              @command="onDropdownCommand"
            >
              启停控制
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  command="enable_command"
                >启用</el-dropdown-item>
                <el-dropdown-item
                  command="disable_command"
                >停用</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="onBtnBatchUserForRole"
            >分配角色</el-button>
            <i
              class="el-icon-menu"
              type="primary"
              icon="el-icon-plus"
              style="font-size: 30px; color: #409eff; float: right"
              @click="onBtnHideClick"
            />
            <!-- <el-button type="primary" @click="showmuen">子系统管理</el-button> -->
          </div>

          <!--data show area  -->
          <el-table
            id="rebateSetTable"
            ref="multipleTable"
            v-loading="queryLoading"
            :data="user"
            element-loading-text="Loading"
            fit
            border
            highlight-current-row
            height="650"
            style="margin: 20px 0"
            @selection-change="handleSelectionChange"
            @row-dblclick="handleRowDoubleClick"
            @cell-click="handleCellClick"
          >
            <el-table-column fixed align="center" width="50" type="selection" />
            <el-table-column
              type="index"
              align="center"
              label="序号"
              width="55"
            >
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="tableColumns[0].show"
              sortable
              align="center"
              prop="code"
              label="工号"
              width="95"
            />
            <el-table-column
              v-if="tableColumns[1].show"
              align="center"
              prop="name"
              label="用户名"
              width="95"
            />
            <el-table-column
              v-if="tableColumns[3].show"
              align="center"
              prop="company.name"
              label="所属公司"
              width="105"
            />
            <el-table-column
              v-if="tableColumns[4].show"
              align="center"
              prop="department.name"
              label="所属部门"
              width="95"
            />
            <el-table-column
              v-if="tableColumns[5].show"
              align="center"
              prop="roleList"
              label="所属角色"
              width="125"
              class-name="hover"
            >
              <template slot-scope="scope">
                <span v-for="(item2, index) in scope.row.roleList" :key="index">
                  {{ item2.name }}&nbsp;
                </span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="tableColumns[6].show"
              align="center"
              prop="position.name"
              label="职位"
              width="95"
            />
            <el-table-column
              v-if="tableColumns[7].show"
              align="center"
              prop="sex"
              label="性别"
              :formatter="formatSex"
              width="55"
            />
            <el-table-column
              v-if="tableColumns[8].show"
              sortable
              align="center"
              prop="birthday"
              label="生日"
              :formatter="formatDate"
              width="155"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div
                  v-if="
                    scope.row.birthday === null ||
                      scope.row.birthday === undefined
                  "
                >
                  /
                </div>
                <div v-else>
                  <i class="el-icon-time" />
                  <span style="margin-left: 10px">{{
                    generateDatabaseTime(new Date(scope.row.birthday))
                  }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              v-if="tableColumns[9].show"
              align="center"
              prop="tel"
              label="电话"
              width="125"
            />
            <!-- <el-table-column
              align="center"
              prop="email"
              label="邮箱"
              width="125"
              show-overflow-tooltip
            /> -->
            <!-- <el-table-column
              align="center"
              prop="other"
              label="其他联系"
              width="125"
              show-overflow-tooltip
            />
            <el-table-column
              align="center"
              prop="remark"
              label="备注"
              width="125"
            /> -->
            <!-- <el-table-column
              align="center"
              prop="modifier"
              label="更新人"
              width="125"
            /> -->
            <!-- <el-table-column
              align="center"
              prop="updatedTime"
              label="更新时间"
              :formatter="formatDate"
              width="200"
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
            <el-table-column
              align="center"
              prop="status"
              label="状态"
              width="100"
            >
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.status === 1"
                  type="success"
                >启用</el-tag>
                <el-tag v-else type="danger">停用</el-tag>
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
          <el-pagination
            :page-size="commonPage.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="commonPage.total"
            :current-page.sync="currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
          <sd-FormDialog
            v-dialogDrag
            :caption="dialogCaption"
            :visible="dialogVisible"
            width="50%"
            :model="userVO"
            :rules="rules"
            @CancelButtonClick="onBtnCancelClick"
            @OkButtonClick="onBtnSaveClick"
          >
            <el-row>
              <el-col :span="10">
                <el-form-item style="padding: 2%" label="工号" prop="code">
                  <el-input v-model="userVO.code" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item style="padding: 2%" label="用户名" prop="name">
                  <el-input v-model="userVO.name" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="性别" style="padding: 2%" prop="sex">
                  <template>
                    <div style="width: 100%; display: inline-block">
                      <el-radio v-model="userVO.sex" :label="0">男</el-radio>
                      <el-radio v-model="userVO.sex" :label="1">女</el-radio>
                    </div>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="10" v-if="dialogType == 'ADD'">
                <el-form-item style="padding: 2%" label="密码" prop="password">
                  <el-input v-model="userVO.password" type="password"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item
                  style="padding: 2%"
                  label="所属部门"
                  prop="departmentId"
                >
                  <el-select
                    v-model="userVO.departmentId"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in optionsDepartment"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item
                  style="padding: 2%"
                  label="职位"
                  prop="positionId"
                >
                  <el-select
                    v-model="userVO.positionId"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in optionsPosition"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item style="padding: 2%" label="电话" prop="tel">
                  <el-input v-model="userVO.tel" />
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item style="padding: 2%" label="邮箱" prop="email">
                  <el-input v-model="userVO.email" placeholder="" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item
                  style="padding: 2%"
                  label="拥有角色"
                  prop="roleList"
                >
                  <el-select
                    v-model="userVO.roleList"
                    multiple
                    value-key="roleList"
                    placeholder="请选择"
                    style="width: 100%"
                    @change="changeList"
                  >
                    <el-option
                      v-for="item in optionsRole"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item style="padding: 2%" label="其他联系" prop="other">
                  <el-input v-model="userVO.other" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item style="padding: 2%" label="生日" prop="birthday">
                  <!-- <el-date-picker
                    v-model="userVO.birthday"
                    type="datetime"
                    :formatter="formatDate"
                    placeholder="选择日期时间"
                    style="width: 100%"
                  /> -->
                  <el-date-picker
                    v-model="userVO.birthday"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item style="padding: 2%" label="备注" prop="remark">
                  <el-input v-model="userVO.remark" />
                </el-form-item>
              </el-col>
            </el-row>
          </sd-FormDialog>
        </el-main>

        <TableDialog
          v-if="tableDialogVisible"
          ref="tableDialog"
          :role-list="optionsRole"
          :common-page="commonRolePage"
        />
        <sd-HideTable
          :visible.sync="hideDialogColumnVisible"
          :table-columns="tableColumns"
          :width="hideTableWidth"
          @hideTableClose="hideTableClose"
          @tableColumnData="tableColumnData"
        />
        <!--资源分配的弹框-->
        <el-dialog
          v-dialogDrag
          title="资源分配："
          :visible.sync="resourcedialogVisible"
          width="60%"
          length="100%"
        >
          <div style="overflow: auto; overflow-y: auto">
            <el-card
              v-loading="listLoading"
              shadow="always"
              class="box-card"
              style="overflow: auto"
            >
              <el-tree
                ref="resourceTree"
                node-key="id"
                show-checkbox
                :data="resourceData"
              />
            </el-card>
          </div>
          <span slot="footer">
            <el-button @click="resourcedialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="resourcedialogVisible = false"
            >确 定</el-button>
          </span>
        </el-dialog>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import {
  add,
  remove,
  modify,
  commonQuery,
  queryUserById,
  batchUpdate,
  batchRemove,
  queryAllRole,
  queryAllDepartment,
  queryAllPosition
} from '@/api/right/user'
import { treeQuery } from '@/api/right/resource'
import {
  stringifyObjArr,
  parseObjArr,
  stringifyArr,
  parseArr
} from '../../../utils/hideTableColumn'
import { QueryPanel, FormDialog } from '@/components/SD365UI'
import TableDialog from '@/components/SD365UI/TableDialog'
import { generateDatabaseTime } from '@/utils'
import dialogDrag from '../../../utils/dialogdrap'
export default {
  components: {
    TableDialog
  },
  data() {
    // init all model
    return {
      hideTableWidth: '30%',
      hideDialogColumnVisible: false,
      showmuenflag: true,
      queryLoading: false, // 查询进度条控制
      updateLoading: false, // 修改进度条控制
      copyLaoding: false, // 拷贝一条数据的进度控制
      multipleSelection: [],
      dialogVisible: false,
      btndisable: false,
      listLoading: false,
      tableDialogVisible: false,
      resourcedialogVisible: false,
      resourceData: [],
      /**
       * 查询区模型
       */
      userQuery: {
        name: '',
        code: '',
        tel: '',
        roleId: '',
        departmentId: '',
        positionId: ''
      }, // 查询对象

      roleList: [],
      /**
       * 展示区模型
       */
      user: [], // 从vo取得的客户信息
      userVO: {}, // 显示查询回来的对象
      dialogImportCaption: '导入信息',

      optionsRole: [], // 从后端取回的role表
      optionsDepartment: [],
      optionsPosition: [],
      commonRolePage: { total: 10, pageCount: 1, pageSize: 10 },
      dialogImportVisible: false,
      currentPage: 1, // 默认返回第一页
      commonPage: { total: 10, pageCount: 1, pageSize: 10 }, // 分页数据对象
      pageIndex: 1,
      rows: 0,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },

      /**
       * 对话框 模型
       */
      dialogCaption: '用户信息',
      dialogType: null, // 标记对话框处于那种状态 或者 ADD

      userDTO: {}, // 增加和修改对象
      rules: {
        // 定义当前页面的非空规则这点参考表结构的字段comment规则要求
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (
                /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(value) ===
                false
              ) {
                callback(new Error('密码由6-20位字母和数字组成'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入工号',
            trigger: 'blur'
          }
        ],
        sex: [
          {
            required: true,
            message: '请输入性别',
            trigger: 'blur'
          }
        ],
        tel: [
          {
            required: true,
            message: '请输入电话',
            trigger: 'blur'
          },
          {
            pattern: /^((0\d{2,3}-\d{7,8})|(1[3|4|5|7|8][0-9]{9}))$/,
            // 0592-5762030
            // pattern: /(^(1[3|4|5|7|8][0-9]{9})|((0(10|2[1-3]|[3-9]\d{2}))?[1-9]\d{6,7})$)/,
            message: '请输入正确的手机号码或者座机号'
          }
        ],
        departmentId: [
          {
            required: true,
            message: '请选择部门',
            trigger: 'blur'
          }
        ],
        positionId: [
          {
            required: true,
            message: '请选择职位',
            trigger: 'blur'
          }
        ],
        roleList: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'blur'
          }
        ],
      },
      tableColumns: [
        { prop: 'code', label: '工号', show: true },
        { prop: 'name', label: '用户名', show: true },
        { prop: 'password', label: '密码', show: true },
        { prop: 'company.name', label: '所属公司', show: true },
        { prop: 'department.name', label: '所属部门', show: true },
        { prop: 'roleList', label: '所属角色', show: true },
        { prop: 'position.name', label: '职位', show: true },
        { prop: 'sex', label: '性别', show: true },
        { prop: 'birthday', label: '生日', show: true },
        { prop: 'tel', label: '电话', show: true }
      ]
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    generateDatabaseTime: generateDatabaseTime,
    /**           jf
     *@description: 初始化界面需要使用的基本的模型的数据 包括发起远程查询获取下拉列表的数据
     *  为了避免方法定义过于混乱所以对方法定义顺序约定如下
     *  1 数据加载方法
     *  2 界面逻辑
     *  3 业务方法
     *@author: yangshaoqi
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
      this.getAllRole()
      this.getAllPosition()
      this.getAllDepartment()
      this.leftQuery()
      this.parseTableColumnData()
    },
    changeList(selectData) {
      // console.log(a)
      this.userVO.roleList = selectData
      console.log(this.userVO.roleList)
    },
    leftQuery() {
      this.data.push(
        {
          label: '部门',
          children: [],
          id: null
        },
        {
          label: '职位',
          children: [],
          id: null
        },
        {
          label: '角色',
          children: [],
          id: null
        }
      )
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
      queryUserById(row.id).then((response) => {
        // 取得CommonResponse的Body
        if (response != null) {
          // eslint-disable-next-line no-undef
          this.userVO = response
          this.userVO.roleList = this.userVO.roleList.map((item) => item.id)
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
     * 处理分页页数变化
     */
    handleSizeChange(val) {
      this.queryUser(val, 1)
      this.currentPage = 1
    },

    handleCurrentChange(val) {
      this.queryUser(this.commonPage.pageSize, val)
    },

    /**
     * 以下区域为界面对应业务逻辑定义区域
     */
    /**
     * @description: 用于对VO的 标志值 转 文字的定义
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
    formatSex(row, column) {
      if (row.sex === 0) {
        return '男'
      } else {
        return '女'
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
      // 点击查询按钮时，清空侧边栏部门和职位的查询参数，保留顶部表单参数项
      this.userQuery.departmentId = ''  
      this.userQuery.positionId = ''

      this.queryUser(this.commonPage.pageSize, 1)
      this.currentPage = 1
    },
    handleNodeClick(data) {
      if (data.id != null) {
        this.userQuery = {
          name: '',
          code: '',
          tel: '',
          roleId: '',
          departmentId: '',
          positionId: ''
        }
        if (data.falg === 0) {
          this.userQuery.roleId = null
          this.userQuery.positionId = null
          this.userQuery.departmentId = data.id
          this.queryUser(this.commonPage.pageSize, 1)
          this.currentPage = 1
        }
        if (data.falg === 1) {
          this.userQuery.roleId = null
          this.userQuery.departmentId = null
          this.userQuery.positionId = data.id
          this.queryUser(this.commonPage.pageSize, 1)
          this.currentPage = 1
        }
        if (data.falg === 2) {
          this.userQuery.departmentId = null
          this.userQuery.positionId = null
          this.userQuery.roleId = data.id
          this.queryUser(this.commonPage.pageSize, 1)
          this.currentPage = 1
        }
      }
    },

    queryUser(currentPage, pageNum) {
      this.queryLoading = true
      this.userQuery.pageSize = currentPage
      this.userQuery.pageNum = pageNum
      // debugger
      commonQuery(this.userQuery)
        .then((response) => {
          const { total, pageNum, pageSize } = response // 如果异常则被axios 的拦截器拦截并且显示错误码和消息
          this.commonPage.total = parseInt(total)
          this.commonPage.pageCount = parseInt(pageNum)
          this.commonPage.pageSize = currentPage
          this.user = response.data // 分页信息带回显示
          // debugger
          this.queryLoading = false // 关闭查询
        })
        .catch(() => {
          this.queryLoading = false // 关闭查询
          this.$message.error('网络异常')
        })
    },
    getAllRole() {
      queryAllRole()
        .then((response) => {
          const { pageNum, pageSize } = response
          this.commonRolePage.total = response.data.length
          this.commonRolePage.pageNum = pageNum
          this.commonRolePage.pageSize = pageSize
          console.log(response)
          this.optionsRole = response.data // 分页信息带回显示
          for (let i = 0; i < this.optionsRole.length; i++) {
            this.data[2].children.push({
              label: this.optionsRole[i].name,
              id: this.optionsRole[i].id,
              falg: 2
            })
          }
        })
        .catch(() => {
          this.$message.error('网络异常')
        })
    },
    getAllDepartment() {
      queryAllDepartment()
        .then((response) => {
          this.optionsDepartment = response.data // 分页信息带回显示
          for (let i = 0; i < this.optionsDepartment.length; i++) {
            this.data[0].children.push({
              label: this.optionsDepartment[i].name,
              id: this.optionsDepartment[i].id,
              falg: 0
            })
          }
        })
        .catch(() => {
          this.$message.error('网络异常')
        })
    },
    getAllPosition() {
      queryAllPosition()
        .then((response) => {
          this.optionsPosition = response.data // 分页信息带回显示
          for (let i = 0; i < this.optionsPosition.length; i++) {
            this.data[1].children.push({
              label: this.optionsPosition[i].name,
              id: this.optionsPosition[i].id,
              falg: 1
            })
          }
        })
        .catch(() => {
          this.$message.error('网络异常')
        })
    },

    /**
     * @description: 点击action bar区 增加按钮弹出对话框
     * @param {*}
     * @return {*}
     */
    onBtnAddClick() {
      try {
        this.userVO = {} // 初始化
        // this.loadSettleType('')
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
      // 如果不是选择一条则提示消息并且返回
      const rows = this.$refs.multipleTable.selection
      if (rows == null || rows.length === 0) {
        this.$message.error('请选择一条进行拷贝')
        return
      }
      if (rows != null && rows.length > 1) {
        this.$message.error('只能选择一条进行拷贝')
        return
      } else {
        this.showUser(rows[0])
      }
    },

    /**
     * @description: 点击action bar区进行批量删除操作
     * @param {*}
     * @return {*}
     */
    onBtnBatchDelete() {
      const userVOS = this.$refs.multipleTable.selection
      if (userVOS == null || userVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }
      this.$confirm('确定删除记录吗').then((response) => {
        const deleteUserDTOS = new Array(userVOS.length)
        for (let i = 0; i < userVOS.length; i++) {
          deleteUserDTOS[i] = {
            id: userVOS[i].id,
            version: userVOS[i].version
          }
        }
        batchRemove(deleteUserDTOS)
          .then((response) => {
            if (response) {
              this.$message.success('删除数据成功')
              this.handleCurrentChange(this.currentPage)
            }
          })
          .catch(() => {
            this.$message.error('网络错误')
          })
      })
    },
    /**
     * @description: 点击 action bar 区域进行启用和停用控制操作
     * @param {*} status
     * @return {*}
     */
    onDisableRecodClick(status) {
      const userVOS = this.$refs.multipleTable.selection
      if (userVOS == null || userVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }

      const userDTOS = new Array(userVOS.length)
      for (let i = 0; i < userVOS.length; i++) {
        userDTOS[i] = {
          id: userVOS[i].id,
          status: status,
          version: userVOS[i].version
        }
      }
      batchUpdate(userDTOS)
        .then((response) => {
          if (response) {
            this.$message.success('操作成功')
            this.handleCurrentChange(this.currentPage)
          } else {
            this.$message.error('没有找到对应记录更新失败')
          }
        })
        .catch(() => {
          this.$message.error('网络错误')
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
        this.showUser(row)
      }
    },

    /**
     * @description: 点击行的操作区域删除当前行的记录
     * @param {*}
     * @return {*}
     */
    onBtnDeleteClick(index, row) {
      //   // 获取多条ID 调用服务端
      const userVOS = this.$refs.multipleTable.selection
      if (userVOS == null || userVOS.length > 1) {
        this.$message.error('请选择一条删除')
        return
      }
      const currentUserVo = this.user[index]
      this.$confirm('确定删除记录吗').then((result) => {
        remove(currentUserVo.id, currentUserVo.version)
          .then((response) => {
            this.commonResponse = response
            if (this.commonResponse) {
              this.$message.success('操作成功')
              this.handleCurrentChange(this.currentPage)
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
      const currentUserVO = this.user[index]
      if (currentUserVO == null) {
        this.$message.info('没有对应记录可以编辑')
        return
      }
      queryUserById(currentUserVO.id)
        .then((response) => {
          // 取得CommonResponse的Body
          if (response != null) {
            this.userVO = response
            this.userVO.roleList = this.userVO.roleList.map((item) => item.id)
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
     * @description: 编辑和修改前从后端查询商品信息的公用商品方法
     * @param {*} userVO
     * @return {*}
     */
    showUser(userVO) {
      this.copyLaoding = true
      // 调用 api 插入记录并且返回记录
      const selectedUser = userVO
      queryUserById(selectedUser.id)
        .then((response) => {
          // 加载下拉框数据 设置下拉框的选项
          this.userVO = response
          this.userVO.roleList = this.userVO.roleList.map((item) => item.id)
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
        this.userVO.modifier = this.$store.getters.name
        // this.userVO.updatedTime = new Date()
        // for (let i = 0; i < this.userVO.roleList.length; i++) {
        //   this.roleList[i] = { id: this.userVO.roleList[i] }
        // }
        this.roleList = []
        if (this.userVO.roleList) {
          this.userVO.roleList.map((item, index) => {
            this.roleList[index] = { id: item }
          })

          this.userVO.roleList = this.roleList
        } else {
          this.userVO.roleList = []
        }

        const currentUserDTO = this.userVO
        currentUserDTO.birthday = this.formatTime(currentUserDTO.birthday)
        // currentUserDTO.updatedTime = this.formatTime(currentUserDTO.updatedTime)
        add(currentUserDTO)
          .then((response) => {
            // 显示保存成功并且返回
            if (response) {
              this.$message.success('操作成功')
            } else {
              this.$message.error('存在该用户工号,不可重复增加')
            }
            this.dialogVisible = false
            this.onBtnQueryClick()
          })
          .catch(() => {
            this.dialogType = null
            this.customerVO = null
            this.$message.error('网络异常')
          })
      } else if (this.dialogType === 'EDIT') {
        this.userVO.modifier = this.$store.getters.name
        // this.userVO.updatedTime = new Date()
        this.roleList = []
        this.userVO.roleList.map((item, index) => {
          this.roleList[index] = { id: item }
        })
        this.userVO.roleList = this.roleList
        this.userDTO = this.userVO
        this.userDTO.birthday = this.formatTime(this.userDTO.birthday)
        // this.userDTO.updatedTime = this.formatTime(this.userDTO.updatedTime)
        modify(this.userDTO)
          .then((response) => {
            // 显示保存成功并且返回
            this.$message.success('操作成功')
            this.dialogVisible = false
            // 查询刷新当前增加数据为第一条
            this.onBtnQueryClick()
          })
          .catch(() => {
            this.dialogType = null
            this.userVO = null
            this.$message.error('网络异常')
          })
      } else if (this.dialogType === 'COPY') {
        this.userVO.modifier = this.$store.getters.name
        // this.userVO.updatedTime = new Date()
        for (let i = 0; i < this.userVO.roleList.length; i++) {
          this.roleList[i] = { id: this.userVO.roleList[i] }
        }
        this.userVO.roleList = this.roleList
        const currentUserDTO = this.userVO
        currentUserDTO.birthday = this.formatTime(currentUserDTO.birthday)
        // currentUserDTO.updatedTime = this.formatTime(currentUserDTO.updatedTime)
        add(currentUserDTO)
          .then((response) => {
            // 显示保存成功并且返回
            if (response) {
              this.$message.success('操作成功')
            } else {
              this.$message.error('存在该工号,不可重复增加')
            }
            this.dialogVisible = false
            // 查询刷新当前增加数据为第一条
            this.onBtnQueryClick()
          })
          .catch(() => {
            this.dialogType = null
            this.userVO = null
            this.$message.error('网络异常')
          })
      }
    },

    /**
     * 时间格式化
     * @param time 传入所需格式化时间
     */
    formatTime(time) {
      if (!time) {
        return
      }
      time = new Date(time)
      time =
        time.getFullYear() +
        '-' +
        (time.getMonth() + 1 < 10
          ? '0' + (time.getMonth() + 1)
          : time.getMonth() + 1) +
        '-' +
        (time.getDate() < 10 ? '0' + time.getDate() : time.getDate()) +
        ' ' +
        (time.getHours() + 1 < 10 ? '0' + time.getHours() : time.getHours()) +
        ':' +
        (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) +
        ':' +
        (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds())
      return time
    },

    formatDate(row, column) {
      const data = row[column.property]
      if (data === null || data === undefined) {
        return ''
      }
      const dt = new Date(data)
      return (
        dt.getFullYear() +
        '-' +
        (dt.getMonth() + 1) +
        '-' +
        dt.getDate() +
        ' ' +
        dt.getHours() +
        ':' +
        dt.getMinutes() +
        ':' +
        dt.getSeconds()
      )
    },

    /**
     * @description: 对话框区域的点击操作,在这里添加你取消的逻辑
     * @param {*}
     * @return {*}
     */
    onBtnCancelClick() {
      this.dialogType = null
      this.dialogVisible = false
    },
    onBtnBatchUserForRole() {
      const userVOS = this.$refs.multipleTable.selection
      if (userVOS == null || userVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }

      this.tableDialogVisible = true
      this.$nextTick(() => {
        this.$refs.tableDialog.init(userVOS)
      })
    },
    showmuen() {
      // debugger
      this.showmuenflag = !this.showmuenflag
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
    },
    // // 缓存表格列数据
    // tableColumnData(data) {
    //   stringifyObjArr('user', data)
    // },
    // // 解析表格列数据

    // parseTableColumnData() {
    //   const tableColumnData = parseObjArr('user')
    //   if (tableColumnData && tableColumnData.length !== 0) {
    //     this.tableColumns = tableColumnData
    //   }
    // },
    handleCheckAllChange(data) {
      this.tableColumns = data
    },
    handleCheckedTableColumnChange(data) {
      this.tableColumns = data
    },
    transform(list) {
      // var map = {}; var node; var tree = []; var i
      var tree = []
      // var firstNode = []
      // var secondNode = []
      // 存储一级节点（系统）
      list.map((item) => {
        if (parseInt(item.parentId) === -1 && item.resourceType === 2) {
          tree.push({ label: item.name, id: item.id, children: [] })
        }
      })
      // 存储二级节点（主菜单）
      tree.map((itemParent) => {
        list.map((item) => {
          if (itemParent.id === item.parentId) {
            itemParent.children.push({
              id: item.id,
              label: item.name,
              children: []
            })
          }
        })
      })
      // 存储三级节点（子菜单）
      tree.map((itemParent) => {
        itemParent.children.map((itemSecondParent) => {
          list.map((item) => {
            if (itemSecondParent.id === item.parentId) {
              itemSecondParent.children.push({
                id: item.id,
                label: item.name,
                children: []
              })
            }
          })
        })
      })
      // 存储四级节点（请求权限）
      tree.map((itemParent) => {
        itemParent.children.map((itemSecondParent) => {
          itemSecondParent.children.map((itemthirdParent) => {
            list.map((item) => {
              if (itemthirdParent.id === item.parentId) {
                itemthirdParent.children.push({ id: item.id, label: item.name })
              }
            })
          })
        })
      })
      return tree
    },
    // 用户拥有资源的回填
    fillResourceTree(roleId) {
      const resourceFillQuery = {}
      resourceFillQuery.pageSize = 1000
      resourceFillQuery.roleId = roleId
      treeQuery(resourceFillQuery)
        .then((res) => {
          for (let i = 0; i < res.data.length; i++) {
            this.$refs.resourceTree.setChecked(res.data[i].id, true, false)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 点击角色查看权限
    handleCellClick(row, column, cell, event) {
      if (column.label === '所属角色') {
        this.listLoading = true
        this.resourcedialogVisible = true
        const resourceQuery = {}
        resourceQuery.pageSize = 1000
        treeQuery(resourceQuery).then((response) => {
          this.resourceData = this.transform(response.data)
          this.fillResourceTree(row.roleList[0].id)
          this.listLoading = false
        })
      }
    }
  }
}
</script>

<style scope>
@import url('../../../assets/systemsicons/iconfont.css');
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.test {
  border-top: 15px solid;
  margin-left: -27px;
  border-color: rgba(0, 0, 0, 0);
}
.upload-demo {
  display: inline-block;
  margin-right: 10px;
}
.i-sty {
  cursor: pointer;
}
.hover:hover {
  cursor: pointer;
}
</style>
