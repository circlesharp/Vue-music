<template>
  <div id="app">
    <!-- part 1 头部的 logo title -->
    <MHeader></MHeader>

    <!-- part 2 tab 栏 -->
    <Tab></Tab>

    <!-- part 3 主页面 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <!-- part 4 底部迷你播放器 -->
    <Player></Player>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'

export default {
  components: {
    MHeader, Tab, Player
  }
}
</script>

<style lang='stylus' scoped>

</style>
