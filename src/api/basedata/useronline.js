import request from '@/utils/request'

const USERONLINE_CENTRE_URL = '/v1/user/online'

// 查询在线用户列表
export function list(query) {
  return request({
    url: USERONLINE_CENTRE_URL,
    method: 'get',
    params: query
  })
}

// 强退用户
export function forceLogout(ids) {
  return request({
    url: USERONLINE_CENTRE_URL,
    method: 'delete',
    params: ids
  })
}
