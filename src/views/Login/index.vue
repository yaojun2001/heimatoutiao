<template>
  <div>
    <van-nav-bar title="黑马头条-登录" />

    <div>
      <van-form @submit="onSubmit">
        <van-field v-model="user.mobile" required name="mobile" label="手机号" placeholder="请输入11位手机号..." :rules="[{ required: true, message: '请填写正确的手机号',pattern:/^1[3-9]\d{9}$/ }]" />
        <van-field v-model="user.code" required type="password" name="code" label="密码" placeholder="请输入密码..." :rules="[{ required: true, message: '请填写正确的密码',pattern: /^\d{6}$/ }]" />
        <div style="margin: 16px;">
          <van-button round block :disabled="isloading" :loading="isloading" loading-type="spinner" loading-text="正在登录..." type="info" native-type="submit">登录</van-button>
        </div>
      </van-form>
    </div>

  </div>
</template>

<script>
import { loginAPI } from '@/api'
import { Notify } from 'vant'
import { setToken } from '@/utils/token.js'
import { setStorage } from '@/utils/storage'
export default {
  name: 'HeimatoutiaoIndex',

  data() {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码（密码-必须是246810后台规定的。无论手机号是什么）
      },
      isloading: false // 登录按钮-加载状态
    }
  },

  mounted() {},

  methods: {
    // 提交方法(form整体通过验证才会触发)
    async onSubmit(values) {
      // 可以直接用values(收集参数名和值)
      // console.log('submit', values)
      // console.log(this.user)
      this.isloading = true

      try {
        const res = await loginAPI(this.user)
        console.log(res) // res.data.data 中存了token 和refresh_token
        Notify({ type: 'success', message: '登录成功' })
        setToken(res.data.data.token)
        setStorage('refresh_token', res.data.data.refresh_token)
        // 跳转一定要写在最后->尽量最后执行
        this.$router.replace({
          path: this.$route.query.path || '/layout/home'
        })
      } catch (err) {
        // promise内ajax抛出错误，直接进入
        console.log(err)
        Notify({ type: 'danger', message: '账号或密码错误' })
      }
      this.isloading = false
    }
  }
}
</script>

<style lang="less" scoped>
// .van-nav-bar {
//   background-color: #007bff;
// }
// // 由于 scoped 给类加一个date-数字 后选择器对应不匹配
// /deep/ .van-nav-bar__title {
//   color: white;
// }
</style>
