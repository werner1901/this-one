/*
 * @Author: 18059301505 275895816@qq.com
 * @Date: 2021-10-27 16:58:22
 * @LastEditors: 18059301505 275895816@qq.com
 * @LastEditTime: 2022-10-12 15:46:00
 * @FilePath: \sd365-permission-centre-front-end\src\api\user.js
 * @Description: 该文件原名为user.js 现在更新为authentication.js对应后端的认证功能接口<br>
 * 另外接口求中中的 /vue-admin-template/user/login 更新为 /v1/user/login 重构了接口的命名的规范性后端做相应的调整
 */
import request from '@/utils/request'
/**
 *  前端发起登录请求的时候调用此接口 此接口在/store/moudle/user.js 中发起调用
 * @param {*} data  登录数据 包含 工号，密码，租户账号
 */
export function login(data) {
  return request({
    url: '/v1/user/login',
    method: 'get',
    params: data,
  })
}
/**
 * 前端 登录认证成功后 进入 主控制台的时候 在permission.js 的router拦截器中发起 用户信息获取的调用，这些信息包含了* 角色和资源列表
 * @param {*} data 用户基本信息，header中已经是携带token
 */
export function getInfo(data) {
  return request({
    url: '/v1/user/info',
    method: 'get',
    params: data,
  })
}
/**
 * 通知后端用户登录做相应前后端的状态清除包括前端store后端token等
 * @param {*} data 用户基本信息
 */
export function logout(data) {
  return request({
    url: '/v1/user/logout',
    method: 'get',
    params: data,
  })
}
