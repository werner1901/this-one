<template>
  <el-pagination
    :v-model="page"
    :current-page.sync="page.pageNum"
    :page-size="page.pageSize"
    :page-sizes="[15]"
    layout="total,sizes,prev, pager, next, jumper"
    :total="page.total"
    @size-change="handleSizeChange"
    @current-change="handleDataChange"
  />
</template>
<script>
export default {
  props: {
    page:{ type: Object, required: true},
    paginationType:{ type: String, required: true}
  },
  data() {
    return {
    }
  },
  methods: {
    handleSizeChange(val) {
      this.page.pageSize = val
      this.$emit('fetchData')
    },
    handleCurrentChange(val) {
      this.$emit('fetchData')
    },
    handleUserSizeChange(val) {
      this.page.pageSize = val
      this.$emit('getUser')
    },
    handleUserDataChange(val) {
      this.$emit('getUser')
    },

    handleSizeChange(val){
      if (this.paginationType === 'role'){
        this.handleSizeChange(val);
      }
      if (this.paginationType === 'user') {
        this.handleUserSizeChange(val);
      }
    },

    handleDataChange(val){
      if (this.paginationType === 'role'){
        this.handleCurrentChange(val);
      }
      if (this.paginationType === 'user') {
        this.handleUserDataChange(val);
      }
    },
  }
}
</script>