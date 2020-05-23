<template>
  <transition name='drop'>
    <div class="top-tip" @click='hide()' v-show='showFlag'>
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    hideDelay: {
      type: Number,
      default: 2000
    }
  },
  data () {
    return {
      showFlag: false
    }
  },
  methods: {
    show () {
      this.showFlag = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.showFlag = false
      }, this.hideDelay)
    },
    hide () {
      this.showFlag = false
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable'

  .top-tip
    position fixed
    top 0
    width 100%
    z-index 500
    background $color-dialog-background
    &.drop-enter-active, &.drop-leave-active
      transition all 0.3s
    &.drop-enter, &.drop-leave-to
      opacity 0
      transform  translate3d(0, -100%, 0)
</style>
