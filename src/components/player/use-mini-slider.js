import { useStore } from 'vuex'
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)
export default function useMiniSlider() {
    const store = useStore()
    const sliderWrapper = ref(null)
    // 初始化滑块操作
    const slider = ref(null)
    const playList = computed(() => store.state.playList)
    const fullScreen = computed(() => store.state.fullScreen)
    const currentIndex = computed(() => store.state.currentIndex)
    // 小技巧：利用双感叹号，将原本的数据类型更改为布尔类型
    const showSlide = computed(() => { return !fullScreen.value && !!playList.value.length })

    onMounted(() => {
        // 性能优化，确保歌曲有内容的情况下，初始化滑块
        let sliderVal
        watch(showSlide, async (newVal) => {
            // 注意确保DOM渲染完毕，不渲染我有可能normalPlayer没有收起
            // 性能优化，让betterScroll组件初始化一次就行，数据更新过，刷新即可
            await nextTick()
            if (newVal) {
                if (!slider.value) {
                    sliderVal = slider.value = new BScroll(sliderWrapper.value, {
                        click: true,
                        scrollX: true,
                        scrollY: false,
                        momentum: false,
                        bounce: false,
                        probeType: 2,
                        slide: {
                            autoplay: false,
                            loop: true
                        }
                    })
                    sliderVal.on('slidePageChanged', (page) => {
                        store.commit('setCurrentIndex', page.pageX)
                    })
                } else {
                    sliderVal.refresh()
                }
                // 将滑块滑动指定的歌曲索引中
                sliderVal.goToPage(currentIndex.value, 0, 0)
            }
        })
        watch(currentIndex, (newVal) => {
            if (sliderVal) {
                sliderVal.goToPage(newVal, 0, 0, 0)
            }
        })
        // 歌曲列表发生变化时，重新刷新滑块
        watch(playList, async (newVal) => {
            if (sliderVal && slider.value && newVal.length) {
                // 保证DOM元素刷新后，在执行操作是个好习惯
                await nextTick()
                sliderVal.refresh()
            }
        })
    })
    onUnmounted(() => {
        if (slider.value) {
            slider.value.destroy()
        }
    })
    return {
        slider,
        sliderWrapper
    }
}
