// 基于vant的二次封装
// 便于 统一修改提示框样式
// import { Notify } from 'vant'
import { Toast } from 'vant'

export default ({ type, message }) => {
  if (type === 'primary') {
    type = 'success'
  } else if (type === 'warning') {
    type = 'fail'
  }
  return Toast({
    type,
    message
  })
}
