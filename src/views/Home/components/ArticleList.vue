<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false" offset="50">
        <ArticleItem @click.native="ArticleItemClickFun(obj.art_id)" v-for="obj in articleList" :key="obj.art_id" @reportEV="reportArt" @disLikeEV="disLikeFun" :artObj="obj"></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 事件修饰符 .native -> 给组件内根标签，绑定原生click 点击事件
import ArticleItem from '../../../components/ArticleItem.vue'
import { getAllArticleListAPI, dislikeArticleAPI, reportsArticleAPI } from '@/api/index.js'
import Notify from '@/ui/Notify'
// 问题：网页刚打开，create里请求和onload里请求同时发送，请求的都是最新数据
// onload中，2此一样的数据合并，数据重复，key重复
// 原因：van-list 组件，组件挂载时，默认就会判定一次是否触底
// 解决方案一：list组件 添加 :immediate-check="false"
// 解决方案二：onload 中 添加 if (this.articleList.length === 0)   return

export default {
  name: 'HeimatoutiaoArticleList',

  data() {
    return {
      articleList: [],
      loading: false, // 底部加载状态
      finished: false, // 底部是否加载完成
      refreshing: false,
      theTime: new Date().getTime() // 用于分页

    }
  },
  props: {
    // list: Array // 文章列表数组
    channelId: Number
  },
  components: {
    ArticleItem
  },

  mounted() {},

  methods: {
    // 专门负责发送请求
    async getArticleListFun() {
      // 文章列表
      const res = await getAllArticleListAPI({
        channel_id: this.channelId,
        // res.data.data.channels[this.active].id
        timestamp: this.theTime
      })
      // console.log(res)
      this.articleList = [...this.articleList, ...res.data.data.results]
      // console.log(res2.data.data.results)

      this.theTime = res.data.data.pre_timestamp

      this.loading = false // 如果不关闭，底部一直是加载状态
      if (res.data.data.pre_timestamp === null) {
        this.finished = true
      }

      // 顶部加载状态改为false
      this.refreshing = false
    },
    // 底部加载
    onLoad() {
      if (this.articleList.length === 0) {
        return
      }
      this.getArticleListFun()
    },
    // 顶部刷新
    onRefresh() {
      this.articleList = []
      this.theTime = new Date().getTime()
      this.getArticleListFun()
      // 顶部加载状态改为false
      this.refreshing = false
    },
    // 反馈--不感兴趣
    async disLikeFun(id) {
      // 如果用try+catch 自己处理错误，内部throw就不会向控制台抛出打印错误，而是交给catch内自定义错误处理
      // try+捕获同步代码的异常
      // await 暂停同步任务，等待异步任务处理
      try {
        await dislikeArticleAPI({
          artId: id
        })
        Notify({ type: 'success', message: '反馈成功' })
        console.log('反馈成功')
      } catch (err) {
        console.log('反馈失败')
      }
    },
    // 反馈--举报
    async reportArt(id, value) {
      try {
        await reportsArticleAPI({
          target: id,
          type: value,
          remark: '有问题'
        })
        Notify({ type: 'success', message: '举报成功' })
      } catch (err) {
        Notify({ type: 'warning', message: '举报失败' })
      }
    },
    ArticleItemClickFun(id) {
      this.$router.push({
        path: `/article_detail?art_id=${id}`
      })
    }
  },
  created() {
    this.getArticleListFun()
  }
}
</script>

<style lang="scss" scoped>
</style>
