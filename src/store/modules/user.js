import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { Message } from 'element-ui'
import avator from '@/assets/avator/avator.png'
import { selectByAccount } from '@/api/user'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    portrait: '',
    account: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PORTRAIT: (state, portrait) => {
      state.portrait = portrait
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const that = this
      const account = userInfo.account.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(account, userInfo.password).then(response => { // 调用 login.js
          const data = response.data
          if (data.code === 'BIZ-400') {
            Message({
              message: data.message,
              type: 'error',
              duration: 2 * 1000
            })
            reject(data.message)
          } else {
            commit('SET_TOKEN', data.data.Token)
            setToken(data.data.Token)
            commit('SET_ACCOUNT', account)
            resolve()
            that.dispatch('connect')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        selectByAccount(state.user.account).then(response => { // 调用 根据账号获取用户信息
          const data = response.data
          if (data.code === 'BIZ-400') {
            Message({
              message: data.message,
              type: 'error',
              duration: 2 * 1000
            })
            reject(data.message)
          } else {
            commit('SET_NAME', data.data.name)
            commit('SET_ACCOUNT', data.data.account)
            commit('SET_PORTRAIT', data.data.portrait)
            commit('SET_ROLES', ['admin'])
            commit('SET_AVATAR', avator)
            commit('SET_INTRODUCTION', '认证负责')
            const response = ['aa']
            resolve(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }

  }
}

export default user
