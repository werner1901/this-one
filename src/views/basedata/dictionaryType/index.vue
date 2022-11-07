<template>
  <el-container>
    <!-- 顶部查询 -->
    <el-header height="60px">
      <sd-QueryPanel
        :query-model="dataForm"
        label-width="40px"
        style="margin-top:10rpx"
        @QueryButtonClick="getDataList"
      >
        <el-form-item label="名称">
          <el-input v-model="dataForm.name" style="width:200px" placeholder="类型名称" />
        </el-form-item>
      </sd-QueryPanel>
      <el-row>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button
          type="danger"
          :disabled="dataListSelections.length <= 0"
          @click="deleteHandle()"
        >删除</el-button>
      </el-row>
    </el-header>

    <el-main style="margin-top: 30px">
      <!--  -->
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        style="width: 100%;margin: 10px 0"
        border
        fix
        :row-style="iRowStyle"
        :cell-style="iCellStyle"
        :header-row-style="iHeaderRowStyle"
        :header-cell-style="iHeaderCellStyle"
        @selection-change="selectionChangeHandle"
        @row-dblclick="addOrUpdateHandle"
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
          prop="name"
          header-align="center"
          align="center"
          label="名称"
          min-width="140"
        />
        <el-table-column
          prop="remark"
          header-align="center"
          align="center"
          label="备注"
          min-width="200"
        />
        <el-table-column
          prop="status"
          header-align="center"
          align="center"
          label="状态"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="danger">停用</el-tag>
            <el-tag v-else type="success">启用</el-tag>
          </template>
        </el-table-column>
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
              @click="rowCopy(scope.row)"
            >复制</el-button>
            <el-button

              size="mini"
              @click="addOrUpdateHandle(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="deleteHandle(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
      />
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshDataList="getDataList"
      />
    </el-main>
  </el-container>
</template>

<script>
import AddOrUpdate from './dictionary-type-add-or-update'
import { list, remove, batchRemove } from '@/api/basedata/dictionary-type'
import { formatTime } from '@/utils'

export default {
  components: {
    AddOrUpdate
  },
  data() {
    return {
      dataForm: {},
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    iRowStyle: function({ row, rowIndex }) {
      return 'height:35px'
    },
    iHeaderRowStyle: function({ row, rowIndex }) {
      return 'height:35px'
    },
    iCellStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'padding:7px'
    },
    iHeaderCellStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'padding:7px'
    },
    formatTime: formatTime,
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      const params = Object.assign(
        {
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        },
        this.dataForm
      )
      list(params).then(response => {
        if (Array.isArray(response.data)) {
          this.dataList = response.data
          this.totalPage = parseInt(response.total)
        } else {
          this.dataList = 0
          this.totalPage = 0
        }
        console.log('params', params, 'list', this.dataList)

        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row)
      })
    },
    // 复制
    rowCopy(row) {
      const copyRow = Object.assign({}, row, { id: null })
      console.log('dictionary-type-copy', copyRow, 'row', row)
      this.addOrUpdateHandle(copyRow)
    },
    // 删除
    deleteHandle(row) {
      let message = ''
      if (row) {
        message = `确定要对 ${row.name} 进行删除吗？`
      } else {
        const names = this.dataListSelections.map(item => item.name)
        message = `确定要对 [${names.join(',')}] 进行批量删除吗？`
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const removeHandle = row ? remove : batchRemove
          const data = row || this.dataListSelections
          removeHandle(data)
            .then(response => {
              console.log('dictionary-type-delete', response)
              if (response) {
                this.$message.success('删除成功')
                this.getDataList()
              } else {
                this.$message.error('删除失败')
              }
            })
        })
        .catch(() => {
          this.$message.info('用户取消删除')
        })
    }
  }
}
</script>
