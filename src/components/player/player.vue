<template>
  <div
    class="player"
  >
      <div
        class="normal-player"
        v-show="fullScreen"
      >
        <!-- 获取当前歌曲的专辑封面 -->
        <div class="background">
          <img :src="currentSong.pic">
        </div>
        <div class="top">
          <div
            class="back"
            @click="goBack"
          >
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <div
          class="middle"
        >
          <div
            class="middle-l"
          >
            <div
              ref="cdWrapperRef"
              class="cd-wrapper"
            >
              <div
                ref="cdRef"
                class="cd"
              >
                <img
                  ref="cdImageRef"
                  class="image"
                  :class="cdCls"
                  :src="currentSong.pic">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll
            class="middle-r"
            ref="lyricScrollRef"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric && !pureMusicLyric" ref="lyricListRef">
                <p
                  class="text"
                  :class="{'current': currentLineNum === index}"
                  v-for="(line,index) in currentLyric.lines"
                  :key="line.num"
                >
                  {{line.txt}}
                </p>
              </div>
              <div class="pure-music" v-else>
                <p>{{ pureMusicLyric }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                ref="barRef"
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
              ></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    <audio ref="audioRef"
     @pause="pause"
     @canplay="ready"
     @error="error"
     @timeupdate="updateTime"
     @ended="end"></audio>
  </div>
</template>

<script>
import { computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { formatTime } from '@/assets/js/util'
import { PLAY_MODE } from '@/assets/js/constant'
import ProgressBar from './progress-bar'
import Scroll from '@/components/base/scroll/scroll.vue'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import useCd from './use-cd'
import useLyric from './use-lyric'
import _ from 'lodash'
export default {
  name: 'player',
  components: { ProgressBar, Scroll },
  // 这里放得都是播放器的相关逻辑
  setup(props, context) {
    // 注意代码的分类规范
    // data
    const store = useStore()
    const audioRef = ref(null)
    const songReady = ref(false)
    const currentTime = ref(0)
    // 当进度条发生变化时，优先拖动改变事件大于播放器获取实时事件
    let progressChanging = false
    // hooks
    const { modeIcon, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    const { cdRef, cdImageRef, cdCls } = useCd()
    const { currentLyric, currentLineNum, pureMusicLyric, playingLyric, lyricScrollRef, lyricListRef, playLyric, stopLyric } = useLyric(songReady, currentTime)
    // computed
    const fullScreen = computed(() => { return store.state.fullScreen })
    const currentSong = computed(() => { return store.getters.currentSong })
    const playing = computed(() => { return store.state.playing })
    const playMode = computed(() => { return store.state.playMode })
    const playIcon = computed(() => {
      return playing.value ? 'icon-play' : 'icon-pause'
    })
    const currentIndex = computed(() => { return store.state.currentIndex })
    const playList = computed(() => { return store.state.playList })
    const disableCls = computed(() => { return songReady.value ? '' : 'disable' })
    const progress = computed(() => { return currentTime.value / currentSong.value.duration })
    // watch
    watch(currentSong, (newVal) => {
      if (!newVal.id && !newVal.url) {
        return
      }
      // 初始化防止歌词获取到上一首歌的歌词，异步导致的结果
      // 情况未执行完的进程
      stopLyric()
      currentLyric.value = null
      currentLineNum.value = 0
      playingLyric.value = ''
      pureMusicLyric.value = ''
      songReady.value = false
      const audioEl = audioRef.value
      audioEl.src = newVal.url
      audioEl.play()
      store.commit('setPlayingState', true)
    })
    watch(playing, (newVal) => {
      // 当歌曲发生切换时，歌曲播放状态和当前歌曲发生变化的两个监听只能触发其中一个，不然就会重复播放
      // 所以歌曲不处于准备状态，就不触发此次监听
      // 因为这里的逻辑是当歌曲处于准备状态时，才能切换歌曲的状态
      if (!songReady.value) {
        return
      }
      const audioEl = audioRef.value
      if (newVal) {
        audioEl.play()
        playLyric()
      } else {
        audioEl.pause()
        stopLyric()
      }
    })
    // methods
    function goBack() {
      store.commit('setFullScreen', false)
    }
    function togglePlay() {
      store.commit('setPlayingState', !playing.value)
    }
    // 这里的pause方法是当电脑处于待机状态下，歌曲会暂停，保证vueX中的状态实时更新
    // 当歌曲播放结束时，歌曲会自动暂停
    function pause() {
      store.commit('setPlayingState', false)
    }
    function loop() {
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
      store.commit('setPlayingState', true)
    }
    const prev = _.throttle(() => {
      let index = currentIndex.value - 1
      const list = playList.value
      // 对异常情况处理，代码逻辑基本上是一个小demo，然后对这个小demo进行异常处理
      // 保证当前歌曲可以播放了才能切歌
      if (!songReady.value && !list.length) {
        return
      }
      if (list.length === 1) {
        // 循环播放
        loop()
      } else {
        if (index === -1) {
          index = list.length - 1
        }
        store.commit('setCurrentIndex', index)
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }
    }, 500)
    const next = _.throttle(() => {
      let index = currentIndex.value + 1
      const list = playList.value
      if (!songReady.value && !list.length) {
        return
      }
      if (list.length === 1) {
        loop()
      } else {
        if (index === list.length) {
          index = 0
        }
        store.commit('setCurrentIndex', index)
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }
    }, 500)
    // 导致错误的原因是两个watch()都执行了audioEl.play()，导致资源被加载了两次
    // 当前歌曲可否正常播放下去，如果被莫名打断，用这个函数去阻止重新加载
    function ready() {
      if (songReady.value) {
        return
      }
      songReady.value = true
      playLyric()
    }
    function error() {
      songReady.value = true
    }
    function end() {
      if (playMode.value === PLAY_MODE.loop) {
        loop()
      } else {
        next()
      }
    }
    // 歌曲当前更新时间触发该方法
    function updateTime(e) {
      if (!progressChanging) {
        currentTime.value = e.target.currentTime
      }
    }
    // 注意 这里的上下两个方法发生了冲突，导致拖动进度条的时候会来回跳跃。
    function onProgressChanging(progress) {
      progressChanging = true
      currentTime.value = progress * currentSong.value.duration
      // 首先同步歌词的地方然后再暂停
      playLyric()
      stopLyric()
    }
    function onProgressChanged(progress) {
      progressChanging = false
      audioRef.value.currentTime = currentTime.value = progress * currentSong.value.duration
      // 注意要根据计算好的响应式数据来判断，注意规范
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
      playLyric()
    }

    return {
      fullScreen,
      currentSong,
      audioRef,
      playIcon,
      disableCls,
      goBack,
      togglePlay,
      pause,
      prev,
      next,
      ready,
      error,
      end,
      formatTime,
      // mode
      modeIcon,
      changeMode,
      // favorite
      getFavoriteIcon,
      toggleFavorite,
      // progress
      progress,
      currentTime,
      updateTime,
      onProgressChanging,
      onProgressChanged,
      // cd
      cdRef,
      cdImageRef,
      cdCls,
      // lyric
      currentLyric,
      currentLineNum,
      playingLyric,
      pureMusicLyric,
      lyricScrollRef,
      lyricListRef
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
              padding-top: 50%;
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
            }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      // .dot-wrapper {
      //   text-align: center;
      //   font-size: 0;
      //   .dot {
      //     display: inline-block;
      //     vertical-align: middle;
      //     margin: 0 4px;
      //     width: 8px;
      //     height: 8px;
      //     border-radius: 50%;
      //     background: $color-text-l;
      //     &.active {
      //       width: 20px;
      //       border-radius: 5px;
      //       background: $color-text-ll;
      //     }
      //   }
      // }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
  //   &.normal-enter-active, &.normal-leave-active {
  //     transition: all .6s;
  //     .top, .bottom {
  //       transition: all .6s cubic-bezier(0.45, 0, 0.55, 1);
  //     }
  //   }
  //   &.normal-enter-from, &.normal-leave-to {
  //     opacity: 0;
  //     .top {
  //       transform: translate3d(0, -100px, 0);
  //     }
  //     .bottom {
  //       transform: translate3d(0, 100px, 0)
  //     }
  //   }
  }
}
</style>
