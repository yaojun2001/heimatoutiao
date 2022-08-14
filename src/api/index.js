// 统一封装接口方法
// 每个方法负责请求一个url地址
// 逻辑页面，导入这个接口方法，就可以发起请求
// 好处：统一管理
// import request from '@/utils/request.js'
// import { getToken } from '@/utils/token.js'
// 用户
export * from './User.js'

// 文章
export * from './Article.js'

// 频道管理
export * from './Channel.js'

// 评论
export * from './Comment.js'

// 搜索
export * from './Search.js'
