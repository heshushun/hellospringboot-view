
import request from '@/utils/request'

export function companyList(query) {
  return request({
    url: '/company/page',
    method: 'get',
    params: query
  })
}

export function industryList() {
  return request({
    url: '/company/getIndustryList',
    method: 'get'
  })
}
