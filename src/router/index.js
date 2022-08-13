import Vue from 'vue'
import VueRouter from 'vue-router'
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
    component: Login
  },
  {
    path: '/layout',
    component: Layout,
    children: [
      {
        path: 'home',
        component: Home
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

export default router
