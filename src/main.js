import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import 'babel-polyfill'
import 'common/stylus/index.styl'

// require('es6-promise').polyfill()
// require('es6-promise/auto')

// fastclick.attach(document.body) // 取消移动端 300ms 延迟

// github 介绍得很详细的
Vue.use(VueLazyLoad, {
  loading: import('common/image/default.png'),
  attemp: 3 // 图片加载失败后的重试次数
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
