<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="user.photo" @click="photoClickChange" />
          <input type="file" v-show="false" ref="iptFile" accept="image/*" @change="onFileChange" />
        </template>
      </van-cell>
      <van-cell title="名称" @click="nameClickFun" :value="user.name" is-link />
      <van-cell title="生日" @click="birthdayClickFun" :value="user.birthday" is-link />
    </van-cell-group>

    <!-- 名称弹窗 -->
    <van-dialog v-model="nameDialogShow" title="修改名称" :before-close="beforeCloseFun" show-cancel-button>
      <input type="text" ref="focusInput" v-model="userName" />
    </van-dialog>

    <!-- 生日 -- 时间选择器-->
    <van-popup v-model="show" position="bottom" round>
      <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" @confirm="confirmChooseFun" @cancel="cancelChooseFun" :min-date="minDate" :max-date="maxDate" />
    </van-popup>

  </div>
</template>

<script>
import { getUserProfileAPI, editUserPhotoAPI, editUserProfileAPI } from '@/api'
import Notify from '@/ui/Notify'
import { formatDateToString } from '@/utils/date.js'
import { mapMutations } from 'vuex'
export default {
  name: 'UserEdit',

  data() {
    return {
      user: {},
      nameDialogShow: false,
      userName: '',
      // 生日 -- 时间选择器
      minDate: new Date(1949, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      show: false
    }
  },
  async created() {
    const res = await getUserProfileAPI()
    console.log(res)
    this.user = res.data.data
    // 方式一：
    // this.$store.commit('SET_USERPHOTO', res.data.data.photo)
    // 方式二：
    // this.SET_USERPHOTO(res.data.data.photo)
    // this.SET_USERNAME(res.data.data.name)
  },

  mounted() {},

  methods: {
    ...mapMutations(['SET_USERPHOTO', 'SET_USERNAME']),
    // 图片点击事件--模拟点击 input-file
    photoClickChange() {
      this.$refs.iptFile.click()
    },
    // 文件改变函数 -- 调接口改头像
    async onFileChange(e) {
      if (e.target.files[0] === undefined) return // e.target.files.length === 0 也可以
      // console.log(e.target.files[0]) // FileList{0: File, length: 1}
      // 创建 FormData 表单对象
      const fdObj = new FormData()
      fdObj.append('photo', e.target.files[0]) // 添加 键值对
      const res = await editUserPhotoAPI(fdObj)
      this.user.photo = res.data.data.photo
      // console.log(res)
      // 方式一：
      // this.$store.commit('SET_USERPHOTO', res.data.data.photo)
      // 方式二：
      this.SET_USERPHOTO(res.data.data.photo)
    },
    // 点击姓名--跳出弹框+自动聚焦
    nameClickFun() {
      this.nameDialogShow = true
      setTimeout(() => {
        this.$refs.focusInput.focus()
      }, 500)
      this.userName = this.user.name
    },
    // 姓名弹框关闭前--确定-调接口保存，取消关闭弹框
    async beforeCloseFun(action, done) {
      // console.log(action) // confirm /  cancel
      if (action === 'confirm') {
        // 正则校验
        const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{2,7}$/
        if (reg.test(this.userName)) {
          // 正则校验通过
          // 调用保存姓名接口  并回显到页面
          await editUserProfileAPI({
            name: this.userName
          })
          this.user.name = this.userName
          this.SET_USERNAME(this.userName)
          done()
        } else {
          // 正则校验未通过
          Notify({ type: 'warning', message: '用户名只能是2-7位数字字母汉字' })
          done(false)
        }
      } else {
        done()
      }
    },
    // 生日弹窗 - 点击 弹出时间选择器，初始时间为用户生日
    birthdayClickFun() {
      this.show = true
      this.currentDate = new Date(this.user.birthday)
    },
    // // 时间选择器 -- 确定按钮
    async confirmChooseFun() {
      // this.currentDate 是Date 对象 ，birthday 要YYYY-MM-DD 字符串
      await editUserProfileAPI({
        birthday: formatDateToString(this.currentDate)
      })
      // 页面显示：
      this.user.birthday = formatDateToString(this.currentDate)
      this.show = false
    },
    // 时间选择器 -- 取消按钮
    cancelChooseFun() {
      this.show = false
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}

::v-deep .van-dialog__content {
  // display: flex;
  text-align: center;
  input {
    padding: 0;
    outline: none;
    border: none;
    text-align: center;
  }
}
</style>
