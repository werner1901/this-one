/*
 * @Author: 18059301505 275895816@qq.com
 * @Date: 2021-10-27 16:58:22
 * @LastEditors: 18059301505 275895816@qq.com
 * @LastEditTime: 2022-10-14 11:13:47
 * @FilePath: \sd365-permission-centre-front-end\src\permission.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import checkAndCompleteRoute from './roleresourcehelper.js'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.onReady(() => {
  /**
   * 如何已经登录存在资源就可以直接登录，初次登录不调用这个
   */
  checkAndCompleteRoute()

  // 此处注意：通配符 '*' 不能在默认路由router/index.js里面添加，否则会造成刷新页面404等错误
  router.addRoutes([{ path: '*', redirect: '/404', hidden: true }])
  // }
})

/**
 * 路由访问拦截，对进入的路由请求进行拉取，登录认证成功了进入主页被拦截然后请求后端权限完成动态路由
 */
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  console.log('router-check-token', hasToken)
  debugger
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          //get user info
          await store.dispatch('user/getInfo')
          checkAndCompleteRoute()
          // 此处注意：通配符 '*' 不能在默认路由router/index.js里面添加，否则会造成刷新页面404等错误
          router.addRoutes([{ path: '*', redirect: '/404', hidden: true }])
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          await store.dispatch('user/resetCodeAndAccount')
          await store.dispatch('user/resetUserId')
          Message.error(error || 'Has Error')
          next(`/login`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
