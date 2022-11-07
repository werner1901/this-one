
<template>
  <el-dialog
    v-dialogDrag
    :title="caption"
    :visible.sync="visible"
    :width="width"
    :modal="true"
    :close-on-click-modal="true"
    @close="onBtnCancelClick"
  >
    <el-table
      ref="formName"
      :data="roleList"
      :model="model"
      label-position="left"
      :rules="rules"
      style="width: 100%"
      :default-sort="{prop: 'name', order:'descending'}"
      @row-click="openRole"
    >
      <el-table-column
        fixed
        align="center"
        style="width: 25%"
        type="selection"
      />
      <el-table-column sortable align="center" label="序号" style="width: 25%">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        sortable
        align="center"
        prop="name"
        label="角色名"
        style="width: 25%"
      />
      <el-table-column
        sortable
        align="center"
        prop="code"
        label="角色代码"
        style="width: 25%"
      />
      <el-table-column
        align="center"
        prop="remarke"
        label="备注"
        style="width: 25%"
      />
    </el-table>
    <el-pagination
      :page-size="commonPage.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="commonPage.total"
      :current-page.sync="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <span slot="footer" class="dialog-footer">
      <el-button id="btnCancel" @click="onBtnCancelClick">取 消</el-button>
      <el-button id="btnOK" @click="onBtnSaveClick">确 定</el-button>
      <!-- :disabled= "this.$store.state.user.judge" -->
    </span>
  </el-dialog>
</template>
<script>
import { modifyWithNewRole } from '@/api/right/user'

export default {
  props: {
    caption: { type: String, required: true, default: '角色列表' },
    width: { type: String, required: true, default: '50%' },
    model: { type: Object, required: true },
    rules: { type: Object, required: true },
    commonPage: { type: Object, default: () => ({}) },
    roleList: { type: Array, default: function() {
      return []
    } }
  },
  data() {
    return {
      queryLoading: false,
      visible: false,
      userDTO: [],
      userWithNewRole: []
    }
  },
  methods: {
    init(users) {
      this.userDTO = users

      // ......
      this.visible = true
    },
    /**
     * @description: 取消的时候回调外部时间
     * @return {*}
     */
    onBtnCancelClick() {
      this.visible = false
    },
    /**
     * @description: 如果操作较长时间则显示进度 如果校验通过则回调父组件定义的保存或者更新操作
     * @param {*} form 表单名
     * @return {*}
     */
    onBtnSaveClick() {
      this.$confirm('分配角色将覆盖已有角色，请慎重操作').then(response => {
        for (let index = 0; index < this.userDTO.length; index++) {
          this.userDTO[index].roleList = null
          this.userDTO[index].roleList = this.$refs.formName.selection
        }
        modifyWithNewRole(this.userDTO)
          .then(response => {
            if (response) {
              this.$message.success('分配成功')
              this.visible = false
            } else {
              this.$message.error('请选择分配角色')
              this.visible = false
            }
          })
          .catch(() => {
            this.$message.error('网络错误')
            this.visible = false
          })
      })
    },
    handleClose() {
      this.onBtnCancelClick()
    },
    handleSizeChange(val) {
      this.queryUser(val, 1)
      this.currentPage = 1
    },

    handleCurrentChange(val) {
      this.queryUser(this.commonPage.pageSize, val)
    },
    // 点击角色跳转
    openRole(row) {
      this.$router.push({ path: '/centre/permission-manager/role', query: { name: row.name }})
    }
  }
}
</script>
