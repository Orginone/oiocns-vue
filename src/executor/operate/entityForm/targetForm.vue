<script lang="ts" setup>
// import SchemaForm from '@/components/SchemaForm';
import { TargetModel } from '@/ts/base/model';
import { ITarget, TargetType, companyTypes } from '@/ts/core';
// import UploadItem from '../../tools/uploadItem';
// import { EntityColumns } from './entityColumns';

// 接收参数
const props = defineProps<{
  formType: string;
  target: ITarget;
  finished: () => void;
}>()

let title = ref('')
let typeName = ref('')
let types: string[] = [props.target.typeName];
const readonly = props.formType === 'remark';
let initialValue: any = props.target.metadata;

// TODO:
console.log('来这改');


onMounted(()=>{
  switch (props.formType) {
    case 'newCohort':
      typeName.value = '群组';
      title.value = '设立群组';
      types = [TargetType.Cohort];
      initialValue = {};
      break;
    case 'newStorage':
      typeName.value = '存储资源';
      title.value = '设立存储资源';
      types = [TargetType.Storage];
      initialValue = {};
      break;
    case 'newStation':
      typeName.value = '岗位';
      title.value = '设立岗位';
      types = [TargetType.Station];
      initialValue = {};
      break;
    case 'newGroup':
      typeName.value = '组织群';
      title.value = '设立集群';
      types = [TargetType.Group];
      initialValue = {};
      break;
    case 'newCompany':
      typeName.value = '单位';
      title.value = '设立单位';
      types = companyTypes;
      initialValue = {};
      break;
    case 'newDepartment':
      typeName.value = '部门';
      title.value = '设立部门';
      if ('departmentTypes' in props.target) {
        types = props.target.departmentTypes as string[];
      }
      if ('childrenTypes' in props.target) {
        types = props.target.childrenTypes as string[];
      }
      initialValue = {};
      break;
    case 'update':
      initialValue.teamCode = props.target.metadata.team?.code;
      initialValue.teamName = props.target.metadata.team?.name;
      typeName.value = props.target.typeName;
      title.value = '更新' + props.target.name;
      break;
    case 'remark':
      initialValue.teamCode = props.target.metadata.team?.code;
      initialValue.teamName = props.target.metadata.team?.name;
      typeName.value = props.target.typeName;
      title.value = '查看' + props.target.name;
      break;
    default:
      return
  }
})


</script>

<template>
  
</template>

<style scoped>

</style>
