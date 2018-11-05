
import request from '@/utils/request'

export function taskList(query) {
  return request({
    url: '/task/page',
    method: 'get',
    params: query
  })
}

export function deleteById(data) {
  return request({
    url: '/task/deleteTaskById',
    method: 'post',
    data
  })
}

export function createTask(data) {
  return request({
    url: '/task/save',
    method: 'post',
    data
  })
}

export function fetchTask(id) {
  return request({
    url: '/task/getTaskById',
    method: 'get',
    params: { 'taskId': id }
  })
}

export function updateTask(data) {
  return request({
    url: '/task/update',
    method: 'post',
    data
  })
}

export function updateTaskStatus(data) {
  return request({
    url: '/task/updateTaskStatus',
    method: 'post',
    data
  })
}

export function updateTaskOnline(data) {
  return request({
    url: '/task/updateTaskOnline',
    method: 'post',
    data
  })
}

export function initTasks() {
  return request({
    url: '/quartz/task/init',
    method: 'get'
  })
}
