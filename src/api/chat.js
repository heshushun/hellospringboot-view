import request from '@/utils/request'

export function friendList(query) {
  return request({
    url: '/user/friend',
    method: 'get',
    params: query
  })
}
