<script setup lang='ts'>

const props = defineProps<{

}>()

</script>
<template>
  TODO: CustomTree
</template>

<style lang='scss' scoped>

.customTreeWrap {
  .top {
    height: 40px;
  }

  .title {
    margin-top: 12px;
    margin-bottom: 12px;
    font-size: 14px;
    // TODO:
    // color: @text-color-secondary;
  }

  .treeTitleBox {
    display: flex;
    justify-content: space-between;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .titleIcon {
    &:nth-of-type(2) {
      font-size: 17px;
    }
    &:hover {
      // TODO:
      // color: @primary-color;
    }
  }
  .titleTag {
    transform: scale(0.8);
    margin-right: 0;
  }
}

</style>