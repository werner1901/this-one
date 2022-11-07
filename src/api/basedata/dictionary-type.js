/*
 * @Author: your name
 * @Date: 2021-10-27 16:58:22
 * @LastEditTime: 2022-03-28 22:51:24
 * @LastEditors: Please set LastEditors
 * @Description:
 * @FilePath: \sd365-permission-centre-front-end\src\api\basedata\dictionary-type.js
 */
import request from '@/utils/request'

const DICTIONARY_TYPE_PATH = 'v1/dictionary-type'

export function info(id) {
  return request({
    url: DICTIONARY_TYPE_PATH + '/' + id,
    method: 'get'
  })
}

export function list(query) {
  return request({
    url: DICTIONARY_TYPE_PATH,
    method: 'get',
    params: query,
  })
}

export function add(data) {
  return request({
    url: DICTIONARY_TYPE_PATH,
    method: 'post',
    data: data,
  })
}

export function modify(data) {
  return request({
    url: DICTIONARY_TYPE_PATH,
    method: 'put',
    data: data,
  })
}

export function remove(data) {
  return request({
    url: DICTIONARY_TYPE_PATH,
    method: 'delete',
    data: data,
  })
}

export function batchRemove(list) {
  return request({
    url: `${DICTIONARY_TYPE_PATH}/batch`,
    method: 'delete',
    data: list,
  })
}
