<template>

</template>
  
<script lang="ts" setup>
// import SchemaForm from '@/components/SchemaForm';
import { IDirectory, IForm } from '@/ts/core';
// import UploadItem from '../../tools/uploadItem';
// import { EntityColumns } from './entityColumns';
import { schema } from '@/ts/base';


// 接收参数
const props = defineProps<{
  formType: string;
  typeName: string;
  current: IDirectory | IForm;
  finished: () => void;
}>()

let title = ref('')
let directory: IDirectory;
let form: IForm | undefined;
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
      form = props.current as IForm;
      directory = form.directory;
      title.value = '更新' + props.typeName;
      break;
    case 'remark':
      form = props.current as IForm;
      directory = form.directory;
      title.value = '查看' + props.typeName;
      break;
    default:
      return;
  }
})
</script>

<style scoped>

</style>
