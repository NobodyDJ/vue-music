import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/slide'
import { ref, onMounted, onUnmounted } from 'vue'

BScroll.use(PullUp)
BScroll.use(ObserveDOM)

export default function usePullUpLoad(requestData, preventPullupLoading) {
    const scroll = ref(null)
    const rootRef = ref(null)
    // 判断用户是否进行了下拉操作
    const isPullUpLoad = ref(false)

    onMounted(() => {
        const scrollVal = scroll.value = new BScroll(rootRef.value, {
            pullUpLoad: true,
            observeDOM: true,
            click: true
        })

        scrollVal.on('pullingUp', pullingUpHandler)

        async function pullingUpHandler() {
            if (preventPullupLoading.value) {
                return
            }
            isPullUpLoad.value = true
            await requestData()
            // 告知组件下拉操作结束
            scrollVal.finishPullUp()
            scrollVal.refresh()
            isPullUpLoad.value = false
        }
    })

    onUnmounted(() => {
        scroll.value.destroy()
    })

    return {
        scroll,
        rootRef,
        isPullUpLoad
    }
}
