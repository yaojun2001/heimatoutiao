// 封装 本地持久化存储方式
export const setStorage = (key, value) => {
  return localStorage.setItem(key, value)
}

export const getStorage = (key) => {
  return localStorage.getItem(key)
}

export const removeStorage = (key) => {
  localStorage.removeItem(key)
}
