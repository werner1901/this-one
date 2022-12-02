// <!--
//  * @Author: abel.han
//  * @Date: 2022-7-09 11:45:25
//  * @LastEditTime: 2022-7-09 11:45:25
//  * @LastEditors: hpl
//  * @Description: In User Settings Edit
//  * @FilePath: /sd365-tms-omp-front-end/src/api/audit/audit.js
// -->
// eslint-disable-next-line quotes
// eslint-disable-next-line quotes
import request from '@/utils/request'

const AUDIT_URL = '/v1/audit'
/**
 * @param: 区域 DTO
 * @return: 成功则true CommonResponse 应答码和消息统一参考基础框架
 * @see
 * @since
 */

/**
 * @param:
 * @return:  CommonResponse<CommonPage<AuditVO>>
 * @see
 * @since
 */
export function commonQuery(auditQuery) {
  return request({
    url: AUDIT_URL,
    method: 'get',
    params: auditQuery
  })
}

export function queryAuditByUsp(isusp) {
  return request({
    url: AUDIT_URL + '/usp/' + isusp,
    method: 'get'
  })
}

export function queryAuditByNup(isnup) {
  return request({
    url: AUDIT_URL + '/nup/' + isnup,
    method: 'get'
  })
}

export function queryAuditBylnl(islnl) {
  return request({
    url: AUDIT_URL + '/lnl/' + islnl,
    method: 'get'
  })
}
