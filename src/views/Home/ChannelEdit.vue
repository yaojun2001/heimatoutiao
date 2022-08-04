<template>
  <div>
    <!-- 弹出层的头部区域 -->
    <van-nav-bar title="频道管理">
      <template #right>
        <van-icon @click="closePopupFun" name="cross" size="0.37333334rem" color="white" />
      </template>
    </van-nav-bar>

    <!-- 我的频道 -->
    <div class="my-channel-box">
      <div class="channel-title">
        <span>我的频道
          <span class="small-title">
            点击{{ isEdit ? '删除' :'进入' }}频道
          </span>
        </span>
        <span @click="EditChannel">{{ isEdit ? '完成' : '编辑' }}</span>
      </div>

      <!-- 我的频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="obj in userList" :key="obj.id" @click="removeChannelFun(obj)">
          <div class="channel-item van-hairline--surround">
            {{ obj.name }}
            <!-- 删除的徽标 -->
            <van-badge v-if="isEdit && obj.id !== 0" color="transparent" class="cross-badge">
              <template #content>
                <van-icon name="cross" class="badge-icon" color="#cfcfcf" size="0.32rem" />
              </template>
            </van-badge>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 更多频道 -->
    <div class="more-channel-box">
      <div class="channel-title">
        <span>点击添加更多频道：</span>
      </div>
      <!-- 更多频道列表 -->
      <van-row type="flex">

        <van-col span="6" v-for="obj in uncheckedList" :key="obj.id" @click="addChannelFun(obj)">
          <div  class="channel-item van-hairline--surround">{{ obj.name }}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeimatoutiaoChannelEdit',

  data() {
    return {
      isEdit: false,
      operater: '编辑'
    }
  },
  props: {
    userList: Array, // 已选
    uncheckedList: Array // 未选
  },

  mounted() {},

  methods: {
    // 编辑-> 点击事件
    EditChannel() {
      this.isEdit = !this.isEdit
    },
    // 添加事件
    addChannelFun(channelObj) {
      if (this.isEdit === true) {
        this.$emit('addChannelEV', channelObj)
      }
    },
    // 用户选择频道--删除按钮--点击事件
    removeChannelFun(channelobj) {
      if (this.isEdit === true) {
        if (channelobj.id !== 0) {
          this.$emit('removeChannelEV', channelobj)
        }
      } else {
        this.$emit('closePopupEV')
        // 触发v-model 绑定的input事件
        // 把值传出去绑定给v-model 的 channelId 变量
        this.$emit('input', channelobj.id)
      }
    },
    // 关闭弹出层方法
    closePopupFun() {
      this.$emit('closePopupEV')
      // this.isEdit = false
    }
  }
}
</script>

<style lang="less" scoped>
.van-popup,
   .popup-container {
     background-color: transparent;
     height: 100%;
     width: 100%;
   }

   .popup-container {
     display: flex;
     flex-direction: column;
   }

   .pop-header {
     height: 90px;
     background-color: #007bff;
     color: white;
     text-align: center;
     font-size: 14px;
     position: relative;
     .title {
       width: 100%;
       position: absolute;
       bottom: 15px;
     }
   }

   .pop-body {
     flex: 1;
     overflow: scroll;
     padding: 8px;
     background-color: white;
   }

   .my-channel-box,
   .more-channel-box {
     .channel-title {
       display: flex;
       justify-content: space-between;
       font-size: 14px;
       line-height: 28px;
       padding: 0 6px;
     }
   }

   .channel-item {
     font-size: 12px;
     text-align: center;
     line-height: 36px;
     background-color: #fafafa;
     margin: 5px;
   }

   /*删除的微标 */
   .cross-badge {
     position: absolute;
     right: -3px;
     top: 0;
     border: none;
   }

   /*提示文字 */
   .small-title {
     font-size: 10px;
     color: gray;
   }
</style>
