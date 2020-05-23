<template>
  <div class="progress-circle">
    <!-- 如果svg不是根元素，svg 元素可以用于在当前文档
    （比如说，一个HTML文档）内嵌套一个独立的svg片段 。
    这个独立片段拥有独立的视口和坐标系统。 -->
    <svg :width='radius' :height='radius' viewBox='0 0 100 100'>
      <!-- r -> 半径, cx&cy -> 圆心坐标 -->
      <circle class='progress-background' r='50' cx='50' cy='50' />
      <circle class='progress-bar' r='50' cx='50' cy='50' fill='transparent'
        :stroke-dasharray='dashArray'
        :stroke-dashoffset='dashOffset'
      />
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    radius: {
      type: Number,
      default: 32
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      dashArray: Math.PI * 100
    }
  },
  computed: {
    dashOffset () {
      return this.dashArray * (1 - this.percent)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>
