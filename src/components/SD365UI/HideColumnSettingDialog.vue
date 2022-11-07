<template>
  <el-dialog
    v-dialogDrag
    :visible.sync="visible"
    :width="width"
    :modal="true"
    :close-on-click-modal="true"
  >
    <div>
      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">选择列</el-checkbox>
      <div style="margin: 15px 0;" />
      <el-checkbox-group v-model="checkedTableColumns" @change="handleCheckedTableColumnChange">
        <el-checkbox
          v-for="column in tableColumns"
          :key="column.prop"
          class="el-checkbox-width"
          :label="column.prop"
          size="medium"
        >{{ column.label }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button id="btnCancel" @click="onBtnCancelClick">取 消</el-button>
      <el-button id="btnOK" type="primary" @click="onBtnSaveClick">保存</el-button>
      <!-- :disabled= "this.$store.state.user.judge" -->
    </span>
  </el-dialog>

</template>

<script>
import { stringifyObjArr, parseObjArr, stringifyArr, parseArr } from '../../utils/hideTableColumn'
export default {
  props: {
    // tableData: { type: Array, required: true },
    tableColumns: { type: Array, required: true },
    width: { type: String, required: true, default: '50%' },
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      isIndeterminate: true,
      checkAll: false,
      checkedOptions: []
    }
  },
  computed: {
    bindTableColumns() {
      return this.tableColumns.filter((column) => column.show)
    },
    checkedTableColumns: {
      get() {
        // 返回选中的列名
        return this.bindTableColumns.map(column => column.prop)
      },
      set(checked) {
        // 设置表格列的显示与隐藏
        // debugger
        this.tableColumns.forEach(column => {
          // 如果选中，则设置列显示
          if (checked.includes(column.prop)) {
            column.show = true
          } else {
            // 如果未选中，则设置列隐藏
            column.show = false
            // debugger
          }
        })
        console.log(this.tableColumns)
        // debugger
      }
    }
  },
  watch: {
  },
  mounted() {
    // this.tableColumnsData = parseObjArr('tableColumns')
  },
  methods: {
    handleCheckAllChange(val) {
      for (let column of this.tableColumns) {
        column.show = val
      }
      this.isIndeterminate = false
      console.log(this.tableColumns)
    },
    handleCheckedTableColumnChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.tableColumns.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableColumns.length
      // this.$emit('handleCheckedTableColumnChange', this.tableColumns)
    },
    // 取消
    onBtnCancelClick() {
      let hideVisible = this.visible
      hideVisible = false
      this.$emit('hideTableClose', hideVisible)
    },
    // 保存
    onBtnSaveClick() {
      // 本地保存数据列显示与否的设置数据
      // this.checkedTableColumns()
      // stringifyObjArr('tableColumns', this.tableColumns)
      let hideVisible = this.visible
      hideVisible = false
      this.$emit('hideTableClose', hideVisible)
      this.$emit('tableColumnData', this.tableColumns)
    }
  }
}
</script>

<style scoped>
.el-checkbox-width{
  width: 100px;
  height: 25px;
}
</style>
