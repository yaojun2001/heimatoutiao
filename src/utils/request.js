// 基于axios封装网络请求
// 有局限性
import theAxios from 'axios'
import router from '@/router'
import { Notify } from 'vant'
// import store from '@/store'
import { getUserTokenAPI } from '@/api'
import { getToken, removeToken, setToken } from '@/utils/token.js'
const axios = theAxios.create({
  baseURL: 'http://geek.itheima.net',
  timeout: 20000 // 20秒超时
})

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
  // ?.可选链操作符，如果前面对象里没有length,原地返回undefined
  // 如果getToken() 在原地有值token字符串，才能调用length获取长度
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    // console.log(config)
    config.headers.Authorization = `Bearer ${getToken()}`
  }

  // 在发送请求之前做些什么
  // 如果vuex里有token携带在请求头上
  // if (store.state.token.length > 0 && config.headers.Authorization === undefined) {
  // 发送请求之前，把token携带在请求头上
  // config.headers.Authorization = 'Bearer ' + store.state.token
  // }
  return config
}, function (error) {
  // 对请求错误做些什么
  console.log(error)
  return Promise.reject(error)
})

// 添加响应拦截器
// 本质：函数
axios.interceptors.response.use(function(response) {
  // http 响应的状态码为2xx,3XX时
  // 对响应数据做点什么
  return response
}, async function(error) {
  // http 响应的状态码为4xx,5XX时
  // 对响应错误做点什么
  console.dir(error)
  // 只有401代表身份过期，需要跳转登录
  if (error.response.status === 401) {
    // console.dir(this)
  // 不能使用this.$router(因为this不是vue组件的实例对象，无法调用$router)
  // 解决：this.$router 为了能够拿到router路由对象，所以直接去引入@/router
    Notify({ type: 'warning', message: '登录过期，请重新登录' })
    removeToken()
    // router.replace('/login')

    // 刷新 获得token
    const res = await getUserTokenAPI()
    // console.log(res)
    // 新token存入本地
    setToken(res.data.data.token)
    // 更新新的token在请求头里
    error.config.headers.Authorization = `Bearer ${res.data.data.token}`
    // 发起未完成的那次请求
    return axios(error.config)
  } else if (error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
    // refresh_token 也过期了
    Notify({ type: 'warning', message: '登录过期，请重新登录' })
    removeToken()
    localStorage.removeItem('refresh_token')
    router.replace('/login')
  }

  return Promise.reject(error)
})

export default ({
  url,
  method = 'GET',
  params = {},
  data = {},
  headers = {}
}) => {
  return axios({
    url,
    method,
    params,
    data,
    headers
  })
}
