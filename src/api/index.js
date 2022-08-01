// 统一封装接口方法
// 每个方法负责请求一个url地址
// 逻辑页面，导入这个接口方法，就可以发起请求
// 好处：统一管理
import request from '@/utils/request.js'
import { getToken } from '@/utils/token.js'

// 登录---登录接口
// axios内部，会把参数对象转成json字符串格式发给后台
// axios内部，会自动携带请求参数(header)里
// Content-Type:'application/json'添加好
export const loginAPI = ({ mobile, code }) => request({
  url: '/v1_0/authorizations',
  method: 'POST',
  data: {
    mobile,
    code
  }
})
// 频道--获取所有频道
export const getAllChannelsAPI = () => {
  return request({
    url: '/v1_0/channels',
    method: 'GET'
  })
}

// 获取-获取用户选择的频道
// 注：用户没有登录，默认返回后台设置的默认频道
export const getUserChannelsAPI = () => request({
  url: '/v1_0/user/channels',
  method: 'GET',
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
})

// 文章--获取文章新闻推荐列表
export const getAllArticleListAPI = ({ channel_id, timestamp }) => request({
  url: '/v1_0/articles',
  method: 'GET',
  headers: {
    Authorization: `Bearer ${getToken()}`
  },
  params: { // 这里的参数，axios会帮你拼接在URL?后面（查询字符串）
    channel_id,
    timestamp
  }
})

// 文章--不喜欢
export const dislikeArticleAPI = ({ artId }) => request({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  headers: {
    Authorization: `Bearer ${getToken()}`
  },
  data: {
    target: artId
  }
})

// 文章--举报
export const reportsArticleAPI = ({ target, type, remark }) => request({
  url: '/v1_0/article/reports',
  method: 'POST',
  headers: {
    Authorization: `Bearer ${getToken()}`
  },
  data: {
    target,
    type,
    remark
  }
})
