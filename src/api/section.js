import request from '@/utils/request'

export function sectionList(query) {
  return request({
    url: '/section/info/page',
    method: 'get',
    params: query
  })
}

export function createSection(data) {
  return request({
    url: '/section/info/save',
    method: 'post',
    data
  })
}

export function fetchSection(id) {
  return request({
    url: '/section/info/getSectionById',
    method: 'get',
    params: { 'sectionId': id }
  })
}

export function updateSection(data) {
  return request({
    url: '/section/info/update',
    method: 'post',
    data
  })
}

export function deleteById(data) {
  return request({
    url: '/section/info/deleteSectionById',
    method: 'post',
    data
  })
}
