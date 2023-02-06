import { ref } from 'vue'
import animations from 'create-keyframe-animation'

export default function useAnimation() {
    const cdWrapperRef = ref(null)

    function onEnter(el, done) {
        const { x, y, scale } = getPosAndScale()
        const animation = {
            0: {
                transform: `translate3d(${x}px, ${y}px) scale(${scale})`
            },
            100: {
                transform: 'translate3d(0, 0, 0) scale(1)'
            }
        }
        animations.registerAnimation({
            name: 'move',
            animation,
            presets: {
                duration: 600,
                easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
            }
        })
        animations.runAnimation(cdWrapperRef.value, 'move', done)
    }
    function onAfterEnter() {
        animations.unregisterAnimation()
        cdWrapperRef.value.animation = ''
    }
    function onLeave() {
        console.log('111')
    }
    function onAfterLeave() {
        console.log('111')
    }
    function getPosAndScale() {
        // 感觉是大的CD变成小的CD
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        // 这里出现负值是因为cdWrapper变成左下角图标，是负值移动
        const x = -(width / 2 - paddingLeft)
        // y轴向下移动是正值
        const y = (window.innerHeight - paddingTop - window.innerWidth - paddingBottom)
        const scale = targetWidth / width
        return {
            x, y, scale
        }
    }
    return {
        cdWrapperRef,
        onEnter,
        onAfterEnter,
        onLeave,
        onAfterLeave
    }
}
