<template>
  <div class="player" v-show='playlist.length > 0'>
    <transition name='normal' @enter='enter' @after-enter='afterEnter' @leave='leave' @after-leave='afterLeave'>
      <div class="normal-player" v-show='fullScreen'>
        <div class="background">
          <img :src="currentSong.image" width='100%' height='100%'>
        </div>
        <div class="top">
          <div class="back" @click='back'>
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html='currentSong.name'></h1>
          <h2 class="subtitle" v-html='currentSong.singer'></h2>
        </div>
        <div class="middle"
          @touchstart.prevent='middleTouchStart'
          @touchmove.prevent='milledTouchMove'
          @touchend='middleTouchEnd'
        >
          <div class="middle-l" ref='middleL'>
            <div class="cd-wrapper" ref='cdWrapper'>
              <div class="cd" :class="cdCls">
                <img :src="currentSong.image" class="image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <!-- 原本该是 currentLyric && currentLyric.lines -->
          <Scroll class="middle-r" ref='lyricList' :data='currentLyric && currentLyric.lines'>
            <div class="lyric-wrapper">
              <div v-if='currentLyric'>
                <p class='text' :class="currentLineNum === index ? 'current' : ''"
                  v-for='(line, index) in currentLyric.lines' :key='index' ref='lyricLine'
                >
                  {{line.txt}}
                </p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="currentShow==='cd' ? 'active' : ''"></span>
            <span class="dot" :class="currentShow==='lyric' ? 'active' : ''"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{currentTime}}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar :percent='percent' @percentChange='onProgressBarChange'></ProgressBar>
            </div>
            <span class="time time-r">{{duration}}</span>
          </div>
          <div class="operators">
            <!-- 切换播放模式 -->
            <div class="icon i-left" @click='changeMode'>
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls" @click='prev'>
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls" @click='togglePlaying'>
              <i :class='playIcon'></i>
            </div>
            <div class="icon i-right" :class="disableCls" @click='next'>
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <!-- 这里貌似对性能很损耗，因为一直在调用函数，以后优化看看能否变成计算属性 -->
              <i class="icon" :class="getFavoriteIcon()" @click.stop='toggleFavorite(currentSong)'></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name='mini'>
      <div class="mini-player" @click='open' v-show='!fullScreen'>
        <div class="icon">
          <div class="imgWrapper">
            <img :src="currentSong.image" :class="cdCls" width='40' height='40'>
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html='currentSong.name'></h2>
          <p class="desc" v-html='currentSong.singer'></p>
        </div>
        <div class="control">
          <ProgressCircle :radius='32' :percent='percent'>
            <i class="icon-mini" :class="miniIcon" @click.stop="togglePlaying"></i>
          </ProgressCircle>
        </div>
        <div class="control" @click.stop='showPlaylist'>
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <Playlist ref='playlist'></Playlist>
    <audio :src="currentSong.url" ref='audio'
      @timeupdate="updateTime"
      @canplay="ready" @error='error' @ended='end'
    >
    </audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import { playMode } from 'common/js/config'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
