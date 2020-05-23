<template>
  <div class="progress-bar" ref='progressBar' @click='progressClick'>
    <div class="bar-inner">
      <div class="progress" ref='progress'></div>
      <div class="progress-btn-wrapper" ref='progressBtn'
        @touchstart.prevent='progressTouchStart'
        @touchmove.prevent='progressTouchMove'
        @touchend.prevent='progressTouchEnd'
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from 'common/js/dom'

const PROGRESSBTNWIDTH = 16
const transform = prefixStyle('transform')

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const offsetWidth = newPercent * this.barWidth
        this._offset(offsetWidth)
      }
    }
  },
  computed: {
    barWidth () {
      return this.$refs.progressBar.clientWidth - PROGRESSBTNWIDTH
    }
  },
  created () {
    this.touch = {
      initiated: false, // 拖动状态
      startX: 0, // btn 距离页面
      left: 0 // btn 距离 bar 起点
    }
  },
  methods: {
    progressTouchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) { return }
      const deltaX = e.touches[0].pageX - this.touch.startX // 拖动过程的偏移
      const offsetWidth = Math.min(this.barWidth, Math.max(0, this.touch.left + deltaX)) // 厉害
      this._offset(offsetWidth)
    },
    progressTouchEnd () {
      this.touch.initiated = false
      this._triggerPercent() // 派发事件修改正在播放的时间
    },
    progressClick (e) {
      // this._offset(e.offsetX) // 不准确
      let rect = this.$refs.progressBar.getBoundingClientRect()
      this._offset(e.pageX - rect.left)
      this._triggerPercent()
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px` // 黄色条
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)` // 这样会比 style.left 好，因为过渡自然
    },
    _triggerPercent () {
      // const barWidth = this.$refs.progressBar.clientWidth - PROGRESSBTNWIDTH
      const percent = this.$refs.progress.clientWidth / this.barWidth
      this.$emit('percentChange', percent)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
