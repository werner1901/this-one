<template>
  <el-dialog
    v-dialogDrag
    :title="caption"
    :visible.sync="visible"
    :width="width"
    :lock-scroll="false"
    :modal="true"
    :close-on-click-modal="false"
    :before-close="onBtnOKClick"
    @close="handleClose"
  >
    <el-image
      style="width: 100%"
      :src="imageUrl"
      fit="scale-down"
    >
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline" />
      </div>
    </el-image>
    <div>
      <el-row type="flex" style="padding: 20px" class="contentBox">
        <el-col :span="4">
          日志标题：
        </el-col>
        <el-col :span="8">
          {{ model.title }}
        </el-col>
        <el-col :span="4">
          更新时间：
        </el-col>
        <el-col :span="8">
          <el-tag type="info">{{ model.upgradeTime }}</el-tag>
        </el-col>
      </el-row>
      <el-row type="flex" style="padding: 20px">
        <el-col :span="4">
          现版本：
        </el-col>
        <el-col :span="8">
          <el-tag>{{ model.newVersion }}</el-tag>
        </el-col>
        <el-col :span="4">
          前版本：
        </el-col>
        <el-col :span="8">
          <el-tag type="info">{{ model.oldVersion }}</el-tag>
        </el-col>
      </el-row>
      <el-row type="flex" style="padding: 20px">
        <el-col :span="20" :offset="2">
          <span>
            {{ model.content }}
          </span>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button
        id="btnOK"
        type="primary"
        @click="onBtnOKClick()"
      >我了解了</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    caption: { type: String, required: true, default: '升级日志' },
    width: { type: String, required: true, default: '50%' },
    visible: { type: Boolean, default: true },
    model: { type: Object, required: true },
    imageUrl: { type: String, required: true }
  },
  data() {
    return {
    }
  },
  methods: {
    /**
     * @description: 了解按钮
     * @return {*}
     */
    onBtnOKClick() {
      this.$emit('onBtnOKClick', this)
      this.visible = false
      // this.$refs.formName.resetFields()
    },
    handleClose() {
      this.onBtnOKClick()
    }
  }
}
</script>

<style scoped>
.contentBox {
  font-size: large;
  font-family: "Microsoft YaHei", serif;
  font-weight: bolder;
}
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
&::-webkit-scrollbar {
   width: 2px;
   background-color: #ccc;
 }
&::-webkit-scrollbar-thumb {
   background-color: #0ae;
 }
&::-webkit-scrollbar-track {
   background-color: #ccc;
 }
}
</style>
