<template>
  <div class="slider" ref="rootRef">
    <div class="slider-group">
      <div
        class="slider-page"
        v-for="item in sliders"
        :key="item.id"
      >
        <a :href="item.link">
          <img :src="item.pic"/>
        </a>
      </div>
    </div>
    <div class="dots-wrapper">
      <span
        class="dot"
        v-for="(item,index) in sliders"
        :key="item.id"
        :class="{'active': currentPageIndex === index}"
      >
      </span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import useSlider from './use-slider'
export default {
  name: 'm-slider',
  props: {
    sliders: {
      type: Array,
      default() {
        return []
      }
    }
  },
  // setup()函数是一个专门用于组合式API的特殊钩子，在生命周期中该函数是最先被执行的
  // setup()函数可以接受两个参数一个参数是props即当前组件实例下的props，第二个参数是context执行上下文
  // 这里是使用compositionAPI主要将与第三方库交互的逻辑剥离出去，结构清晰
  setup() {
    // 如下相当于声明了一个响应式变量,ref(null)相当于获取最外层容器的节点，想获取子元素节点可以使用children
    const rootRef = ref(null)
    const { currentPageIndex } = useSlider(rootRef)
    return {
      rootRef,
      currentPageIndex
    }
  }
}
</script>

<style lang="scss" scoped>
.slider{
  min-height: 1px;
  font-size:0;
  touch-action: pan-y;//手指可以沿着y轴的方向平移
  .slider-group{
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-page{
      display: inline-block;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;
      a{
        display:block;
        width: 100%
      }
      img{
        display:block;
        width:100%;
      }
    }
  }
  .dots-wrapper{
      position:absolute;
      left: 50%;
      bottom: 12px;
      line-height:12px;
      transform: translateX(-50%);
      .dot{
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: $color-text-l;
        &.active{
          width:20px;
          border-radius: 5px;
          background: $color-text-ll; // 在vue.config.js中设置了全局css变量
        }
      }
    }
}
</style>
