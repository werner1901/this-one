/**
 * Copyright (C), 2022-2025, www.bosssof.com.cn
 * @FileName RoleApi.java
 * @Author Administrator
 * @Date 2022-9-28  17:26
 * @Description TODO
 * History:
 * <author> Administrator
 * <time> 2022-9-28  17:26
 * <version> 1.0.0
 * <desc> 
 */
import request from '@/utils/request'
//资源管理模块的相对路径
const RESOURCE_URL = '/resource'
// 增加或者修改菜单资源需要取得填写子系统因此这里发起对子系统的接口的请求
const SUBSYSTEM_URL = '/subsystem'
/**
 * 增加资源或者修改资源取得子系统
 * @param {*} subSystemQuery
 */
export function getSubsystem(subSystemQuery) {
  return request({
    url: SUBSYSTEM_URL,
    method: 'get',
    params: subSystemQuery,
  })
}
/**
 * 改方法作废 2022-09-28
 */
export function getMenu() {
  return request({
    url: RESOURCE_URL + '/menu',
    method: 'get',
  })
}
/**
 *  资源对话框增加资源页面
 * @param {*} ResourceDTO 界面必输和接口参数必须填写赋值
 */
export function add(ResourceDTO) {
  return request({
    url: RESOURCE_URL,
    method: 'post',
    data: ResourceDTO,
  })
}
/**
 * 删除当前行
 * @param {*} id  选选择的行的id
 * @param {*} version  当前的行的版本号，每次变更都将增加1
 */
export function remove(id, version) {
  return request({
    url: RESOURCE_URL,
    method: 'delete',
    params: { id: id, version: version },
  })
}
/**
 * 批量删除传入数组
 * @param {*} ResourceDTOs
 */
export function batchRemove(ResourceDTOs) {
  return request({
    url: RESOURCE_URL + '/batch',
    method: 'delete',
    data: ResourceDTOs,
  })
}
/**
 * 执行修改动作，具体输入按界面要求注意非空项目后台有非空检查
 * @param {*} ResourceDTO
 */
export function modify(ResourceDTO) {
  return request({
    url: RESOURCE_URL,
    method: 'put',
    data: ResourceDTO,
  })
}
/**
 *  改方法作废
 * @param {*} id
 */
export function getModifyInfo(id) {
  return request({
    url: RESOURCE_URL + `/${id}`,
    method: 'get',
  })
}
/**
 * 改方法作废
 */
export function copy(id) {
  return request({
    url: RESOURCE_URL + '/copy',
    method: 'get',
    params: { id: id },
  })
}

export function commonQuery(ResourceQuery) {
  return request({
    url: RESOURCE_URL,
    method: 'get',
    params: ResourceQuery,
  })
}

// export function commonQueryTree(ResourceQuery) {
//   return request({
//     url: RESOURCE_URL + '/tree',
//     method: 'get',
//     params: ResourceQuery,
//   })
// }
/**
 *  初始化使调用此方法加载系统的树
 * @param {*} ResourceQuery 
 */
export function treeQuery(ResourceQuery) {
  return request({
    url: RESOURCE_URL + '/tree',
    method: 'get',
    params: ResourceQuery,
  })
}

export function Query(Query) {
  return request({
    url: '/subsystem',
    method: 'get',
    params: Query,
  })
}

export function querySubSystemById(id) {
  return request({
    url: '/subsystem/' + id,
    method: 'get',
  })
}

export function queryResourceById(id) {
  return request({
    url: RESOURCE_URL + '/' + id,
    method: 'get',
  })
}
