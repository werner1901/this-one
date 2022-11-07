// eslint-disable-next-line quotes
import request from '@/utils/request'

// eslint-disable-next-line quotes
const DICTIONARY_CENTRE_URL = '/permission/centre/v1/dictionary'
/**
 * @param: 客户DTO
 * @return: 成功则true CommonResponse 应答码和消息统一参考基础框架
 * @see
 * @since
 */

export function add(dictionaryDTO) {
  return request({
    url: DICTIONARY_CENTRE_URL,
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
    url: DICTIONARY_CENTRE_URL,
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
    url: DICTIONARY_CENTRE_URL,
    method: 'put',
    params: dictionaryDTO
  })
}

export function batchRemove(dictionaryDTOS) {
  return request({
    url: DICTIONARY_CENTRE_URL + '/batch',
    data: dictionaryDTOS,
    method: 'delete'
  })
}

export function batchUpdate(dictionaryDTOS) {
  return request({
    url: DICTIONARY_CENTRE_URL + '/batch',
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
  return request({
    url: DICTIONARY_CENTRE_URL,
    method: 'get',
    params: dictionaryQuery
  })
}

export function queryDictionaryById(id) {
  return request({
    url: DICTIONARY_CENTRE_URL + '/' + id,
    method: 'get'
  })
}

export function queryDictionaryByTypeId(id) {
  return request({
    url: DICTIONARY_CENTRE_URL + '/classify/' + id,
    method: 'get'
  })
}

