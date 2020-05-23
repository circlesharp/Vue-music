<template>
  <transition appear name='slide'>
    <MusicList :bgImage='bgImage' :songs='songs' :title='title' :rank='true'></MusicList>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { ERR_OK } from 'api/config'
import { getMusicList } from 'api/rank'
import { isValidMusic, createSong, processSongsUrl } from 'common/js/song'

export default {
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.topList.topTitle
    },
    bgImage () {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return 'this.topList.imgUrl'
    },
    ...mapGetters([
      'topList'
    ])
  },
  created () {
    this._getMusicList()
  },
  methods: {
    _getMusicList () {
      if (!this.topList.id) {
        this.$router.push('/rank')
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          const rawSongList = res.songlist
          processSongsUrl(this._normalizeSongs(rawSongList)).then((songs) => {
            this.songs = songs
          })
        }
      })
    },
    _normalizeSongs (songlist) {
      const res = []
      songlist.forEach((song) => {
        if (isValidMusic(song.data)) {
          res.push(createSong(song.data))
        }
      })
      return res
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition all 0.3s ease
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>