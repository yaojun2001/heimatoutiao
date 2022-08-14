import request from '@/utils/request'

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
