import { ref } from 'vue'
export default function useMiddleActive() {
    // 初始化当前页面
    const currentShow = ref('cd')
    const middleLStyle = ref(null)
    const middleRStyle = ref(null)

    // 当前视图，默认为cd
    let currentView = 'cd'
    const touch = {}
    function onMiddleTouchStart(e) {
        touch.startX = e.touches[0].pageX
        touch.startY = e.touches[0].pageY
        // 当用户进行触动时，保存用户一开始拖动的方向位置，这样就不会被其他方向影响
        touch.direction = ''
    }
    function onMiddleTouchMove(e) {
        // 这里有个问题如果用户按住歌词页面拖动会知道歌词被拖动，限制y轴不允许拖动
        const deltaX = e.touches[0].pageX - touch.startX
        const deltaY = e.touches[0].pageY - touch.startY

        const absDeltaX = Math.abs(deltaX)
        const absDeltaY = Math.abs(deltaY)
        if (!touch.direction) {
            touch.direction = absDeltaX >= absDeltaY ? 'x' : 'y'
        }
        if (touch.direction === 'y') {
            return
        }
        // 用于记录用户向左滑动了多少距离
        const left = currentView === 'cd' ? 0 : -window.innerWidth
        // 限制拖动的范围，不能无限制
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        // 算出偏移的比例
        touch.percent = Math.abs(offsetWidth / window.innerWidth)
        if (currentView === 'cd') {
            if (touch.percent > 0.2) {
                currentShow.value = 'lyric'
            } else {
                currentShow.value = 'cd'
            }
        } else {
            if (touch.percent < 0.8) {
                currentShow.value = 'cd'
            } else {
                currentShow.value = 'lyric'
            }
        }
        middleLStyle.value = {
            opacity: 1 - touch.percent
        }

        middleRStyle.value = {
            transform: `translate3d(${offsetWidth}px, 0, 0)`
        }
    }
    function onMiddleTouchEnd() {
        let offsetWidth
        let opacity
        if (currentShow.value === 'cd') {
            currentView = 'cd'
            offsetWidth = 0
            opacity = 1
        } else {
            currentView = 'lyric'
            offsetWidth = -window.innerWidth
            // 设置透明度为0，隐藏cd页面
            opacity = 0
        }

        const duration = 300
        middleLStyle.value = {
            opacity,
            transitionDuration: `${duration}ms`
        }

        middleRStyle.value = {
            transform: `translate3d(${offsetWidth}px, 0, 0)`,
            transitionDuration: `${duration}ms`
        }
    }
    return {
        currentShow,
        middleLStyle,
        middleRStyle,
        onMiddleTouchStart,
        onMiddleTouchMove,
        onMiddleTouchEnd
    }
}
