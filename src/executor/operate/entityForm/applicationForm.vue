<template>

</template>
  
<script lang="ts" setup>
// import SchemaForm from '@/components/SchemaForm';
import { IApplication, IDirectory } from '@/ts/core';
// import UploadItem from '../../tools/uploadItem';
// import { EntityColumns } from './entityColumns';
import { schema } from '@/ts/base';

// 接收参数
const props = defineProps<{
  formType: string;
  current: IDirectory | IApplication;
  finished: () => void;
}>()

let title = ref('');
let types = ref(['应用']);
let directory: IDirectory;
let parentApp: IApplication;
let application: IApplication | undefined;
const readonly = props.formType === 'remarkApp';
let initialValue: any = props.current.metadata;

onMounted(()=>{
 switch (props.formType) {
    case 'newApp':
      title.value = '新建应用';
      directory = props.current as IDirectory;
      initialValue = {};
      break;
    case 'newModule':
      title.value = '新建模块';
      types.value = ['模块'];
      parentApp = props.current as IApplication;
      initialValue = {};
      break;
    case 'updateApp':
    case 'updateModule':
      application = props.current as IApplication;
      directory = application.directory;
      types.value = [application.typeName];
      title.value = '更新' + application.typeName;
      break;
    case 'remarkApp':
      application = props.current as IApplication;
      directory = application.directory;
      title.value = '查看' + application.typeName;
      break;
    default:
      return;
  }
})
</script>

<style scoped>

</style>
