<template>
<el-row style="margin-left: 7px; margin-top: -7px">
  <div>
    <el-form :inline="true">
      <slot></slot>
      <el-button
        style="margin-left: 5px"
        type="primary"
        @click="queryByName"
      >查询</el-button>
    </el-form>
  </div>
</el-row>
</template>
<script>
export default {
  props: {
    boxType:{ type: String, required: true}
  },
  data() {
    return {
    }
  },
  methods: {
    queryByName(){
      if (this.boxType === 'role'){
        this.$emit("queryRoleByName");
      }
      if (this.boxType === 'user') {
        this.$emit("queryUserByName");
      }
    },
  }
}
</script>