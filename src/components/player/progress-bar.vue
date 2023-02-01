<template>
  <div
    class="progress-bar"
    @click="onClick"
  >
    <div class="bar-inner">
      <div
        ref="progress"
        class="progress"
        :style="progressStyle"
      ></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
// 这里的按钮大小是定死的
const progressBtnWidth = 16
export default {
  name: 'progress-bar',
  emits: ['progress-changing', 'progress-changed'],
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      offset: 0
    }
  },
  created() {
    this.touch = {} // 把touch放在这里可以设为不响应式的数据，减少性能开销
  },
  computed: {
    progressStyle() {
      return {
        width: `${this.offset}px`
      }
    },
    btnStyle() {
      return {
        transform: `translate3d(${this.offset}px, 0, 0)`
      }
    }
  },
  watch: {
    progress(newVal) {
      const barWidth = this.$el.clientWidth - progressBtnWidth
      this.offset = barWidth * newVal
    }
  },
  methods: {
    onTouchStart(e) {
      // 获取按钮的偏移量
      this.touch.x1 = e.touches[0].pageX
      // 获取进度条的目前的长度
      this.touch.beginWidth = this.$refs.progress.clientWidth
    },
    onTouchMove(e) {
      const delta = e.touches[0].pageX - this.touch.x1
      const tempWidth = this.touch.beginWidth + delta
      const barWidth = this.$el.clientWidth - progressBtnWidth
      // 注意获取进度条的范围
      const progress = Math.min(1, Math.max(0, tempWidth / barWidth))
      // 注意计算此时进度条的偏移量
      this.offset = progress * barWidth
      // 讲progress实时反馈给父组件，更新当前事件
      this.$emit('progress-changing', progress)
    },
    onTouchEnd() {
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const progress = this.$refs.progress.clientWidth / barWidth
      this.$emit('progress-changed', progress)
    },
    onClick(e) {
      // 获取该DOM元素距离周围视口的距离
      const rect = this.$el.getBoundingClientRect()
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const delta = e.pageX - rect.x
      const progress = delta / barWidth
      // 注意这里讲progress进度返回给父组件 去计算当前歌曲的时间
      this.$emit('progress-changed', progress)
    }
  }
}
</script>

<style lang="scss" scoped>
  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
