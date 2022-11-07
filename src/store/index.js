/*
 * @Author: Xnew
 * @Description:
 * @Date: 2022-02-16 14:52:00
 * @LastEditors: Xnew
 * @LastEditTime: 2022-02-22 14:18:33
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permission
  },
  getters
})

export default store
