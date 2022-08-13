// 统一封装接口方法
// 每个方法负责请求一个url地址
// 逻辑页面，导入这个接口方法，就可以发起请求
// 好处：统一管理
import request from '@/utils/request.js'
// import { getToken } from '@/utils/token.js'

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

// 用户--刷新用户token
export const getUserTokenAPI = () => request({
  url: '/v1_0/authorizations',
  method: 'PUT',
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('refresh_token')
  }
})

// 用户 -- 关注用户
export const followingUserAPI = ({ targetUserId }) => request({
  url: '/v1_0/user/followings',
  method: 'POST',
  data: {
    target: targetUserId
  }
})
// 用户 -- 取消关注用户
export const cancelFollowedUserAPI = ({ targetUserId }) => request({
  url: `/v1_0/user/followings/${targetUserId}`,
  method: 'DELETE'
})

// 用户 -- 获取用户个人资料(编辑页面用)
export const getUserProfileAPI = () => request({
  url: '/v1_0/user/profile',
  method: 'GET'
})

// 用户 -- 获取用户自己的信息
export const getTheUserAPI = () => request({
  url: '/v1_0/user',
  method: 'GET'
})

// 用户 -- 编辑用户照片资料
export const editUserPhotoAPI = (fd) => request({
  url: '/v1_0/user/photo',
  method: 'PATCH',
  // Content-Type: application/json; 是axios携带的，前题：data请求体是对象->json字符串->后台
  // Content-Type: multipart.form-data;浏览器携带，前题：data请求体必须是FormData类型的对象
  data: fd // fd是new FormData表单对象
})

// 用户 -- 编辑用户个人资料
export const editUserProfileAPI = (obj) => {
  // const dobj = {
  //   name: '', // 呢称
  //   gender: 0, // 性别：0男1女
  //   birthday: '', // 生日 YYYY-MM-DD
  //   intro: '' // 个人介绍
  // }
  // for (const k in dobj) {
  //   if (obj[k] === undefined) {
  //     delete dobj[k]
  //   } else {
  //     obj[k] = dobj[k]
  //   }
  // }

  // 不够语义化，不知道obj里有什么
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: obj
  // {
  //   name, // 呢称
  //   gender, // 性别：0男1女
  //   birthday, // 生日 YYYY-MM-DD
  //   intro // 个人介绍
  // }
  })
}

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
  method: 'GET'
  // headers: {
  //   Authorization: `Bearer ${getToken()}`
  // }
})

// 频道管理--更新覆盖频道
export const updateChannelsAPI = ({ channels }) => request({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: {
    channels // 用户已选频道数组
  }
})

// 频道管理- 删除用户指定的频道
export const removeTheChannelAPI = ({ channelId }) => request({
  url: `/v1_0/user/channels/${channelId}`,
  method: 'DELETE'
})

// 文章--获取文章新闻推荐列表
export const getAllArticleListAPI = ({ channel_id, timestamp }) => request({
  url: '/v1_0/articles',
  method: 'GET',
  // headers: {
  //   Authorization: `Bearer ${getToken()}`
  // },
  params: { // 这里的参数，axios会帮你拼接在URL?后面（查询字符串）
    channel_id,
    timestamp
  }
})

// 文章--不喜欢
export const dislikeArticleAPI = ({ artId }) => request({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  // headers: {
  //   Authorization: `Bearer ${getToken()}`
  // },
  data: {
    target: artId
  }
})

// 文章--举报
export const reportsArticleAPI = ({ target, type, remark }) => request({
  url: '/v1_0/article/reports',
  method: 'POST',
  // headers: {
  //   Authorization: `Bearer ${getToken()}`
  // },
  data: {
    target,
    type,
    remark
  }
})

// 文章--点赞
export const articleLikeAPI = ({ article_id }) => request({
  url: '/v1_0/article/likings',
  method: 'POST',
  data: {
    target: article_id
  }
})
// 文章-- 取消点赞
export const articleLikeCancelAPI = ({ article_id }) => request({
  url: `/v1_0/article/likings/${article_id}`,
  method: 'DELETE'
})

// 文章 -- 收藏
export const articleCollectionAPI = ({ tgArt_id }) => request({
  url: '/v1_0/article/collections',
  method: 'POST',
  data: {
    target: tgArt_id
  }
})
// 文章 -- 取消收藏
export const articleCollectionCancelAPI = ({ tgArt_id }) => request({
  url: `/v1_0/article/collections/${tgArt_id}`,
  method: 'DELETE'
})
// 文章详情-获取文章详情
export const getArticleDetailAPI = ({ article_id }) => request({
  url: `/v1_0/articles/${article_id}`,
  method: 'GET'
})

// 评论 -- 获取评论
export const getArticleCommentListAPI = ({ type = 'a', source, offset = null, limit = 10 }) => request({
  url: '/v1_0/comments',
  method: 'GET',
  params: {
    type,
    source,
    offset,
    limit
  }
})

// 评论 -- 对评论点赞
export const likingsCommentAPI = ({ comId }) => request({
  url: '/v1_0/comment/likings',
  method: 'POST',
  data: {
    target: comId
  }
})

// 评论 -- 对评论取消点赞
export const likingsCancelCommentAPI = ({ comId }) => request({
  url: `/v1_0/comment/likings/${comId}`,
  method: 'DELETE'
})

// 评论--对文章进行评论
export const commentArticleOrCommentAPI = ({ id, comText, art_id = null }) => {
  // axios中，data请求体传参，如果值为null是不会忽略这个参数的
  // 也会把参数名和值携带给后台（只有params遇到null才会忽略）

  // 形参artId为可选参数，如果对文章评论，则不需要传递art_id, 目标id即为文章id
  // 如果内部 art_id为null，证明此次调用为对文章评论
  const obj = {
    target: id,
    content: comText
  }
  if (art_id !== null) {
    obj.art_id = art_id
  }
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: obj
  })
}
// 搜素--联想菜单
export const suggestListAPI = ({ keywords }) => request({
  url: '/v1_0/suggestion',
  params: {
    q: keywords
  }
})

// 搜索--搜索结果列表
export const searchResultAPI = ({ page = 1, per_page = 10, q }) => request({
  url: '/v1_0/search',
  method: 'GET',
  params: {
    page,
    per_page,
    q
  }
})
