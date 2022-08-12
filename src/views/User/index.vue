
  <template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="userObj.photo" alt="" class="avatar">
        </template>
        <template #title>
          <span class="username">{{ userObj.name  }}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{ userObj.art_count  }}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{ userObj.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{  userObj.fans_count }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to="/user_edit" />
      <van-cell icon="chat-o" title="小思同学" is-link />
      <van-cell icon="warning-o" title="退出登录" @click="quitLoginFun" is-link />
    </van-cell-group>
  </div>
</template>

<script>
import { getTheUserAPI } from '@/api'
import { Dialog } from 'vant'
import { removeToken } from '@/utils/token.js'
export default {
  name: 'HeimatoutiaoIndex',

  data() {
    return {
      userObj: {} // 用户对象
    }
  },
  async created() {
    const res = await getTheUserAPI()
    console.log(res)
    this.userObj = res.data.data
  },

  mounted() {},

  methods: {
    // 退出登录--点击事件-弹框退出
    quitLoginFun() {
      Dialog.confirm({
        title: '提示',
        message: '您确定要退出登录吗？'
      })
        .then(() => {
          // on confirm
          removeToken()
          this.$router.replace('/login')
        })
        .catch(() => {
          // on cancel
        })
    },
    // 编辑资料 -- 点击事件--跳转路由
    editClickFun() {
      this.$router.push('/user_edit')
    }
  }
}
</script>

<style lang="less" scoped>
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>
