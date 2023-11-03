<template>

</template>
  
<script lang="ts" setup>
// import SchemaForm from '@/components/SchemaForm';
import { IDirectory, valueTypes, IProperty } from '@/ts/core';
// import { EntityColumns } from './entityColumns';
import { schema } from '@/ts/base';
// import OpenFileDialog from '@/components/OpenFileDialog';

// 接收参数
const props = defineProps<{
  formType: string;
  current: IDirectory | IProperty;
  finished: () => void;
}>()

const formRef = ref(null);
const selectType = ref<string>((props.current as IProperty).metadata.valueType);
let title = ref('');
let species = ref(null);
let directory: IDirectory;
let property: IProperty | undefined;
const readonly = props.formType === 'remarkProperty';
let initialValue: any = props.current.metadata;

const findSpecies = () => {
  if (property?.metadata.speciesId) {
    return directory.target.user.findMetadata<schema.XEntity>(
      property.metadata.speciesId,
    );
  }
};

onMounted(()=>{
  switch (props.formType) {
    case 'newProperty':
      initialValue = {};
      title.value = '新建属性';
      directory = props.current as IDirectory;
      break;
    case 'updateProperty':
      title.value = '更新属性';
      property = props.current as IProperty;
      directory = property.directory;
      break;
    case 'remarkProperty':
      title.value = '查看属性';
      property = props.current as IProperty;
      directory = property.directory;
      break;
    default:
      return;
  }
  species = findSpecies()
  formRef.current?.setFieldValue('speciesId', species?.id);
})
</script>

<style scoped>

</style>
