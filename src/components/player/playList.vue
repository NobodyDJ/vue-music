<template>
  <!-- teleport将该DOM元素插入到body节点上 -->
  <teleport to="body">
    <transition name="list-fade">
      <div
        class="playList"
        v-show="visible && playList.length"
        @click="hide"
      >
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i
                class="icon"
                :class="modeIcon"
                @click="changeMode"
              >
              </i>
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <scroll
            ref="scrollRef"
            class="list-content"
          >
            <transition-group
              ref="listRef"
              name="list"
              tag="ul"
            >
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click.stop="selectItem(song)"
              >
                <i
                  class="current"
                  :class="getCurrentIcon(song)"
                ></i>
                <span class="text">{{song.name}}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <!-- 在DOM元素上防止用户连续过多点击，导致出错 -->
                <span
                  class="delete"
                  :class="{ 'disable': removing }"
                  @click.stop="removeSong(song)"
                >
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <div class="list-add">
            <div class="add" @click="showAddSong">
              <i class="icon-add"></i>
              <span class="text">添加歌曲到队列</span>
            </div>
          </div>
          <!-- 注意事件冒泡影响到上层DOM -->
          <div class="list-footer" @click.stop="hide">
            <span>关闭</span>
          </div>
          <div></div>
        </div>
        <confirm
          ref="confirmRef"
          text="是否清空播放列表"
          confirmBtnText="清空"
          @confirm="clearPlayList"
        ></confirm>
        <add-song ref="addSongRef"></add-song>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { ref, computed, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import Scroll from '@/components/base/scroll/scroll'
import Confirm from '@/components/base/confirm/confirm.vue'
import AddSong from '@/components/add-song/add-song.vue'
import useMode from './use-mode'
import useFavorite from './use-favorite'
export default {
  name: 'playList',
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  setup() {
    const visible = ref(null)
    const store = useStore()
    const scrollRef = ref(null)
    const listRef = ref(null)
    const confirmRef = ref(null)
    const addSongRef = ref(null)
    const removing = ref(false)
    // computed
    const playList = computed(() => store.state.playList)
    const currentSong = computed(() => store.getters.currentSong)
    const sequenceList = computed(() => store.state.sequenceList)
    // hooks
    const { modeIcon, modeText, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    // watch
    watch(currentSong, async (newSong) => {
      // 保证删除的时候有歌曲
      if (!visible.value || !newSong.id) {
        return
      }
      await nextTick
      scrollToCurrent()
    })
    // function
    function hide() {
      visible.value = false
    }
    async function show() {
      visible.value = true
      await nextTick()
      scrollRefresh()
      scrollToCurrent()
    }
    // 获取播放图标
    function getCurrentIcon(song) {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }
    function scrollRefresh() {
      scrollRef.value.scroll.refresh()
    }
    // 选中歌曲自动滚动到对应的位置
    function scrollToCurrent() {
      const index = sequenceList.value.findIndex((song) => {
        return song.id === currentSong.value.id
      })
      if (index < 0) {
        return
      }
      const target = listRef.value.$el.children[index]
      scrollRef.value.scroll.scrollToElement(target, 300)
    }
    // 播放选中的歌曲
    function selectItem(song) {
      const index = playList.value.findIndex((item) => {
        return song.id === item.id
      })
      store.commit('setCurrentIndex', index)
      store.commit('setPlayMode', true)
    }
    // 删除选中的歌曲
    function removeSong(song) {
      // 因为需要改变播放列表的歌曲和顺序
      if (removing.value) {
        return
      }
      removing.value = true
      store.dispatch('removeSong', song)
      // 这里的时长是根据动画时长来判断的
      if (!playList.value.length) {
        hide()
      }
      setTimeout(() => {
        removing.value = false
      }, 300)
    }
    // 展示清空列表对话框
    function showConfirm() {
      confirmRef.value.visible = true
    }
    // 清空播放列表
    function clearPlayList() {
      store.dispatch('clearSongList')
      hide()
    }
    function showAddSong() {
      addSongRef.value.show()
    }
    return {
      visible,
      scrollRef,
      removing,
      listRef,
      confirmRef,
      addSongRef,
      playList,
      sequenceList,
      hide,
      show,
      getCurrentIcon,
      scrollToCurrent,
      selectItem,
      removeSong,
      showConfirm,
      clearPlayList,
      showAddSong,
      // useMode
      modeIcon,
      modeText,
      changeMode,
      // favorite
      getFavoriteIcon,
      toggleFavorite
    }
  }
}
</script>

<style lang="scss" scoped>
  .playList {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: $color-background-d;
    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity .3s;
      .list-wrapper {
        transition: all .3s;
      }
    }
    &.list-fade-enter-from, &.list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 210;
      width: 100%;
      background-color: $color-highlight-background;
      .list-header {
        position: relative;
        padding: 20px 30px 10px 20px;
        .title {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 10px;
            font-size: 24px;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
      .list-content {
        max-height: 240px;
        overflow: hidden;
        .item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;
          .current {
            flex: 0 0 20px;
            width: 20px;
            font-size: $font-size-small;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text-d;
            padding-top: 2px;
          }
          .favorite {
            @include extend-click();
            margin-right: 15px;
            font-size: $font-size-small;
            color: $color-theme;
            .icon-favorite {
              color: $color-sub-theme;
            }
          }
          .delete {
            @include extend-click();
            font-size: $font-size-small;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
          }
        }
      }
      .list-add {
        width: 140px;
        margin: 20px auto 30px auto;
        .add {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid $color-text-l;
          border-radius: 100px;
          color: $color-text-l;
          .icon-add {
            margin-right: 5px;
            font-size: $font-size-small-s;
          }
          .text {
            font-size: $font-size-small;
          }
        }
      }
      .list-footer {
        text-align: center;
        line-height: 50px;
        background: $color-background;
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
    }
  }
</style>
