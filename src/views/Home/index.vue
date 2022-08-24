<template>
  <div>
    <!-- 头部导航 -->
    <div>
      <van-nav-bar fixed>
        <template v-slot:left>
          <img class="logo" src="@/assets/toutiao_logo.png" alt="">
        </template>
        <template #right>
          <van-icon name="search" size="0.48rem" color="#ffffff" @click="$router.push('/search')" />
        </template>
      </van-nav-bar>
    </div>
    <!-- tab 导航栏 -->
    <div class="home-tab">
      <van-tabs v-model="channelId" animated sticky @change="channelIdChangeFun" offset-top="1.226667rem">
        <van-tab :title="obj.name" v-for="obj in userChannelsList" :key="obj.id" :name="obj.id">
          <ArticleList :channelId="channelId"></ArticleList>
        </van-tab>
      </van-tabs>
      <!-- 编辑频道图标 -->
      <van-icon name="plus" size="0.37333334rem" class="moreChannels" @click="showPopup" />
    </div>
    <!-- 频道管理弹出层 -->
    <van-popup class="channel_popup" v-model="show" get-container="body">
      <ChannelEdit v-model="channelId" ref="editRef" @closePopupEV="closePopupFun" @removeChannelEV="removeChannelFun" @addChannelEV="addChannelFn" :userList="userChannelsList" :uncheckedList="unCheckChannelList"></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannelsAPI, getAllChannelsAPI, updateChannelsAPI, removeTheChannelAPI } from '@/api'
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from './ChannelEdit.vue'
import { Notify } from 'vant'
// 问题：每次切换tab拿到的数据都是新的
// 多个ArticleLise用的是同一个数组，切换会影响其他频道的列表
// 解决： 文章列表数据，请求，数组，分别放入到ArticleList内部（自己请求自己的数据）
export default {
  name: 'HeimatoutiaoIndex',

  data() {
    return {
      channelId: 0, // tab导航-激活频道的ID，默认为推荐
      userChannelsList: [], // 用户选择频道列表
      allChannelsList: [], // 所有频道列表
      show: false, // 频道弹出层显示/隐藏
      channelScrollTop: {}
      // articleList: []
    }
  },
  async created() {
    // 频道列表
    const res = await getUserChannelsAPI()
    console.log(res)
    this.userChannelsList = res.data.data.channels
    // this.channelIdChangeFun()

    // 所有频道列表
    const res2 = await getAllChannelsAPI()
    console.log(res2)
    this.allChannelsList = res2.data.data.channels
  },
  components: {
    ArticleList,
    ChannelEdit
  },

  mounted() {},

  methods: {
    // 关闭弹出层
    closePopupFun() {
      this.show = false
      this.$refs.editRef.isEdit = false
    },
    // 删除频道
    async removeChannelFun(channelobj) {
      const index = this.userChannelsList.findIndex(obj => obj.id === channelobj.id)
      this.userChannelsList.splice(index, 1)

      // 一：覆盖式更新发送
      // 二：调用接口
      const res = await removeTheChannelAPI({
        channelId: channelobj.id
      })
      console.log(res)
      // 删除接口返回状态码 204(Not Content) 无返回内容
      Notify({ type: 'warning', message: '删除成功' })
    },

    // 添加频道
    async addChannelFn(channelObj) {
      this.userChannelsList.push(channelObj)
      // const res = await updateChannelsAPI({
      //   channels: this.userChannelsList
      // })
      // console.log(res)
      // 深拷贝，保存的是同一个地址，出问题：新增时，名字没了
      // const newArr = this.userChannelsList.filter(obj => obj.id !== 0)
      // newArr.forEach((obj, index) => {
      //   delete obj.name
      //   obj.seq = index
      // })
      // const res = await updateChannelsAPI({
      //   channels: newArr
      // })
      // console.log(res)

      // 新方法：浅拷贝，新建一个数组实现浅拷贝
      const newArr = this.userChannelsList.filter(obj => obj.id !== 0)
      const theNewArr = newArr.map((obj, index) => {
        const newObj = { ...obj }
        delete newObj.name
        newObj.seq = index

        return newObj // 让map方法把新对象收集起来，形成一个新数组
      })
      const res = await updateChannelsAPI({
        channels: theNewArr
      })
      console.log(res)
    },
    // + 号点击 展示 弹出层
    showPopup() {
      this.show = true
    },
    // tabs 切换的事件 -> 获取文章列表数据
    channelIdChangeFun() {
    //   // 文章列表
    //   const res2 = await getAllArticleListAPI({
    //     channel_id: this.channelId,
    //     // res.data.data.channels[this.active].id
    //     timestamp: new Date().getTime()
    //   })
    //   console.log(res2)
    //   this.articleList = res2.data.data.results
    //   // console.log(res2.data.data.results)
      // console.log(this.$route.meta.scrollT)
      this.$nextTick(() => {
        document.documentElement.scrollTop = this.channelScrollTop[this.channelId]
      })
    },
    scrollFun() {
      this.$route.meta.scrollT = document.documentElement.scrollTop
      this.channelScrollTop[this.channelId] = document.documentElement.scrollTop
    }
  },
  // 计算属性
  computed: {
    unCheckChannelList() {
      // 目标：把所有频道数组挨个对象取出，去用户已选频道数组里查找，如果找不到，则让filter方法收集到一个新数组里面
      // const newArr = this.allChannelsList.filter(bigObj => {
      //   const index = this.userChannelsList.findIndex(smallObj => {
      //     return smallObj.id === bigObj.id
      //   })

      //   // 找到了
      //   if (index > -1) {
      //     return false
      //   } else {
      //     return true
      //   }
      // })

      // return newArr
      return this.allChannelsList.filter(bigObj =>
        (this.userChannelsList.findIndex(smallObj => smallObj.id === bigObj.id)) === -1
      )

      //   // 找到了
      //   if (index > -1) {
      //     return false
      //   } else {
      //     return true
      //   }
      // })

      // return newArr
    }
  },
  activated() {
    // console.log(111)
    window.addEventListener('scroll', this.scrollFun)
    // console.log(this.$route.meta.scrollT)
    document.documentElement.scrollTop = this.$route.meta.scrollT
  },
  deactivated() {
    window.removeEventListener('scroll', this.scrollFun)
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}
.logo {
  width: 100px;
  height: 30px;
}
.home-tab {
  padding-top: 44px;
}
// 如果要设置100%，要先给html和body 设置100%
// vw 和 vh 参考浏览器窗口百分比
.channel_popup {
  width: 100vw;
  height: 100vh;
}
</style>
