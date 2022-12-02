/*
 * @Author: your name
 * @Date: 2022-03-28 21:41:24
 * @LastEditTime: 2022-03-28 22:25:35
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sd365-permission-centre-front-end\src\api\org\department.js
 */
// eslint-disable-next-line quotes
import request from '@/utils/request'

// eslint-disable-next-line quotes
const DEPARTMENT_URL = '/v1/department'
/**
 * @param: 部门 DTO
 * @return: 成功则true CommonResponse 应答码和消息统一参考基础框架
 * @see
 * @since
 */

export function add(departmentDTO) {
  return request({
    url: DEPARTMENT_URL + '/departmentAdd',
    method: 'post',
    data: departmentDTO,
  })
}

export function remove(id, version) {
  return request({
    url: DEPARTMENT_URL + '/departmentDelete',
    params: { id: id, version: version }, // id 和 发行版本
    method: 'delete',
  })
}

export function modify(departmentDTO) {
  return request({
    url: DEPARTMENT_URL + '/departmentUpdate',
    method: 'put',
    data: departmentDTO,
  })
}

export function queryDepartmentById(id) {
  return request({
    url: DEPARTMENT_URL + '/' + id,
    method: 'get',
  })
}

/**
 * @param: departmentQuery部门查询条件
 * @return:
 * @see
 * @since
 */
export function commonQueryDepartment(departmentQuery) {
  return request({
    url: DEPARTMENT_URL,
    method: 'get',
    params: departmentQuery,
  })
}

export function treeQueryDepartment(params) {
  return request({
    url: DEPARTMENT_URL + '/deptree',
    method: 'get',
    params,
  })
}

/**
 * @param: departmentDTOS
 * @return:  批量修改结果
 * @see
 * @since
 */
export function batchUpdateDepartment(departmentDTOS) {
  return request({
    url: DEPARTMENT_URL + '/batch',
    method: 'put',
    data: departmentDTOS,
  })
}

export function batchRemove(departmentDTOS) {
  return request({
    url: DEPARTMENT_URL + '/deleteBatch',
    method: 'delete',
    data: departmentDTOS,
  })
}
/**
 * 修改单条启用状态
 * @author Yan Huazhi
 * @date 2020/12/18 9:36
 * @param {*} departmentDTO
 */
export function status(departmentDTO) {
  return request({
    url: DEPARTMENT_URL + '/status',
    method: 'put',
    data: departmentDTO,
  })
}
