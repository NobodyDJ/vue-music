<template>
  <div
    ref="rootRef"
    class="suggest"
    v-loading:[loadingText]="loading"
    v-noResult:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li
        v-if="singer"
        class="suggest-item"
        @click="selectSinger(singer)"
      >
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer ? singer.name : '' }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">
            {{song.singer}}-{{song.name}}
          </p>
        </div>
      </li>
      <div
        class="suggest-item"
        v-loading:[loadingText]="pullUpLoading"
      ></div>
    </ul>
  </div>
</template>

<script>
import { ref, watch, computed, nextTick } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'
import usePullUpLoad from './use-pull-up-load'
export default {
  name: 'suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['selectSong', 'selectSinger'],
  setup(props, { emit }) {
    const singer = ref(null)
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)
    const loadingText = ref('')
    const noResultText = ref('抱歉，暂无搜索结果')
    const autoLoading = ref(false) //  用于限制自动加载时，用户手动拉取又出现loading图标

    const loading = computed(() => {
      return !singer.value && !songs.value.length
    })
    const noResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value
    })
    const pullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value
    })
    const preventPullupLoading = computed(() => {
      return autoLoading.value || loading.value
    })
    // hooks
    const { rootRef, isPullUpLoad, scroll } = usePullUpLoad(searchMore, preventPullupLoading)
    // 注意这里监听的query变量不是响应式，将其转换为getter
    watch(() => props.query, async (newVal) => {
      if (!newVal) {
          return
      }
      await searchFirst()
    })
    // 进行第一次搜索，要对页码初始化
    async function searchFirst() {
      // 加载时，数据清空立马不请求接口
      if (!props.query) {
        return
      }
      page.value = 1
      singer.value = null
      songs.value = []
      hasMore.value = true

      const result = await search(props.query, page.value, props.showSinger)
      songs.value = await processSongs(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
      await nextTick
      await makeItScrollable()
    }
    // 进行更多搜索
    async function searchMore() {
      if (!hasMore.value || !props.query) {
        return
      }
      page.value++
      const result = await search(props.query, page.value, props.showSinger)
      // 合并数组的方法，下拉操作，本质是对songs数组进行扩充
      songs.value = songs.value.concat(await processSongs(result.songs))
      hasMore.value = result.hasMore
      await nextTick
      await makeItScrollable()
    }
    // 当容器的高度不大于内容高度的时候，进行自动请求数据
    async function makeItScrollable() {
      if (scroll.value.maxScrollY >= -1) {
        autoLoading.value = true
        await searchMore()
        autoLoading.value = false
      }
    }
    function selectSong(song) {
      emit('select-song', song)
    }
    function selectSinger(singer) {
      emit('select-singer', singer)
    }
    return {
      singer,
      songs,
      loadingText,
      loading,
      noResult,
      noResultText,
      pullUpLoading,
      selectSong,
      selectSinger,
      // use-pull-uo-load
      rootRef,
      isPullUpLoad
    }
  }
}
</script>

<style lang="scss" scoped>
  .suggest {
    height: 100%;
    overflow: hidden;
    .suggest-list {
      padding: 0 30px;
      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          [class^="icon-"] {
            font-size: 14px;
            color: $color-text-d;
          }
        }
        .name {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
          overflow: hidden;
          .text {
            @include no-wrap();
            padding-top: 2px;
          }
        }
      }
    }
  }
</style>
