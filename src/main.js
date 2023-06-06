/*
 * @Date: 2021-11-26 16:56:48
 * @LastEditors: Xnew
 * @LastEditTime: 2022-02-23 19:04:12
 */
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import { Message, MessageBox } from 'element-ui'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import './utils/dialogdrap'
import '@/icons' // icon
import '@/permission' // permission control
import '@/styles/index.scss' // global css
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import SlideVerify from 'vue-monoplasty-slide-verify'
import SD365UI from './components/SD365UI'
import './utils/dialogdrap'

import eIconPicker, { iconList } from 'e-icon-picker'
import 'e-icon-picker/lib/symbol.js' // 基本彩色图标库
import 'e-icon-picker/lib/index.css' // 基本样式，包含基本图标
import 'font-awesome/css/font-awesome.min.css' // font-awesome 图标库
import 'element-ui/lib/theme-chalk/icon.css' // element-ui 图标库
// svgIcons 对应的就是图标列表，将图标列表添加到选择器就可以了
import svgIcons from 'e-icon-picker/lib/getSvg'
import SYSUPDLOG from '@/components/SystemUpgradeLog'
import JsonViewer from 'vue-json-viewer'
import VueClipboards from 'vue-clipboard2'
// iconList.addIcon(svgIcons)
// console.log(svgIcons, '图标')
// import SlideVerify from 'vue-monoplasty-slide-verify';

// Vue.use(SlideVerify);

// import bossQuery from './components/QueryPanel'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

Vue.use(SlideVerify)
Vue.use(SD365UI)
Vue.use(JsonViewer)
Vue.use(VueClipboards)

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 全局删除增加图标
Vue.use(eIconPicker, {
  FontAwesome: false,
  ElementUI: false,
  eIcon: false, // 自带的图标，来自阿里妈妈
  addIconList: svgIcons,
  removeIconList: [],
  zIndex: 3100,
  // eIconSymbol: true, // 是否开启彩色图标
})
Vue.config.productionTip = false

// 升级日志模块展示对话框
Vue.use(SYSUPDLOG)

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
})
