/*
 * @Author: your name
 * @Date: 2021-10-27 16:58:22
 * @LastEditTime: 2022-03-23 08:42:34
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sd365-permission-centre-front-end\src\api\basedata\dictionary.js
 */
// eslint-disable-next-line quotes
import request from '@/utils/request'
// eslint-disable-next-line quotes
const DICTIONARY_URL = '/v1/dictionary'
/**
 * @param: 字典DTO
 * @return: 成功则true CommonResponse 应答码和消息统一参考基础框架
 * @see
 * @since
 */

export function add(dictionaryDTO) {
  return request({
    url: DICTIONARY_URL,
    method: 'post',
    data: dictionaryDTO
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
    url: DICTIONARY_URL,
    params: { id: id, version: version },
    method: 'delete'
  })
}

/**
 * @param:
 * @return:
 * @see
 * @since
 */

export function modify(dictionaryDTO) {
  return request({
    url: DICTIONARY_URL,
    method: 'put',
    params: dictionaryDTO
  })
}

export function batchRemove(dictionaryDTOS) {
  return request({
    url: DICTIONARY_URL + '/batch',
    data: dictionaryDTOS,
    method: 'delete'
  })
}

export function batchUpdate(dictionaryDTOS) {
  return request({
    url: DICTIONARY_URL + '/batch',
    method: 'put',
    data: dictionaryDTOS
  })
}

/**
 * @param:
 * @return:  CommonResponse<CommonPage<dictionaryVO>>
 * @see
 * @since
 */

export function commonQuery(dictionaryQuery) {
  // debugger
  return request({
    url: DICTIONARY_URL,
    method: 'get',
    params: dictionaryQuery
  })
}

export function queryDictionaryById(id) {
  return request({
    url: DICTIONARY_URL + '/' + id,
    method: 'get'
  })
}

export function queryDictionaryByTypeId(id) {
  return request({
    url: DICTIONARY_URL + '/classify/' + id,
    method: 'get'
  })
}
