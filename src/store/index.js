import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import getters from './getters'
import '../lib/sockjs'
import '../lib/stomp'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    msgList: [], // 消息列表
    isDotMap: new Map(), // 是否提醒
    currentFriend: {}, // 当前好友
    chatStomp: Stomp.over(new SockJS('/ws/endpointChat'))
  },
  mutations: {
    updateMsgList(state, newMsgList) {
      state.msgList = newMsgList
    },
    updateCurrentFriend(state, newFriend) {
      state.currentFriend = newFriend
    },
    addValue2DotMap(state, key) {
      state.isDotMap.set(key, '您有未读消息')
    },
    removeValueDotMap(state, key) {
      state.isDotMap.delete(key)
    }
  },
  actions: {
    connect(context) {
      // debugger
      context.state.chatStomp = Stomp.over(new SockJS('/ws/endpointChat'))
      context.state.chatStomp.connect({}, frame => {
        context.state.chatStomp.subscribe('/user/queue/chat', message => {
          console.log('收到消息：' + message.body)
          var msg = JSON.parse(message.body)
          var oldMsg = window.localStorage.getItem(context.state.user.account + '#' + msg.from)
          if (oldMsg === null) {
            oldMsg = []
            oldMsg.push(msg)
            window.localStorage.setItem(context.state.user.account + '#' + msg.from, JSON.stringify(oldMsg))
          } else {
            var oldMsgJson = JSON.parse(oldMsg)
            oldMsgJson.push(msg)
            window.localStorage.setItem(context.state.user.account + '#' + msg.from, JSON.stringify(oldMsgJson))
          }
          if (msg.from !== context.state.currentFriend.account) {
            context.commit('addValue2DotMap', 'isDot#' + context.state.user.account + '#' + msg.from)
          }
          // 更新msgList
          var oldMsg2 = window.localStorage.getItem(context.state.user.account + '#' + context.state.currentFriend.account)
          if (oldMsg2 === null) {
            context.commit('updateMsgList', [])
          } else {
            context.commit('updateMsgList', JSON.parse(oldMsg2))
          }
        })
      }, failedMsg => {

      })
    }
  },
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user
  },
  getters
})

export default store
