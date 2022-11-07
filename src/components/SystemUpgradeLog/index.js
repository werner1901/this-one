import ShowLogDialog from './ShowLogDialog.vue'

const SYSUPDLOG = {
  install: function(Vue) {
    Vue.component('ShowLogDialog', ShowLogDialog)
  }
}
export default SYSUPDLOG
