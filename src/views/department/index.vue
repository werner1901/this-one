<!--
 * @Author: abel.zhan
 * @Date: 2020-11-08 17:45:25
 * @LastEditTime: 2022-03-28 23:05:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \sd365-tms-omp-front-end\src\views\basedata\customer\index.vue
-->

<template>
  <el-container>
    <!--
    <el-header>
      <sd-QueryPanel :query-model="customerQuery" @QueryButtonClick="onBtnQueryClick">
        <el-form-item label="姓名">
          <el-input v-model="customerQuery.name" style="width:200px" />
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="customerQuery.mobile" style="width:200px" />
        </el-form-item>
      </sd-QueryPanel>
    </el-header>
    -->
    <!-- 查询区 -->
    <el-header>
      <!--引入查询面板组件该组件封装基本的查询控制逻辑-->
      <sd-QueryPanel
        class="queryClass"
        :query-model="departmentQuery"
        @QueryButtonClick="onBtnQueryClick"
      >
        <!--这里在组件是slot 由用户自定义查询条件-->
        <el-form-item label="部门名称">
          <el-input v-model="departmentQuery.name" style="width: 200px" />
        </el-form-item>
        <el-form-item label="助记码">
          <el-input
            v-model="departmentQuery.mnemonicCode"
            style="width: 200px"
          />
        </el-form-item>
      </sd-QueryPanel>
    </el-header>
    <!--    左边的树-->
    <el-container>
      <el-aside
        style="position: relative; top: 20px"
        :width="hidemenuflag ? '0px' : '190px'"
      >
        <el-menu :collapse="hidemenuflag">
          <el-col :span="4">
            <el-card shadow="always" style="height: 100%; width: 190px">
              <div slot="header" style="width: 555px" class="clearfix">
                <em
                  class="el-icon-menu"
                  style="height: 22px"
                  @click="hidemenuflag = !hidemenuflag"
                >部门管理</em>
              </div>
              <el-tree
                class="tree"
                :props="treeProps"
                :data="departmentData"
                @node-click="handleNodeClick"
              />
            </el-card>
          </el-col>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main style="line-height: 0px">
          <!--action bar area-->
          <div style="margin-bottom: 20px">
            <i
              :class="
                hidemenuflag ? 'el-icon-arrow-right' : 'el-icon-arrow-left'
              "
              class="i-sty"
              @click="hideMenu"
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
              style="margin-left: 5px; margin-right: 5px; margin-bottom: 5px"
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
              prop="name"
              label="部门名称"
              width="130"
              sortable :sort-method="(a,b) => a.name.localeCompare(b.name)"
            />
            <el-table-column
              align="center"
              prop="code"
              label="部门编号"
              width="130"
              sortable 
             :sort-method="(a,b)=>{return a.code - b.code}"
            />
            <el-table-column
              align="center"
              prop="mnemonicCode"
              label="助记码"
              width="130"
            />
            <!-- 上级部门 -->
            <el-table-column
              sortable
              align="center"
              prop="parentDepartmentVO.name"
              label="上级部门"
              width="130"
            />
            <!-- level部门级别 -->
            <el-table-column
              sortable
              align="center"
              prop="level"
              label="部门级别"
              width="110"
            />
            <!-- master负责人 -->
            <el-table-column
              align="center"
              prop="master"
              label="负责人"
              width="130"
            />
            <!-- 隶属公司 -->
            <el-table-column
              sortable
              align="center"
              prop="companyVO.name"
              label="隶属公司"
              width="130"
            />
            <!-- descript部门描述 -->
            <!-- <el-table-column
          sortable
          align="center"
          prop="descript"
          label="部门描述"
          width="120"
        /> -->
            <!-- <el-table-column
          align="center"
          prop="status"
          label="状态"
          width="95"
          :formatter="statusFormat"
        /> -->
            <!-- <el-table-column align="center" prop="organizationDTO.name" label="机构" width="95" />
        <el-table-column sortable align="center" prop="companyDTO.name" label="公司" width="95" />
        <el-table-column align="center" prop="modifier" label="更新人" width="95" />
        <el-table-column align="center" prop="updatedTime" label="更新时间" width="95" />
        <el-table-column align="center" prop="status" label="状态" width="95" :formatter="statusFormat" /> -->

            <!-- <el-table-column sortable align="center" prop="name" label="姓名" width="95" />
        <el-table-column align="center" prop="ename" label="英文名" width="95" />
        <el-table-column align="center" prop="assistantCode" label="助记码" width="95" />
        <el-table-column sortable align="center" prop="customerType" label="客户类型" width="95" />
        <el-table-column sortable align="center" prop="settleTypeDTO.name" label="结算类型" width="95" />
        <el-table-column align="center" prop="contacts" label="联系人" width="95" />
        <el-table-column align="center" prop="mobile" label="手机" width="95" />
        <el-table-column align="center" prop="tel" label="电话" width="95" />
        <el-table-column align="center" prop="address" label="地址" width="95" show-overflow-tooltip="true" />
        <el-table-column align="center" prop="fax" label="传真" width="95" />
        <el-table-column align="center" prop="account" label="账号" width="95" />
        <el-table-column align="center" prop="email" label="邮箱" width="95" />
        <el-table-column align="center" prop="organizationDTO.name" label="机构" width="95" />
        <el-table-column sortable align="center" prop="companyDTO.name" label="公司" width="95" />
        <el-table-column align="center" prop="modifier" label="更新人" width="95" />
        <el-table-column align="center" prop="updatedTime" label="更新时间" width="95" />
        <el-table-column align="center" prop="status" label="状态" width="95" :formatter="statusFormat" /> -->
            <!--操作区-->
            <el-table-column
              align="center"
              prop="operation"
              label="状态"
              width="200px"
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
              width="370"
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
            :total="commonPage.total"
            layout="total, sizes, prev, pager, next, jumper"
            :page-size="commonPage.pageSize"
            :current-page.sync="currentPage"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
          <!-- 对话框 -->
          <sd-FormDialog
            :caption="dialogCaption"
            :visible="dialogVisible"
            width="50%"
            :model="customerVO"
            :rules="rules"
            @OkButtonClick="onBtnSaveClick"
            @CancelButtonClick="onBtnCancelClick"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="部门名称" prop="name">
                  <el-col :span="22">
                    <el-input
                      v-model="customerVO.name"
                      @input="inputPY(customerVO.name)"
                    
                    />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="助记码" prop="mnemonicCode">
                  <el-col :span="22">
                    <el-input
                      v-model="customerVO.mnemonicCode"
                      @input="inputAssistantCode($event)"
                    />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="部门编号" prop="code">
                  <el-col :span="22">
                    <el-input v-model="customerVO.code" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部门级别" prop="level">
                  <el-select
                    v-model="customerVO.level"
                    style="width: 92%"
                     disabled
                  >
                    <el-option
                      v-for="(item, index) in [
                        { name: '1' },
                        { name: '2' },
                        { name: '3' }
                      ]"
                      :key="index"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="隶属公司" prop="companyId">
                  <el-col :span="22">
                    <!-- 选择器 选项改变的时候，查询公司下属部门 -->
                    <el-select
                      v-model="customerVO.companyId"
                      style="width: 100%"
                      filterable
                      @change="handleDialogCompanyChange"
                    >
                      <el-option
                        v-for="item in selectableCompanyData"
                        :key="item.companyId"
                        :label="item.name"
                        :value="item.companyId"
                      />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="上级部门" prop="parentId">
                  <el-col :span="22">
                    <!-- 级联选择器  单选选择任意一级选项 -->
                    <el-cascader
                      ref="parentDepartmentCascader"
                      v-model="customerVO.parentId"
                      style="width: 100%"
                      :options="selectableDepartmentData"
                      :props="dialogParentDepartmentProps"
                      @change="handleDialogParentDepartmentChange"
                    />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="负责人" prop="master">
                  <el-col :span="22">
                    <el-input v-model="customerVO.master" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </sd-FormDialog>
        </el-main>
        <el-container />
      </el-container> </el-container></el-container>
