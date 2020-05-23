<template>
  <transition name='slide'>
    <!-- 使用 v-if 条件渲染，因为有屎一样的 better-scroll -->
    <div class="add-song" v-if='showFlag' @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click='hide'>
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <SearchBox :clearQuery='true' @query='onQueryChange' placeholder='搜索歌曲' ref='searchBox'></SearchBox>
      </div>
      <div class="shortcut" v-show='!query'>
        <Switches :switches='switches' :currentIndex='switchIndex' @switchIndexChange='handelSwitchIndexChange'></Switches>
        <!-- 因为SongList是没有应用 Scroll -->
        <div class="list-wrapper">
          <Scroll class='list-scroll' v-if='switchIndex === 0' :data='playHistory' ref='scroll'>
            <div class="list-inner">
              <SongList :songs='playHistory' @select='selectSong'></SongList>
            </div>
          </Scroll>
          <Scroll class='list-scroll' v-if='switchIndex === 1' :refreshDelay='refreshDelay' :data='playHistory' ref='scroll'>
            <div class="list-inner">
              <SearchList :searches='searchHistory' @select='addQuery' @delete='deleteHistory'></SearchList>
            </div>
          </Scroll>
        </div>
      </div>
      <div class="search-result" v-show='query'>
        <Suggest @select='selectSuggest' @listScroll='blurInput' :query='query' :showSinger='false'></Suggest>
      </div>
      <TopTip ref='topTip'>
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">歌曲已经添加到播放队列</span>
        </div>
      </TopTip>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import SearchList from 'base/search-list/search-list'
import Suggest from 'components/suggest/suggest'
import TopTip from 'base/top-tip/top-tip'
import { mapGetters, mapActions } from 'vuex'
import { searchMixin } from 'common/js/mixin'
import Song from 'common/js/song'

export default {
  mixins: [ searchMixin ],
  data () {
    return {
      showFlag: false,
      switchIndex: 0,
      switches: [
        { name: '最近播放' },
        { name: '搜索历史' }
      ],
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'playHistory', 'searchHistory'
    ])
  },
  methods: {
    show () {
      this.showFlag = true
    },
    hide () {
      this.showFlag = false
      this.query = '' // 不让重进就搜索
    },
    selectSuggest (data) {
      this.saveSearch(data)
      this.showTip()
    },
    handelSwitchIndexChange (index) {
      this.switchIndex = index
    },
    selectSong (song, index) {
      if (index > 0) { // 第一首啥都不做
        this.insertSong(new Song(song))
        this.showTip()
      }
    },
    showTip () {
        this.$refs.topTip.show()
    },
    ...mapActions([
      'insertSong'
    ])
  },
  components: {
    SearchBox, Suggest, Switches, Scroll, SongList, SearchList, TopTip
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .add-song
    position fixed
    top 0
    bottom 0
    width 100%
    z-index 200
    background $color-background
    &.slide-enter-active, &.slide-leave-active
      transition all 0.3s
    &.slide-enter, &.slide-leave-to
      opacity 0
      transform translate3d(100%, 0, 0)
    .header
      position relative
      height 44px
      text-align center
      .title
        line-height 44px
        font-size $font-size-large
        color $color-text
      .close
        position absolute
        top 0
        right 8px
        .icon-close
          display block
          padding 12px
          font-size 20px
          color color-theme
    .search-box-wrapper
      margin 20px
    .shortcut
      .list-wrapper
        position absolute
        top 165px
        bottom 0
        width 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position fixed
      top 124px
      bottom 0
      width 100%
    .tip-title
      text-align center
      padding 18px 0
      font-size 0
      .icon-ok
        font-size $font-size-medium
        color $color-theme
        margin-right 4px
      .text
        font-size $font-size-medium
        color $color-text
</style>
