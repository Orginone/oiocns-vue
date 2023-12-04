<!-- 实体预览 -->
<script setup lang="ts">

import ImageView from './image/index.vue'
import VideoView from './video/index.vue'
import OfficeView from './office/index.vue'
import EntityInfo from '@/components/Common/EntityInfo/index.vue'
import Directory from '@/components/Directory/index.vue'

import {
  IDirectory,
  IEntity,
  IForm,
  ISession,
  ISysFileInfo,
  ITarget,
  IWorkTask,
  TargetType,
} from '@/ts/core';
import { command, schema } from '@/ts/base'

import SessionBody from './session/index.vue'
// import StorageBody from './storage';
// import TaskBody from './task';
// import JoinApply from './task/joinApply';

// import WorkForm from '@/components/DataStandard/WorkForm';

const props = defineProps<{
  flag?: string;
  entity: EntityType;
}>()
const officeExt = ['.md', '.pdf', '.xls', '.xlsx', '.doc', '.docx', '.ppt', '.pptx'];
const videoExt = ['.mp4', '.avi', '.mov', '.mpg', '.swf', '.flv', '.mpeg'];

type EntityType =
  | IEntity<schema.XEntity>
  | ISysFileInfo
  | ISession
  | IWorkTask
  | IForm
  | ITarget
  | IDirectory
  | string
  | undefined

const entity=ref<EntityType>()
entity.value = props.entity
let id = ''
watch(()=>props.flag,(v)=>{
  console.log(v);
})
onMounted(() => {
  id = command.subscribe((type, flag, ...args: any[]) => {
    if (type !== 'preview' || flag !== props.flag) return;
    if (args && args.length > 0) {
      entity.value = args[0]
    } else {
      entity.value = undefined
    }
  })
})
onBeforeUnmount(() => {
  command.unsubscribe(id);
})
</script>

<template>
  <template v-if = "entity && (typeof entity) != 'string'"> 
    <!-- 文件 -->
    <template v-if="entity.hasOwnProperty('filedata')">
      <ImageView 
        v-if="(entity as ISysFileInfo).filedata.contentType?.startsWith('image')" 
        :share="(entity as ISysFileInfo).filedata" 
      />
      <VideoView 
        v-else-if="
          (entity as ISysFileInfo).filedata.contentType?.startsWith('video') 
          || videoExt.includes((entity as ISysFileInfo).filedata.extension ?? '-')
        " 
        :share="(entity as ISysFileInfo).filedata" 
      />
      <OfficeView 
        v-else-if="officeExt.includes((entity as ISysFileInfo).filedata.extension ?? '-')" 
        :share="(entity as ISysFileInfo).filedata" 
      />
      <EntityInfo 
        v-else :entity="(entity as ISysFileInfo)" :column="1" 
      />
    </template>
    <!-- 动态 -->
    <template v-else-if="entity.hasOwnProperty('activity')">
      <SessionBody :target="(entity as ISession).target" :session="(entity as ISession)" />
    </template>
    <!-- TODO:会话 -->
    <template v-else-if="entity.hasOwnProperty('session')">
      <template v-if="(entity as ITarget).typeName === TargetType.Storage">
        <!-- <StorageBody :storage="entity" /> -->
      </template>
      <template v-else>
        <SessionBody :target="(entity as ITarget)" :session="(entity as ITarget).session" setting />
      </template>
    </template>
    <!--  TODO: 表单 -->
    <template v-else-if="entity.hasOwnProperty('fields')">
      <!-- <WorkForm :form="entity" /> -->
    </template>
    <!-- TODO: taskdata -->
    <template v-else-if="entity.hasOwnProperty('taskdata')">
      <!-- switch (entity.taskdata.taskType) {
        case '事项':
          return <TaskBody task={entity} />;
        case '加用户':
          return <JoinApply task={entity} />;
        default:
          return <></>;
      } -->
    </template>
    <!-- 全部文件 -->
    <template v-else-if="entity.hasOwnProperty('standard')">
      <Directory :current="(entity as IDirectory)" />
    </template>
    <!-- 实体信息展示 -->
    <template v-else>
      <EntityInfo :entity="(entity as IEntity<schema.XEntity>)" :column="1" />
    </template>
  </template>
</template>

<style lang="scss" scoped>

</style>
