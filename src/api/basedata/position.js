// eslint-disable-next-line quotes
import request from '@/utils/request'

// eslint-disable-next-line quotes
// const position_URL = '/permission/centre/v1/position'
const position_URL = '/v1/position'

/**
 * @param: 用户DTO
 * @return: 成功则true CommonResponse 应答码和消息统一参考基础框架
 * @see
 * @since
 */

export function add(positionDTO) {
  return request({
    url: position_URL,
    method: 'post',
    data: positionDTO
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
    url: position_URL,
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

export function batchRemove(deletepositionDOTS) {
  return request({
    url: position_URL + '/batchDelete',
    data: deletepositionDOTS,
    method: 'delete'
  })
}

/**
 * @param:
 * @return:
 * @see
 * @since
 */

export function modify(positionDTO) {
  return request({
    url: position_URL,
    method: 'put',
    data: positionDTO
  })
}

export function batchUpdate(positionDTOS) {
  return request({
    url: position_URL + '/batchUpdate',
    method: 'put',
    data: positionDTOS
  })
}

/**
 * @param:
 * @return:  CommonResponse<CommonPage<positionVO>>
 * @see
 * @since
 */

export function commonQuery(positionQuery) {
  return request({
    url: position_URL,
    method: 'get',
    params: positionQuery
  })
}

export function querypositionById(id) {
  return request({
    url: position_URL + '/' + id,
    method: 'get'
  })
}

export function queryAllRole() {
  return request({
    url: position_URL + '/queryAllRole',
    method: 'get'
  })
}
export function queryAllDepartment() {
  return request({
    url: position_URL + '/queryAllDepartment',
    method: 'get'
  })
}
export function queryAllPosition() {
  return request({
    url: position_URL + '/queryAllPosition',
    method: 'get'
  })
}
export function modifyWithNewRole(positionDTOS) {
  return request({
    url: position_URL + '/modifyWithNewRole',
    method: 'put',
    data: positionDTOS
  })
}
export function status(positionDTO) {
  return request({
    url: position_URL + '/status',
    method: 'put',
    data: positionDTO,
  })
}
