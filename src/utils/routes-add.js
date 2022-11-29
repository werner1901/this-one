/*
 * @Author: 18059301505 275895816@qq.com
 * @Date: 2022-11-07 15:48:41
 * @LastEditors: 18059301505 275895816@qq.com
 * @LastEditTime: 2022-11-29 12:05:06
 * @FilePath: \bosssoft-train-user-permission-centre-front-end\src\utils\routes-add.js
 * @Description: 请在改文件实现动态菜单的生成的逻辑，确保动态菜单的相关模块和组件能否使用改模块是生成的设定的菜单数据
 *
 */
import router from '@/router'
import { constantRoutes } from '@/router'

/**
 * 系统所支持的所有的页面组件都这里定义，根据后端所返回的角色对应的资源的 url 去匹配取得相应的 @View
 * 该模式采用预定义的模式，如果需要进一步改进也可以不定义该数组，完全由后端配置生成数组，当前版本暂定采用
 * 此预定义简单模式
 */
export const components = {
  '@/layout': () => import('@/layout'),
  // TODO:添加对应需要导入的组件，'资源path': () => import('对应资源文件')
  '@/views/bg/resource/index': () => import('@/views/bg/resource/index'),
  '@/views/basedata/dictionary/index': () =>
    import('@/views/basedata/dictionary/index'),
  '@/views/basedata/dictionaryType/index': () =>
    import('@/views/basedata/dictionaryType/index'),
  '@/views/basedata/systemParam/index': () =>
    import('@/views/basedata/systemParam/index'),
  '@/views/basedata/position/index': () =>
    import('@/views/basedata/position/index'),
  '@/views/basedata/user/index': () => import('@/views/basedata/user/index'),
  '@/views/company/index': () => import('@/views/company/index'),
  '@/views/administrative/index': () => import('@/views/administrative/index'),
  '@/views/audit/index': () => import('@/views/audit/index'),
  '@/views/department/index': () => import('@/views/department/index'),
  '@/views/bg/role/index': () => import('@/views/bg/role/index'),
  '@/views/bg/subsystem/index': () => import('@/views/bg/subsystem/index'),
  '@/views/basedata/tenant/index': () =>
    import('@/views/basedata/tenant/index'),
  '@/views/organization/index': () => import('@/views/organization/index'),
  '@/views/basedata/blackorwhite/index': () =>
    import('@/views/basedata/blackorwhite/index'),
  '@/views/job/index': () => import('@/views/job/index'),
  '@/views/basedata/useronline/index': () =>
    import('@/views/basedata/useronline/index'),
  '@/views/module/index': () => import('@/views/module/index'),
  '@/views/licenses/index': () => import('@/views/licenses/index'),
  '@/views/message/index': () => import('@/views/message/index'),
  '@/views/cache/index': () => import('@/views/cache/index'),
  '@/views/system/upgradelog/index': () =>
    import('@/views/system/upgradelog/index'),
}

function addRoutesByResources(resources) {}

export default addRoutesByResources
