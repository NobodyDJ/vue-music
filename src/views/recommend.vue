<template>
  <!-- 这里运用到了一个动态指令的规则 -->
  <div class="recommend" v-loading:[loadingText]="loading">
    <!-- 注意betterScroll只对第一个子元素生效 -->
    <scroll ref="scrollRef" class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <slider v-if="sliders.length" :sliders="sliders"></slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
          <ul>
            <li
              v-for="item in albums"
              class="item"
              :key="item.id"
              @click="selectItem(item)"
            >
              <div class="icon">
                <img width="60" height="60" v-lazy="item.pic">
              </div>
              <div class="text">
                <h2 class="name">
                  {{ item.username }}
                </h2>
                <p class="title">
                  {{item.title}}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <keep-alive>
          <component :is="Component" :data="selectedAlbum" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getRecommend } from '@/service/recommend'
import Slider from '@/components/base/slider/slider'
import Scroll from '@/components/wrapper-scroll/wrapper-scroll'
import { ALBUM_KEY } from '@/assets/js/constant'
export default {
  name: 'mRecommend',
  components: { Slider, Scroll },
  data() {
    return {
      sliders: [],
      albums: [],
      loadingText: '正在载入...',
      selectedAlbum: null
    }
  },
  computed: {
    loading() {
      return !this.sliders.length && !this.albums.length
    }
  },
  watch: {
    async albums(val) {
      this.$nextTick(() => {
        this.$refs.scrollRef.scroll.refresh()
      })
    }
  },
  // 生命周期函数也可以声明为一个异步函数
  async created() {
    try {
      const result = await getRecommend()
      this.sliders = result.sliders
      this.albums = result.albums
    } catch (error) {
      this.$message.error(error)
    }
  },
  methods: {
    selectItem(item) {
      this.selectedAlbum = item
      this.cacheAlbum(item)
      this.$router.push({
        path: `/recommend/${item.id}`
      })
    },
    cacheAlbum(album) {
      sessionStorage.setItem(ALBUM_KEY, JSON.stringify(album))
    }
  }
}
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;
  .recommend-content{
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          // flex-grow 0如果存在剩余空间也不放大 flex-shrink 0空间不足时也不会缩小 flex-basis 与width设置一样的空间是保证该项目大小固定不变
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
        }
        .name {
          margin-bottom: 10px;
          color: $color-text;
        }
        .title {
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
