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
    url: '/user/delete',
    method: 'post',
    params: data
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
    url: '/user/get',
    method: 'get',
    params: { 'id': id }
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/user/updateStatus',
    method: 'post',
    data
  })
}

export function resetPassword(data) {
  return request({
    url: '/user/resetPassword',
    method: 'post',
    params: data
  })
}

export function selectByAccount(data) {
  return request({
    url: '/user/selectByAccount',
    method: 'get',
    params: data
  })
}

export function updatePass(data) {
  return request({
    url: '/user/updatePass',
    method: 'post',
    params: data
  })
}
