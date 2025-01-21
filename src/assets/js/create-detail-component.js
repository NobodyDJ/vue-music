// 封装详情组件，公共逻辑抽离
import MusicList from '@/components/music-list/music-list'
import { processSongs } from '@/service/song'
export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    props: {
      data: {
        type: Object,
        default: () => { }
      }
    },
    data() {
      return {
        songs: [],
        loading: true
      }
    },
    components: {
      MusicList
    },
    watch: {
      $route() {
        if (this.$route.params.id) {
          this.$nextTick(() => {
            this.getSongs()
          })
        }
      }
    },
    computed: {
      // 对已经选中的歌手已经缓存
      computedData() {
        const data = this.data
        let result = null
        if (data && Object.keys(data).length !== 0) {
          result = data
        } else {
          const cachedData = JSON.parse(sessionStorage.getItem(key))
          if (cachedData && (cachedData.mid || cachedData.id + '') === this.$route.params.id) {
            result = cachedData
          }
        }
        return result
      },
      pic() {
        return this.computedData && this.computedData.pic
      },
      title() {
        return this.computedData && (this.computedData.name || this.computedData.title)
      }
    },
    created() {
      this.getSongs()
    },
    methods: {
      async getSongs() {
        const computedData = this.computedData
        if (!computedData) {
          const path = this.$route.matched[0].path
          this.$router.push({ path })
          return
        }
        const result = await fetch(computedData)
        this.songs = await processSongs(result.songs)
        this.loading = false
      }
    }
  }
}
