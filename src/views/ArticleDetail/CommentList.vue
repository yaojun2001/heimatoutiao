<!-- 定义评论组件 -->
<template>
  <div>
    <!-- 评论列表 -->
    <div class="cmt-list" :class="{'art-cmt-container-1':isShow,'art-cmt-container-2':!isShow}">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多评论了" @load="onLoad" :immediate-check="false" offset="50">

      <!-- 评论的 Item 项 -->
      <div v-for="obj in commentsList" :key="obj.com_id" class="cmt-item">
        <!-- 头部区域 -->
        <div class="cmt-header">
          <!-- 头部左侧 -->
          <div class="cmt-header-left">
            <img :src="obj.aut_photo" alt="" class="avatar">
            <span class="uname">{{ obj.aut_name}}</span>
          </div>
          <!-- 头部右侧 -->
          <div class="cmt-header-right">
            <van-icon @click="likeClickFun(obj)" v-if="obj.is_liking" name="like" size="16" color="red" />
            <van-icon @click="likeClickFun(obj)" v-else name="like-o" size="16" color="gray" />
          </div>
        </div>
        <!-- 主体区域 -->
        <div class="cmt-body" v-html=" obj.content">
        </div>
        <!-- 尾部区域 -->
        <div class="cmt-footer">{{timeAgo(obj.pubdate)}}</div>
      </div>
      </van-list>
    </div>
    <div>
          <!-- 底部添加评论区域 - 1 -->
    <div v-if="isShow" class="add-cmt-box van-hairline--top">
      <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
      <div class="ipt-cmt-div" @click="changeComment">发表评论</div>
      <div class="icon-box">
        <van-badge :content="commentCount===0? '':commentCount" max="99">
          <van-icon @click="commentClickFun" name="comment-o" size="0.53333334rem" />
        </van-badge>
        <van-icon name="star-o" size="0.53333334rem" />
        <van-icon name="share-o" size="0.53333334rem" />
      </div>
    </div>

    <!-- 底部添加评论区域 - 2 -->
    <div v-else class="cmt-box van-hairline--top">
      <textarea v-infoc @blur="changeComment" v-model.trim="comText" placeholder="友善评论、理性发言、阳光心灵"></textarea>
      <van-button type="default" :disabled="comText.length === 0" @click="sendCommentFun">发布</van-button>
    </div>
    </div>
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date'
import {
  getArticleCommentListAPI,
  likingsCommentAPI,
  likingsCancelCommentAPI,
  commentArticleOrCommentAPI
} from '@/api'
import { Notify } from 'vant'
export default {
  name: 'HeimatoutiaoCommentList',
  // props: ['art_id'],

  data() {
    return {
      commentsList: [], // 评论列表
      commentCount: 0,
      offset: null, // 偏移量评论ID
      isShow: true, // 底部显示1/2的评论盒
      comText: '', // 评论内容
      lastId: null, // 做分页
      loading: false,
      finished: false
    }
  },
  async created() {
    const res = await getArticleCommentListAPI({
      source: this.$route.query.art_id
    })
    console.log(res)
    this.commentsList = res.data.data.results
    this.commentCount = res.data.data.total_count
    this.lastId = res.data.data.last_id
    if (res.data.data.last_id === res.data.data.end_id) {
      this.finished = true
    }
  },

  mounted() {},

  methods: {
    timeAgo,
    async likeClickFun(comObj) {
      comObj.is_liking = !comObj.is_liking
      if (comObj.is_liking === true) {
        // 对评论点赞
        // 调点赞接口
        await likingsCommentAPI({
          comId: comObj.com_id
        })

        Notify({ type: 'success', message: '已点赞' })
      } else {
        // 对评论取消点赞
        // 调取消点赞接口
        await likingsCancelCommentAPI({
          comId: comObj.com_id
        })

        Notify({ type: 'warning', message: '已取消' })
      }
    },
    changeComment() {
      // 点击发布按钮，发现点击事件不执行
      // 原因：页面点击一瞬间，输入框失去焦点，被v-if移除了标签
      // 点击事件还没来得及执行
      setTimeout(() => {
        this.isShow = !this.isShow
      }, 0)
    },
    // 评论按钮--点击--滚动跳转--第一条评论滑动到最上面
    commentClickFun() {
      // JS代码是在html+css运行后，真实dom已经在网页上了，从document往下获取标签是可以的
      // 设置window.scrollTo(0,文章内容高度)
      // const articleHeight = document.querySelector('.article-container')
      // window.scrollTo(0, articleHeight)

      // js写动画：定时器间隔时间,修改目标状态
      // H5 新增方法:让原生标签.scrollIntoView() 滚动到屏幕最上面，可能不兼容
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },
    // 发布按钮-点击事件-发布评论
    async sendCommentFun() {
      console.log(this.comText)
      const res = await commentArticleOrCommentAPI({
        id: this.$route.query.art_id,
        comText: this.comText
      })
      console.log(res)
      this.commentsList = [res.data.data.new_obj, ...this.commentsList]
      // this.commentsList.unshift(res.data.data.new_obj)
      this.commentCount++
      this.comText = ''
      this.commentClickFun()
    },
    async onLoad() {
      if (this.commentsList.length > 0) {
        const res = await getArticleCommentListAPI({
          source: this.$route.query.art_id,
          offset: this.lastId
        })
        console.log(res)
        // 多发一次请求
        // if (res.data.data.results.length === 0) {
        //   this.finished = true
        // }
        this.commentsList = [...this.commentsList, ...res.data.data.results]
        this.commentCount = res.data.data.total_count
        this.lastId = res.data.data.last_id

        if (res.data.data.last_id === null) {
          this.finished = true
        }
        this.loading = false
      } else {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
