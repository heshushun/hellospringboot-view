import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000
})

// request 过滤器 请求前添加token
service.interceptors.request.use(config => {
  if (store.getters.token) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    // config.headers['X-Token'] = getToken()
    config.headers['AuthorizationType'] = '1'
    config.headers['Authorization'] = getToken()
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// respone 过滤器
service.interceptors.response.use(
  response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.response.data
    if (res.data.status === 8888) {
      Message({
        message: res.data.message,
        type: 'error',
        duration: 5 * 1000,
        onClose() {
          removeToken()
          const href = location.href
          location.replace(href.substring(0, href.indexOf('#') + 1) + '/login')
        }
      })
    } else if (res.data.status === 400) {
      Message({
        message: res.data.message,
        type: 'error',
        duration: 2 * 1000
      })
    } else {
      Message({
        message: res.data.message,
        type: 'error',
        duration: 2 * 1000
      })
    }
  },
  error => {
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service
