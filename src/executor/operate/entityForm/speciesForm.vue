<template>

</template>
  
<script lang="ts" setup>
// import SchemaForm from '@/components/SchemaForm';
import { IDirectory, ISpecies } from '@/ts/core';
// import UploadItem from '../../tools/uploadItem';
// import { EntityColumns } from './entityColumns';
import { schema } from '@/ts/base';

// 接收参数
const props = defineProps<{
  formType: string;
  typeName: string;
  current: IDirectory | ISpecies;
  finished: () => void;
}>()

let title = ref('');
let species = ref(null);
let directory: IDirectory;
const readonly = props.formType === 'remark';
let initialValue: any = props.current.metadata;

onMounted(()=>{
  switch (props.formType) {
    case 'new':
      title.value = '新建' + props.typeName;
      initialValue = {};
      directory = props.current as IDirectory;
      break;
    case 'update':
      species = props.current as ISpecies;
      directory = species.directory;
      title.value = '更新' + props.typeName;
      break;
    case 'remark':
      species = props.current as ISpecies;
      directory = species.directory;
      title.value = '查看' + props.typeName;
      break;
    default:
      return;
  }
})
</script>

<style scoped>

</style>
