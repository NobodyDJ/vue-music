<template>
  <div class="music-list">
    <div
      class="back"
      @click="goBack"
    >
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <!-- 根据图片的背景高度来设置list的值 -->
    <div
      class="bg-image"
      :style="bgImageStyle"
      ref="bgImage"
    >
      <div
        class="play-btn-wrapper"
        :style="playBtnStyle"
      >
        <div
          v-show="songs.length > 0"
          class="play-btn"
          @click="randomSong"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div
        class="filter"
        :style="filterStyle"
      ></div>
    </div>
    <!-- 自定义指令可以用指令参数来修改数据 -->
    <scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      :probeType="3"
      @scroll="onScroll"
      ref="scrollList"
    >
      <div class="song-list-wrapper">
        <song-list
          :songs="songs"
          @select="selectSong"
          :rank="rank"
        ></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
  import SongList from '@/components/base/song-list/song-list'
  import Scroll from '@/components/wrapper-scroll/wrapper-scroll'
  import { mapActions, mapState } from 'vuex'
  const REVERSED_HEIGHT = 40

  export default {
    name: 'music-list',
    components: {
      SongList,
      Scroll
    },
    data() {
      return {
        imageHeight: 0,
        scrollY: 0,
        maxTranslateY: 0
      }
    },
    props: {
      songs: {
        type: Array,
        default() {
          return []
        }
      },
      title: String,
      pic: String,
      loading: {
        type: Boolean,
        default: true
      },
      noResultText: {
        type: String,
        default: '抱歉，没有找到可播放的歌曲'
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    updated() {
      this.$refs.scrollList.scroll.refresh()
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.maxTranslateY = this.imageHeight - REVERSED_HEIGHT
    },
    computed: {
      noResult() {
        return !this.loading && !this.songs.length
      },
      // 对图片的处理是要点注意z-index的使用
      bgImageStyle() {
        // 注意兼容苹果 将需要频繁使用的全局变量缓存起来，提高性能
        const scrollY = this.scrollY
        let zIndex = 0
        let paddingTop = '70%'
        let height = 0
        let translateZ = 0
        let scale = 1

        if (scrollY > this.maxTranslateY) {
          zIndex = 10
          paddingTop = 0
          height = `${REVERSED_HEIGHT}px`
          translateZ = 1
        }

        if (scrollY < 0) {
          // 用下拉的高度除去图片的高度算出比列
          scale = 1 + Math.abs(scrollY / this.imageHeight)
        }

        return {
          zIndex,
          paddingTop,
          height,
          scale,
          transform: `translateZ(${translateZ}px)`,
          backgroundImage: `url(${this.pic})`
        }
      },
      scrollStyle() {
        // 解决小播放器阻挡了歌曲列表的问题
        const bottom = this.playList.length ? '60px' : '0'
        return {
          top: `${this.imageHeight}px`,
          bottom
        }
      },
      filterStyle() {
        const scrollY = this.scrollY
        const imageHeight = this.imageHeight
        const maxTranslateY = this.maxTranslateY
        let blur = 0
        if (scrollY > 0) {
          blur = Math.min(maxTranslateY / imageHeight, scrollY / imageHeight) * 20
        }
        return {
          backdropFilter: `blur(${blur}px)`
        }
      },
      playBtnStyle() {
        let display = ''
        if (this.scrollY > this.maxTranslateY) {
          display = 'none'
        }
        return {
          display
        }
      },
      ...mapState(['playList'])
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      onScroll(pos) {
        this.scrollY = -pos.y
      },
      selectSong({ song, index }) {
        this.selectPlay({
          // 直接把歌手下面的所有歌曲放入播放列表
          list: this.songs,
          index
        })
      },
      randomSong() {
        this.randomPlay(this.songs)
      },
      ...mapActions(['selectPlay', 'randomPlay'])
    }
  }
</script>

<style lang="scss" scoped>
  .music-list {
    position: relative;
    height: 100%;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 20;
      transform: translateZ(2px);
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      width: 80%;
      z-index: 20;
      transform: translateZ(2px);
      @include no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .bg-image {
      position: relative;
      width: 100%;
      transform-origin: top;
      background-size: cover;
      .play-btn-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 10;
        width: 100%;
        .play-btn {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 0;
        }
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .list {
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 0;
      .song-list-wrapper {
        padding: 20px 30px;
        background: $color-background;
      }
    }
  }
</style>
