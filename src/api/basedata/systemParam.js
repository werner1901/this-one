// eslint-disable-next-line quotes
import request from '@/utils/request'

// eslint-disable-next-line quotes
const SYSTEM_PARAM_URL = '/v1/system/parameter'
/**
 * @param: 客户DTO
 * @return: 成功则true CommonResponse 应答码和消息统一参考基础框架
 * @see
 * @since
 */

export function add(systemParamDTO) {
  return request({
    url: SYSTEM_PARAM_URL + '/add',
    method: 'post',
    data: systemParamDTO
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
    url: SYSTEM_PARAM_URL,
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
export function batchRemove(systemParamDTOS) {
  return request({
    url: SYSTEM_PARAM_URL + '/remove',
    data: systemParamDTOS,
    method: 'post'
  })
}
/**
 * @param:
 * @return:
 * @see
 * @since
 */

export function modify(systemParamDTO) {
  return request({
    url: SYSTEM_PARAM_URL,
    method: 'put',
    data: systemParamDTO
  })
}

/**
 * @param:
 * @return:  CommonResponse<CommonPage<CustomerVO>>
 * @see
 * @since
 */

export function commonQuery(systemParamQuery) {
  return request({
    url: SYSTEM_PARAM_URL,
    method: 'get',
    params: systemParamQuery
  })
}

export function fuzzyQuery(systemParamQuery) {
  return request({
    url: SYSTEM_PARAM_URL + '/fuzzy',
    method: 'get',
    params: systemParamQuery
  })
}

export function querySystemParameterById(id) {
  return request({
    url: SYSTEM_PARAM_URL + '/' + id,
    method: 'get'
  })
}

export function batchUpdate(systemParamDTOS) {
  return request({
    url: SYSTEM_PARAM_URL + '/batch',
    method: 'put',
    data: systemParamDTOS
  })
}
