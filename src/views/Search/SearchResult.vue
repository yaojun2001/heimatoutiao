<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar title="搜索结果" left-arrow @click-left="$router.go(-1)" fixed />
    </div>
    <!-- 搜索结果页，复用ArticleItem组件 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false" offset="50">
    <ArticleItem @click.native="articleItemClickFun(obj.art_id)" v-for="obj in articleList" :key="obj.art_id" :artObj="obj" :isShow="false"></ArticleItem>
    </van-list>
  </div>
</template>

<script>
import { searchResultAPI } from '@/api'
import ArticleItem from '../../components/ArticleItem.vue'

export default {
  name: 'SearchResult',

  data() {
    return {
      page: 1, // 页码
      articleList: [], // 文章列表
      loading: false, // 加载状态
      finished: false // 是否全部加载完成
    }
  },
  components: {
    ArticleItem
  },
  async created() {
    const res = await searchResultAPI({
      page: this.page,
      q: this.$route.params.kw
    })
    // console.log(this.$route)
    this.articleList = res.data.data.results
    // console.log(res)
  },
  mounted() {},

  methods: {
    async onLoad() {
      if (this.articleList.length > 0) {
        this.page++
        const res = await searchResultAPI({
          page: this.page,
          q: this.$route.params.kw
        })
        if (res.data.data.results.length === 0) {
          this.finished = true
          return
        }
        // console.log(this.$route)
        this.articleList = [...this.articleList, ...res.data.data.results]
        // console.log(res)
        this.loading = false
      }
    },
    articleItemClickFun(id) {
      this.$router.push({
        path: `/article_detail?art_id=${id}`
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