</template>

<script>
import { queryDictionaryByTypeId } from '@/api/basedata/dictionary'
import {
  commonQueryDepartment,
  batchUpdateDepartment,
  add,
  remove,
  modify,
  queryDepartmentById,
  batchRemove,
  status,
  treeQueryDepartment
} from '@/api/org/department'
import { commonQuery } from '@/api/org/company'
import { queryAllDepartment } from '@/api/right/user'
// eslint-disable-next-line no-unused-vars
import { QueryPanel, FormDialog } from '../../components/SD365UI'
import vPinyin from '../../utils/vue-py'
import Vue from 'vue'

// commonQueryDepartment

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
      dialogVisible: false, // 部门编辑对话框显示控制
      hidemenuflag: false, // 侧边栏树显示控制
      isRewriteEditor: false, // 复制时的对话框关键字段是否编辑过
      /**
       * 查询区模型
       */
      departmentQuery: {
        companyId: '',
        id: '',
        name: '',
        mnemonicCode: '',
        code: '',
        parentId: '',
        level: ''
      }, // 查询对象
      /**
       * 展示区模型
       */
      departments: [], // 从vo取得的 部门信息

      // eslint-disable-next-line no-new-object
      customerVO: { 
        settleTypeDTO: { id: '' },
        //companyId: ''
      }, // 显示查询回来的对象
      commonPage: { total: 10, pageCount: 1, pageSize: 10 }, // 分页数据对象
      currentPage: 1,
      /**
       * 对话框 模型
       */
      dialogCaption: '部门信息',
      // eslint-disable-next-line no-undef
      dialogType: 'EDIT', // 标记对话框处于那种状态 或者 ADD
      // eslint-disable-next-line no-undef
      // organizations: [], // for 机构
      // companies: [], // for 公司
      settleTypeVOS: [], // for 结算类型
      selectValue: '', // 显示用户的选择 以及后台的返回的默认值
      customerDTO: {}, // 增加和修改对象
      rules: {
        // 定义当前页面的非空规则这点参考表结构的字段comment规则要求
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
        mnemonicCode: [
          { required: true, message: '请输入助记码', trigger: 'blur' }
        ],
        code: [{ required: true, message: '请输入部门编号', trigger: 'blur' }],
        parentId: [{ required: true, message: '请选择上级部门', trigger: 'blur' }],
        companyId: [{ required: true, message: '请选择隶属公司', trigger: 'blur' }],
        master: [{ required: true, message: '请输入负责人', trigger: 'blur' }]
        // level: [{ required: true, message: '请输入部门等级', trigger: 'blur' }]
      },
      departmentData: [],
      treeProps: {
        children: 'children',
        label: 'label',
        value: ['companyId', 'departmentId']
      },
      dialogParentDepartmentProps: {
        checkStrictly: true,
        children: 'children',
        label: 'name',
        value: 'departmentId',
        level: 'level'
      },
      selectableCompanyData: [],
      selectableDepartmentData: []
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

    /**
     * @description:
     * @param {*}
     * @return {*}
     */
    inputPY(v) {
      this.customerVO.mnemonicCode = vPinyin
        .getPinYinFirstCharacter(v, '', true)
        .replace(/\s+/g, '');
    },
    inputPY(e){
      this.isRewriteEditor = true;
    },
    inputAssistantCode(e) {
      this.$forceUpdate();
      this.isRewriteEditor = true;
    },
    initData() {
      this.searchLoading = false
      this.queryLoading = false
      this.updateLoading = false
      this.listLoading = false
      this.onBtnQueryClick()
      this.getResourceTree()
    },
    /**
     * @description: 根据页面的下拉框的需要从字典加载数据参数为字典类型
     * @param {*} defaultSelectValue
     * @return {*}
     */
    loadSettleType(defaultSelectValue) {
      queryDictionaryByTypeId(1326439346873696256n)
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
      queryDepartmentById(row.id).then((response) => {
        // 取得CommonResponse的Body
        if (response != null) {
          // eslint-disable-next-line no-undef
          this.customerVO = response
          this.handleDialogCompanyChange(this.customerVO.companyId)
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
     * 更改单条状态
     */
    changeStatus(index, row) {
      const departmentDTO = {
        id: row.id,
        status: row.status,
        version: row.version
      }
      status(departmentDTO)
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

    onBtnQueryClick() {
      this.refreshDepartmentQueryModel('panel')
      this.queryDepartment(this.commonPage.pageSize, 1)
      this.currentPage = 1
    },

    /**
     * 换页
     */
    handleCurrentChange(val) {
      this.refreshDepartmentQueryModel('table')
      this.queryDepartment(this.commonPage.pageSize, val)
    },

    /**
     * 更改页面显示数量大小
     */
    handleSizeChange(val) {
      // this.$message.error()
      this.refreshDepartmentQueryModel('table')
      this.queryDepartment(val, 1)
      this.currentPage = 1 // 调整默认显示页面
    },

    /**
     * @description: 查询操作
     * @param {*}
     * @return {*}
     */
    queryDepartment(size, num) {
      this.queryLoading = true
      this.departmentQuery.pageSize = size
      this.departmentQuery.pageNum = num
      commonQueryDepartment(this.departmentQuery)
        .then((response) => {
          // eslint-disable-next-line no-unused-vars
          const { total, pageNum, pageSize } = response // 如果异常则被axios 的拦截器拦截并且显示错误码和消息

          this.commonPage.total = parseInt(total)
          this.commonPage.pageCount = parseInt(pageNum)
          this.commonPage.pageSize = size
          this.departments = response.data // 分页信息带回显示
          this.departments.map((dep) => {
            if (dep.parentId === -1 || dep.parentId === '-1') {
              Vue.set(dep, 'parentDepartmentVO', {
                name: '无上级部门',
                id: -1
              })
            } else {
              queryDepartmentById(dep.parentId)
                .then((response) => {
                  Vue.set(dep, 'parentDepartmentVO', response)
                })
                .catch(() => {
                  this.$message.error('网络异常')
                })
            }
          })
          this.queryLoading = false // 关闭查询
        })
        .catch(() => {
          this.queryLoading = false // 关闭查询
          this.$message.error('网络异常')
        })
      // for (let i = 0; i++; i < this.departments[i].length) {
      //   if (this.departments[i].parentId === -1 || this.departments[i].parentId === '-1') {
      //     this.departments[i].parentDepartmentVO.name = '无上级部门'
      //     this.departments[i].parentDepartmentVO.id = -1
      //   } else {
      //     queryDepartmentById(this.departments[i].parentId)
      //       .then((response) => {
      //         this.departments[i].parentDepartmentVO = response
      //       })
      //       .catch(() => {
      //         this.$message.error('网络异常')
      //       })
      //   }
      // }
      // 将 commonnPage 数据设在到 分页控件
    },
    // onBtnQueryClick() {
    //   console.log('before ')
    //   //
    //   this.queryLoading = true
    //   this.customerQuery.pageSize = 10
    //   this.customerQuery.pageNum = 1
    //   commonQuery(this.customerQuery).then(response => {
    //     // eslint-disable-next-line no-unused-vars
    //     const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息
    //
    //     this.commonPage.total = total
    //     this.commonPage.pageCount = pageNum
    //     this.commonPage.pageSize = pageSize
    //     this.customers = response.data// 分页信息带回显示
    //     this.queryLoading = false // 关闭查询
    //   }).catch(() => {
    //     this.queryLoading = false // 关闭查询
    //     this.$message.error('网络异常')
    //   })
    //   // 将 commonnPage 数据设在到 分页控件
    // },

    /**
     * @description: 点击action bar区 增加按钮弹出对话框
     * @param {*}
     * @return {*}
     */
    onBtnAddClick() {
      // get header from token  load organizations and companies
      try {
        this.customerVO = {} // 初始化
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
      // get header from token  load organizations and companies
      // 如果不是选择一条则提示消息并且返回
      const rows = this.$refs.multipleTable.selection
      if (rows.length === 0 || rows == null) {
        this.$message.error('选择一条进行拷贝')
        return
      } else if (rows != null && rows.length > 1) {
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
    async onBtnBatchDelete() {
      const customerVOS = this.$refs.multipleTable.selection
      if (customerVOS == null || customerVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }
      let deleteCustomerDTOS = []
      let deleteFlag = true
      for (let i = 0; i < customerVOS.length; i++) {
        await commonQueryDepartment({ parentId: customerVOS[i].id })
          .then((response) => {
            console.log('batchdelete中查询的结果')
            console.log(response)
            if (response.data.length === 0) {
              deleteCustomerDTOS.push({
                id: customerVOS[i].id,
                version: customerVOS[i].version
              })
              console.log('batchdelete中deleteCustomerDTOS')
              console.log(deleteCustomerDTOS)
            } else {
              this.$message.error(customerVOS[i].name + '部门存在子部门，无法删除')
              deleteFlag = false
            }
          })
          .catch(() => {
            this.$message.error('网络错误')
          })
      }
      if (deleteFlag === true) {
        console.log('进入了batchdelete删除部分')
        this.$confirm('确定删除记录吗')
          .then(() => {
            batchRemove(deleteCustomerDTOS)
              .then((response) => {
                if (response) {
                  this.$message.success('已选择的无子部门的部门已删除成功')
                  this.onBtnQueryClick()
                  this.getResourceTree()
                } else {
                  this.$message.error('删除部门失败')
                }
              })
          })
          .catch(() => {
            this.$message.error('已取消操作')
          })
      }
    },

    /**
     * @description: 点击 action bar 区域进行启用和停用控制操作
     * @param {*} status
     * @return {*}
     */
    onDisableRecodClick(status) {
      const departmentVOS = this.$refs.multipleTable.selection
      if (departmentVOS == null || departmentVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }

      const departmentDTOS = new Array(departmentVOS.length)
      for (let i = 0; i < departmentVOS.length; i++) {
        departmentDTOS[i] = {
          id: departmentVOS[i].id,
          status: status,
          version: departmentVOS[i].version
        }
      }
      // eslint-disable-next-line no-array-constructor
      batchUpdateDepartment(departmentDTOS)
        .then((response) => {
          if (response) {
            this.$message.success('操作成功')
            // 刷新数据
            this.onBtnQueryClick()
            this.getResourceTree()
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

    // /**
    //  * @description: 点击 action bar 区域进行启用和停用控制操作
    //  * @param {*} status
    //  * @return {*}
    //  */
    // onDisableRecodClick(status) {
    //
    //   const customerVOS = this.$refs.multipleTable.selection
    //   if (customerVOS == null || customerVOS.length === 0) {
    //     this.$message.error('至少选择一条进行操作')
    //     return
    //   }
    //
    //   const customerDTOS = new Array(customerVOS.length)
    //   for (let i = 0; i < customerVOS.length; i++) {
    //     customerDTOS[i] = { id: customerVOS[i].id, status: status }
    //   }
    //   // eslint-disable-next-line no-array-constructor
    //   batchUpdate(customerDTOS).then(response => {
    //     if (response) {
    //       this.$message.success('操作成功')
    //     } else {
    //       this.$message.error('没有找到对应记录更新失败')
    //     }
    //   }).catch(() => {
    //     this.$message.error('网络错误')
    //   })
    // },
    // onDropdownCommand(command) {
    //   console.log(command)
    //   switch (command) {
    //     case 'enable_command': {
    //       this.onDisableRecodClick(1)
    //       break
    //     }
    //     case 'disable_command': {
    //       this.onDisableRecodClick(0)
    //       break
    //     }
    //   }
    // },

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
      this.isRewriteEditor = false;
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
      this.$confirm('确定删除记录吗').then((result) => {
        // 获取多条ID 调用服务端
        console.log(row.id + ':' + row.version)
        if (row.level === 3 || row.level === '3') {
          remove(row.id, row.version)
            .then((response) => {
              if (response) {
                this.$message.success('操作成功')
                this.onBtnQueryClick()
                this.getResourceTree()
                this.$forceUpdate()
              } else {
                this.$message.error('操作失败')
              }
            })
            .catch(() => {
              this.$message.error('网络错误')
            })
        } else {
          commonQueryDepartment({ parentId: row.id })
            .then((response) => {
              if (response.total === '0') {
                remove(row.id, row.version)
                  .then((response) => {
                    if (response) {
                      this.$message.success('删除操作成功')
                      this.onBtnQueryClick()
                      this.getResourceTree()
                      this.$forceUpdate()
                    } else {
                      this.$message.error('删除操作失败')
                    }
                  })
                  .catch(() => {
                    this.$message.error('网络错误')
                  })
              } else {
                this.$message.error('部门存在子部门，无法删除')
              }
            })
        }
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
      this.customerVO = row
      const currentCustomerVO = row
      if (currentCustomerVO == null) {
        this.$message.info('没有对应记录可以编辑')
        return
      }
      queryDepartmentById(currentCustomerVO.id)
        .then((response) => {
          // 取得CommonResponse的Body

          if (response != null) {
            // eslint-disable-next-line no-undef

            this.customerVO = response
            this.handleDialogCompanyChange(this.customerVO.companyId)
          } else {
            this.$message.info('没有对应记录可以编辑')
          }
        })
        .catch(() => {
          this.$message.error('网络异常')
        })
      // 加载结算类型 设置settleType默认选择项目
      // if (this.customerVO.settleTypeDTO != null) {
      //   this.loadSettleType(this.customerVO.settleTypeDTO.id)
      // } else {
      //   this.loadSettleType('') // 没有数据则传入
      // }
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
          let currentCustomerVO = {
            code: response.code,
            id: '',
            companyId: response.companyId,
            master: response.master,
            mnemonicCode: response.mnemonicCode,
            parentId: response.parentId,
            name: response.name,
            level: response.level
          }
          // this.$forceUpdate()
          this.customerVO = currentCustomerVO
          this.handleDialogCompanyChange(this.customerVO.companyId)
          this.handleDialogParentDepartmentChange()
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
     * @description: 对话框的已选择隶属公司被更改时，调用此方法更新对话框中上级部门级联选择器的选项
     * 根据已选择隶属公司调用接口，将查询回的部门信息解析存入上级部门级联选择器的数据模型selectableDepartmentData
     * @param {*} val el-select控件下value: customerVO.companyId
     */
    handleDialogCompanyChange(val) {
      console.log('调用handleDialogCompanyChange，对话框公司选择器')
      console.log('入参val:' + val)
      console.log(val)
      console.log('customerVO.companyId是')
      console.log(this.customerVO.companyId)
      this.selectableDepartmentData = []
      let deptree = []
      treeQueryDepartment({ companyId: val, pageSize: 10000 })
        .then((res) => {
          const response = res.data
          // 存储【无上级部门】选项
          deptree.push({
            departmentId: -1,
            name: '无上级部门',
            level: 0,
            children: []
          })
          // 存储根节点/一级部门
          response.map((item) => {
            deptree.push({
              departmentId: item.id,
              name: item.name,
              level: item.level,
              children: []
            })
          })
          // 存储二级节点/二级部门
          deptree.map((itemParent) => {
            response.map((item) => {
              if (itemParent.departmentId === item.id) {
                item.departmentDTOS.map((item) => {
                  itemParent.children.push({
                    departmentId: item.id,
                    name: item.name,
                    level: item.level,
                    children: []
                  })
                })
              }
            })
          })
          // 存储三级节点/三级部门 但是一般只有三级部门故三级部门不作为父部门
          // deptree.map((itemFirstParent) => {
          //   itemFirstParent.children.map((itemSecondParent) => {
          //     response.map((item) => {
          //       item.departmentDTOS.map((item) => {
          //         if (itemSecondParent.departmentId === item.id) {
          //           item.departmentDTOS.map((item) => {
          //             itemSecondParent.children.push({
          //               departmentId: item.id,
          //               name: item.name,
          //               level: item.level,
          //               children: []
          //             })
          //           })
          //         }
          //       })
          //     })
          //   })
          // })
        })
        .catch((error) => {
          console.log(error)
        })
      this.selectableDepartmentData = deptree
      this.handleDialogParentDepartmentChange()
    },
    handleDialogParentDepartmentChange() {
      let parentId
      if (this.customerVO.parentId instanceof Array) {
        parentId = this.customerVO.parentId[this.customerVO.parentId.length - 1]
      } else {
        parentId = this.customerVO.parentId
      }
      this.selectableDepartmentData.map((levelOne) => {
        if (levelOne.departmentId === parentId) {
          this.customerVO.level = Number(levelOne.level) + 1
        }
        if (levelOne.children.length !== 0) {
          levelOne.children.map((levelTwo) => {
            if (levelTwo.departmentId === parentId) {
              this.customerVO.level = Number(levelTwo.level) + 1
            }
          })
        }
      })
      console.log('这是this.customerVO.level')
      console.log(this.customerVO.level)
      console.log('这是this.customerVO.parentId')
      console.log(this.customerVO.parentId)
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
      //this.$message.success('onBtnSaveClick 被回调了 ')
      const currentCustomerDTO = JSON.parse(JSON.stringify(this.customerVO))
      //currentCustomerDTO.companyId = this.customerVO.companyId
      if (currentCustomerDTO.parentId instanceof Array) {
        // el-cascader的选择值，是包含了选择路径所有节点值的一个数组
        let index = currentCustomerDTO.parentId.length - 1
        currentCustomerDTO.parentId = currentCustomerDTO.parentId[index]
        if (currentCustomerDTO.parentId === '1' || currentCustomerDTO.parentId === 1 ||
          currentCustomerDTO.parentId === '0' || currentCustomerDTO.parentId === 0) {
          currentCustomerDTO.parentId = '-1'
        }
      }
      // bug: parentId在按下编辑按钮之后操作任何控件直接保存提交会变成4

      console.log('onBtnSaveClick中，customerVO.parentId的值')
      console.log(this.customerVO.parentId)
      console.log('onBtnSaveClick中，customerVO的值')
      console.log(this.customerVO)
      console.log('onBtnSaveClick中，currentCustomerDTO的值')
      console.log(currentCustomerDTO)
      console.log('onBtnSaveClick中打印的，目前customerVO的值')
      console.log(this.customerVO)
      if (this.dialogType === 'ADD') {
        // const currentCustomerDTO = this.customerVO
        add(currentCustomerDTO)
          .then((response) => {
            // 显示保存成功并且返回
            this.$message.success('操作成功')
            // this.resetUIToInitStatus()
            this.dialogVisible = false
            this.onBtnQueryClick()
            this.getResourceTree()
            this.customerVO = {}
          })
          .catch(() => {
            this.dialogType = null
            this.customerVO = {}
            this.$message.error('网络异常')
          })
      } else if (this.dialogType === 'EDIT') {
        // this.customerDTO = this.customerVO
        modify(currentCustomerDTO)
          .then((response) => {
            // 显示保存成功并且返回
            this.$message.success('操作成功')
            this.dialogVisible = false
            // 查询刷新当前增加数据为第一条
            this.onBtnQueryClick()
            this.getResourceTree()
            this.customerVO = {}
          })
          .catch(() => {
            this.dialogType = null
            this.customerVO = {}
            this.$message.error('网络异常')
          })
      } else if (this.dialogType === 'COPY') {
        if (this.isRewriteEditor){
          if (this.validateInsertEntry(currentCustomerDTO) === false) {
               return
           }
      
        // const currentCustomerDTO = this.customerVO
        // console.log('复制的currentCustomerDTO')
        // console.log(currentCustomerDTO)
        add(currentCustomerDTO)
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
            this.customerVO = {}
            // 查询刷新当前增加数据为第一条
            this.onBtnQueryClick()
            this.getResourceTree()
          })
          .catch(() => {
            this.dialogType = null
            this.customerVO = {}
            this.$message.error('职位名称/助记码/部门编号重复！！')
          })
      }else{
        this.$message.warning("请修改职位名称、助记码、部门编号后再提交")
      }
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
      this.customerVO = {}
    },
    hideMenu() {
      this.hidemenuflag = !this.hidemenuflag
    },
    getResourceTree() {
      const resourceQuery = {}
      resourceQuery.pageSize = 1000
      commonQuery().then((response) => {
        this.selectableCompanyData = []
        response.data.map((item) => {
          this.selectableCompanyData.push({
            companyId: item.id,
            name: item.name
          })
        })
        this.departmentData = this.treetransform(response.data)
        this.$forceUpdate()
        console.log('getResourceTree')
        console.log(this.selectableCompanyData, '公司数据')
        console.log(this.departmentData, '部门数据')
      })
    },
    queryTreeDepartment(currentPage, pageNum) {
      this.queryLoading = true
      this.departmentQuery.pageSize = currentPage
      this.departmentQuery.pageNum = pageNum
      console.log(this.departmentQuery)
      // debugger
      commonQueryDepartment(this.departmentQuery)
        .then((response) => {
          const { total, pageNum, pageSize } = response // 如果异常则被axios 的拦截器拦截并且显示错误码和消息
          this.commonPage.total = parseInt(total)
          this.commonPage.pageCount = parseInt(pageNum)
          this.commonPage.pageSize = currentPage
          this.departments = response.data // 分页信息带回显示
          this.departments.map((dep) => {
            if (dep.parentId === -1 || dep.parentId === '-1') {
              Vue.set(dep, 'parentDepartmentVO', {
                name: '无上级部门',
                id: -1
              })
            } else {
              queryDepartmentById(dep.parentId)
                .then((response) => {
                  Vue.set(dep, 'parentDepartmentVO', response)
                })
                .catch(() => {
                  this.$message.error('网络异常')
                })
            }
          })
          this.queryLoading = false // 关闭查询
          // debugger
        })
        .catch(() => {
          this.queryLoading = false // 关闭查询
          this.$message.error('网络异常')
        })
    },
    treetransform(list) {
      // var map = {}; var node; var tree = []; var i
      var tree = []
      // var firstNode = []
      // var secondNode = []
      // 存储一级节点（系统）
      list.map((item) => {
        tree.push({ label: item.name, companyId: item.id, departmentId: -1, level: 0, children: [] })
      })
      // 存储二级节点（主菜单）
      treeQueryDepartment({ pageSize: 10000 })
        .then((res) => {
          const response = res.data
          response.map((itemParent) => {
            tree.map((item) => {
              if (itemParent.companyId === item.companyId) {
                item.children.push({
                  departmentId: itemParent.id,
                  companyId: itemParent.companyId,
                  label: itemParent.name,
                  level: itemParent.level,
                  children: []
                })
              }
            })
          })
          // 存储三级节点（子菜单）
          tree.map((itemParent) => {
            itemParent.children.map((itemSecondParent) => {
              response.map((item) => {
                item.departmentDTOS.map((item) => {
                  if (itemSecondParent.departmentId === item.parentId) {
                    itemSecondParent.children.push({
                      departmentId: item.id,
                      label: item.name,
                      companyId: item.companyId,
                      level: item.level,
                      children: []
                    })
                  }
                })
              })
            })
          })
          // 存储四级节点（请求权限）
          tree.map((itemParent) => {
            itemParent.children.map((itemSecondParent) => {
              itemSecondParent.children.map((itemthirdParent) => {
                response.map((item) => {
                  item.departmentDTOS.map((item) => {
                    item.departmentDTOS.map((item) => {
                      if (itemthirdParent.departmentId === item.parentId) {
                        itemthirdParent.children.push({
                          departmentId: item.id,
                          label: item.name,
                          companyId: item.companyId,
                          level: item.level
                        })
                      }
                    })
                  })
                })
              })
            })
          })
        })
        .catch((error) => {
          console.log(error)
        })
      return tree
    },
    handleNodeClick(data, node) {
      console.log(data, '666666666666')
      this.refreshDepartmentQueryModel('tree')
      if (data.companyId != null) {
        if (data.level === 0) {
          this.departmentQuery.companyId = data.companyId
          this.departmentQuery.id = ''
          this.departmentQuery.code = ''
          this.departmentQuery.parentId = -1
          this.departmentQuery.level = Number(data.level) + 1
          console.log(this.departmentQuery)
          this.queryTreeDepartment(this.commonPage.pageSize, 1)
          this.currentPage = 1
          // debugger
        } else {
          this.departmentQuery.companyId = data.companyId
          this.departmentQuery.id = ''
          this.departmentQuery.code = ''
          this.departmentQuery.parentId = data.departmentId
          this.departmentQuery.level = Number(data.level) + 1
          console.log(this.departmentQuery)
          this.queryTreeDepartment(this.commonPage.pageSize, 1)
          this.currentPage = 1
        }
      }
    },
    /**
     * 左侧树、查询区、展示区共用一个查询数据模型，在每次查询操作前清除其它区域操作留下的值，所以如果存有值会互相干扰
     * @author lxr
     * @param queryFrom 代表调用函数的操作来源/类型的字符串
     */
    refreshDepartmentQueryModel(queryFrom) {
      console.log(this.departmentQuery, queryFrom, '刷新前')
      if (queryFrom === 'tree') {
        // this.departmentQuery.companyId = ''
        // this.departmentQuery.id = ''
        this.departmentQuery.name = ''
        this.departmentQuery.mnemonicCode = ''
        // this.departmentQuery.code = ''
        // this.departmentQuery.parentId = ''
        // this.departmentQuery.level = ''
        console.log('tree查询前')
      } else if (queryFrom === 'panel') {
        this.departmentQuery.companyId = ''
        this.departmentQuery.id = ''
        // this.departmentQuery.name = ''
        // this.departmentQuery.mnemonicCode = ''
        this.departmentQuery.code = ''
        this.departmentQuery.parentId = ''
        this.departmentQuery.level = ''
        console.log('panel查询前')
      } else if (queryFrom === 'table') {
        console.log('table查询前')
      }
      console.log(this.departmentQuery, queryFrom, '刷新后')
    },
    validateInsertEntry(currentCustomerDTO) {
      let valid = true
      commonQueryDepartment({
        name: currentCustomerDTO.name,
        mnemonicCode: currentCustomerDTO.mnemonicCode,
        orgId: currentCustomerDTO.orgId,
        companyId: currentCustomerDTO.companyId
      })
        .then((response) => {
          if (response.data.length !== 0) {
            this.$message.error('同公司下已有该名称/助记码部门，请修改后再提交！')
            valid = false
          }
        })
        .catch(() => {
          this.$message.error('网络异常')
          valid = false
        })
      return valid
    }
  }
}
</script>
<style scoped>
.queryClass {
  margin-left: -54px;
  margin-top: 10px;
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-cascader-panel {
  height: 250px;
}
</style>
