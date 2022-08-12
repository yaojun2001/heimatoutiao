<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小思同学"></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div v-for="(obj, index) in list" :key="index">
        <!-- 左侧是机器人小思 -->
        <div class="chat-item left" v-if="obj.name !== 'me'">
          <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
          <div class="chat-pao">{{ obj.msg }}</div>
        </div>

        <!-- 右侧是当前用户 -->
        <div class="chat-item right" v-else>
          <div class="chat-pao">{{ obj.msg }}</div>
          <van-image fit="cover" round :src="$store.state.userPhoto" />
        </div>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="word" placeholder="说点什么...">
        <template #button>
          <span style="font-size:12px;color:#999" @click="commitClickFun">提交</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client'
import { getToken } from '@/utils/token'
export default {
  name: 'HeimatoutiaoIndex',

  data() {
    return {
      word: '', // 输入框的内容
      list: [ // 所有的聊天信息
        { name: 'xs', msg: 'hi,你好！我是小思' },
        { name: 'me', msg: 'hello! 我是程序员' },
        { name: 'xs', msg: 'hi,你好！我是小思' },
        { name: 'me', msg: 'hello! 我是程序员' },
        { name: 'xs', msg: 'hi,你好！我是小思' },
        { name: 'me', msg: 'hello! 我是程序员' },
        { name: 'xs', msg: 'hi,你好！我是小思' },
        { name: 'me', msg: 'hello! 我是程序员' },
        { name: 'xs', msg: 'hi,你好！我是小思' },
        { name: 'me', msg: 'hello! 我是程序员' }
      ],
      socket: null // 客户端和服务器端建立链接的socket对象
    }
  },
  created() {
    // io 是建立socket链接
    this.socket = io('ws://geek.itheima.net', {
      query: {
        token: getToken()
      },
      transports: ['websocket']
    })

    // 测试链接
    this.socket.on('connect', () => {
      console.log('链接成功')
    })

    // 接收后端传回的消息
    this.socket.on('message', obj => {
      this.list.push({
        name: 'xs',
        msg: obj.msg
      })
    })
  },

  mounted() {},

  methods: {
    commitClickFun() {
      if (this.word.trim().length === 0) return
      // 添加聊天记录 到list列表
      this.list.push({
        name: 'me',
        msg: this.word
      })
      // 向 服务器发送消息  服务端接收消息
      this.socket.emit('message', {
        msg: this.word,
        timestamp: new Date().getDate()
      })

      // 输入框->置空
      this.word = ''
    }

  },
  destroyed() {
    this.socket.close()
    this.socket = null
  },
  watch: {
    list: {
      // 1为新值，2为旧值
      handler(list1, list2) {
        this.$nextTick(() => {
          const theLastDiv = document.querySelector('.chat-list>div:last-child')
          // console.log(theLastDiv)
          theLastDiv.scrollIntoView({
            behavior: 'smooth'
          })
        })
      },
      immediate: true
      // deep: true

    }
  }
}
</script>

<style lang="less" scoped>
.container {
     height: 100%;
     width: 100%;
     position: absolute;
     left: 0;
     top: 0;
     box-sizing: border-box;
     background: #fafafa;
     padding: 46px 0 50px 0;
     .chat-list {
       height: 100%;
       overflow-y: scroll;
       .chat-item {
         padding: 10px;
         .van-image {
           vertical-align: top;
           width: 40px;
           height: 40px;
         }
         .chat-pao {
           vertical-align: top;
           display: inline-block;
           min-width: 40px;
           max-width: 70%;
           min-height: 40px;
           line-height: 38px;
           border: 0.5px solid #c2d9ea;
           border-radius: 4px;
           position: relative;
           padding: 0 10px;
           background-color: #e0effb;
           word-break: break-all;
           font-size: 14px;
           color: #333;
           &::before {
             content: '';
             width: 10px;
             height: 10px;
             position: absolute;
             top: 12px;
             border-top: 0.5px solid #c2d9ea;
             border-right: 0.5px solid #c2d9ea;
             background: #e0effb;
           }
         }
       }
     }
   }
   .chat-item.right {
     text-align: right;
     .chat-pao {
       margin-left: 0;
       margin-right: 15px;
       &::before {
         right: -6px;
         transform: rotate(45deg);
       }
     }
   }
   .chat-item.left {
     text-align: left;
     .chat-pao {
       margin-left: 15px;
       margin-right: 0;
       &::before {
         left: -5px;
         transform: rotate(-135deg);
       }
     }
   }
   .reply-container {
     position: fixed;
     left: 0;
     bottom: 0;
     height: 44px;
     width: 100%;
     background: #f5f5f5;
     z-index: 9999;
   }
</style>
