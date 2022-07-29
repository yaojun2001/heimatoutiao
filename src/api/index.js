// 统一封装接口方法
// 每个方法负责请求一个url地址
// 逻辑页面，导入这个接口方法，就可以发起请求
// 好处：统一管理
import request from '@/utils/request.js'

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
