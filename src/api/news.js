import request from '@/utils/request'

export function newsList(query) {
  return request({
    url: '/news/info/page',
    method: 'get',
    params: query
  })
}

export function fetchNews(id) {
  return request({
    url: '/news/info/getNewsById',
    method: 'get',
    params: { 'newsId': id }
  })
}

export function updateNews(data) {
  return request({
    url: '/news/info/update',
    method: 'post',
    data
  })
}

export function createNews(data) {
  return request({
    url: '/news/info/save',
    method: 'post',
    data
  })
}

export function deleteById(data) {
  return request({
    url: '/news/info/deleteNewsById',
    method: 'post',
    data
  })
}
