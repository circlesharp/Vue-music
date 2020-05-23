<template>
  <transition appear name='slide'>
    <MusicList :title='title' :bgImage='bgImage' :songs='songs'></MusicList>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getSongList } from 'api/recommend'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import { ERR_OK } from 'api/config'

export default {
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  created () {
    this._getSongList()
  },
  methods: {
    _getSongList () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
      }
      getSongList(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          const rawSongList = res.cdlist[0].songlist
          processSongsUrl(this._normalistSonglist(rawSongList)).then((songs) => {
            this.songs = songs
          })
          // this.songs = normaliszeSongs
        }
      })
    },
    _normalistSonglist (rawSongList) {
      let res = []
      rawSongList.forEach((song) => {
        if (isValidMusic(song)) {
          res.push(createSong(song))
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
    transition all 0.3s

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>