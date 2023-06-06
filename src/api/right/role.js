/*
 * @Author: Xnew
 * @Description:
 * @Date: 2022-02-16 14:49:50
 * @LastEditors: 18059301505 275895816@qq.com
 * @LastEditTime: 2022-09-30 16:41:48
 */
import request from '@/utils/request'

const ROLE_URL = '/v1/role'

export function getUserResource(params) {
  return request({
    url: ROLE_URL + '/queryUserResource',
    method: 'get',
    params,
  })
}

export function add(RoleDTO) {
  console.log(RoleDTO)
  return request({
    url: ROLE_URL,
    method: 'post',
    data: RoleDTO,
  })
}

export function remove(id, version,name,code) {
  return request({
    url: ROLE_URL,
    method: 'delete',
    params: { id: id, version: version,name:name,code:code },
  })
}

export function batchRemove(RoleDTOs) {
  return request({
    url: ROLE_URL + '/batch',
    method: 'delete',
    data: RoleDTOs,
  })
}

export function modify(data) {
  return request({
    url: ROLE_URL,
    method: 'put',
    data,
  })
}

export function copy(id) {
  return request({
    url: ROLE_URL + '/copy',
    method: 'post',
    params: { id: id },
  })
}

export function commonQuery(RoleQuery) {
  return request({
    url: ROLE_URL,
    method: 'get',
    params: RoleQuery,
  })
}

export function queryRoleById(id) {
  return request({
    url: ROLE_URL + '/' + id,
    method: 'get',
  })
}

export function commonQueryUser(userQuery) {
  return request({
    url: ROLE_URL + '/commonQueryUser',
    method: 'get',
    params: userQuery,
  })
}

export function assignUser(userRoleDTO) {
  return request({
    url: ROLE_URL + '/assignUser',
    method: 'post',
    data: userRoleDTO,
  })
}

export function assignResource(roleResourceDTO) {
  return request({
    url: ROLE_URL + '/assignResource',
    method: 'post',
    data: roleResourceDTO,
  })
}

export function selectCompany() {
  return request({
    url: ROLE_URL + '/selectCompany',
    method: 'get',
  })
}

export function queryRoleCompany(id) {
  return request({
    url: ROLE_URL + '/company',
    method: 'get',
    params: { id },
  })
}

export function modifyRoleCompany(roleCompanyDTO) {
  return request({
    url: ROLE_URL + '/company',
    method: 'put',
    data: roleCompanyDTO,
  })
}
