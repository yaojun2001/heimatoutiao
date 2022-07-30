<template>
  <div>
    <!-- 头部导航 -->
    <div>
      <van-nav-bar fixed>
        <template v-slot:left>
          <img class="logo" src="@/assets/toutiao_logo.png" alt="">
        </template>
        <template #right>
          <van-icon name="search" size="0.48rem" color="#ffffff" />
        </template>
      </van-nav-bar>
    </div>
    <!-- tab 导航栏 -->
    <div class="home-tab">
      <van-tabs v-model="active" sticky offset-top="1.226667rem">
        <van-tab :title="obj.name" v-for="obj in userChannelsList" :key="obj.id">内容 {{ obj.name }}</van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { getUserChannelsAPI } from '@/api'
export default {
  name: 'HeimatoutiaoIndex',

  data() {
    return {
      active: 0,
      userChannelsList: []
    }
  },
  async created() {
    const res = await getUserChannelsAPI()
    console.log(res)
    this.userChannelsList = res.data.data.channels
  },

  mounted() {},

  methods: {}
}
</script>

<style lang="less" scoped>
.logo {
  width: 100px;
  height: 30px;
}
.home-tab{
  padding-top: 44px ;
}
</style>
