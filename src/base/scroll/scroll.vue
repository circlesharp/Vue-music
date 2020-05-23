<template>
  <div ref='wrapper'>
    <!-- 不要再多加一层div了 -->
    <!-- 因为使用组件只用一个盒子，表示同步的 -->
    <!-- 而使用多个盒子，则是对长的盒子管用 -->
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props: {
    probeType: { // 什么时候派发 scroll 事件
      type: Number,
      default: 1
    },
    click: { // 派发的 event 参数加一个私有属性 _constructed，值为 true
      type: Boolean,
      default: true
    },
    data: { // 用于 watch，调用 refresh
      type: Array,
      default: null
    },
    listenScroll: { // 是否派发 scroll 事件
      type: Boolean,
      default: false
    },
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  // 根据data变化而refresh
  watch: {
    data () {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    }, this.refreshDelay) // 用以提到nextTick
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      // 初始化的时候便确实是否派发scroll事件
      if (this.listenScroll) {
        let that = this // 因为调用 on 的不是 Vue 实例，而是 this.scroll。但是派发事件是组件（Vue实例）
        this.scroll.on('scroll', (pos) => { // 当监听到 scroll , 会向实例派发事件，也叫 scroll
          that.$emit('scroll', pos) // 这是向实例派发的
        })
      }
      if (this.pullup) {
        // 触底就会触发 scrollEnd 事件
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    enable () { // 启用 better-scroll, 默认 开启
      this.scroll && this.scroll.enable()
    },
    disable () { // 禁用 better-scroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应
      this.scroll && this.scroll.disable()
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    // 应为封装，所以这两个方法要对外暴露
    scrollTo () { // scrollTo(x, y, time, easing)
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () { // scrollToElement(el, time, offsetX, offsetY, easing)
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  }
}
</script>
