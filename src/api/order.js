import request from '@/utils/request'

export function orderList(query) {
  return request({
    url: '/order/info/getListByCondition',
    method: 'get',
    params: query
  })
}


