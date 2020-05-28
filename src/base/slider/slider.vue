<template>
  <div class='slider' ref='slider'>
    <div class="slider-group" ref='sliderGroup'>
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        v-for='(item, index) in dots'
        :key='index'
        :class="{ 'active': currentPageIndex === index }"
      ></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'

export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted () {
    setTimeout(() => {
      this._setSliderWidth()
      this.__initDots()
      this._initSlider()
      if (this.autoPlay) {
        this._play() // 最先的启动，但是每一次翻页都要启动（无论是人为还是自动）
      }
    }, 20) // 浏览器一般17ms刷新一次
    // 监听到 resize, 更新图片宽度
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth()
      this.slider.refresh()
    })
  },
  methods: {
    // 横向是不会自动撑开的
    _setSliderWidth () {
      this.children = this.$refs.sliderGroup.children

      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      // 新版的不需要这个了
      // if (this.loop) {
      //   width += 2 * sliderWidth
      // }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    __initDots () {
      this.dots = new Array(this.children.length) // 长度确定的空数组
    },
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400
      })

      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        this.currentPageIndex = pageIndex
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play() // 每一次翻页都要启动
        }
      }) // 每次滑动，bs实例都会派发 scrollEnd 事件
    },
    _play () {
      let pageIndex = this.currentPageIndex % (this.dots.length)
      if (this.loop) {
        pageIndex += 1
        pageIndex %= this.dots.length
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  },
  destroyed () {
    if (this.autoPlay) {
      clearTimeout(this.timer)
    } // 现在发现切换的时候不能自动播放。可以在点击tab的时候触发
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .slider
    min-height 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      transform: translateZ(1px)
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
