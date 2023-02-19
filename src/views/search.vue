<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <scroll
     ref="scrollRef"
     class="search-content"
     v-show="!query">
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              v-for="item in hotKeys"
              :key="item.id"
              @click="addQuery(item.key)"
            >
              <span>{{item.key}}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <confirm
            ref="confirmRef"
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          >
          </confirm>
          <search-list
            :searches="searchHistory"
            @select-item="addQuery"
            @delete-item="deleteSearch"
          ></search-list>
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest
      :query="query"
      @select-song="selectSong"
      @select-singer="selectSinger"
      ></suggest>
    </div>
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
import { useStore } from 'vuex'
import SearchInput from '@/components/search/search-input.vue'
import Suggest from '@/components/search/suggest.vue'
import SearchList from '@/components/base/search/search-list.vue'
import Scroll from '@/components/wrapper-scroll/wrapper-scroll'
import Confirm from '@/components/base/confirm/confirm.vue'
import { ref, computed, watch, nextTick } from 'vue'
import { getHotKeys } from '@/service/search'
import { useRouter } from 'vue-router'
import { SINGER_KEY } from '@/assets/js/constant'
import useSearchHistory from '@/components/search/use-search-history'
export default {
  name: 'search',
  components: {
    SearchInput,
    Suggest,
    SearchList,
    Scroll,
    Confirm
  },
  setup() {
    const query = ref('')
    const hotKeys = ref([])
    const store = useStore()
    const router = useRouter()
    const selectedSinger = ref(null)
    const scrollRef = ref(null)
    const confirmRef = ref(null)
    // computed
    const searchHistory = computed(() => store.state.searchHistory)
    // watch
    watch(query, async(val) => {
      if (val) {
        saveSearchQuery(query.value)
      } else {
        await nextTick()
        refreshScroll()
      }
    })
    // hooks
    const { saveSearchQuery, deleteSearch, clearSearch } = useSearchHistory()
    getHotKeys().then((res) => {
      hotKeys.value = res.hotKeys
    })
    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }
    function addQuery(key) {
      query.value = key
    }
    function selectSong(song) {
      store.dispatch('addSong', song)
    }
    function selectSinger(singer) {
      selectedSinger.value = singer
      cacheSinger(singer)
      router.push({ path: `/search/${singer.mid}` })
    }
    function cacheSinger(singer) {
      sessionStorage.setItem(SINGER_KEY, JSON.stringify(singer))
    }
    // 可以通过获取ref元素调用其中的方法来展示该组件
    function showConfirm() {
      confirmRef.value.show()
    }
    return {
      query,
      hotKeys,
      selectedSinger,
      searchHistory,
      scrollRef,
      confirmRef,
      addQuery,
      selectSong,
      selectSinger,
      clearSearch,
      showConfirm,
      // useSearchHistory
      deleteSearch
    }
  }
}
</script>

<style lang="scss" scoped>
  .search {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .search-input-wrapper {
      margin: 20px;
    }
    .search-content {
      flex: 1;
      overflow: hidden;
      .hot-keys {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
          padding-top: 2px;
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;
          .text {
            flex: 1;
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
    }
    .search-result {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
