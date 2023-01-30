<template>
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :pic="pic"
      :title="title"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import musicList from '@/components/music-list/music-list'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
    name: 'singer-detail',
    props: {
        singer: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            songs: [],
            loading: true
        }
    },
    components: {
        musicList
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
        computedSinger() {
            const singer = this.singer
            let result = null
            if (Object.keys(singer).length !== 0) {
                result = singer
            } else {
                const cachedSinger = JSON.parse(sessionStorage.getItem(SINGER_KEY))
                if (cachedSinger && cachedSinger.mid === this.$route.params.id) {
                    result = cachedSinger
                }
            }
            return result
        },
        pic() {
            return this.computedSinger && this.computedSinger.pic
        },
        title() {
            return this.computedSinger && this.computedSinger.name
        }
    },
    created() {
        this.getSongs()
    },
    methods: {
        async getSongs() {
            const computedSinger = this.computedSinger
            if (!computedSinger) {
                const path = this.$route.matched[0].path
                this.$router.push({ path })
                return
            }
            const result = await getSingerDetail(computedSinger)
            this.songs = await processSongs(result.songs)
            this.loading = false
        }
    }
}
</script>

<style lang="scss" scoped>
.singer-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
}
</style>
