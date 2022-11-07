<template>
  <el-container>
    <el-header>
      <!--引入查询面板组件该组件封装基本的查询控制逻辑-->
      <sd-QueryPanel
        style="margin-top: 10px; margin-left: -25px"
        :query-model="dictionaryQuery"
        @QueryButtonClick="onBtnQueryClick"
      >
        <!--这里在组件是slot 由用户自定义查询条件-->
        <el-form-item label="字典类型" label-width="90px">
          <el-select
            v-model="dictionaryQuery.dictionaryTypeId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dictionaryTypeVOS"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="字典名字" label-width="90px">
          <el-input
            v-model="dictionaryQuery.name"
            placeholder="请输入字典名"
            style="width: 200px"
          />
        </el-form-item>
      </sd-QueryPanel>
    </el-header>
    <el-main>
      <!--action bar area-->
      <div style="margin-bottom: 0px">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="medium"
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
            <el-dropdown-item command="enable_command">启用</el-dropdown-item>
            <el-dropdown-item command="disable_command">停用</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!--data show area  -->
      <el-table
        ref="multipleTable"
        v-loading="queryLoading"
        :data="dictionarys"
        element-loading-text="Loading"
        fit
        highlight-current-row
        border
        class="mytable-position"
        :row-style="iRowStyle"
        :cell-style="iCellStyle"
        :header-row-style="iHeaderRowStyle"
        :header-cell-style="iHeaderCellStyle"
        empty-text="暂无数据"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowDoubleClick"
        @select="onRowSelected"
      >
        <el-table-column fixed align="center" width="60" type="selection" />
        <el-table-column align="center" label="序号" width="100">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="dictionaryTypeDTO.name"
          label="字典类型"
        />
        <el-table-column align="center" prop="name" label="字典名" />
        <!-- <el-table-column
          sortable
          align="center"
          prop="tenantName"
          label="租户"
        /> -->
        <!-- <el-table-column
          sortable
          align="center"
          prop="organizationDTO.name"
          label="机构"
        /> -->
        <!-- <el-table-column align="center" prop="companyDTO.name" label="公司" /> -->
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
            <el-tag v-else type="danger">停用</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="modifier" label="修改人" />
        <el-table-column align="center" prop="updatedTime" label="修改时间">
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
                size="mini"
                type="primary"
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
        :current-page="commonPage.pageNum"
        :page-size="commonPage.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="commonPage.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <sd-FormDialog
        :caption="dialogCaption"
        :visible="dialogVisible"
        width="50%"
        :model="dictionaryVO"
        :rules="rules"
        @CancelButtonClick="onBtnCancelClick"
        @OkButtonClick="onBtnSaveClick"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="字典类型">
              <el-select v-model="selectValue" placeholder="请选择">
                <el-option
                  v-for="item in dictionaryTypeVOS"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="字典名" prop="name">
              <el-input
                v-model="dictionaryVO.name"
                placeholder="请输入字典名"
                style="width: 220px"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input
                v-model="dictionaryVO.remark"
                placeholder="请输入备注信息"
                style="width: 220px"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="修改人">

              <el-input
                v-model="dictionaryVO.modifier"
                placeholder="请输入修改人"
                style="width: 220px"
              />
            </el-form-item>
          </el-col> -->
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
body {
  height: 100%;
}
</style>
<script>
import {
  add,
  remove,
  modify,
  commonQuery,
  queryDictionaryById,
  batchUpdate,
  batchRemove
} from '@/api/basedata/dictionary'
import { list } from '@/api/basedata/dictionary-type'
import { generateDatabaseTime } from '@/utils'
import dialogDrag from '../../../utils/dialogdrap'
import { data } from 'autoprefixer'
import '@/style/global.css'
export default {
  // inject: ['reload'],

  data() {
    return {
      queryLoading: false, // 查询进度条控制
      updateLoading: false, // 修改进度条控制
      copyLaoding: false, // 拷贝一条数据的进度控制
      multipleSelection: [],
      dialogVisible: false,
      /**
       * 查询区模型
       */
      dictionaryQuery: { dictionaryTypeId: '', name: '' }, //
      dictionarytypeQuery: { name: '' },
      defaultPageSize: 10,
      /**
       * 展示区模型
       */
      dictionarys: [], // 从vo取得的客户信息
      dictionary: [], // 单个字典对象
      // eslint-disable-next-line no-new-object
      dictionaryVO: { dictionaryTypeDTO: { id: '' }}, // 显示查询回来的对象
      // dictionaryTwoVO: {}, // 显示查询回来的对象,用于增加功能
      commonPage: { total: 10, pageCount: 1, pageSize: 10 }, // 分页数据对象
      pageIndex: 1,
      /**
       * 对话框 模型
       */
      dialogCaption: '字典信息',
      // eslint-disable-next-line no-undef
      dialogType: 'EDIT', // 标记对话框处于那种状态 或者 ADD
      dictionaryTypeVOS: [], // for 字典类型
      dictionaryTypes: [],
      selectValue: '', // 显示用户的选择 以及后台的返回的默认值
      dictionaryDTO: {}, // 增加和修改对象
      currentPage: '1', // 初始分页为第一页
      rules: {
        // 定义当前页面的非空规则这点参考表结构的字段comment规则要求
        name: [{ required: true, message: '请输入字典名' }]
      }
    }
  },
  mounted() {
    // console.log('mounted..')
    this.initData()
  },
  methods: {
    generateDatabaseTime: generateDatabaseTime,
    iRowStyle: function({ row, rowIndex }) {
      return 'height:25px'
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
    /**           jf
     *@description: 初始化界面需要使用的基本的模型的数据 包括发起远程查询获取下拉列表的数据
     *  为了避免方法定义过于混乱所以对方法定义顺序约定如下
     *  1 数据加载方法
     *  2 界面逻辑
     *  3 业务方法
     *@author: 朱水龙
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
      this.loadDictionaryTypeData()
      this.onBtnQueryClick()
    },

    /**
     * 加载字典类型表中所有的数据
     */
    loadDictionaryTypeData() {
      list(this.dictionarytypeQuery)
        .then((response) => {
          this.dictionaryTypeVOS = response.data

          console.log(this.dictionaryTypeVOS)
          console.log(typeof response.data)
        })
        .catch(() => {
          this.$message.error('网络异常')
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
      queryDictionaryById(row.id).then((response) => {
        // 取得CommonResponse的Body
        if (response != null) {
          // eslint-disable-next-line no-undef
          this.dictionaryVO = response
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
     * 业务方法区  按查询区  操作区  展示区  分别组织代码
     */

    /**
     * @description: 查询1操作
     * @param {*}
     * @return {*}
     */
    onBtnQueryClick() {
      this.queryDictionary(10, 1)
    },
    queryDictionary(pageSize, pageNum) {
      this.queryLoading = true
      this.dictionaryQuery.pageSize = pageSize
      this.dictionaryQuery.pageNum = pageNum

      commonQuery(this.dictionaryQuery)
        .then((response) => {
          // eslint-disable-next-line no-unused-vars
          const { total, pageNum, pageSize } = response // 如果异常则被axios 的拦截器拦截并且显示错误码和消息

          this.commonPage.total = parseInt(total)
          this.commonPage.pageNum = parseInt(pageNum)
          this.dictionarys = response.data // 分页信息带回显示
          this.queryLoading = false // 关闭查询
        })
        .catch(() => {
          this.queryLoading = false // 关闭查询
          this.$message.error('网络异常')
        })
    },

    /**
     * @description: 查询2操作
     * @param {*}
     * @return {*}
     */
    queryDictionary2(pageSize, pageNum) {
      this.queryLoading = true
      // this.dictionaryQuery.pageSize = pageSize
      this.dictionaryQuery.pageNum = pageNum

      commonQuery(this.dictionaryQuery)
        .then((response) => {
          // eslint-disable-next-line no-unused-vars
          const { total, pageNum, pageSize } = response // 如果异常则被axios 的拦截器拦截并且显示错误码和消息

          this.commonPage.total = parseInt(total)
          this.commonPage.pageNum = parseInt(pageNum)
          this.dictionarys = response.data // 分页信息带回显示

          this.queryLoading = false // 关闭查询
        })
        .catch(() => {
          this.queryLoading = false // 关闭查询
          this.$message.error('网络异常')
        })
    },

    /**
     * @description: 点击action bar区 增加按钮弹出对话框
     * @param {*}
     * @return {*}
     */
    onBtnAddClick() {
      // get header from token  load organizations and companies
      this.copyLaoding = true
      try {
        this.dictionaryVO = {} // 初始化
        // this.loadDictionaryType('')

        this.dialogVisible = true
        this.dialogType = 'ADD'
        this.copyLaoding = false
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
        console.log('请选择一条进行拷贝')
        this.$message.error('请选择一条进行拷贝')
        return
      }
      if (rows != null && rows.length > 1) {
        this.$message.error('只能选择一条进行拷贝')
        return
      } else {
        this.showDictionary(rows[0])
      }
    },

    /**
     * @description: 点击action bar区进行批量删除操作
     * @param {*}
     * @return {*}
     */
    onBtnBatchDelete() {
      const dictionaryVOS = this.$refs.multipleTable.selection
      if (dictionaryVOS == null || dictionaryVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }

      this.$confirm('是否删除？').then((res) => {
        if (res === 'confirm') {
          const deleteDictionaryDTOS = new Array(dictionaryVOS.length)
          for (let i = 0; i < dictionaryVOS.length; i++) {
            deleteDictionaryDTOS[i] = {
              id: dictionaryVOS[i].id,
              version: dictionaryVOS[i].version
            }
          }
          batchRemove(deleteDictionaryDTOS)
            .then((response) => {
              if (response) {
                this.$message.success('删除数据成功')
                // 刷新为最新的数据
                this.onBtnQueryClick()
              }
            })
            .catch(() => {
              this.$message.error('网络错误')
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
      const dictionaryVOS = this.$refs.multipleTable.selection
      if (dictionaryVOS == null || dictionaryVOS.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }

      const dictionaryDTOS = new Array(dictionaryVOS.length)
      for (let i = 0; i < dictionaryVOS.length; i++) {
        dictionaryDTOS[i] = {
          id: dictionaryVOS[i].id,
          status: status,
          updatedTime: new Date(),
          version: dictionaryVOS[i].version
        }
      }
      // eslint-disable-next-line no-array-constructor
      batchUpdate(dictionaryDTOS)
        .then((response) => {
          if (response) {
            this.$message.success('操作成功')
          } else {
            this.$message.error('没有找到对应记录更新失败')
          }
          // 查询刷新为最新数据
          this.onBtnQueryClick()
        })
        .catch(() => {
          this.$message.error('网络错误')
          // 查询刷新为原始数据
          this.onBtnQueryClick()
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
        this.showDictionary(row)
      }
    },
    /**
     * @description: 点击行的操作区域删除当前行的记录
     * @param {*}
     * @return {*}
     */
    onBtnDeleteClick(index, row) {
      if (row == null) {
        this.$message.info('没有对应记录可以删除')
        return
      }

      this.$confirm('确定删除记录吗').then((result) => {
        // 获取多条ID 调用服务端

        console.log(row.id)
        remove(row.id, row.version)
          .then((response) => {
            this.commonResponse = response
            if (this.commonResponse) {
              this.$message.success('操作成功')
              // 刷新为最新的数据
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
      // debugger

      const currentDictionaryVO = this.dictionarys[index]
      this.dictionaryVO = currentDictionaryVO // 初始化
      this.selectValue = currentDictionaryVO.dictionaryTypeDTO.name // 初始化selectValue
      this.selectValue = currentDictionaryVO.dictionaryTypeDTO.id // selectValue返回给后端的id

      if (currentDictionaryVO == null) {
        this.$message.info('没有对应记录可以编辑')
        return
      }
      this.copyLaoding = true
      this.dialogVisible = true
      this.dialogType = 'EDIT'
      // eslint-disable-next-line no-undef
      // this.dialogVisible = false
      // this.copyLaoding = false
    },

    /**
     * @description: 复制展示对话框
     * @param {*} dictionaryVO
     * @return {*}
     */
    showDictionary(dictionaryVO) {
      this.dictionaryVO = dictionaryVO // 初始化
      this.selectValue = dictionaryVO.dictionaryTypeDTO.name // 初始化selectValue
      this.selectValue = dictionaryVO.dictionaryTypeDTO.id // selectValue返回给后端的id
      this.dialogType = 'COPY'
      // this.dialogVisible = false
      // this.copyLaoding = false
      this.copyLaoding = true
      this.dialogVisible = true
    },
    /**
     * ******************************************
     *  以下开始分页的逻辑定义
     * *******************************************8
     */
    handleSizeChange(val) {
      this.queryDictionary(val, this.commonPage.pageNum)
    },
    handleCurrentChange(val) {
      this.queryDictionary2(this.commonPage.pageSize, val)
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
        const currentdictionaryDTO = this.dictionaryVO
        // const currentdictionaryTypeName = ''
        console.log(this.selectValue)

        currentdictionaryDTO.dictionaryTypeDTO = { id: this.selectValue }

        console.log(currentdictionaryDTO)
        add(currentdictionaryDTO)
          .then((response) => {
            this.commonResponse = response
            if (this.commonResponse) {
              this.$message.success('增加成功')
              // 查询刷新当前增加数据为第一条
              this.onBtnQueryClick()
            } else {
              this.$message.error('增加失败,不能插入重复的字典名!')
              // 查询刷新为原始数据
              this.onBtnQueryClick()
            }
            this.dialogVisible = false
          })
          .catch(() => {
            this.dialogType = null
            this.dictionaryVO = null
            this.$message.error('网络异常')
          })
      } else if (this.dialogType === 'EDIT') {
        const currentdictionaryDTO = {}
        currentdictionaryDTO.id = this.dictionaryVO.id
        currentdictionaryDTO.dictionaryTypeId = this.selectValue
        currentdictionaryDTO.name = this.dictionaryVO.name
        currentdictionaryDTO.remark = this.dictionaryVO.remark
        currentdictionaryDTO.modifier = this.dictionaryVO.modifier
        currentdictionaryDTO.version = this.dictionaryVO.version
        currentdictionaryDTO.updatedTime = null
        currentdictionaryDTO.createdTime = null
        modify(currentdictionaryDTO)
          .then((response) => {
            this.commonResponse = response
            if (this.commonResponse) {
              this.$message.success('修改成功')
              // 查询刷新当前增加数据为第一条
              this.onBtnQueryClick()
            } else {
              this.$message.error('修改失败,不能修改为重复的字典名!')
              // 查询刷新为原始数据
              this.onBtnQueryClick()
            }
            this.dialogVisible = false
          })
          .catch(() => {
            this.dialogType = null
            this.dictionaryVO = null
            this.$message.error('网络异常')
          })
      } else if (this.dialogType === 'COPY') {
        const currentdictionaryDTO = this.dictionaryVO
        currentdictionaryDTO.dictionaryTypeDTO = { id: this.selectValue }
        console.log(currentdictionaryDTO)
        add(currentdictionaryDTO)
          .then((response) => {
            this.commonResponse = response
            if (this.commonResponse) {
              this.$message.success('复制成功')
              // 查询刷新当前增加数据为第一条
              this.onBtnQueryClick()
            } else {
              this.$message.error('复制失败,不能复制重复的字典名!')
              // 查询刷新为原始数据
              this.onBtnQueryClick()
            }
            this.dialogVisible = false
          })
          .catch(() => {
            this.dialogType = null
            this.dictionaryVO = null
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
      // 需要则这里实现
      this.dialogType = null
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
// .el-button-group{
//   margin:0px;
//   height:120px;
// }
</style>
