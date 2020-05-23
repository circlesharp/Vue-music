import * as types from './mutation-types'

const mutations = {
  // [变量名] -> 计算属性名
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag // flag 表示布尔值
  },
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST] (state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  },
  [types.SET_DISC] (state, disc) {
    state.disc = disc
  },
  [types.SET_TOP_LIST] (state, topList) {
    state.topList = topList
  },
  [types.SET_SEARCH_HISTORY] (state, searchHistory) {
    state.searchHistory = searchHistory
  },
  [types.SET_PLAY_HISTORY] (state, playHistory) {
    state.playHistory = playHistory
  },
  [types.SET_FAVOURITE_LIST] (state, favouriteList) {
    state.favouriteList = favouriteList
  },
  [types.DELETE_FAVOURITE_LIST] (state, favouriteList) {
    state.favouriteList = favouriteList
  }
}

export default mutations
