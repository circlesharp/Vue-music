<template>
  <ul class="switches">
    <li class="switch-item" :class="currentIndex === index ? 'active' : ''"
      v-for='(item, index) in switches' :key='index'
      @click='switchIndex(index)'
    >
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    switches: {
      type: Array,
      default () {
        return [
          { name: '选项1' },
          { name: '选项2' }
        ]
      }
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchIndex (index) { // 这个还是交给上级，因为上级有逻辑需要
      this.$emit('switchIndexChange', index)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable'

  .switches
    display flex
    align-items center
    width 240px
    margin 0 auto
    border 1px solid $color-highlight-background
    border-radius 5px
    .switch-item
      flex 1
      padding 8px
      text-align center
      font-size $font-size-medium
      color $color-text-d
      &.active
        background $color-highlight-background
        color $color-text
</style>
