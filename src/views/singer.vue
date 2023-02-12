<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :data="singers" :probeType="3" @select="selectSinger"></index-list>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <keep-alive>
          <component :is="Component" :data="selectedSinger" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer.js'
import indexList from '@/components/index-list/index-list.vue'
import { SINGER_KEY } from '@/assets/js/constant'
export default {
  name: 'mSinger',
  components: { indexList },
  data() {
    return {
      singers: [],
      selectedSinger: {}
    }
  },
  async created() {
    try {
      const result = await getSingerList()
      this.singers = result.singers
    } catch (error) {
      this.$message.error(error)
    }
  },
  methods: {
    selectSinger(singer) {
      this.selectedSinger = singer
      this.cacheSinger(singer)
      this.$router.push({ path: `/singer/${singer.mid}` })
    },
    cacheSinger(singer) {
      sessionStorage.setItem(SINGER_KEY, JSON.stringify(singer))
    }
  }
}
</script>

<style lang="scss" scoped>
.singer{
  position: fixed;
  width: 100%;
  top: 86px;
  bottom: 0;
}
</style>
