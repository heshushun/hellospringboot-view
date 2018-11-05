import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/banner/info/page',
    method: 'get',
    params: query
  })
}
export function fetchBanner(id) {
  return request({
    url: '/banner/info/getBannerById',
    method: 'get',
    params: { 'bannerId': id }
  })
}

export function createBanner(data) {
  return request({
    url: '/banner/info/save',
    method: 'post',
    data
  })
}

export function updateBanner(data) {
  return request({
    url: '/banner/info/update',
    method: 'post',
    data
  })
}

export function deleteById(data) {
  return request({
    url: '/banner/info/deleteBannerById',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/banner/info/updateStatus',
    method: 'post',
    data
  })
}
