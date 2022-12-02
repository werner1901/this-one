<!--
 * @Author: your name
 * @Date: 2020-12-13 00:02:31
 * @LastEditTime: 2022-03-22 23:10:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \sd365-permission-centre-front-end\src\views\organization\index.vue
-->
<template>
  <el-container>
    <el-header>
      <!--引入查询面板组件该组件封装基本的查询控制逻辑-->
      <sd-QueryPanel :query-model="organizationQuery" @QueryButtonClick="onBtnQueryClick">
        <!--这里在组件是slot 由用户自定义查询条件-->
        <el-form-item style="margin-left:-50px" label="组织机构">
          <el-input v-model="organizationQuery.name" style="width:150px" />
        </el-form-item>
      </sd-QueryPanel>

      <el-row>
        <el-button type="primary" icon="el-icon-plus" @click="onBtnAddClick">增加</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="onBtnBatchDelete">删除</el-button>
        <el-dropdown split-button type="primary" style="margin-left:5px;margin-right:5px;margin-bottom:5px" @command="onDropdownCommand">
          启停控制
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="enable_command">启用</el-dropdown-item>
            <el-dropdown-item command="disable_command">停用</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>

    </el-header>
    <el-main style="line-height:0px">
      <!--data show area  -->
      <el-table
        id="organizationTable"
        ref="multipleTable"
        v-loading="queryLoading"
        :data="organizations"
        element-loading-text="Loading"
        fit
        highlight-current-row
        border
        style="margin-top:50px"
        :height="tableHeight"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowDoubleClick"
        @select="onRowSelected"
      >
        <el-table-column align="center" width="40" type="selection" />
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column sortable align="center" prop="name" label="组织机构" />
        <el-table-column align="center" prop="code" label="组织代码" />
        <el-table-column align="center" prop="master" label="负责人" />
        <el-table-column align="center" prop="tel" label="电话" :formatter="sexFormat" />
        <el-table-column align="center" prop="address" label="地址" />
        <el-table-column sortable align="center" prop="status" label="启用">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === 1 ? 'success' : 'danger'"
              disable-transitions
            >
              {{ statusFormat(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        <!--操作区-->
        <el-table-column v-if="!exportStatus" align="center" prop="operation" label="操作" width="300">
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
        :v-model="commonPage"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :total="commonPage.total"
        :current-page.sync="commonPage.currentPage"
        :page-size="commonPage.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <sd-FormDialog
        v-dialogDrag
        :caption="dialogCaption"
        :visible="dialogVisible"
        width="50%"
        :model="organizationVO"
        :rules="rules"
        @OkButtonClick="onBtnSaveClick"
        @CancelButtonClick="onBtnCancelClick"
      >
        <el-row>
          <el-form-item label="机构名称" prop="name">
            <el-input v-model="organizationVO.name" placeholder=""  @input="handlerChange" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="机构代码" prop="code">
            <el-input v-model="organizationVO.code" @input="handlerChange"/>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="负责人" prop="master">
            <el-input v-model="organizationVO.master" placeholder="" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="电话" prop="tel">
            <el-input v-model="organizationVO.tel" placeholder="" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="地址" prop="address">
            <el-input v-model="organizationVO.address" placeholder="" />
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
import { add, remove, modify, commonQuery, queryorganizationById, batchUpdate, batchRemove } from '@/api/org/organization'
// eslint-disable-next-line no-unused-vars
import { QueryPanel, FormDialog } from '@/components/SD365UI'

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
       * 导出状态false时表格有操作列，true时表格没有操作列
       */
      exportStatus: false,
      /**
             * 查询区模型
             */
      organizationQuery: { name: '', tel: '' }, // 查询对象
      /**
             * 展示区模型
             */
      organizations: [], // 从vo取得的客户信息
      // eslint-disable-next-line no-new-object
      organizationVO: { }, // 显示查询回来的对象
      commonPage: { total: 10, pageCount: 1, pageSize: 10, currentPage: 1, pages: 1 }, // 分页数据对象
      /**
       * table高度
       */
      tableHeight: 600,
      /**
      * 对话框 模型
      */
      dialogCaption: '组织机构基本信息',
      // eslint-disable-next-line no-undef
      dialogType: 'EDIT', // 标记对话框处于那种状态 或者 ADD
      // eslint-disable-next-line no-undef
      // organizations: [], // for 机构
      // companies: [], // for 公司
      settleTypeVOS: [], // for 结算类型
      selectValue: '', // 显示用户的选择 以及后台的返回的默认值
      organizationDTO: {}, // 增加和修改对象
      isRewriteEditor: false, // 复制时的对话框关键字段是否编辑过
      rules: { // 定义当前页面的非空规则这点参考表结构的字段comment规则要求
        name: [
          { required: true, message: '请输入机构名', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入机构代码', trigger: 'blur' }
        ]

      }
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
      queryorganizationById(row.id).then(response => {
        // 取得CommonResponse的Body
        if (response != null) {
          // eslint-disable-next-line no-undef
          this.organizationVO = response
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
    runCommonQuery() {
      this.queryLoading = true
      this.organizationQuery.pageSize = this.commonPage.pageSize
      this.organizationQuery.pageNum = this.commonPage.currentPage
      commonQuery(this.organizationQuery).then(response => {
        // eslint-disable-next-line no-unused-vars
        this.commonPage.total = parseInt(response.total)
        this.commonPage.pages = parseInt(response.pages)
        this.organizations = response.data// 分页信息带回显示
        this.queryLoading = false // 关闭查询
      }).catch(() => {
        this.queryLoading = false // 关闭查询
        this.$message.error('网络异常')
      })
      // 将 commonnPage 数据设在到 分页控件
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
      this.runCommonQuery()
    },

    /**
     * @description: 点击action bar区 增加按钮弹出对话框
     * @param {*}
     * @return {*}
     */
    onBtnAddClick() {
      // get header from token  load organizations and companies
      try {
        this.organizationVO = {}// 初始化
        /**
         * 初始化性别为男
         */
        this.organizationVO.sex = 1
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
      if (rows == null || rows.length === 0) {
        this.$message.error('选择一条进行拷贝')
        return
      }
      if ((rows != null && rows.length > 1)) {
        this.$message.error('只能选择一条进行拷贝')
        return
      } else {
        this.showorganization(rows[0])
      }
    },

    /**
     * @description: 点击action bar区进行批量删除操作
     * @param {*}
     * @return {*}
     */
    onBtnBatchDelete() {
      const organizationVOS = this.$refs.multipleTable.selection
      if (organizationVOS == null || organizationVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }
      const deleteorganizationDTOS = new Array(organizationVOS.length)
      for (let i = 0; i < organizationVOS.length; i++) {
        deleteorganizationDTOS[i] = ({ 'id': organizationVOS[i].id, 'version': organizationVOS[i].version })
      }
      this.$confirm('确定删除记录吗').then(result => {
        batchRemove(deleteorganizationDTOS).then(response => {
          if (response) {
            if (this.commonPage.pages === this.commonPage.currentPage &&
            deleteorganizationDTOS.length === this.organizations.length) {
              this.commonPage.currentPage -= 1
            }
            this.runCommonQuery()
            this.$message.success('删除数据成功')
          }
        }).catch(() => {
          this.$message.error('网络错误')
        })
      })
    },

    // size-change	pageSize 改变时会触发	每页条数size
    // current-change	currentPage 改变时会触发	当前页currentPage
    handleSizeChange: function(size) {
      this.commonPage.pageSize = size
      this.runCommonQuery()
    },
    handleCurrentChange: function(currentPage) {
      this.runCommonQuery()
    },
    /**
     * @description: 点击 action bar 区域进行启用和停用控制操作
     * @param {*} status
     * @return {*}
     */
    onDisableRecodClick(status) {
      const organizationVOS = this.$refs.multipleTable.selection
      if (organizationVOS == null || organizationVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }

      const organizationDTOS = new Array(organizationVOS.length)
      for (let i = 0; i < organizationVOS.length; i++) {
        organizationDTOS[i] = { id: organizationVOS[i].id, status: status, version: organizationVOS[i].version }
      }
      // eslint-disable-next-line no-array-constructor
      batchUpdate(organizationDTOS).then(response => {
        if (response) {
          this.$message.success('操作成功')
          this.runCommonQuery()
        } else {
          this.$message.error('没有找到对应记录更新失败')
        }
      }).catch(() => {
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
      this.isRewriteEditor = false;
      if (row != null) {
        this.showorganization(row)
      }
    },
    /**
     * @description: 点击行的操作区域删除当前行的记录
     * @param {*}
     * @return {*}
     */
    onBtnDeleteClick(index, row) {
      const currentorganizationVO = this.organizations[index]
      if (currentorganizationVO == null) {
        this.$message.info('没有对应记录可以删除')
        return
      }
      this.$confirm('确定删除记录吗').then(result => {
        remove(currentorganizationVO.id, currentorganizationVO.version).then(response => {
          this.commonResponse = response
          if (this.commonResponse) {
            if (this.commonPage.pages === this.commonPage.currentPage &&
            this.organizations.length === 1) {
              this.commonPage.currentPage -= 1
            }
            this.runCommonQuery()
            this.$message.success('操作成功')
          } else {
            this.$message.error('操作失败')
          }
        }).catch(() => {
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

      const currentorganizationVO = this.organizations[index]
      if (currentorganizationVO == null) {
        this.$message.info('没有对应记录可以编辑')
        return
      }
      queryorganizationById(currentorganizationVO.id).then(response => {
        // 取得CommonResponse的Body

        if (response != null) {
          // eslint-disable-next-line no-undef

          this.organizationVO = response
          // eslint-disable-next-line no-undef
        } else {
          this.$message.info('没有对应记录可以编辑')
        }
      }).catch(() => {
        this.$message.error('网络异常')
        return
      })

      this.dialogType = 'EDIT'
      // eslint-disable-next-line no-undef
      this.dialogVisible = true
    },

    /**
     * @description: 编辑和修改前从后端查询客户信息的公用客户方法
     * @param {*} organizationVO
     * @return {*}
     */
    showorganization(organizationVO) {
      this.copyLaoding = true
      // this.loadOrganizations()
      // this.loadCompanies()
      // 调用 api 插入记录并且返回记录
      const selectedorganization = organizationVO
      queryorganizationById(selectedorganization.id).then(response => {
        // eslint-disable-next-line no-undef
        // 加载下拉框数据 设置下拉框的选项

        this.organizationVO = response
        this.dialogType = 'COPY'
        this.dialogVisible = true
        this.copyLaoding = false
        // 如果修改对话框将更新数据到数据库
      }).catch(() => {
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
        const currentorganizationDTO = this.organizationVO
        add(currentorganizationDTO).then(response => {
          this.onBtnQueryClick()
          // 显示保存成功并且返回
          this.$message.success('操作成功')
        }).catch(() => {
          this.dialogType = null
          this.organizationVO = null
          this.$message.error('网络异常')
        })
      } else if (this.dialogType === 'EDIT') {
        this.organizationDTO = this.organizationVO
        modify(this.organizationDTO).then(response => {
          // 显示保存成功并且返回
          this.onBtnQueryClick()
          if (response.body === 'false') {
            this.$message.success('操作失败')
          } else {
            this.$message.success('操作成功')
          }
          // 查询刷新当前增加数据为第一条
          this.onBtnQueryClick()
        }).catch(() => {
          this.dialogType = null
          this.organizationVO = null
          this.$message.error('网络异常')
        })
      } else if (this.dialogType === 'COPY') {
        if (this.isRewriteEditor) {
          const currentorganizationDTO = this.organizationVO
          add(currentorganizationDTO).then(response => {
            // 显示保存成功并且返回
            if (response) {
              this.onBtnQueryClick()
              this.$message.success('操作成功')
            } else {
              this.$message.success('操作失败')
            }
          }).catch(() => {
            this.dialogType = null
            this.organizationVO = null
            this.$message.error('机构名称/机构代码重复')
          })
        }else{
          this.$message.warning("请修改机构名称和机构代码后再提交")
        }
      }
        
      
    },
        handlerChange(e) {
      this.isRewriteEditor = true;
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
    }

  }
}
</script>
