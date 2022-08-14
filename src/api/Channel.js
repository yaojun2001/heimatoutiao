import request from '@/utils/request.js'

// 频道--获取所有频道
export const getAllChannelsAPI = () => {
  return request({
    url: '/v1_0/channels',
    method: 'GET'
  })
}

// 频道--获取用户选择的频道
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
