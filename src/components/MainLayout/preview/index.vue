<!-- 实体预览 -->
<script setup lang="ts">

import ImageView from './image/index.vue'
import VideoView from './video/index.vue'
import OfficeView from './office/index.vue'
import EntityInfo from '@/components/Common/EntityInfo/index.vue'
import Directory from '@/components/Directory/index.vue'
import PreviewLayout from './layout/index.vue';

import {
  IDirectory,
  IEntity,
  IForm,
  IMemeber,
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
let id = ''
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
    <!--  TODO: 表单 -->
    <template v-else-if="entity.hasOwnProperty('fields')">
      <!-- <WorkForm :form="entity" /> -->
    </template>
     <!-- 数据和会话 -->
    <template v-else-if="entity.hasOwnProperty('session')">
      <template v-if="props.flag =='store'">
        <PreviewLayout :entity="(entity as IEntity<schema.XEntity>)">
          <template v-slot:content>
            <Directory :key="entity.key" :root="(entity.directory as IDirectory)" />
          </template>
        </PreviewLayout>
      </template>
      <template v-else-if="props.flag =='relation'">
        <SessionBody :key="entity.key" :session="(entity as ITarget).session" setting/>,
      </template>
    </template>
    <!-- 全部文件 -->
    <template v-else-if="entity?.isContainer">
      <Directory :key="(entity as IDirectory).key" :root="(entity as IDirectory)" />
    </template>
    <!-- 实体信息展示 -->
    <template v-else>
      <EntityInfo :entity="(entity as IEntity<schema.XEntity>)" :column="1" />
    </template>
  </template>
</template>

<style lang="scss" scoped>

</style>
