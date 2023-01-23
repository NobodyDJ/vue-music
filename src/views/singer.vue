<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :data="singers" :probeType="3" @select="selectSinger"></index-list>
    <router-view :singer="selectSinger"></router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer.js'
import indexList from '@/components/index-list/index-list.vue'
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
    selectSinger(item) {
      this.selectSinger = item
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
