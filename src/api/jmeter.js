
import request from '@/utils/request'

export function jmeterList(query) {
  return request({
    url: '/jmeter/page',
    method: 'get',
    params: query
  })
}

export function deleteById(data) {
  return request({
    url: '/jmeter/deleteJmeterById',
    method: 'post',
    data
  })
}

export function createJmeter(data) {
  return request({
    url: '/jmeter/save',
    method: 'post',
    data
  })
}

export function startJmx(data) {
  return request({
    url: '/jmeter/startJmx',
    method: 'post',
    data
  })
}
