<template>
  <div class="tab">
    <!-- router-link相当于a标签，但是它可以不重新加载页面的情况下跳转至指定的路径to属性指定了路径 -->
    <router-link
      class="tab-item"
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
    >
      <span class="tab-link">{{tab.name}}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'm-tab',
  data() {
    return {
      tabs: [
        {
          name: '推荐',
          path: '/recommend'
        },
        {
          name: '歌手',
          path: '/singer'
        },
        {
          name: '排行',
          path: '/top-list'
        },
        {
          name: '搜索',
          path: '/search'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.tab{
  display:flex;
  height:44px;
  line-height:44px;
  font-size: $font-size-medium;
  .tab-item{
      flex:1;
      text-align:center;
      .tab-link{
        padding-bottom: 5px;// 防止抖动，预留选中tab标签时出现下边距黄色框。
        color:$color-text-l;
      }
  }
  //表示router-link激活选中时的样式
  .router-link-active{
    .tab-link{
      color: $color-theme;
      border-bottom: 2px solid $color-theme;
    }
  }
}
</style>
