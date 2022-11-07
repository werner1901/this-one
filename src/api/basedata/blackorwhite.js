// eslint-disable-next-line quotes
import request from '@/utils/request'

// eslint-disable-next-line quotes
const BLACKORWHITE_URL = '/v1/blackorwhite'

export function add(blackOrWhiteDTO) {
  return request({
    url: BLACKORWHITE_URL + '/add',
    method: 'post',
    data: blackOrWhiteDTO,
  })
}

export function remove(params) {
  return request({
    url: BLACKORWHITE_URL + '/delete',
    params,
    method: 'delete',
  })
}
/**
 * @param:
 * @return:  CommonResponse<Boolean>
 * @see
 * @since
 */
export function batchRemove(blackOrWhiteDTOS) {
  return request({
    url: BLACKORWHITE_URL + '/batch',
    data: blackOrWhiteDTOS,
    method: 'delete',
  })
}
/**
 * @param:
 * @return:
 * @see
 * @since
 */

export function modify(blackOrWhiteDTO) {
  return request({
    url: BLACKORWHITE_URL + '/modify',
    method: 'put',
    data: blackOrWhiteDTO,
  })
}

/**
 * @param:
 * @return:  CommonResponse<CommonPage<CustomerVO>>
 * @see
 * @since
 */

export function bwcommonQuery(blackOrWhiteQuery) {
  return request({
    url: BLACKORWHITE_URL,
    method: 'get',
    params: blackOrWhiteQuery,
  })
}

export function queryblackOrWhiteById(id) {
  return request({
    url: BLACKORWHITE_URL + '/' + id,
    method: 'get',
  })
}

export function batchUpdate(blackOrWhiteDTOS) {
  return request({
    url: BLACKORWHITE_URL + '/batch',
    method: 'put',
    data: blackOrWhiteDTOS,
  })
}
export function batchadd(blackOrWhiteDTOS) {
  return request({
    url: BLACKORWHITE_URL + '/batchadd',
    data: blackOrWhiteDTOS,
    method: 'post',
  })
}