import Playlist from 'components/playlist/playlist'
import { playModeMixin } from 'common/js/mixin'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  mixins: [ playModeMixin ],
  data () {
    return {
      songReady: false,
      currentTime: '0:00',
      rawCurrentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!newSong.id || newSong.id === oldSong.id) { return }
      this.setPlayState(true)
      this._playMusic(this.playing)
      if (this.currentLyric) {
        this.currentLyric.stop() // 先停掉之前的计时器
      }
      this._getLyric()
    },
    playing (newPlaying) {
      this._playMusic(newPlaying, true)
    }
  },
  computed: {
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    duration () {
      return this._formatTime(this.currentSong.duration)
    },
    percent () {
      return this.rawCurrentTime / this.currentSong.duration
    },
    // iconMode () {
    //   let modeArr = Object.keys(playMode)
    //   return `icon-${modeArr[this.mode]}`
    // },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList',
      'favouriteList'
    ])
  },
  created () {
    this.touch = {}
  },
  methods: {
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    togglePlaying () {
      this.setPlayState(!this.playing)
      this.songReady = true
      if (this.currentLyric) {
        this.currentLyric.togglePlay() // 文档里写了
      }
    },
    prev () {
      if (!this.songReady) { return }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playlist.length - 1
      }
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        this.setCurrentIndex(index)
      }
    },
    next () {
      if (!this.songReady) { return }
      let index = this.currentIndex + 1
      if (index === this.playlist.length) {
        index = 0
      }
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        this.setCurrentIndex(index)
      }
    },
    loop () {
      this.setCurrentIndex(this.currentIndex)
      this.$refs.audio.currentTime = 0
      this._playMusic(this.playing)
      if (this.currentLyric) {
        this.currentLyric.seek(0) // 文档里写了, seek(startTime)
      }
    },
    ready () {
      this.songReady = true
      this.saveSongHistory(this.currentSong)
    },
    error () {
      this.songReady = true
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    showPlaylist () {
      this.$refs.playlist.show()
    },
    updateTime (e) {
      let time = e.target.currentTime
      this.rawCurrentTime = time
      this.currentTime = this._formatTime(time)
    },
    onProgressBarChange (percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000) // 文档里写了, seek(startTime)
      }
    },
    enter (el, done) {
      const { x, y, scale } = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter (el, done) {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave (el, done) {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    // 处理屏幕横向滑动
    middleTouchStart (e) {
      this.touch.initiated = true // 标志位
      this.touch.onTouchMove = false
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    milledTouchMove (e) {
      if (!this.touch.initiated) { return }
      this.touch.onTouchMove = true
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) { return }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
    },
    middleTouchEnd () {
      let offsetWidth, opacity
      if (this.touch.onTouchMove) { // 仅在 touchMove 的时候才切换左右
        if (this.currentShow === 'cd') { // >>>
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            this.currentShow = 'lyric'
            opacity = 0
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else { // <<<
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        // 使用 $el 是因为前者是 vue 组件，通过这样才能操作 dom
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricList.$el.style[transitionDuration] = '300ms'
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = '300ms'
      }
    },
    // 用于显示数组中的对象的歌名
    _showSongName (songList) {
      let songName = songList.map((i) => {
        return i.name
      })
      return songName
    },
    _formatTime (time) {
      let min = time / 60 | 0
      let sec = time % 60 | 0
      time = `${min}:${this._pad(sec)}`
      return time
    },
    _pad (num, n = 2) {
      num = num.toString()
      let len = num.length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    _getPosAndScale () {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return { x, y, scale }
    },
    // 封装了开始播放歌曲的逻辑，只有请求满足才能播放
    _playMusic (playing, flag = false) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        playing ? audio.play() : audio.pause()
      })
      // this._getLyric()
      this.songReady = flag
    },
    _getLyric () {
      this.currentSong.getLyric().then((lyric) => { // 这个就是resolve函数
        this.currentLyric = new Lyric(lyric, this._handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    _handleLyric ({ lineNum, txt }) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setSequenceList: 'SET_SEQUENCE_LIST',
      setPlaylist: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveSongHistory'
    ])
  },
  components: {
    ProgressBar, ProgressCircle, Scroll, Playlist
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            box-sizing: border-box
            height: 100%
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                box-sizing: border-box
                border-radius: 50%
                border: 10px solid rgba(255, 255, 255, 0.1)
              // 旋转动画
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
            .pure-music
              padding-top: 50%
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        height: 40px
        padding: 0 10px 0 20px
        .imgWrapper
          height: 100%
          width: 100%
          img
            border-radius: 50%
            // 旋转动画
            &.play
              animation: rotate 10s linear infinite
            &.pause
              animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist, .icon-mini
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
