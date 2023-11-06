<script setup lang="ts">
import { useRouter } from 'vue-router';
import { IEntity, TargetType } from '@/ts/core';

import EntityForm from './entityForm/index.vue';
import ActivityPublisher from './pubActivity/index.vue';
// import SettingAuth from './settingModal/settingAuth';
// import SettingStation from './settingModal/settingStation';
// import SettingIdentity from './settingModal/settingIdentity';
// import { schema } from '@/ts/base';
// import PullMember from './pullMember';
import JoinTarget from './joinTarget/index.vue';
// import FileTaskList from './fileTaskList';

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

// TODO:感觉可以抽离成hooks
// 动态组件
const contentComponent = ref(null);
// 动态props
const dynamicProps = ref({})
// 设置组件与参数
const setContent = (component: any,props: object) => {
  contentComponent.value = component;
  dynamicProps.value = props
}

onMounted(()=>{
  if (Array.isArray(props.args) && props.args.length > 0) {
    switch (props.cmd) {
      case 'pull':
        return console.log('来这改');
        // return <PullMember finished={finished} current={args[0]} />;
      case 'taskList':
        return console.log('来这改');
        // return <FileTaskList directory={args[0]} finished={finished} />;
      case 'settingAuth':
        return console.log('来这改');
        // return <SettingAuth space={args[0].target} finished={finished} />;
      case 'settingIdentity':
        return console.log('来这改');
        // return <SettingIdentity target={args[0].target} finished={finished} />;
      case 'settingStation':
        return console.log('来这改');
        // return <SettingStation company={args[0].target} finished={finished} />;
      
      case 'pubActivity':
        // return <ActivityPublisher activity={args[0]} finish={finished} />;
        return setContent(ActivityPublisher, {activity: props.args[0], finish: props.finished})
      case 'update':
        return console.log('来这改');
        // {
        //   const entity: IEntity<schema.XEntity> = args[0];
        //   if (entity.groupTags && entity.groupTags.includes('表单')) {
        //     return <EntityForm cmd={cmd + 'Form'} entity={args[0]} finished={finished} />;
        //   }
        //   if (Object.keys(entityMap).includes(args[0].typeName)) {
        //     return (
        //       <EntityForm
        //         cmd={cmd + entityMap[args[0].typeName]}
        //         entity={args[0]}
        //         finished={finished}
        //       />
        //     );
        //   }
        //   if (Object.values(TargetType).includes(args[0].typeName as TargetType)) {
        //     return <EntityForm cmd={cmd} entity={args[0]} finished={finished} />;
        //   }
        // }
        break;
      default:
        if (props.cmd.startsWith('join')) {   
          // return <JoinTarget cmd={cmd} current={args[0]} finished={finished} />
          return setContent(JoinTarget, {cmd:props.cmd,current: props.args[0], finished: props.finished})
        }
        // return <EntityForm cmd={cmd} entity={args[0]} finished={finished} />
        // TODO:
        console.log('来这改');
        // return setContent(EntityForm, {cmd: props.cmd, entity: props.args[0], finished: props.finished})
    }
  }
})



</script>

<template>
  <component :is="contentComponent" v-bind="dynamicProps"/>
</template>

<style lang="scss" scoped></style>
