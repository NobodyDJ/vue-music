import { createStore, createLogger } from 'vuex'
import state from './state'
import * as getters from './getters'
import mutations from './mutations'
import * as actions from './actions'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state,
  getters,
  mutations,
  actions,
  // 以下配置的作用是？主要用于在开发环境下，调试vuex的状态的变化
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
