<!--
 * @Author: abel.zhan
 * @Date: 2020-11-18 06:19:11
 * @LastEditTime: 2022-03-29 00:25:46
 * @LastEditTime: 2020-12-04 18:51:42
 * @LastEditTime: 2020-11-23 01:24:50
 * @LastEditTime: 2020-12-16 22:37:18
 * @LastEditors: Please set LastEditors
 * @Description: 封装了 编辑和保存的对话框用于开发过程统一代码和样式表单的内容由slot定义
 * @FilePath: \sd365-tms-omp-front-end\src\components\sd365ui\FormDialog.vue
-->
<template>
  <el-dialog
    v-dialogDrag
    :title="caption"
    :visible.sync="visible"
    :width="width"
    :before-close="onBtnCancelClick"
    :lock-scroll="false"
    :modal="true"
    :close-on-click-modal="false"
    @open="onDialogOpen"
    @close="onBtnCancelClick"
  >
    <el-form
      ref="formName"
      :model="model"
      label-position="left"
      :rules="rules"
      label-width="80px"
    >
    <slot></slot>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button id="btnCancel" @click="onBtnCancelClick">取 消</el-button>
      <el-button
        id="btnOK"
        type="primary"
        @click="onBtnSaveClick('formName')"
      >确 定</el-button>
      <!-- :disabled= "this.$store.state.user.judge" -->
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    caption: { type: String, required: true, default: '信息维护' },
    width: { type: String, required: true, default: '50%' },
    visible: { type: Boolean, default: true },
    model: { type: Object, required: true },
    rules: { type: Object, required: true }
  },
  data() {
    return {
      queryLoading: false
    }
  },
  methods: {
    onDialogOpen(){
      if(this.$refs['formName'] != undefined){
        this.$refs['formName'].resetFields()
      }
    },
    /**
     * @description: 取消的时候回调外部时间
     * @return {*}
     */
    onBtnCancelClick() {
      this.queryLoading = true
      this.$emit('CancelButtonClick', this)
      this.queryLoading = false
      this.$emit('update:visible', false)
      // this.$refs.formName.resetFields()
    },
    /**
     * @description: 如果操作较长时间则显示进度 如果校验通过则回调父组件定义的保存或者更新操作
     * @param {*} form 表单名
     * @return {*}
     */
    onBtnSaveClick(form) {
      this.$refs[form].validate((valid) => {
        // debugger
        if (valid) {
          this.queryLoading = true
          this.$emit('OkButtonClick', this) // 回调父组件的时间具体业务逻辑由父组件实现
          this.queryLoading = false
          this.$emit('update:visible', false)
          // this.$message.success('操作成功xxxxxxxxxxxxx')
          // this.$refs.formName.resetFields()
        }
      })
    },
    handleClose() {
      this.onBtnCancelClick()
    }
  }
}
</script>
<style scoped>
.el-dialog {
  position: relative;
  margin: 0 auto 0px;
  background: #ffffff;
  border-radius: 2px;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 50%;
  height: 60%;
}
.el-dialog__body {
  border-top: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  max-height: 85% !important;
  min-height: 70%;
  overflow-y: auto;
  /* &::-webkit-scrollbar {
    width: 2px;
    background-color: #ccc;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #0ae;
  }
  &::-webkit-scrollbar-track {
    background-color: #ccc;
  } */
}
</style>
