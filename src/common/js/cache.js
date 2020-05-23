import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15
const SONG_KEY = '__song__'
const SONG_MAX_LENGTH = 20
const FAVOURITE_KEY = '__favourite__'
const FAVOURITE_MAX_LENGTH = 200

function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 搜索缓存

export function loadSearch () {
  return storage.get(SEARCH_KEY, []) // get(key, def)
}

export function saveSearch (query) {
  let searches = loadSearch()
  insertArray(searches, query, (i) => {
    return i === query
    // return i.id === query.id // 通过 id 来判断
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function deleteSearch (query) {
  let searches = loadSearch()
  if (query === 'CLEARALLQUERY') {
    searches = []
  } else if (!isNaN(query) && searches.length) {
    searches.splice(query, 1)
  }
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 歌曲缓存

export function loadSong () {
  return storage.get(SONG_KEY, [])
}

export function saveSong (song) {
  let history = loadSong()
  insertArray(history, song, (item) => {
    return song.id === item.id
  }, SONG_MAX_LENGTH)
  storage.set(SONG_KEY, history)
  return history
}

// 收藏

export function loadFavourite () {
  let favourite = storage.get(FAVOURITE_KEY, [])
  return favourite
}

export function saveFavourite (song) {
  let favourite = loadFavourite()
  insertArray(favourite, song, (item) => {
    return song.id === item.id
  }, FAVOURITE_MAX_LENGTH)
  storage.set(FAVOURITE_KEY, favourite)
  return favourite
}

export function deleteFavourite (song) {
  let favourite = loadFavourite()
  deleteFromArray(favourite, (item) => {
    return item.id === song.id
  })
  storage.set(FAVOURITE_KEY, favourite)
  return favourite
}
