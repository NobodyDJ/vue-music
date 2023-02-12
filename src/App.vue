<template>
 <m-header></m-header>
 <m-tab></m-tab>
 <!-- 承载了对应的路由组件 -->
 <router-view :style="viewStyle"></router-view>
 <!-- 一个全局的播放器 -->
 <player></player>
</template>

<script>
import mHeader from '@/components/header/header.vue'
import mTab from '@/components/tab/tab.vue'
import player from '@/components/player/player.vue'
import { mapState } from 'vuex'

export default {
  components: { mHeader, mTab, player },
  computed: {
    ...mapState(['playList']),
    viewStyle() {
      const bottom = this.playList.length ? '60px' : '0'
      return {
        bottom
      }
    }
  }
}
</script>

<style lang="scss">

</style>
