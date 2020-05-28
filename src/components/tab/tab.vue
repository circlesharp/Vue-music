<template>
  <div class="tab">
    <!-- tag 的默认为 a ,表示渲染成为什么标签 -->
    <!-- class 在被选中时，会成为 router-link-active -->
    <!-- to 对应路由配置里面的 path -->
    <router-link tag='div' class='tab-item' to='/recommend'>
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag='div' class='tab-item' to='/singer'>
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag='div' class='tab-item' to='/rank'>
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag='div' class='tab-item' to='/search'>
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  .tab
    display flex
    height 44px
    line-height 44px
    font-size $font-size-medium
    .tab-item
      flex 1
      text-align center
      .tab-link
        padding-bottom 5px
        color $color-text-l
      &.router-link-active
        .tab-link
          color $color-theme
          border-bottom 2px solid $color-theme
</style>
