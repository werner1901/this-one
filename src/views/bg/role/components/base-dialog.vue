<template>
  <el-dialog
    v-dialogDrag
    :title="title"
    :visible.sync="visible"
    width="60%"
    length="100%"
    :before-close="handleClose"
  >
    <slot></slot>
    <span slot="footer">
      <el-button style="margin-left: 30px" @click="handleClose"
        >取 消</el-button
      >
      <el-button type="primary" @click="assign">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    title: { type: String, required: true, default: '' },
    dialogType: { type: String, required: true },
    visible: { type: Boolean, default: false },
    // model: { type: Object, required: true },
    // rules: { type: Object, required: true }
  },
  data() {
    return {}
  },
  methods: {
    handleClose() {
      // console.log()
      this.$emit('update:visible', false)
    },
    assign() {
      if (this.dialogType === 'user') {
        this.$emit('assignUser')
      }
      if (this.dialogType === 'resource') {
        this.$emit('assignResource')
      }
      if (this.dialogType === 'company') {
        this.$emit('assignCompany')
      }
    },
  },
}
</script>
