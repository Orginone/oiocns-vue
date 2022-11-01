<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="personDel"> 移出 </div>
    </template>
  </DiyButton>
</template>

<script setup lang="ts">
  import DiyButton from '@/components/diyButton/index.vue'
  import $services from '@/services'
  import { ElMessage } from 'element-plus'
  const emit = defineEmits(['update'])
  const props = defineProps({
    data: {
      type: Object,
      default: () => {}
    }
  })
  const personDel = () => {
    console.log(props.data)
    $services.appstore
      .removeMemver({
        data: {
          id: props.data.id
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '移出成功',
            type: 'success'
          })
          emit('update')
        }
      })
  }
</script>

<style lang="scss" scoped>
  .diy-button {
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      background: rgba(235, 238, 245, 1);
      border-radius: 4px;
    }
  }
</style>
