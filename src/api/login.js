import request from '@/utils/request'

// 登入
export function loginByUsername(account, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      account: account,
      password: password
    }
  })
}

// 登出
export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

// 获取用户信息
export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

