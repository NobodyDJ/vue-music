<template>
  <div class="singer-detail">

  </div>
</template>

<script>
export default {
    name: 'singer-detail',
    props: {
        singer: {
            type: Object,
            default: () => {}
        }
    }

}
</script>

<style lang="scss" scoped>
.singer-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
}
</style>
