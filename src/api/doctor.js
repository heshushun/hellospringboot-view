import request from '@/utils/request'

export function doctorList(query) {
  return request({
    url: '/doctor/info/page',
    method: 'get',
    params: query
  })
}

export function createDoctor(data) {
  return request({
    url: '/doctor/info/save',
    method: 'post',
    data
  })
}

export function getSectionIdList() {
  return request({
    url: '/section/info/getSectionIdList',
    method: 'get'
  })
}

export function fetchDoctor(id) {
  return request({
    url: '/doctor/info/getDoctorById',
    method: 'get',
    params: { 'doctorId': id }
  })
}

export function updateDoctor(data) {
  return request({
    url: '/doctor/info/update',
    method: 'post',
    data
  })
}

export function deleteById(data) {
  return request({
    url: '/doctor/info/deleteDoctorById',
    method: 'post',
    data
  })
}
