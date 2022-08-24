import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/token.js'
const Login = () => import(/* webpackChunkName: "Login" */ '@/views/Login')
const Layout = () => import(/* webpackChunkName: "Layout" */ '@/views/Layout')
const Home = () => import(/* webpackChunkName: "Home" */ '@/views/Home')
const User = () => import(/* webpackChunkName: "User" */ '@/views/User')
const Search = () => import(/* webpackChunkName: "Search" */ '@/views/Search')
const SearchResult = () => import(/* webpackChunkName: "SearchResult" */ '@/views/Search/SearchResult.vue')
const ArticleDetail = () => import(/* webpackChunkName: "ArticleDetail" */ '@/views/ArticleDetail')
const UserEdit = () => import(/* webpackChunkName: "UserEdit" */ '@/views/User/UserEdit.vue')
const UserChat = () => import(/* webpackChunkName: "UserChat" */ '@/views/Chat')

// import Login from '@/views/Login'
// import Layout from '@/views/Layout'
// import Home from '@/views/Home'
// import User from '@/views/User'
// import Search from '@/views/Search'
// import SearchResult from '@/views/Search/SearchResult.vue'
// import ArticleDetail from '@/views/ArticleDetail'
// import UserEdit from '@/views/User/UserEdit.vue'
// import UserChat from '@/views/Chat'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home'
  },
  {
    path: '/login',
    component: Login,
    // 路由独享守卫 或使用全局守卫:加to.path 当跳转要跳转到/login页面前判断
    beforeEnter: (to, from, next) => {
      // ...
      if (getToken()?.length > 0) {
        // 详情页无法返回首页
        // next(false)
        next('/layout/home')
      } else {
        next()
      }
    }
  },
  {
    path: '/layout',
    component: Layout,
    children: [
      {
        path: 'home',
        component: Home,
        meta: {
          scrollT: 0 // 保存离开时，滚动条的位置
        }
      },
      {
        path: 'user',
        component: User
      }
    ]
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/search_result/:kw',
    component: SearchResult
  },
  {
    path: '/article_detail',
    component: ArticleDetail
  },
  {
    path: '/user_edit',
    component: UserEdit
  },
  {
    path: '/user_chat',
    component: UserChat
  }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫
// router.beforeEach((to, from, next) => {
//   if (getToken()?.length > 0 && to.path === '/login') {
//     next(false)
//     next('/layout/home')
//   } else {
//     next()
//   }
// })

export default router
