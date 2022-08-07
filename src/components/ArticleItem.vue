<template>
  <div>
    <div>
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 标题区域的插槽 -->
        <template #title>
          <div class="title-box">
            <!-- 标题 -->
            <span>{{ artObj.title }}</span>
            <!-- 单图 -->
            <!-- <img v-if="artObj.cover.type === 1" class="thumb" :src="artObj.cover.images[0]" alt="" /> -->
            <van-image v-if="artObj.cover.type === 1" class="thumb" :src="artObj.cover.images[0]">
              <template v-slot:error>图片加载失败</template>
            </van-image>
            <!-- 标签 -->
            <!-- <van-tag type="danger">新</van-tag> -->
          </div>
          <!-- 多图 -->
          <div v-if="artObj.cover.type>1" class="thumb-box">
            <!-- <img v-for="(imgUrl, index) in artObj.cover.images" :key="index" class="thumb" :src="imgUrl" alt="" /> -->
            <van-image v-for="(imgUrl, index) in artObj.cover.images" :key="index" class="thumb" :src="imgUrl" alt="">
              <template v-slot:error>图片加载失败</template>
            </van-image>
          </div>
        </template>
        <!-- label区域的插槽  -->
        <template #label>
          <div class="label-box">
            <div>
              <span>{{ artObj.aut_name }} </span>
              <span>{{ artObj.comm_count }}评论 </span>
              <span>{{ timeAgo(artObj.pubdate) }} </span>
            </div>
            <!-- 反馈按钮 -->
            <van-icon name="cross" @click.stop="show=true" v-if="isShow" />
          </div>
        </template>

        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <!-- <template #right-icon>
          <van-icon name="cross" />
        </template> -->
      </van-cell>
      <van-action-sheet v-model="show" :actions="actions" @close="closeFun" @cancel="cancelFun" :cancel-text="bottomText" @select="onSelect" get-container="body" />

    </div>
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date.js'
import { firstActions, secondActions } from '@/api/report.js'

export default {
  name: 'HeimatoutiaoArticleItem',

  data() {
    return {
      // artDate: timeAgo(this.artObj.pubdate)
      show: false,
      actions: firstActions,
      bottomText: '取消'
    }
  },
  props: {
    artObj: Object, // 文章对象
    isShow: {
      // 反馈按钮的显示与否
      type: Boolean,
      default: true // 默认显示
    }
  },

  mounted() {},

  methods: {
    // timeAgo
    timeAgo: timeAgo,
    onSelect(action, item) {
      // console.log(action)// {name:不感兴趣}
      // console.log(item)//索引值
      // this.show = false
      if (action.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.bottomText = '返回'
      } else if (action.name === '不感兴趣') {
        this.$emit('disLikeEV', this.artObj.art_id)
        this.show = false
      } else {
        this.$emit('reportEV', this.artObj.art_id, action.value)
        // this.closeFun()
        this.show = false
      }
    },
    cancelFun() {
      if (this.bottomText === '返回') {
        this.show = true
        this.actions = firstActions
        this.bottomText = '取消'
      }
    },
    closeFun() {
      this.actions = firstActions
      this.bottomText = '取消'
    }
  }
}
</script>

<style lang="less" scoped>
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}
.van-icon:before {
  padding: 50% 0;
}
//图片样式，矩形比例0.618
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}
// 三图，图片容器
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
