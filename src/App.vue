<template>
  <div id="app">
    <keep-alive exclude="SearchIndex,SearchResult,ArticleDetailIndex,ArticleCommentList,UserEdit">
    <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { getAllChannelsAPI } from '@/api'
export default {
  async created() {
    try {
      const res = await getAllChannelsAPI()
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }
}
</script>

<style lang="less">
// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }

// nav {
//   padding: 30px;

//   a {
//     font-weight: bold;
//     color: #2c3e50;

//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>
