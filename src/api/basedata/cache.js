/*
 * @Author: your name
 * @Date: 2021-10-27 16:58:22
 * @LastEditTime: 2022-07-25 11:25:10
 * @LastEditors: 18059301505 275895816@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sd365-permission-centre-front-end\src\api\basedata\dictionary.js
 */
// eslint-disable-next-line quotes
import request from '@/utils/request'
// eslint-disable-next-line quotes
const CACHE_URL = '/v1/monitor'

/**
 * 查看键值 key DbSIze 缓存命令
 * @param:
 * @return:   Map<String, Object>
 * @see
 * @since
 */

export function getCacheInfo(key) {
  return request({
    url: CACHE_URL + '/queryCacheInfo',
    method: 'get',
    params: { key: key },
  })
}

/**
 * 查看键值通过 key获取value
 * @param:
 * @return:   Map<String, Object>
 * @see
 * @since
 */

export function queryByKeyValue(key) {
  return request({
    url: CACHE_URL + '/queryByKeyCache',
    method: 'get',
    params: { key: key },
  })
}

/**
 * 删除 key
 * @param:
 * @return:   Map<String, Object>
 * @see
 * @since
 */

export function deleteByKey(key) {
  return request({
    url: CACHE_URL + '/deleteByKey',
    method: 'get',
    params: { key: key },
  })
}
