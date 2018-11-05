import request from '@/utils/request'

export function noticeList(query) {
  return request({
    url: '/notice/info/page',
    method: 'get',
    params: query
  })
}

export function fetchNotice(id) {
  return request({
    url: '/notice/info/getNoticeById',
    method: 'get',
    params: { 'noticeId': id }
  })
}

export function updateNotice(data) {
  return request({
    url: '/notice/info/update',
    method: 'post',
    data
  })
}

export function createNotice(data) {
  return request({
    url: '/notice/info/save',
    method: 'post',
    data
  })
}

export function deleteById(data) {
  return request({
    url: '/notice/info/deleteNoticeById',
    method: 'post',
    data
  })
}
