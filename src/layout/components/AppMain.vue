<!--
 * @Author: Xnew
 * @Description:
 * @Date: 2022-02-16 14:49:50
 * @LastEditors: Xnew
 * @LastEditTime: 2022-02-22 09:50:08
-->
<template>
  <section class="app-main" :style="autoHeight">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      clientHeight: '',
      autoHeight: {
        height: ''
      }
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function() {
      this.changeFixed(this.clientHeight)
    }
  },
  mounted() {
    this.clientHeight = `${document.documentElement.clientHeight}`
    window.onresize = function temp() {
      this.clientHeight = `${document.documentElement.clientHeight}`
    }
  },
  methods: {
    //  动态修改container高度
    changeFixed(clientHeight) {
      this.autoHeight.height = (clientHeight - 110) + 'px'
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  max-height: calc(100vh - 25vh);
  width: 100%;
  position: relative;
  overflow: auto;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
