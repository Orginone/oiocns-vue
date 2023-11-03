<template>

</template>
  
<script lang="ts" setup>
// import SchemaForm from '@/components/SchemaForm';
import { IDirectory } from '@/ts/core';
// import UploadItem from '../../tools/uploadItem';
// import { EntityColumns } from './entityColumns';
import { schema } from '@/ts/base';

// 接收参数
const props = defineProps<{
  formType: string;
  current: IDirectory;
  finished: () => void;
}>()

let title = ref('');
const readonly = props.formType === 'remarkDir';
let initialValue: any = props.current.metadata;

onMounted(()=>{
  switch (props.formType) {
    case 'newDir':
      title.value = '新建目录';
      initialValue = { shareId: props.current.target.id };
      break;
    case 'updateDir':
      title.value = '更新目录';
      break;
    case 'remarkDir':
      title.value = '查看目录';
      break;
    default:
      return;
  }
})
</script>

<style scoped>

</style>
