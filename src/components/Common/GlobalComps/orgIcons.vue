<template>
  <div class="icons">
      <img class="img" :src="imgUrl" />
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeMount, onBeforeUnmount,reactive,watch,ref,nextTick,getCurrentInstance, onMounted} from 'vue'
  const props = defineProps(['url'])
  const imgUrl = ref<string>('/svg/'+props.url+'.svg');
</script>

<style lang="scss" scoped>
  .icons{
    img{
      width: 26px;
      height: 26px;
    }
  }

</style>
