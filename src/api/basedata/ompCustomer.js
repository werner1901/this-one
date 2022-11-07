// eslint-disable-next-line quotes
import request from '@/utils/request'

// eslint-disable-next-line quotes
const CUSTOMER_URL = '/permission/centre/v1/customer'
/**
 * @param: 客户DTO
 * @return: 成功则true CommonResponse 应答码和消息统一参考基础框架
 * @see
 * @since
 */

export function add(customerDTO) {
  return request({
    url: CUSTOMER_URL,
    method: 'post',
    data: customerDTO,
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
    url: CUSTOMER_URL,
    params: { id: id, version: version },
    method: 'delete',
  })
}

/**
 * @param:
 * @return:  CommonResponse<Boolean>
 * @see
 * @since
 */

export function batchRemove(deleteCustomerDOTS) {
  return request({
    url: CUSTOMER_URL + '/batch',
    data: deleteCustomerDOTS,
    method: 'delete',
  })
}

/**
 * @param:
 * @return:
 * @see
 * @since
 */

export function modify(customerDTO) {
  return request({
    url: CUSTOMER_URL,
    method: 'put',
    data: customerDTO,
  })
}

export function batchUpdate(customerDTOS) {
  return request({
    url: CUSTOMER_URL + '/batch',
    method: 'put',
    data: customerDTOS,
  })
}

/**
 * @param:
 * @return:  CommonResponse<CommonPage<CustomerVO>>
 * @see
 * @since
 */

export function commonQuery(customerQuery) {
  return request({
    url: CUSTOMER_URL,
    method: 'get',
    params: customerQuery,
  })
}

export function queryCustomerById(id) {
  return request({
    url: CUSTOMER_URL + '/' + id,
    method: 'get',
  })
}

export function copy(id) {
  return request({
    url: CUSTOMER_URL + '/copy',
    method: 'post',
    params: id,
  })
}
