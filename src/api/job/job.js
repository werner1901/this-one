// eslint-disable-next-line quotes
// eslint-disable-next-line quotes
import request from '@/utils/request'

// eslint-disable-next-line quotes
const JOB_URL = '/v1/job'
/**
 *增加任务
 *  @param: jobDTO
 * @return: 成功则true CommonResponse 应答码和消息统一参考基础框架
 * @see
 * @since
 */
export function addJob(jobDTO) {
  return request({
    url: JOB_URL + '/add',
    method: 'post',
    data: jobDTO,
  })
}
/**
 * 删除任务
 * @param {*} id 
 * @param {*} version 
 * @param {*} jobName
 * @returns 
 */
export function removeJob(id,version,jobName) {
  return request({
    url: JOB_URL+'/delete',
    params: { id: id,version: version,jobName: jobName},
    method: 'delete',
  })
}

/**
 * 修改任务
 */
export function modifyJob(jobDTO) {
  return request({
    url: JOB_URL + '/modify',
    method: 'put',
    data: jobDTO,
  })
}

/**
 * @param:
 * @return:  CommonResponse<CommonPage<CustomerVO>>
 * @see
 * @since
 */
export function commonQuery(jobQuery) {
  return request({
    url: JOB_URL,
    method: 'get',
    data: jobQuery,
  })
}

/**
 * 停止任务
 * @param {*} jobDTO 
 * @returns 
 */
export function pauseJob(jobDTO){
  return request({
    url: JOB_URL+'/pauseJob',
    method: 'put',
    data: jobDTO,
  })
}

/**
 * 启动任务
 * @param {*} jobDTO 
 * @returns 
 */
export function resume(jobDTO){
  return request({
    url: JOB_URL+'/resumeJob',
    method: 'put',
    data: jobDTO,
  })
}
/**
 * 立即执行一次
 * @param {*} jobDTO 
 * @returns 
 */
export function runOnce(jobDTO){
  return request({
    url: JOB_URL+'/runOnce',
    method: 'put',
    data: jobDTO,
  })
}