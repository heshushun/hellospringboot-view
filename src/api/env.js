import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/env/info/page',
    method: 'get',
    params: query
  })
}
export function fetchEnv(id) {
  return request({
    url: '/env/info/getEnvById',
    method: 'get',
    params: { 'envId': id }
  })
}

export function createEnv(data) {
  return request({
    url: '/env/info/save',
    method: 'post',
    data
  })
}

export function updateEnv(data) {
  return request({
    url: '/env/info/update',
    method: 'post',
    data
  })
}

export function deleteById(data) {
  return request({
    url: '/env/info/deleteEnvById',
    method: 'post',
    data
  })
}
