<template>
  <transition appear name='slide'>
    <MusicList :title='title' :bgImage='bgImage' :songs='songs'></MusicList>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import { ERR_OK } from 'api/config'

import MusicList from 'components/music-list/music-list'

export default {
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return 'this.singer.avatar'
    },
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    // 这一步很关键，通过传入的 id ，得到 this.songs
    this._getDetail()
  },
  methods: {
    _getDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer') // 这个厉害，如果直接到详情页，回去 /singer 【边界处理】
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
            this.songs = songs
          })
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        let { musicData } = item
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)

  // 不需要了，因为交给了 MusicList
  // @import '~common/stylus/variable'
  // .singer-detail
  //   position fixed
  //   z-index 100
  //   top 0 // 50% 可以验证，路由不是新页面，而是一个盖住别人的层
  //   left 0
  //   right 0
  //   bottom 0
  //   background $color-background
</style>
