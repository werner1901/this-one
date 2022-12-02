import request from '@/utils/request'

const MESSAGE_URL = '/v1/message'

export default {
  commonQuery(messageQuery) {
    return request({
      url: MESSAGE_URL,
      method: 'get',
      params: messageQuery
    })
  },
  add(message) {
    return request({
      url: MESSAGE_URL,
      method: 'post',
      data: message
    })
  },
  remove(id, version) {
    return request({
      url: MESSAGE_URL,
      method: 'delete',
      params: { id, version }
    })
  },
  update(message){
    return request({
      url: MESSAGE_URL,
      method: 'put',
      data: message
    })
  },
  batchRemove(idVersionQueryList){
    return request({
      url: MESSAGE_URL + '/batch',
      method: 'delete',
      data: idVersionQueryList
    })
  },
  batchUpdate(messageList){
    return request({
      url: MESSAGE_URL + '/batch',
      method: 'put',
      data: messageList
    })
  },

}
