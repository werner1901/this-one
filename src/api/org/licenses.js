import request from '@/utils/request'

const LICENSES_URL = '/v1/licenses'

export function showInfo() {
  return request({
    url: LICENSES_URL,
    method: 'get'
  })
}
