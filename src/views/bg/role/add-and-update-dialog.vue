<template>
<sd-FormDialog
  :caption="caption"
  :visible="visible"
  :model="model"
  :rules="rules"
  width="60%"
  @OkButtonClick="OkButtonClick"
  @CancelButtonClick="CancelButtonClick"
>
<el-row>
  <el-col :span="11">
    <el-form-item :span="12" label="角色名称" prop="name">
      <el-input v-model="model.name" />
    </el-form-item>
  </el-col>
  <el-col :span="11">
    <el-form-item label="角色代码" prop="code">
      <el-input v-model="model.code" />
    </el-form-item>
  </el-col>
</el-row>
<el-row>
  <el-col :span="11">
    <el-form-item label="角色备注" prop="remark">
      <el-input v-model="model.remark" />
    </el-form-item>
  </el-col>
</el-row>
<el-row>
  <el-col :span="11">
    <el-form-item label="是否启用">
      <template>
        <el-radio v-model="model.status" :label="1">是</el-radio>
        <el-radio v-model="model.status" :label="0">否</el-radio>
      </template>
    </el-form-item>
  </el-col>
</el-row>
</sd-FormDialog>
</template>

<script>
export default {
  props: {
    caption: { type: String, required: true, default: '信息维护' },
    width: { type: String, required: true, default: '50%' },
    visible: { type: Boolean, default: true },
    model: { type: Object, required: true },
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '角色编号不能为空', trigger: 'blur' }
        ],
        remark: [{ required: false, message: '备注不能为空', trigger: 'blur' }],
        companyId: [
          { required: true, message: '所属公司不能为空', trigger: 'change' }
        ]
      },
    }
  },
  methods: {
    OkButtonClick(){
      this.$emit("OkButtonClick");
    },
    CancelButtonClick(){
      this.$emit("CancelButtonClick");
    }
  }
}
</script>