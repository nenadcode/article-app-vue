import userApi from '../../../api/user'
import * as types from './mutation-types'
import * as alert from '../alert/mutation-types'
import * as firebase from 'firebase'

const state = {
  user: null,
  loading: false,
  error: null
}

const getters = {
  userInfo: state => state.user
}

const actions = {
  // getUser ({ commit }) {
  //   commit(alert.SET_LOADING, true)
  //   return userApi.getUserAccount()
  //     .then(user => {
  //       commit(alert.SET_LOADING, false)
  //       commit(types.RECEIVE_USER_ACCOUNT, { user: user.data })
  //     })
  //     .catch((error) => {
  //       commit(alert.SET_LOADING, false)
  //       commit(alert.SET_ERROR, error)
  //     })
  // },
  getUser({ commit, getters }) {
    commit(alert.SET_LOADING, true)
    firebase.database().ref('/users/' + getters.userInfo.id + '/registrations/').once('value')
      .then(user => {
        console.log('get user: ', user)
        commit(alert.SET_LOADING, false)
        commit(types.RECEIVE_USER_ACCOUNT, { user: user.data })
      })
      .catch((error) => {
        commit(alert.SET_LOADING, false)
        commit(alert.SET_ERROR, error)
      })
  },
  editUserAccount ({ commit }, editedUser) {
    commit(alert.SET_LOADING, true)
    return userApi.editUserAccount(editedUser)
      .then(editedUser => {
        commit(alert.SET_LOADING, false)
        return editedUser
      })
      .catch(error => {
        commit(alert.SET_LOADING, false)
        commit(alert.SET_ERROR, error)
      })
  },
  changeAccountInfo ({ commit }, changed) {
    commit(types.CHANGE_USER_ACCOUNT, changed)
  },
  resetUserInfo ({ commit }) {
    firebase.auth().signOut()
    commit(types.RESET_USER_INFO)
  },
  registerUser ({ commit }, payload ) {
    commit(alert.SET_LOADING, true)
    commit(alert.CLEAR_ERROR, true)
    firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(user => {
        commit(alert.SET_LOADING, false)
        const newUser = `User with email ${user.user.email} is successfully registered.`
        commit(types.SET_USER, newUser)
      })
      .catch(error => {
        commit(alert.SET_LOADING, false)
        commit(alert.SET_ERROR, error)
        console.log(error)
      })
  },
  loginUser({ commit }, payload) {
    commit(alert.SET_LOADING, true)
    commit(alert.CLEAR_ERROR, true)
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
          .then(user => {
            commit(alert.SET_LOADING, false)
            const newUser = {
              id: user.user.uid,
              email: user.user.email
            }
            commit(types.SET_USER, newUser)
          })
          .catch(error => {
            commit(alert.SET_LOADING, false)
            commit(alert.SET_ERROR, error)
          })
      })
  },
  autoSignIn({ commit }, payload) {
    commit(types.SET_USER, {
      id: payload.uid,
      email: payload.email
    })
  }
}

const mutations = {
  [types.SET_USER] (state, payload) {
    state.user = payload
  },
  [types.RECEIVE_USER_ACCOUNT] (state, { user }) {
    state.user = user
  },
  [types.CHANGE_USER_ACCOUNT] (state, { property, value }) {
    if (!state.userInfo) {
      return
    }
    state.userInfo[property] = value
  },
  [types.RESET_USER_INFO] (state) {
    state.user = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
