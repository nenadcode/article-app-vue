import * as types from './mutation-types'

const state = {
  loading: false,
  storeError: null
}

const getters = {
  loading: state => state.loading,
  storeError: state => state.storeError
}

const actions = {
  clearError ({ commit }) {
    commit('clearError')
  }
}

const mutations = {
  [types.SET_LOADING] (state, payload) {
    state.loading = payload
  },
  [types.SET_ERROR] (state, payload) {
    state.storeError = payload
  },
  [types.CLEAR_ERROR] (state) {
    state.storeError = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
