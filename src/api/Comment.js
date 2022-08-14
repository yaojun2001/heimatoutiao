import request from '@/utils/request.js'

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
