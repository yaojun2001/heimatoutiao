// 封装全局自定义指令的js文件
// 封装中间件函数的插件
const directiveObj = {
  install(Vue) {
    Vue.directive('infoc', {
      // 指令所在标签，被插入到真实DOM时才触发
      // 如果标签用display:none隐藏再出现，不会再触发
      // inserted 方法名
      inserted(el) {
        // el 代表指令所在标签
        // 原生DOM.nodeName 拿到标签名(大写字符串)
        TextAreaOrInputfocus(el)
      }
      // // 更新时触发
      // update(el) {
      //   TextAreaOrInputfocus(el)
      // }
    })
  }
}
function TextAreaOrInputfocus(el) {
  if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
    el.focus()
  } else {
    const theInput = el.querySelector('input')
    if (theInput) theInput.focus()
    const theTextArea = el.querySelector('TextArea')
    if (theTextArea) theTextArea.focus()
  }
}

export default directiveObj
