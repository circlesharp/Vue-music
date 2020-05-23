<template>
  <div class="search">
    <div class="search-box-wrapper">
      <SearchBox ref='searchBox' @query='onQueryChange'></SearchBox>
    </div>
    <div class="shortcut-wrapper" v-show='!query' ref='shortcutWrapper'>
      <Scroll class="shortcut" :refreshDelay='refreshDelay' ref='shortcut'>
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" @click='addQuery(item.k)' v-for='item in hotKey' :key='item.n'>
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show='searchHistory.length'>
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click.stop='showConfirm'>
                <i class="icon-clear"></i>
              </span>
            </h1>
            <!-- 点击元素后会触发 select 事件 -->
            <SearchList :searches='searchHistory' @select='addQuery' @delete='deleteHistory'></SearchList>
          </div>
        </div>
      </Scroll>
    </div>
    <div class="search-result" v-show='query' ref='suggest'>
      <Suggest :query='query' @select='saveSearch' @listScroll='blurInput'></Suggest>
    </div>
    <Confirm text='搜索历史将被删除' @confirm="deleteHistory('CLEARALLQUERY')" ref='confirm'></Confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import { playlistMixin, searchMixin } from 'common/js/mixin'

export default {
  mixins: [ playlistMixin, searchMixin ],
  data () {
    return {
      hotKey: [],
      isConfirmShow: false,
      refreshDelay: 100
    }
  },
  computed: {
    concatData () {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  created () {
    this._getHotKey()
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.suggest.style.bottom = bottom
      // 回想了一下，应该不需要再次刷新，两个组件的bottom都被调整了，刷新一次即可
      this.$refs.shortcut.refresh() // 这里应该是有 bug 的，因为 suggest 没有明确调用刷新，但是不知道为啥成功了
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    _getHotKey () {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          const rawHotkeyList = res.data.hotkey
          this.hotKey = rawHotkeyList.slice(0, 10)
          this.hotKey.unshift({ k: '玉脸小肥龙', n: '1233211234567' })
          this.hotKey.push({ k: 'forever young', n: '1433223' })
        }
      })
    }
  },
  components: {
    SearchBox, Suggest, SearchList, Confirm, Scroll
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
