// eslint-disable-next-line quotes
// eslint-disable-next-line quotes
import request from '@/utils/request'

// eslint-disable-next-line quotes
const COMPANY_URL = '/v1/company'
/**
 * @param: 公司 DTO
 * @return: 成功则true CommonResponse 应答码和消息统一参考基础框架
 * @see
 * @since
 */
export function addCompany(companyDTO) {
  return request({
    url: COMPANY_URL + '/add',
    method: 'post',
    data: companyDTO,
  })
}

export function removeCompany(id, version) {
  return request({
    url: COMPANY_URL + '/delete',
    params: { id: id, version: version },
    method: 'delete',
  })
}

export function removeBatchCompany(deleteCompanyDTOS) {
  return request({
    url: COMPANY_URL + '/batch',
    data: deleteCompanyDTOS,
    method: 'delete',
  })
}

export function modifyCompany(companyDTO) {
  return request({
    url: COMPANY_URL + '/modify',
    method: 'put',
    data: companyDTO,
  })
}

/**
 * @param:
 * @return:  CommonResponse<CommonPage<CustomerVO>>
 * @see
 * @since
 */
export function commonQuery(companyQuery) {
  return request({
    url: COMPANY_URL,
    method: 'get',
    params: companyQuery,
  })
}

/**
 * @param:companyDTOS
 * @return: 批量修改结果
 * @see
 * @since
 */
export function batchUpdateCompany(idVersionQueryList) {
  return request({
    url: COMPANY_URL + '/batch',
    method: 'put',
    data: idVersionQueryList,
  })
}
export function queryCompanyById(id) {
  return request({
    url: COMPANY_URL + '/' + id,
    method: 'get',
  })
}

export function copyCompany(companyDTO) {
  return request({
    url: COMPANY_URL + '/copy',
    method: 'post',
    data: companyDTO,
  })
}
/**
 * @author Yan Huazhi
 * @date 2020/12/18 9:22
 * @param {*} companyDTO
 */
export function status(companyDTO) {
  return request({
    url: COMPANY_URL + '/status',
    method: 'put',
    data: companyDTO,
  })
}
