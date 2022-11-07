<template>
  <el-dialog
    v-dialogDrag
    :title="dialogTitle"
    :visible.sync="visible"
    style="text-align: center"
  >
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @keyup.enter.native="dataFormSubmit()"
    >
      <el-form-item label="名称" prop="name" style="width: 250px">
        <el-input v-model="dataForm.name" placeholder="名称" style="width:600px" />
      </el-form-item>
      <el-form-item label="备注" prop="remark" style="width: 250px">
        <el-input v-model="dataForm.remark" placeholder="备注" style="width:600px" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { add, modify } from '@/api/basedata/dictionary-type'
import Store from '@/store'
// eslint-disable-next-line no-unused-vars
import dialogdrop from '@/utils/dialogdrap'

export default {
  data() {
    return {
      dialogTitle: '',
      visible: false,
      oldData: {},
      dataForm: {},
      dataRule: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    init(row) {
      if (row) {
        this.dialogTitle = row.id === null ? '复制' : '修改'
        this.dataForm = Object.assign({}, row)
        this.oldData = row.id === null ? {} : Object.assign({}, row)
      } else {
        this.dialogTitle = '添加信息'
        this.dataForm = Object.assign({})
      }
      this.visible = true
    },
    // 表单提交
    dataFormSubmit() {
      console.log(this.oldData, this.dataForm)
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const currentTime = new Date().toJSON()
          const submit = this.dataForm.id ? modify : add

          if (!this.dataForm.id) {
            console.log(Store)

            // this.dataForm.createdTime = currentTime
            this.dataForm.createdBy = 1
            this.dataForm.creator = Store.getters.name
          }

          this.dataForm.updatedBy = 1
          // this.dataForm.updatedTime = currentTime
          this.dataForm.modifier = Store.getters.name

          submit(this.dataForm)
            .then(response => {
              console.log('dictionary-type-submit', response)
              if (response) {
                this.$message.success('操作成功')
                this.$emit('refreshDataList')
                this.visible = false
              } else {
                if (this.dataForm.id) {
                  this.$message.success('操作成功')
                  this.visible = false
                } else {
                  this.$message.error('已有重复的字典名称')
                  this.visible = false
                }
              }
            })
            .catch(e => {
              console.log('dictionary-type-submit', e)
              // this.$message.error(e.message)
            })
        }
      })
    }
  }
}
</script>
