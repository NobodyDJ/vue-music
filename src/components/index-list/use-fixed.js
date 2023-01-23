import { ref, watch, nextTick, computed } from 'vue'
export default function useFixed(props) {
    // calculate函数用于计算有多少个列表高度区间，所以需要获取每个列表距离视口的高度
    // 设置了一个常量，该点的距离比bottom之间小于这个常量，开始偏移
    const TITLE_HEIGHT = 30
    const groupRef = ref(null)
    const listHeights = ref([])
    const scrollY = ref(0)
    const currentIndex = ref(0)
    const distance = ref(0)

    // 计算当前的fixedTitle
    const fixedTitle = computed(() => {
        if (scrollY.value < 0) {
            return ''
        }
        const currentGroup = props.data[currentIndex.value]
        return currentGroup ? currentGroup.title : ''
    })

    // 计算fixedTitle的偏移量
    const fixedStyle = computed(() => {
        const diff = (distance.value > 0 && distance.value < TITLE_HEIGHT) ? distance.value - TITLE_HEIGHT : 0
        return {
            transform: `translate3d(0,${diff}px,0)`
        }
    })

    // 等待DOM元素更新完毕后，在重新计算高度区间即可
    watch(() => props.data, async (newVal, oldVal) => {
        await nextTick
        calculate()
    })

    // 监听scrollY滚动的位置
    watch(scrollY, (newVal) => {
        const listHeightsVal = listHeights.value
        for (let i = 0; i < listHeightsVal.length - 1; i++) {
            const heightTop = listHeightsVal[i]
            const heightBottom = listHeightsVal[i + 1]
            if (newVal >= heightTop && newVal < heightBottom) {
                currentIndex.value = i
                distance.value = heightBottom - newVal
                break
            }
        }
    }, { immediate: true, deep: true })

    // 计算列表区间
    function calculate() {
        // 获取DOM元素下有多少个列表区间
        const list = groupRef.value.children
        const listHeightsVal = listHeights.value
        let height = 0

        listHeightsVal.length = 0
        listHeightsVal.push(0)
        // 遍历list累加获取每个元素高度的区间
        for (let i = 0; i < list.length; i++) {
            height += list[i].clientHeight
            listHeightsVal.push(height)
        }
    }

    // 滚动时，获取当前滚动的位置
    function onScroll(pos) {
        // const的原因仅仅改变数据的值，而没有改变遍历指向的地址
        scrollY.value = -pos.y
    }
    return {
        groupRef,
        onScroll,
        fixedTitle,
        fixedStyle,
        currentIndex
    }
}
