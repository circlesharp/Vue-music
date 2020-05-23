function getRandomInt (min, max) {
  const randomInt = Math.floor(Math.random() * (max - min + 1) + min) // 因为是向下取整，所以要 + 1
  return randomInt
}

export function shuffle (arr) {
  let i, temp, tempIndex
  let len = arr.length
  let copyArr = Array.from(arr)
  for (i = 0; i < len; i++) {
    temp = copyArr[i]
    tempIndex = getRandomInt(0, len - 1)
    copyArr[i] = copyArr[tempIndex]
    copyArr[tempIndex] = temp
  }
  return copyArr
}

export function showSongName (songList) {
  let songName = songList.map((i) => {
    return i.name
  })
  return songName
}

// 截流
export function debounce (func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
