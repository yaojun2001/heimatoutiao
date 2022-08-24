import request from '@/utils/request.js'
import { getStorage } from '@/utils/storage'

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
    Authorization: 'Bearer ' + getStorage('refresh_token')
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
