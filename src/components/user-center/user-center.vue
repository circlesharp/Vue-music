<template>
  <transition name='slide'>
    <div class="user-center">
      <div class="back" @click='back'>
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <Switches @switchIndexChange='switchItem' :switches='switches' :currentIndex='switchIndex'></Switches>
      </div>
      <div class="play-btn" @click='random' ref='playBtn'>
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref='listWrapper'>
        <Scroll class='list-scroll' v-if='switchIndex === 0' :data='favouriteList' ref='favouriteList'>
          <div class="list-inner">
            <SongList :songs='favouriteList' @select='selectSong'></SongList>
          </div>
        </Scroll>
        <Scroll class='list-scroll' v-if='switchIndex === 1' :data='playHistory' ref='playHistory'>
          <div class="list-inner">
            <SongList :songs='playHistory' @select='selectSong'></SongList>
          </div>
        </Scroll>
      </div>
      <div class="no-result-wrapper" v-show='noResult.isShow'>
        <NoResult :title='noResult.title'></NoResult>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Song from 'common/js/song'
import NoResult from 'base/no-result/no-result'
import { playlistMixin } from 'common/js/mixin'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [ playlistMixin ],
  data () {
    return {
      switchIndex: 0,
      switches: [
        { name: '我喜欢的' },
        { name: '最近听的' }
      ]
    }
  },
  computed: {
    noResult () {
      return {
        isShow: this.switchIndex === 0 ? this.favouriteList.length === 0 : this.playHistory.length === 0,
        title: this.switchIndex === 0 ? '暂无收藏歌曲' : '你还没听歌呢~'
      }
    },
    ...mapGetters([
      'favouriteList', 'playHistory'
    ])
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.listWrapper.style.bottom = bottom
      // 因为用了 v-if 所以可能不存在的
      this.$refs.favouriteList && this.$refs.favouriteList.refresh()
      this.$refs.playHistory && this.$refs.playHistory.refresh()
    },
    switchItem (index) {
      this.switchIndex = index
    },
    selectSong (song) {
      this.insertSong(new Song(song))
    },
    back () {
      this.$router.back()
    },
    random () {
      // const rawList = this.switchIndex === 0 ? this.favouriteList : this.playHistory
      // const list = []
      // rawList.forEach((item) => {
      //   list.push(new Song(item))
      // })
      let list = this.switchIndex === 0 ? this.favouriteList : this.playHistory
      list = list.map((item) => {
        return new Song(item)
      }) // 使用 映射 和 forEach 方法都行
      this.randomPlay({ list })
    },
    ...mapActions([
      'insertSong', 'randomPlay'
    ])
  },
  components: {
    Switches, Scroll, SongList, NoResult
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
