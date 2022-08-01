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
      <van-tabs v-model="channelId"  animated sticky offset-top="1.226667rem">
        <van-tab :title="obj.name" v-for="obj in userChannelsList" :key="obj.id" :name="obj.id">
          <ArticleList :channelId="channelId"></ArticleList>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { getUserChannelsAPI } from '@/api'
import ArticleList from './components/ArticleList.vue'

// 问题：每次切换tab拿到的数据都是新的
// 多个ArticleLise用的是同一个数组，切换会影响其他频道的列表
// 解决： 文章列表数据，请求，数组，分别放入到ArticleList内部（自己请求自己的数据）
export default {
  name: 'HeimatoutiaoIndex',

  data() {
    return {
      channelId: 0,
      userChannelsList: []
      // articleList: []
    }
  },
  async created() {
    // 频道列表
    const res = await getUserChannelsAPI()
    console.log(res)
    this.userChannelsList = res.data.data.channels
    // this.channelIdChangeFun()
  },
  components: {
    ArticleList
  },

  mounted() {},

  methods: {
    // async channelIdChangeFun() {
    //   // 文章列表
    //   const res2 = await getAllArticleListAPI({
    //     channel_id: this.channelId,
    //     // res.data.data.channels[this.active].id
    //     timestamp: new Date().getTime()
    //   })
    //   console.log(res2)
    //   this.articleList = res2.data.data.results
    //   // console.log(res2.data.data.results)
    // }
  }
}
</script>

<style lang="less" scoped>
.logo {
  width: 100px;
  height: 30px;
}
.home-tab {
  padding-top: 44px;
}
</style>
