// eslint-disable-next-line quotes
import request from '@/utils/request'

// eslint-disable-next-line quotes
const tenant_URL = '/v1/tenant'
/**
 * @param: 租户DTO
 * @return: 成功则true CommonResponse 应答码和消息统一参考基础框架
 * @see
 * @since
 */
export function add(tenantDTO) {
  // debugger
  return request({
    url: tenant_URL,
    method: 'post',
    data: tenantDTO
  })
}

/**
 * @param:
 * @return:  CommonResponse<Boolean>
 * @see
 * @since
 */

export function remove(id, version) {
  return request({
    url: tenant_URL,
    params: { id: id, version: version },
    method: 'delete'
  })
}

/**
 * @param:
 * @return:  CommonResponse<Boolean>
 * @see
 * @since
 */

export function batchRemove(deletetenantDOTS) {
  return request({
    url: tenant_URL + '/batch',
    data: deletetenantDOTS,
    method: 'delete'
  })
}

/**
 * @param:
 * @return:
 * @see
 * @since
 */

export function modify(tenantDTO) {
  return request({
    url: tenant_URL,
    method: 'put',
    data: tenantDTO
  })
}

export function batchUpdate(tenantDTOS) {
  return request({
    url: tenant_URL + '/batch',
    method: 'put',
    data: tenantDTOS
  })
}

/**
 * @param:
 * @return:  CommonResponse<CommonPage<tenantVO>>
 * @see
 * @since
 */

export function commonQueryTenant(tenantQuery) {
  return request({
    url: tenant_URL,
    method: 'get',
    params: tenantQuery
  })
}

export function querytenantById(id) {
  return request({
    url: tenant_URL + '/' + id,
    method: 'get'
  })
}

export function copy(id) {
  return request({
    url: tenant_URL + '/copy',
    method: 'post',
    params: id
  })
}
/**
 * 
 * @param {*} tenantDTO 
 * @returns 
 */
 export function status(tenantDTO) {
  return request({
    url: tenant_URL + '/status',
    method: 'put',
    data: tenantDTO,
  })
}