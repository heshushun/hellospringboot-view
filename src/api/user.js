import request from '@/utils/request'

export function userList(query) {
  return request({
    url: '/user/page',
    method: 'get',
    params: query
  })
}

export function deleteById(data) {
  return request({
    url: '/user/deleteUserById',
    method: 'post',
    data
  })
}

export function createUser(data) {
  return request({
    url: '/user/save',
    method: 'post',
    data
  })
}

export function fetchUser(id) {
  return request({
    url: '/user/getUserById',
    method: 'get',
    params: { 'userId': id }
  })
}
