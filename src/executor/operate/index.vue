<script setup lang="ts">
import { useRouter } from 'vue-router';
import { IEntity, TargetType } from '@/ts/core';

import EntityForm from './entityForm/index.vue';
import ActivityPublisher from './pubActivity/index.vue';
// import SettingAuth from './settingModal/settingAuth.vue';
// import SettingStation from './settingModal/settingStation';
// import SettingIdentity from './settingModal/settingIdentity';
// import { schema } from '@/ts/base';
import PullMember from './pullMember/index.vue'
import JoinTarget from './joinTarget/index.vue'
import FileTaskList from './fileTaskList/index.vue'
import { useDyncamicComponent } from '../dynamicComponentHooks'

// 实体类型字典
const entityMap: any = {
  目录: 'Dir',
  应用: 'App',
  模块: 'Module',
  属性: 'Property',
  分类: 'Species',
  字典: 'Dict',
  角色: 'Identity',
  岗位: 'Station',
  办事: 'Work',
  报表: 'Report',
  迁移配置: 'TransferConfig',
  事项配置: 'WorkConfig',
  实体配置: 'ThingConfig',
}

// 接收参数
const props = defineProps<{
  cmd: string;
  args: any[];
  finished: () => void;
}>()

// 设置动态组件
const { 
  component:contentComponent,
  propsObj:dynamicProps,
  setComponent:setContent,
  resetComponent:resetContent 
} = useDyncamicComponent()

onMounted(()=>{
  // TODO:
  console.log(props);
  
  if (Array.isArray(props.args) && props.args.length > 0) {
    switch (props.cmd) {
      case 'pull':
        return setContent(PullMember,{finished: props.finished, current:props.args[0]})
      case 'taskList': // 上传进度列表
        return setContent(FileTaskList, {directory: props.args[0], finished: props.finished})
      case 'settingAuth':
        // return setContent(SettingAuth, {space: props.args[0].target, finished: props.finished})
      case 'settingIdentity':
        return console.log('角色设置来这改');
        // return <SettingIdentity target={args[0].target} finished={finished} />;
      case 'settingStation':
        return console.log('来这改');
        // return <SettingStation company={args[0].target} finished={finished} />;
      case 'pubActivity':
        return setContent(ActivityPublisher, {activity: props.args[0], finish: props.finished})
      case 'update':
        return setContent(EntityForm, {cmd: props.cmd, entity: props.args[0], finished: props.finished})
      default:
        if (props.cmd.startsWith('join')) {   
          return setContent(JoinTarget, {cmd:props.cmd,current: props.args[0], finished: props.finished})
        }
        return setContent(EntityForm, {cmd: props.cmd, entity: props.args[0], finished: props.finished})
    }
  }
})

</script>

<template>
  <!-- operate -->
  <component :is="contentComponent" v-bind="dynamicProps"/>
</template>

<style lang="scss" scoped></style>
