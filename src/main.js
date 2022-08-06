import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible' // 引入flexible.js 设置根标签字体大小，做移动端的适配
import { NavBar, Form, Field, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell, CellGroup, List, PullRefresh, Toast, ActionSheet, Popup, Row, Col, Badge, Search, Image as VanImage } from 'vant'

Vue.use(VanImage)
Vue.use(Search)
Vue.use(Row)
Vue.use(Col)
Vue.use(Badge)
Vue.use(Popup)
Vue.use(ActionSheet)

Vue.use(Toast)
Vue.use(PullRefresh)
Vue.use(List)

Vue.use(Cell)
Vue.use(CellGroup)

Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Button)
Vue.use(Form)
Vue.use(Field)
Vue.use(NavBar)

// 封装中间件函数的插件
const directiveObj = {
  install(Vue) {
    Vue.directive('infoc', {
      // inserted 方法名
      inserted(el) {
        const theInput = el.querySelector('input')
        theInput.focus()
      }
    })
  }
}
// 执行目标对象里的install方法
Vue.use(directiveObj)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
