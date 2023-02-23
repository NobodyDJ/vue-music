// 单文件原则（SFC）
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

import { onMounted, onUnmounted, ref, onActivated, onDeactivated } from 'vue'

BScroll.use(Slide)

export default function useSlider(wrapperRef) {
    const slider = ref(null) // 初始值为null，变成可响应式的
    const currentPageIndex = ref(0) // 初始值为0
    let sliderVal = slider.value

    // onMounted相关的vue3知识点 composition API 7.17看一下 组合式API获取生命周期函数
    onMounted(() => {
        sliderVal = new BScroll(wrapperRef.value, {
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
        sliderVal.destroy()
    })

    onActivated(() => {
        sliderVal.enable()
        sliderVal.refresh()
    })

    onDeactivated(() => {
        sliderVal.disable()
    })
    return {
        slider,
        currentPageIndex
    }
}
