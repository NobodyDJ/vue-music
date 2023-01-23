import { ref, computed } from 'vue'
export default function useShortcut(props, groupRef) {
    const ANCHOR_HEIGHT = 18
    const scrollRef = ref(null)
    const touch = {}

    const shortcutList = computed(() => {
        return props.data.map((item) => {
            return item.title
        })
    })

    function onShortcutStart(e) {
        // 获取需要滚动到具体dom的索引
        touch.y1 = e.touches[0].pageY
        const anchorIndex = parseInt(e.target.dataset.index)
        touch.anchorIndex = anchorIndex
        scrollTo(anchorIndex)
    }
    function onShortcutMove(e) {
        touch.y2 = e.touches[0].pageY
        const delta = ((touch.y2 - touch.y1) / ANCHOR_HEIGHT) | 0
        const anchorIndex = touch.anchorIndex + delta
        scrollTo(anchorIndex)
    }
    function scrollTo(anchorIndex) {
        // 添加一场处理，因为用户点击的区域可能为父级dom元素，而不是anchor内部的li会出现获取不到dataset这个属性，从而导致报错
        if (Number.isNaN(anchorIndex)) {
            return
        }
        // 设置index区间必须在list长度与0之间，使用了先获取最大值，再获取最小值的技巧，防止如果超出这个范围就报错的问题
        anchorIndex = Math.max(0, Math.min(shortcutList.value.length - 1, anchorIndex))
        const targetEl = groupRef.value.children[anchorIndex]
        const scroll = scrollRef.value.scroll
        scroll.scrollToElement(targetEl, 0)
    }
    return {
        shortcutList,
        scrollRef,
        onShortcutStart,
        onShortcutMove
    }
}
