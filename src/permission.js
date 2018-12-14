import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 权限判断功能
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/authredirect'] // 没有重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start() // 开始进度条
  if (getToken()) { // 确定令牌
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // 如果当前页面是首页，则不会触发afterEach hook，所以手动处理它
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          store.dispatch('GenerateRoutes', { 'roles': ['admin'] }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,设置.：true，这样导航就不会留下历史记录
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || '验证失败，请再次登录')
            next({ path: '/' })
          })
        })
        /* store.dispatch('GenerateRoutes', { 'roles': ['admin'] }).then(() => { // 根据roles权限生成可访问的路由表
          router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          //next({ ...to }) // hack方法 确保addRoutes已完成 ,设置.：true，这样导航就不会留下历史记录
        })*/
        /* console.log('判断。。。。。。。。。。')
        console.log(store.getters.addRouters)
        router.addRoutes(store.getters.addRouters)
        next()*/
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next()
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
        // 可删 ↑
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // 如果当前页面是登录的，则不会在每次挂钩后触发，所以手动处理它
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 完成进度条
})
