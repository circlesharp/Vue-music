<template>
  <Scroll class="suggest" @scrollToEnd='searchMore' @beforeScroll='listScroll'
    :data='result' :pullup='true' :beforeScroll='true'
  >
    <ul class="suggest-list">
      <li class="suggest-item" @click='selectItem(item)' v-for='(item, index) in result' :key='index'>
        <div class="icon">
          <i :class='getIconCls(item)'></i>
        </div>
        <div class="name">
          <p class="text" v-html='getDisplayName(item)'></p>
        </div>
      </li>
      <!-- 太妙了，因为一直在最下面，所以一直显示 -->
      <Loading v-show='hasMore' title=''></Loading>
    </ul>
    <div class="no-result-wrapper">
      <NoResult v-show='!hasMore && !result.length' title='-- sorry, no more result --'></NoResult>
    </div>
  </Scroll>
</template>

<script>
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import { createSong, processSongsUrl, isValidMusic } from 'common/js/song'
import { mapMutations, mapActions } from 'vuex'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import NoResult from 'base/no-result/no-result'

const TYPE_SINGER = 'singer'
const PREPAGE = 20

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      hasMore: true
    }
  },
  watch: {
    query () {
      this.search()
      this.result = []
    },
    result () {
      // console.log(this.page, this.result)
    }
  },
  methods: {
    search () {
      this.hasMore = true
      search(this.query, this.page, this.showSinger, PREPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data)
          this._checkMore(res.data)
        }
      })
    },
    searchMore () {
      if (!this.hasMore) { return }
      search(this.query, ++this.page, this.showSinger, PREPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data)
          this._checkMore(res.data)
        }
      })
    },
    // 选择推荐结果的某一首歌
    selectItem (item) {
      this.$emit('select', { item, content: this.getDisplayName(item) })
      if (item.type === TYPE_SINGER) { // 这里是不能成功的，因为坑爹的 id 是错的。先留着，以后优化即可。
        let singer = new Singer({
          id: item.singerid,
          name: item.singername
        })
        this.setSinger(singer)
        this.$router.push({
          path: `/search/${singer.id}`
        })
      } else {
        this.insertSong(item)
        this.setFullScreen(true)
      }
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name} - ${item.singer}`
      }
    },
    listScroll () {
      this.$emit('listScroll')
    },
    _genResult (data) {
      let ret = []
      if (this.result.length) {
        ret = this.result
      } else if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
        this.result = ret
      }
      if (data.song) {
        processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
          ret = ret.concat(songs)
          this.result = ret
        })
      }
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    _checkMore (data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * PREPAGE) > song.totalnum) {
        this.hasMore = false
      }
    },
    ...mapMutations({
      setSinger: 'SET_SINGER',
      setFullScreen: 'SET_FULL_SCREEN'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  components: {
    Scroll, Loading, NoResult
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .suggest
    // height 200px
    height 100%
    overflow hidden
    .suggest-list
      padding 0 30px
      .suggest-item
        display flex
        align-items center
        padding-bottom 20px
      .icon
        flex 0 0 30px
        width 30px
        [class^='icon-']
          font-size 14px
          color $color-text-d
      .name
        flex 1
        font-size $font-size-medium
        color $color-text-d
        overflow hidden
        .text
          no-wrap()
    .no-result-wrapper
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
