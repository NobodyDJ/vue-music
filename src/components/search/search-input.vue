<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input
      class="input-inner"
      :placeholder="placeholder"
      v-model="query"
    />
    <i
      v-show="query"
      class="icon-dismiss"
      @click="clearQuery"
    ></i>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
    name: 'search-input',
    props: {
        modelValue: String,
        placeholder: {
            type: String,
            default: '搜索歌曲、歌手'
        }
    },
    data() {
        return {
            query: this.modelValue
        }
    },
    created() {
        // 向父组件传递更改的数据，vue3中的v-model，去除空白格
        // $watch第一个参数是属性的字符串
        this.$watch('query', _.debounce((newQuery) => {
            this.$emit('update:modelValue', newQuery.trim())
        }, 300))
        this.$watch('modelValue', (newVal) => {
            this.query = newVal
        })
    },
    methods: {
        clearQuery() {
            this.query = ''
        }
    }
}
</script>

<style lang="scss" scoped>
  .search-input {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 32px;
    background: $color-highlight-background;
    border-radius: 6px;
    .icon-search {
      font-size: 24px;
      color: $color-text-d;
    }
    .input-inner {
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: $color-highlight-background;
      color: $color-text;
      font-size: $font-size-medium;
      outline: 0;
      &::placeholder {
        color: $color-text-d;
      }
    }
    .icon-dismiss {
      font-size: 16px;
      color: $color-text-d;
    }
  }
</style>
