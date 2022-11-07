// <!--
//  * @Author: abel.han
//  * @Date: 2022-7-09 11:45:25
//  * @LastEditTime: 2022-7-09 11:45:25
//  * @LastEditors: hpl
//  * @Description: In User Settings Edit
//  * @FilePath: /sd365-tms-omp-front-end/src/api/administrative/administrative.js
// -->
// eslint-disable-next-line quotes
// eslint-disable-next-line quotes
import request from '@/utils/request'

const ADMINISTRATIVE_URL = '/v1/administrative'
/**
 * @param: 区域 DTO
 * @return: 成功则true CommonResponse 应答码和消息统一参考基础框架
 * @see
 * @since
 */
export function addAdministrative(administrativeDTO) {
  return request({
    url: ADMINISTRATIVE_URL + '/add',
    method: 'post',
    data: administrativeDTO
  })
}

export function removeAdministrative(id, version) {
  return request({
    url: ADMINISTRATIVE_URL + '/delete',
    params: { id: id, version: version },
    method: 'delete'
  })
}

export function removeBatchAdministrative(deleteAdministrativeDTOS) {
  return request({
    url: ADMINISTRATIVE_URL + '/batch',
    data: deleteAdministrativeDTOS,
    method: 'delete'
  })
}

export function modifyAdministrative(administrativeDTO) {
  return request({
    url: ADMINISTRATIVE_URL + '/modify',
    method: 'put',
    data: administrativeDTO
  })
}

/**
 * @param:
 * @return:  CommonResponse<CommonPage<AdministrativeVO>>
 * @see
 * @since
 */
export function commonQuery(administrativeQuery) {
  return request({
    url: ADMINISTRATIVE_URL,
    method: 'get',
    params: administrativeQuery
  })
}

export function queryAdministrativeById(id) {
  return request({
    url: ADMINISTRATIVE_URL + '/' + id,
    method: 'get'
  })
}

export function status(administrativeDTO) {
  return request({
    url: ADMINISTRATIVE_URL + '/status',
    method: 'put',
    data: administrativeDTO
  })
}
