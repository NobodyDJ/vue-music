import { useStore } from 'vuex'
import { watch, computed, ref } from 'vue'

export default function useCd() {
    const store = useStore()
    const playing = computed(() => store.state.playing)
    // 获取DOM元素
    const cdRef = ref(null)
    const cdImageRef = ref(null)

    const cdCls = computed(() => {
        return playing.value ? 'playing' : ''
    })

    watch(playing, (newPlaying) => {
        if (!newPlaying) {
            syncTransform(cdRef.value, cdImageRef.value)
        }
    })

    function syncTransform(wrapper, inner) {
        // 注意 这里的外层wrapper不会随着内部image图片进行旋转，从而导致了内部图片会受到外部的wrapper的影响
        // 外部图片需要叠加内部图片，最终确定位置
        const wrapperTransForm = getComputedStyle(wrapper).transform
        const innerTransForm = getComputedStyle(inner).transform
        wrapper.style.transform = wrapperTransForm === 'none' ? innerTransForm : wrapperTransForm + innerTransForm
    }

    return {
        cdRef,
        cdImageRef,
        cdCls
    }
}
