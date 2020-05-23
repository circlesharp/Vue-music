import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({ // 单例模式
  actions,
  getters,
  state,
  mutations,
  strict: debug, // 检查 state 的修改是否来源于 mutations
  plugins: debug ? [ createLogger() ] : []
})
