import { register, login, logout } from '@/api/user'
import { getInfo } from '@/api/kuaishou'
import { getUnreadNotices } from '@/api/notice'
import { resetRouter } from '@/router'
import md5 from 'js-md5'

const getDefaultState = () => {
  return {
    hasLogin: false,
    hasAuth: false,
    username: 'nanashi',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    notices: 0,
    details: {},
    noticenum: 0,
    nickename: '名無し',
    authurl: ''
  }
}

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_AUTH: (state) => {
    state.hasAuth = true
  },
  SET_UNAUTH: (state) => {
    state.hasAuth = false
  },
  SET_LOGIN: (state) => {
    state.hasLogin = true
  },
  SET_LOGOUT: (state) => {
    state.hasLogin = false
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_NOTICES: (state, notices) => {
    state.notices = notices
  },
  SET_NOTICENUM: (state, noticenum) => {
    state.noticenum = noticenum
  },
  SET_NICKNAME: (state, nickname) => {
    state.nickname = nickname
  },
  SET_DETAILS: (state, details) => {
    state.details = details
  },
  SET_AUTHURL: (state, authurl) => {
    state.authurl = authurl
  }
}

const actions = {

  // user register
  register({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // register with trim
      register({ username: username.trim(), password: md5(password) }).then(response => {
        if (response.code === 200) {
          commit('SET_LOGIN')
          resolve(response)
        } else if (response.code === 400) {
          resolve(response)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // login with trim
      login({ username: username.trim(), password: md5(password) }).then(response => {
        if (response.code === 200) {
          commit('SET_LOGIN')
          resolve(response)
        } else if (response.code === 400) {
          resolve(response)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        // now judge if backend return a auth url, or authorized data
        if (response.code === 200) {
          commit('SET_LOGIN')
          commit('SET_AUTH')
          commit('SET_USERNAME', data.username)
          commit('SET_AVATAR', data.info.avatar)
          commit('SET_NICKNAME', data.info.name)
          commit('SET_DETAILS', data.info.details)
          resolve(response)
        } else if (response.code === 202) {
          commit('SET_LOGIN')
          commit('SET_UNAUTH')
          commit('SET_USERNAME', data.username)
          commit('SET_AUTHURL', data.authurl)
          resolve(response)
        }
      }).catch(error => {
        reject(error)
      })
      getUnreadNotices().then(response => {
        const { notices } = response
        if (response.code === 200) {
          commit('SET_NOTICENUM', notices.length)
          commit('SET_NOTICES', notices)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // reset state
  resetState({ commit }) {
    return new Promise(resolve => {
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations,
  actions
}
