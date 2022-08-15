import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible' // 引入flexible.js 设置根标签字体大小，做移动端的适配
import 'highlight.js/styles/default.css' // 代码高亮 的样式
import './vantComponent.js' // vant组件引入
import directiveObj from '@/utils/directive.js'
// 执行目标对象里的install方法
Vue.use(directiveObj)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
