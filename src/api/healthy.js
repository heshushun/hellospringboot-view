import request from '@/utils/request'

export function healthyList(query) {
  return request({
    url: '/healthy/info/page',
    method: 'get',
    params: query
  })
}

export function fetchHealthy(id) {
  return request({
    url: '/healthy/info/getHealthyById',
    method: 'get',
    params: { 'healthyId': id }
  })
}

export function updateHealthy(data) {
  return request({
    url: '/healthy/info/update',
    method: 'post',
    data
  })
}

export function createHealthy(data) {
  return request({
    url: '/healthy/info/save',
    method: 'post',
    data
  })
}

export function deleteById(data) {
  return request({
    url: '/healthy/info/deleteHealthyById',
    method: 'post',
    data
  })
}
