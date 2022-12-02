<template>
  <div class="big-box">
    <div class="right-box">
      <h1>产品许可信息</h1>
      <p>{{ licensesVO[0].licensesDescription }}</p>
      <br>
      <p>授权机器码是：{{ licensesVO[0].authorizedMachineCode }}</p>
      <p>授权产品名称：{{ licensesVO[0].authorizedProductName }}</p>
      <p>授权公司名称：{{ licensesVO[0].authorizedCompanyName }}</p>
      <p>授权访问地址：{{ licensesVO[0].authorizedAccessAddress }}</p>
      <p>系统访问地址：{{ licensesVO[0].systemAccessAddress }}</p>
      <p>当前平台版本：{{ licensesVO[0].currentPlatformVersion }}</p>
      <el-button type="primary">上传许可（*.lic）<i class="el-icon-upload el-icon--right"></i></el-button>
      <el-button type="success">关闭页面</el-button>
    </div>
    <div class="left-box">
      <img src="钥匙.png">
    </div>
    <div class="bottom">
      <p class="author">{{ licensesVO[0].copyRight }}</p>
    </div>
  </div>
</template>
<script>
import { showInfo } from '@/api/org/licenses'

export default {
  name: 'ShowInfo',
  data() {
    return {
      licensesVO: []
    }
  },
  mounted() {
    console.log('mounted..')
    this.initData()
  },
  methods: {
    initData() {
      this.queryLicenses()
    },
    queryLicenses() {
      showInfo().then(response => {
        this.licensesVO = response.data
      }).catch(() => {
        this.$message.error('网络异常')
      })
    }
  }
}
</script>

<style scoped>
.big-box{margin:0px auto;width: 900px;height: 400px;}
.left-box{ margin:0px auto;width: 300px;height: 200px;float: left;}/* 左边模块左浮动 */
.right-box{margin:0px auto;width: 600px;height: 200px;float: right;}
.bottom{position:absolute;width: 900px;bottom: 0;text-align: center}
.author{font-size: 20px}
</style>
