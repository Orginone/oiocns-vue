<template>

</template>
  
<script lang="ts" setup>
import { IApplication, IWork } from '@/ts/core';
import { model } from '@/ts/base';
// import SchemaForm from '@/components/SchemaForm';
import { WorkDefineModel } from '@/ts/base/model';
// import UploadItem from '../../tools/uploadItem';

// 接收参数
const props = defineProps<{
  formType: string;
  current: IWork | IApplication;
  finished: () => void;
}>()

let title = ref('');
const readonly = props.formType === 'remarkDir';
let initialValue: any = props.current.metadata;

onMounted(()=>{
  switch (props.formType) {
    case 'newWork':
      title.value = '新建办事';
      initialValue = { shareId: props.current.directory.target.id };
      break;
    case 'updateWork':
      title.value = '更新办事';
      break;
    case 'remarkWork':
      title.value = '查看办事';
      break;
    default:
      return;
  }
})
</script>

<style scoped>

</style>
