// 在 state 里面只存放最基础的数据。
// 更加语义化的数据可以放在 getter

import { playMode } from 'common/js/config'
import { loadSearch, loadSong, loadFavourite } from 'common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence, // 语义化
  currentIndex: -1,
  disc: {},
  topList: [],
  searchHistory: loadSearch(),
  playHistory: loadSong(),
  favouriteList: loadFavourite()
}

export default state
