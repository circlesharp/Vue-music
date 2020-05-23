import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([ 'playlist' ])
  },
  mounted () {
    this.handlePlaylist(this.playlist)
  },
  activated () {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist () { // 这个将被覆盖
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playModeMixin = {
  computed: {
    iconMode () {
      let modeArr = Object.keys(playMode)
      return `icon-${modeArr[this.mode]}`
    },
    playModeText () {
      let text = ''
      switch (this.mode) {
        case 1:
          text = '单曲循环'
          break
        case 2:
          text = '随机播放'
          break
        default:
          text = '顺序播放'
      }
      return text
    },
    ...mapGetters([
      'currentSong',
      'mode',
      'sequenceList',
      'favouriteList'
    ])
  },
  methods: {
    changeMode () {
      let mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = []
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return this.currentSong.id === item.id
      })
      this.setCurrentIndex(index)
    },
    toggleFavorite (song) {
      if (this.isFavorite(song)) {
        this.deleteFavouriteList(song)
      } else {
        this.saveFavouriteList(song)
      }
    },
    getFavoriteIcon (song = this.currentSong) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    isFavorite (song) {
      let index = this.favouriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index !== -1
    },
    ...mapActions([
      'saveFavouriteList', 'deleteFavouriteList'
    ]),
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE'
    })
  }
}

export const searchMixin = {
  data () {
    return {
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    blurInput () {
      this.$refs.searchBox.blur()
    },
    saveSearch (data) {
      this.saveSearchHistory(data.content)
    },
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange (query) {
      this.query = query
    },
    deleteHistory (index) {
      this.deleteSearchHistory(index)
    },
    ...mapActions([
      'saveSearchHistory', 'deleteSearchHistory'
    ])
  }
}
