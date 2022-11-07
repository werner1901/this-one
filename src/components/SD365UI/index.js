import QueryPanel from './QueryPanel.vue'
import FormDialog from './FormDialog.vue'
import HideColumnSettingDialog from './HideColumnSettingDialog.vue'
// 这里是重点
const SD365UI = {
  install: function(Vue) {
    Vue.component('sd-QueryPanel', QueryPanel)
    Vue.component('sd-FormDialog', FormDialog)
    Vue.component('sd-HideTable', HideColumnSettingDialog)
  }
}

// 导出组件
export default SD365UI
