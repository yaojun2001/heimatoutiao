<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon name="arrow-left" color="white" size="0.48rem" class="goback" @click="$router.back()" />
      <!-- 搜索组件 -->
      <van-search v-infoc v-model.trim="kw" @input="inputFun" placeholder="请输入搜索关键词" background="#007BFF" shape="round" @search="searchClickFun" />
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length !== 0">
      <div v-for="(str,index) in suggestList" :key="index" v-html=" lightFn(str, kw) " class="sugg-item" @click="suggestItemClickFun(str)" >
      </div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽自定义右侧图标  -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="deleteClickFun" />
        </template>
      </van-cell>
      <!-- 历史列表 -->
      <div class="history-list">
        <span class="history-item" v-for="(str,index) in historyList" :key="index" @click="historyItemClickFun(str)">{{str}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { suggestListAPI } from '@/api/index.js'
import { Notify } from 'vant'
import { getStorage, setStorage } from '@/utils/storage.js'
export default {
  name: 'SearchIndex',

  data() {
    return {
      kw: '', // 搜索关键字
      timer: null, //
      suggestList: [],
      historyList: JSON.parse(getStorage('hisList')) || [] // 搜索历史
    }
  },

  mounted() {},

  methods: {
    // 输入框--内容实时改变--触发事件方法
    inputFun() {
      // 防抖
      clearTimeout(this.timer)
      if (this.kw.length === 0) {
        this.suggestList = []
      } else {
        this.timer = setTimeout(async () => {
          if (this.kw.length === 0) return
          console.log(this.kw)
          const res = await suggestListAPI({
            keywords: this.kw
          })
          console.log(res)
          this.suggestList = res.data.data.options
        }, 300)
      }
    },
    // 专门处理字符串-高亮关键字 的方法
    lightFn(originStr, target) {
      // originStr: 原来的字符串
      // target: 关键字
      // 字符串.replace()

      // 替换高亮一个
      // return originStr.replace(target, `<span style="color:red">${target}</span>`)
      // 替换所有-高亮-联想浏览器报错： "TypeError: originStr.replaceAll is not a function"
      // edge正常实现，但不能忽略大小写
      // return originStr.replaceAll(target, `<span style="color:red">${target}</span>`)

      if (!originStr) {
        Notify({ type: 'warning', message: '当前搜素无推荐内容' })
        this.kw = ''
      } else {
        // 如果要使用变量，作为正则的匹配条件，不能使用语法糖简化写法
        const reg = new RegExp(target, 'ig') // i忽略大小写，g全局都匹配
        // console.log(originStr)
        return originStr.replace(reg, (match) => {
          // match是高亮匹配的原来字符串的值
          return `<span style="color:red">${match}</span>`
        })
      }
    },
    moveSearchResultFun(str) {
      // 路由跳转，在watch之前执行
      // 让路由最后跳转，来一个定时器包裹
      setTimeout(() => {
        this.$router.push({
          path: `/search_result/${str}`
        })
      })
    },
    // 回车确定搜索-跳转
    searchClickFun() {
      if (this.kw.length > 0) {
        // 搜索关键字--保存到数组里
        this.historyList.push(this.kw)
        this.moveSearchResultFun(this.kw)
      }
    },
    // 点击推荐列表--跳转
    suggestItemClickFun(str) {
      // 搜索关键字--保存到数组里
      this.historyList.push(str)
      this.moveSearchResultFun(str)
    },
    // 点击历史列表--跳转
    historyItemClickFun(str) {
      this.moveSearchResultFun(str)
    },
    // 清除历史记录
    deleteClickFun() {
      this.historyList = []
    }
  },
  watch: {
    historyList: { // 历史记录数组的改变
      deep: true,
      handler() {
        // 立刻覆盖式的保存到本地
        // ES6 新增了2种引用类型(以前 Array,Object),(新增：Set Map)
        // Set: 无序不重复的value集合体(无下角标)
        // 特点：你传入的数组类型，如果有重复元素，会自动清理重复的元素，返回无重复的Set
        // Set类型对象 -> Array数组类型
        // 如果值是对象，比较的是对象的内存地址
        const theSet = new Set(this.historyList)
        const hisArr = Array.from(theSet)
        setStorage('hisList', JSON.stringify(hisArr))
        // setStorage('hisList', JSON.stringify([...new Set(this.historyList)]))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  // 后退按钮
  .goback {
    padding-left: 14px;
  }
  // 搜索组件
  .van-search {
    flex: 1;
  }
}
// 搜索建议列表样式
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
// 搜索历史
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
