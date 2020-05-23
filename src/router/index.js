import Vue from 'vue'
import Router from 'vue-router'

import rank from 'components/rank/rank'
import Recommend from 'components/recommend/recommend'
import Search from 'components/search/search'
import Singer from 'components/singer/singer'
import SingerDetail from 'components/singer-detail/singer-detail'
import Disc from 'components/disc/disc'
import TopList from 'components/top-list/top-list'
import UserCenter from 'components/user-center/user-center'

// 用 Vue.use 使用插件
Vue.use(Router)

// 导出 router 对象，将会在 main.js 中被接收，并注册
export default new Router({
  routes: [
    { path: '/', redirect: '/recommend' },
    { path: '/user', component: UserCenter },
    {
      path: '/rank',
      component: rank,
      children: [ { path: ':id', component: TopList } ]
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [ { path: ':id', component: Disc } ]
    },
    {
      path: '/search',
      component: Search,
      children: [ { path: ':id', component: SingerDetail } ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [ { path: ':id', component: SingerDetail } ]
    }
  ]
})
