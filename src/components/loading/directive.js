import { addClass, removeClass } from '@/assets/js/dom.js'
import { createApp } from 'vue'
import loading from './loading.vue'
// 将loading组件动态插入所需组件的内部
// 需要创建一个loading组件动态插入组件上
// 优化：
// loading组件本身是一个绝对布局，如果父级元素不存在fixed或relative或absolute布局或导致布局错误
// 因此需要手动给该组件的父元素添加此布局
const relativeCls = 'g-relative'

const loadingDirective = {
    mounted(el, binding) {
        const app = createApp(loading)
        // 创建一个dom元素插到组件里
        const instance = app.mount(document.createElement('div'))
        // 可以将创建的元素保留在需要操作的DOM元素上，方便其他生命周期函数访问这个DOM实例
        el.instance = instance
        const title = binding.arg
        if (typeof title !== 'undefined') {
            instance.setTitle(title)
        }
        if (binding.value) {
            append(el)
        }
    },
    updated(el, binding) {
        const title = binding.arg
        if (typeof title !== 'undefined') {
            el.instance.setTitle(title)
        }
        if (binding.value !== binding.oldValue) {
            binding.value ? append(el) : remove(el)
        }
    }
}
// 添加与移除
// $el组件对应的更根节点的DOM元素
function append(el) {
    const style = getComputedStyle(el)
    if (['relative', 'fixed', 'absolute'].indexOf(style.position)) {
        addClass(el, relativeCls)
    }
    el.appendChild(el.instance.$el)
}
function remove(el) {
    removeClass(el, relativeCls)
    el.removeChild(el.instance.$el)
}
export default loadingDirective
