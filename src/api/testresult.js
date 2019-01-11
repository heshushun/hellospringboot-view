
import request from '@/utils/request'

export function testresultList(query) {
  return request({
    url: '/testresult/page',
    method: 'get',
    params: query
  })
}

export function projectList() {
  return request({
    url: '/testresult/getProjectList',
    method: 'get'
  })
}

export function TsList() {
  return request({
    url: '/testresult/getTsList',
    method: 'get'
  })
}

export function getExportList(query) {
  return request({
    url: '/testresult/getTestresultList',
    method: 'get',
    params: query
  })
}

export function fetchTestResult(id) {
  return request({
    url: '/testresult/getTestresultById',
    method: 'get',
    params: { 'testresultId': id }
  })
}

export function exportTestResult(query) {
  return request({
    url: '/testresult/exportTestResult',
    method: 'get',
    params: query,
    responseType: 'blob' // 二进制流
  })
}
