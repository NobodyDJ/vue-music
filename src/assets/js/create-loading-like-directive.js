import { addClass, removeClass } from '@/assets/js/dom.js'
import { createApp } from 'vue'
// 将loading组件动态插入所需组件的内部
// 需要创建一个loading组件动态插入组件上
// 优化：
// loading组件本身是一个绝对布局，如果父级元素不存在fixed或relative或absolute布局或导致布局错误
// 因此需要手动给该组件的父元素添加此布局
// 注意这里的移除child，一开始是打算移除loading这个dom，但是noResult组件覆盖了loading导致移除的是noResult元素，而不是loading，导致了错误
const relativeCls = 'g-relative'

export default function createLoadingLikeDirective(comp) {
    // 添加与移除
    // $el组件对应的更根节点的DOM元素
    const name = comp.name
    function append(el) {
        const style = getComputedStyle(el)
        if (['relative', 'fixed', 'absolute'].indexOf(style.position)) {
            addClass(el, relativeCls)
        }
        el.appendChild(el[name].instance.$el)
    }
    function remove(el, comp) {
        removeClass(el, relativeCls)
        el.removeChild(el[name].instance.$el)
    }
    const Directive = {
        mounted(el, binding) {
            const app = createApp(comp)
            // 创建一个dom元素插到组件里
            const instance = app.mount(document.createElement('div'))
            if (!el[name]) {
                el[name] = {}
            }
            // 可以将创建的元素保留在需要操作的DOM元素上，方便其他生命周期函数访问这个DOM实例
            el[name].instance = instance
            const title = binding.arg
            if (typeof title !== 'undefined') {
                instance.setTitle(title)
            }
            if (binding.value) {
                append(el)
            }
        },
        // 详情参考自定义指令文档，binding各类参数
        updated(el, binding) {
            const title = binding.arg
            if (typeof title !== 'undefined') {
                el[name].instance.setTitle(title)
            }
            if (binding.value !== binding.oldValue) {
                binding.value ? append(el) : remove(el)
            }
        }
    }
    return Directive
}
