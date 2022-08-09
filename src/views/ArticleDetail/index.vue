<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />

    <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ articleObj.title }}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="articleObj.aut_name" :label="timeAgo(articleObj.pubdate)">
        <template #icon>
          <van-image :src="articleObj.aut_photo" alt="" class="avatar">
            <template v-slot:error>图片加载失败</template>
          </van-image>
          <!-- <img :src="articleObj.aut_photo" alt="" class="avatar"> -->
        </template>
        <template #default>
          <div>
            <van-button @click="followedClickFun" v-if="articleObj.is_followed" type="info" size="mini">已关注</van-button>
            <van-button @click="followedClickFun" v-else icon="plus" type="info" size="mini" plain>关注</van-button>
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="articleObj.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button @click="likeArticleClickFun" v-if="articleObj.attitude === 1" icon="good-job" type="danger" size="small">已点赞</van-button>
        <van-button @click="likeArticleClickFun" v-else icon="good-job-o" type="danger" plain size="small">点赞</van-button>
      </div>
    </div>
    <!-- 分割线 -->
    <van-divider></van-divider>
    <!-- 文章评论部分 -->
    <div>
      <CommentList></CommentList>
    </div>
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date.js'
import {
  getArticleDetailAPI,
  followingUserAPI,
  cancelFollowedUserAPI,
  articleLikeAPI,
  articleLikeCancelAPI
} from '@/api'
import { Notify } from 'vant'
import CommentList from './CommentList.vue'
export default {
  name: 'HeimatoutiaoIndex',
  data() {
    return {
      articleObj: {}
    }
  },
  mounted() {},
  async created() {
    const res = await getArticleDetailAPI({
      article_id: this.$route.query.art_id
    })
    // console.log(res)
    this.articleObj = res.data.data
  },
  methods: {
    timeAgo,
    // 关注/取关 -> 作者
    async followedClickFun() {
      if (this.articleObj !== {}) {
        this.articleObj.is_followed = !this.articleObj.is_followed
      }
      if (this.articleObj.is_followed === true) {
        // 点击已关注
        // 页面--显示：已关注 按钮
        // 实现 关注接口
        Notify({ type: 'success', message: '已关注' })
        // 关注接口
        const res = await followingUserAPI({
          targetUserId: this.articleObj.aut_id
        })
        console.log(res)
      } else {
        // 用户 点在 '关注' 按钮上
        // 页面 -> 显示 '关注' 按钮
        Notify({ type: 'warning', message: '已取消关注' })
        const res = await cancelFollowedUserAPI({
          targetUserId: this.articleObj.aut_id
        })
        console.log(res)
      }
      console.log(this.articleObj)
    },
    async likeArticleClickFun() {
      if (this.articleObj.attitude === 1) {
        this.articleObj.attitude = -1 // 对文章无态度
        // 实现 取消点赞
        Notify({ type: 'warning', message: '已取消点赞' })
        //  取消点赞接口方法
        const res = await articleLikeCancelAPI({
          article_id: this.articleObj.art_id
        })
        console.log(res)
      } else {
        this.articleObj.attitude = 1 // 对文章点赞
        Notify({ type: 'success', message: '已点赞' })
        // 点赞请求
        const res = await articleLikeAPI({
          article_id: this.articleObj.art_id
        })
        console.log(res)
      }
      console.log(this.articleObj)
    }
  },
  components: { CommentList }
}
</script>

<style lang="less" scoped>
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
</style>
