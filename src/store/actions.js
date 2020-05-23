import * as types from './mutation-types'
import { shuffle } from 'common/js/util'
// import { shuffle, showSongName } from 'common/js/util'
import { playMode } from 'common/js/config'
import { saveSearch, deleteSearch, saveSong, saveFavourite, deleteFavourite } from 'common/js/cache'

const fIndex = function (playlist, song) {
  return playlist.findIndex((item) => {
    return item.id === song.id
  })
}

export const selecePlay = function ({ commit }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({ commit }, { list, index = 0 }) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, shuffle(list))
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, false)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_PLAY_MODE, playMode.random)
}

export const insertSong = function ({ commit, state }, song) {
  let playlist = Array.from(state.playlist) // ps. 创建副本，也可以用 .slice() 方法
  let sequenceList = Array.from(state.sequenceList)
  let currentIndex = state.currentIndex
  let pyIndex = fIndex(playlist, song)
  let sqIndex = fIndex(sequenceList, song)
  // console.log(playlist, sequenceList, currentIndex, song) // 这里通过布拉格广场做测试
  if (sqIndex > -1) { // 歌曲存在
    playlist.splice(pyIndex, 1)
    sequenceList.splice(sqIndex, 1)
    pyIndex = (pyIndex <= currentIndex) ? currentIndex : ++currentIndex
    currentIndex--
  }
  currentIndex++
  playlist.splice(currentIndex, 0, song)
  sequenceList.splice(sqIndex === -1 ? currentIndex : sqIndex, 0, song) // 如果不改变sequenceList, 切换播放模式就可能有问题
  // console.log(showSongName(playlist), showSongName(sequenceList), currentIndex) // 这里通过布拉格广场做测试
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const deleteSong = function ({ commit, state }, song) {
  let playlist = Array.from(state.playlist) // ps. 创建副本，也可以用 .slice() 方法
  let sequenceList = Array.from(state.sequenceList)
  let currentIndex = state.currentIndex
  let pyIndex = fIndex(playlist, song)
  let sqIndex = fIndex(sequenceList, song)

  playlist.splice(pyIndex, 1)
  sequenceList.splice(sqIndex, 1)
  if (currentIndex > pyIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  const playingState = playlist.length > 0

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYING_STATE, playingState)
}

export const deleteSongList = function ({ commit }) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export function saveSearchHistory ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export function deleteSearchHistory ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export function saveSongHistory ({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, saveSong(song))
}

export function saveFavouriteList ({ commit }, song) {
  console.log('saveFavouriteList')
  commit(types.SET_FAVOURITE_LIST, saveFavourite(song))
}

export function deleteFavouriteList ({ commit }, song) {
  console.log('deleteFavouriteList')
  commit(types.DELETE_FAVOURITE_LIST, deleteFavourite(song))
}
