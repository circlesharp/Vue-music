<template>
  <transition name='list-fade'>
    <div class="playlist" v-show='showFlag' @click='hide'>
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <!-- 这里需要切换播放模式 -->
            <i class="icon" :class="iconMode" @click='changeMode'></i>
            <span class="text">{{playModeText}}</span>
            <span class="clear" @click='showConfirm'>
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <Scroll class="list-content" :refreshDelay='refreshDelay' :data='sequenceList' ref='scroll'>
          <transition-group tag='ul' name='list' ref='list'>
            <li class="item" @click='selectItem(item, index)' ref='itemList' v-for='(item, index) in sequenceList' :key='item.id'>
              <i class="current" :class="item.id === currentSong.id ? 'icon-play' : ''"></i>
              <span class="text">{{item.name}}</span>
              <!-- 坑爹收藏按钮 -->
              <span class="like" @click.stop='toggleFavorite(item)'>
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop='deleteOne(item)'>
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </Scroll>
        <div class="list-operate">
          <div class="add" @click='addSong'>
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click='hide'>
          <span>关闭</span>
        </div>
      </div>
      <Confirm @confirm='confirmClear' text='是否清空播放列表' confirmBtnText='清空' ref='confirm'></Confirm>
      <AddSong ref='addSong'></AddSong>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import { playMode } from 'common/js/config'
import { playModeMixin } from 'common/js/mixin'
import AddSong from 'components/add-song/add-song'

export default {
  mixins: [ playModeMixin ],
  data () {
    return {
      showFlag: false,
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'sequenceList', 'currentSong', 'playlist', 'mode'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      this.scrollToCurrent(newSong)
    }
  },
  methods: {
    show () {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.scroll.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    selectItem (item, index) {
      // 妙呀，处理了随机播放的问题
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayState(true) // 我觉得这里也可以不用，网易云如果当前歌曲是暂停状态，点击该歌曲也不会播放
    },
    scrollToCurrent (current) {
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id
      }) // 最好通过id来确定index, 单靠index不靠谱。
      this.$refs.scroll.scrollToElement(this.$refs.list.$el.children[index], 300)
    },
    deleteOne (song) {
      this.deleteSong(song)
      if (!this.sequenceList.length) {
        this.hide()
      }
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    confirmClear () {
      this.deleteSongList()
      this.hide()
    },
    addSong () {
      this.$refs.addSong.show()
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayState: 'SET_PLAYING_STATE',
      setPlaylist: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'deleteSong', 'deleteSongList'
    ])
  },
  components: {
    Scroll, Confirm, AddSong
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .playlist
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 200
    background-color $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transiton opacity 0.3s
      .list-wrapper
        transition all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity 0
      .list-wrapper
        transform translate3d(0, 100%, 0)
    $.list-fade-enter
    .list-wrapper
      position absolute
      left 0
      bottom 0
      width 100%
      background-color $color-highlight-background
      .list-header
        position relative
        padding 20px 30px 10px 20px
        .title
          display flex
          align-items center
          .icon
            margin-right 10px
            font-size 30px
            color $color-theme-d
          .text
            flex 1
            font-size $font-size-medium
            color $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size $font-size-medium
              color $color-text-d
      .list-content
        max-height 240px
        overflow hidden
        .item
          display flex
          align-items center
          height 40px
          padding 0 30px 0 20px
          overflow hidden
          &.list-enter-active, &.list-leave-active
            transition all 0.1s
          &.list-enter, &.list-leave-to
            height 0
          .current
            flex 0 0 20px
            width 20px
            font-size $font-size-small
            color $color-theme-d
          .text
            flex 1
            no-wrap()
            font-size $font-size-medium
            color $color-text-d
          .like
            extend-click()
            margin-right 15px
            font-size $font-size-small
            color $color-theme
            .icon-favorite
              color $colicon-favoriteor-sub-theme
          .delete
            extend-click()
            font-size $font-size-small
            color $color-theme
      .list-operate
        width 140px
        margin 20px auto 30px auto
        .add
          display flex
          align-items center
          padding 8px 16px
          border 1px solid $color-text-l
          border-radius 100px
          color $color-text-l
          .icon-add
            margin-right 5px
            font-size $font-size-small-s
          .text
            font-size $font-size-small
      .list-close
        text-align center
        line-height 50px
        background-color $color-background
        font-size $font-size-medium-x
        color $color-text-l
</style>
