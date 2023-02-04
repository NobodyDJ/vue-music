import { useStore } from 'vuex'
import { watch, computed, ref } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'
export default function useLyric(songReady, currentTime) {
    const store = useStore()
    const currentLyric = ref(null)
    const currentLineNum = ref(0)
    const lyricScrollRef = ref(null)
    const lyricListRef = ref(null)
    const pureMusicLyric = ref('')
    const playingLyric = ref('')
    const currentSong = computed(() => { return store.getters.currentSong })

    watch(currentSong, async (newSong) => {
        try {
            // 异常处理
            if (!newSong.url || !newSong.id) {
                return
            }
            // 对已经获取过的歌曲的歌词，进行缓存操作内部有，出现异步操作抢占执行顺序时，可以考虑把前者未执行完的过程，情况
            const lyric = await getLyric(newSong)
            // 注意 await后续的操作，是一个异步操作，必须await成功执行才会继续操作
            // 但是如果期间发生了歌曲切换，会导致歌词错乱，保证一一对应即可,vuex的数据与传入参数的song不一致
            store.commit('addSongLyric', {
                song: newSong,
                lyric
            })
            if (currentSong.value.id !== newSong.id) {
                return
            }
            currentLyric.value = new Lyric(lyric, handleLyric)
            const hasLyric = currentLyric.value.lines.length
            if (hasLyric) {
                if (songReady.value) {
                    playLyric()
                }
            } else {
                playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
            }
        } catch (error) {
            this.$message.error(error)
        }
    })
    // 对当前歌词进行操作
    function handleLyric({ lineNum, txt }) {
        currentLineNum.value = lineNum
        const scrollComp = lyricScrollRef.value
        const listEL = lyricListRef.value
        playingLyric.value = txt
        // 当歌词行超过第五行的时候，就自动滚动到那一行
        if (lineNum > 5) {
            // 默认一直滚动到第二位置，这样的中心的歌词位置相对就不会发生改变
            const lineEl = listEL.children[lineNum - 5]
            scrollComp.scroll.scrollToElement(lineEl, 1000)
        } else {
            scrollComp.scroll.scrollTo(0, 0, 1000)
        }
    }
    // 开始播放歌词
    function playLyric() {
        const currentLyricVal = currentLyric.value
        if (currentLyricVal) {
            // 这里的seek方法是第三方库的封装，当前播放的时间，实时播放歌词
            currentLyricVal.seek(currentTime.value * 1000)
        }
    }
    // 暂停歌词
    function stopLyric() {
        const currentLyricVal = currentLyric.value
        if (currentLyricVal) {
            // 这里的seek方法是第三方库的封装，当前播放的时间
            currentLyricVal.stop()
        }
    }
    return {
        currentLyric,
        currentLineNum,
        pureMusicLyric,
        playingLyric,
        lyricScrollRef,
        lyricListRef,
        playLyric,
        stopLyric
    }
}
