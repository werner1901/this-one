// eslint-disable-next-line quotes
import request from '@/utils/request'

// eslint-disable-next-line quotes
const organization_URL = '/v1/organization'
/**
 * @param: 组织DTO
 * @return: 成功则true CommonResponse 应答码和消息统一参考基础框架
 * @see
 * @since
 */

export function add(organizationDTO) {
  return request({
    url: organization_URL,
    method: 'post',
    data: organizationDTO
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
    url: organization_URL,
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

export function batchRemove(deleteorganizationDOTS) {
  return request({
    url: organization_URL + '/batch',
    data: deleteorganizationDOTS,
    method: 'delete'
  })
}

/**
 * @param:
 * @return:
 * @see
 * @since
 */

export function modify(organizationDTO) {
  return request({
    url: organization_URL,
    method: 'put',
    data: organizationDTO
  })
}

export function batchUpdate(organizationDTOS) {
  return request({
    url: organization_URL + '/batch',
    method: 'put',
    data: organizationDTOS
  })
}

/**
 * @param:
 * @return:  CommonResponse<CommonPage<organizationVO>>
 * @see
 * @since
 */

export function commonQuery(organizationQuery) {
  return request({
    url: organization_URL,
    method: 'get',
    params: organizationQuery
  })
}

export function queryorganizationById(id) {
  return request({
    url: organization_URL + '/' + id,
    method: 'get'
  })
}

export function copy(id) {
  return request({
    url: organization_URL + '/copy',
    method: 'post',
    params: id
  })
}
