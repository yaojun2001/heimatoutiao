import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userPhoto: 'https://ts1.cn.mm.bing.net/th/id/R-C.cda6d09cbf0762a7d9f15b5b17380a1d?rik=L18LPj03ZQnVMw&riu=http%3a%2f%2ftupian.qqw21.com%2farticle%2fUploadPic%2f2018-8%2f201882222255890038.jpg&ehk=zuyAFj4K6fGGZwL6TwkZPwzv5Vg72K41Wnto%2byOaSIc%3d&risl=&pid=ImgRaw&r=0'
  },
  getters: {
  },
  mutations: {
    SET_USERPHOTO(state, value) {
      state.userPhoto = value
    }
  },
  actions: {
  },
  modules: {
  }
})
