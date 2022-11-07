import request from '@/utils/request'

const MODULE_URL = '/v1/module'

export function commonQuery(moduleQuery) {
  return request({
    url: MODULE_URL,
    method: 'get',
    params: moduleQuery
  })
}

export function addModule(moduleDTO) {
  return request({
    url: MODULE_URL + '/add',
    method: 'post',
    data: moduleDTO
  })
}

export function removeModule(id, version) {
  return request({
    url: MODULE_URL + '/delete',
    params: { id: id, version: version },
    method: 'delete'
  })
}

export function removeBatchModule(deleteModuleDTOS) {
  return request({
    url: MODULE_URL + '/batch',
    method: 'delete',
    data: deleteModuleDTOS
  })
}

export function modifyModule(moduleDTO) {
  return request({
    url: MODULE_URL + '/modify',
    method: 'put',
    data: moduleDTO
  })
}

export function batchUpdateModule(idVersionQueryList) {
  return request({
    url: MODULE_URL + '/batch',
    method: 'put',
    data: idVersionQueryList
  })
}

export function queryModuleById(id) {
  return request({
    url: MODULE_URL + '/' + id,
    method: 'get'
  })
}

export function status(moduleDTO) {
  return request({
    url: MODULE_URL + '/status',
    method: 'put',
    data: moduleDTO
  })
}
