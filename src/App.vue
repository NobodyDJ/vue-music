<template>
 <m-header></m-header>
 <m-tab></m-tab>
 <!-- 承载了对应的路由视图 -->
 <router-view></router-view>
</template>

<script>
import mHeader from '@/components/header/header.vue'
import mTab from '@/components/tab/tab.vue'

export default {
  components: { mHeader, mTab }
}
</script>

<style lang="scss">

</style>
