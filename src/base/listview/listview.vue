<template>
  <Scroll class='listview' :data='data' :listenScroll=true :probeType=3 @scroll='scroll' ref='listview'>
    <ul>
      <li class='list-group' v-for='(group, index) in data' :key='index' ref='listGroup'>
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" @click='selectItem(item)' v-for='(item, index) in group.items' :key='index'>
            <img class='avatar' v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 这是第二个盒子，和第一个盒子独立；而且高度不到外围高度，故实现绝对定位 -->
    <!-- stop->阻止冒泡; prevent->阻止触发原生事件; touchstart, touchmove, touchend 都是 HTML5 的原生事件 -->
    <div class="list-shortcut" @touchstart='onShortcutTouchStart' @touchmove.stop.prevent='onShortcutTouchMove'>
      <ul>
        <!-- data-index 是属性，小程序也是这样实现的；能够获取这个li的序号 -->
        <li class="item" :class="{'current': currentIndex === index}" :data-index='index' v-for="(item, index) in shortcutList" :key='index'>
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show='fixedTitle' ref='fixed'>
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div class="loading-container" v-if='!data.length'>
      <Loading></Loading>
    </div>
  </Scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getData } from 'common/js/dom'

const ANCHOR_HEIGHT = 18
const FIXED_HEIGHT = 30

export default {
  props: {
    data: { // 这个是传入的，每个元素是一个对象，具有 title, items 两个标识符
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      scrollY: 1, // BS滚动的y
      currentIndex: 0,
      diff: 0
    }
  },
  computed: {
    shortcutList () {
      // Array.prototype.map(func) -> 返回一个新数组，对原数组的每一个元素都执行该func
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY < 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  watch: {
    data () { // 应该是props中的data, 如果传入的数据改了
      setTimeout(() => {
        this._calculateHeight()
      }, 20) // 太快了受不了。。
    },
    // 在这里设置
    scrollY (newY) { // 可以设置定时器，记得clear
      let listHeight = this.listHeight
      let len = listHeight.length
      let h1, h2
      for (let i = 0; i < len; i++) {
        h1 = listHeight[i]
        h2 = listHeight[i + 1] || listHeight[i]
        if (newY >= h1 && newY < h2) {
          this.currentIndex = i
          this.diff = h2 - newY - FIXED_HEIGHT
        } else if (newY >= listHeight[len - 1]) {
          this.currentIndex = len - 1
        } else if (newY < 0) {
          this.currentIndex = 0
        }
      }
    },
    // fixedTitle (x) { console.log(x) } // 计算属性的参数就是他本身
    diff (val) {
      let fixedTop = (val < 0) ? val : 0
      if (this.fixedTop === fixedTop) { // DOM操作耗费性能
        return
      }
      this.fixedTop = fixedTop // 滑动的时候一定是变的，如果不等于0，滑动的时候不太可能相等
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  // 在created这里，vue不会跟踪，而且这些不需要跟踪变化
  created () {
    this.touch = {
      y1: 0,
      y2: 0,
      anchorIndex: 0,
      fixedTop: 0
    } // 保存 shortcutList 的 touch位置
    this.listScroll = true
    this.listHeight = []
  },
  methods: {
    // 监听到触摸时候触发
    onShortcutTouchStart (e) {
      // console.log(e) // 这个 e 是 TouchEvent
      let anchorIndex = parseInt(getData(e.target, 'index')) //  e.target 是 元素节点，dataset里面有 index
      let firstTouch = e.touches[0] // e 的 touches 的第0位是 touch 对象
      this.touch.y1 = firstTouch.pageY // pageY = clientY + 页面滚动高度
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
      // this.currentIndex = anchorIndex
    },
    // 监听到触摸滑动时候触发
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = parseInt((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) // 这样计算是有误差的，不过问题不大
      let anchorIndex = this.touch.anchorIndex + delta
      this._scrollTo(anchorIndex)
    },
    scroll (pos) { // 是 Scroll 派发的，有一参数 pos = { x: *, y: * }
      this.scrollY = -pos.y // BS滚动的y, 是负数
    },
    selectItem (item) { // 把元素派发出去，不耦合业务逻辑
      this.$emit('select', item)
    },
    // 将子组件的refresh暴露出去
    refresh () {
      this.$refs.listview.refresh()
    },
    _scrollTo (index) { // shortcut 控制 BScroll
      // 第2个参数是缓动动画的时间
      // scrollToElement(el, time, offsetX, offsetY, easing)
      // 因为 listGroup 是通过 v-for 生成的，listGroup 是一个 Array 实例，可用索引
      if (!index && index !== 0) {
        return // 什么都不做index
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.currentIndex = index // 标记的时候用在这里
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight () { // 高度区间列表
      this.listHeight = [] // 注意，这不是初始化，而是清零
      const list = this.$refs.listGroup // Array
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  components: {
    Scroll, Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
