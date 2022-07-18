import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

import { onMounted, onUnmounted, ref } from 'vue'

BScroll.use(Slide)

export default function useSlider(wrapperRef) {
    const slider = ref(null) // 初始值为null，变成可响应式的
    const currentPageIndex = ref(0) // 初始值为0

    // onMounted相关的vue3知识点 composition API 7.17看一下
    onMounted(() => {
        const sliderVal = slider.value = new BScroll(wrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            // 使用slide插件的默认配置
            slide: true
        })
        sliderVal.on('slideWillChange', (page) => {
            currentPageIndex.value = page.pageX
        })
    })
    onUnmounted(() => {
        slider.value.destroy()
    })
    return {
        slider,
        currentPageIndex
    }
}
