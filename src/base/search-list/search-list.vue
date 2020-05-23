<template>
  <div class="search-list" v-show='searches.length'>
    <ul>
      <li class="search-item" @click='select(item)' v-for='(item, key) in searches' :key='key'>
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop='deleteItem(key)'>
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default () { return [] }
    }
  },
  methods: {
    select (item) {
      this.$emit('select', item)
    },
    deleteItem (key) {
      this.$emit('delete', key)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .search-list
    .search-item
      display flex
      align-items center
      height 40px
      .text
        display inline-block
        padding-right 50px
        flex 1
        color $color-text-l
        no-wrap()
      .icon
        extend-click()
        .icon-delete
          font-size $font-size-small
          color $color-text-d
</style>
