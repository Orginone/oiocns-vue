<template>
  <div class="icons">
      <div class="img" :src=imgUrl.value></div>
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeMount, onBeforeUnmount,reactive,watch,ref,nextTick,getCurrentInstance, onMounted} from 'vue'
  const props = defineProps(['url'])
  const imgUrl = ref<string>('/svg/'+props.url+'.svg');
  console.log(imgUrl)
</script>

<style lang="scss" scoped>
  .slide{
    width: 60px;
    height: 100%;
    background-color: #fafafa;
    border-right: rgba(227,226,226,.8) solid 1px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .item{
    padding: 10px 0;
    img{
      width: 26px;
      height: 26px;
    }
    .item-text{
      font-size: 12px;
      line-height: 18px;
      color: #888;
    }
  }

</style>
