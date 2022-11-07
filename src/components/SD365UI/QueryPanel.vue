<!--
 * @Author: your name
 * @Date: 2020-11-18 21:25:40
 * @LastEditTime: 2020-12-13 00:34:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \sd365-tms-omp-front-end\src\components\SD365UI\QueryPanel.vue
-->
<template>
  <el-form :model="queryModel" :label-width="labelWidth">
    <el-row type="flex" style="padding:5px;">
      <slot />
      <el-form-item label="">
        <el-button
          id="btnQuery"
          v-loading="queryLoading"
          type="primary"
          icon="el-icon-search"
          @click="handleBtnQueryClick"
        >查询</el-button>
      </el-form-item>
    </el-row>
  </el-form>
</template>
<script>
export default {
  props: {
    queryModel: { type: Object, required: true },
    labelWidth: { type: String, default: '120px' }
  },
  data() {
    return {
      queryLoading: false
    }
  },
  methods: {
    handleBtnQueryClick() {
      this.queryLoading = true
      this.$emit('QueryButtonClick')
      this.queryLoading = false
    }
  }
}
</script>

