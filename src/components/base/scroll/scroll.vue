<template>
  <div ref="rootRef">
    <!-- 使用了插槽来用于将需要滚动的部分放在这里 -->
    <slot></slot>
  </div>
</template>

<script>
import { ref } from 'vue'
import useScroll from './use-scroll'
export default {
  name: 'm-scroll',
  props: {
    click: {
      type: Boolean,
      default: true
    },
    probeType: {
      type: Number,
      default: 0
    }
  },
  emits: ['scroll'], // 派发属性将子组件传递给父组件
  setup(props, { emit }) {
    const rootRef = ref(null)
    const { scroll } = useScroll(rootRef, props, emit)
    return {
      rootRef,
      scroll
    }
  }
}
</script>
