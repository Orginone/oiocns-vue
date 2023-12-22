<script setup lang='ts'>
import ImageView from './image/index.vue'
import VideoView from '@/components/MainLayout/preview/video/index.vue'
// import React from 'react';
// import FormView from './form';
// import WorkStart from './work';
// import TaskContent from './task';
// import JoinApply from './task/joinApply';
import OfficeView from '@/components/MainLayout/preview/office/index.vue'
// import TransferView from './transfer';
// import AudioPlayer from './audio';
import EntityPreview from './entity/index.vue'
// import CodeEditor from './codeeditor';
// import EntityForm from '../operate/entityForm';
import { IEntity, ISysFileInfo, TargetType } from '@/ts/core'
import { model, schema } from '@/ts/base'
// import TemplateView from './page'
import { useDyncamicComponent } from '../dynamicComponentHooks'
import {h} from 'vue'
import fullScreenModal from '@/components/Common/fullScreenModal.vue'

const audioExt = ['.mp3', '.wav', '.ogg'];
const officeExt = ['.md', '.pdf', '.xls', '.xlsx', '.doc', '.docx', '.ppt', '.pptx'];
const videoExt = ['.mp4', '.avi', '.mov', '.mpg', '.swf', '.flv', '.mpeg'];
const remarkTypes: any = { 分类: 'Species', 字典: 'Dict', 属性: 'Property', 目录: 'Dir' };

const props = defineProps<{
  cmd: string;
  entity:
    | IEntity<schema.XEntity>
    | ISysFileInfo
    | model.FileItemShare
    | schema.XEntity
    | undefined;
  finished: () => void;
}>()
const {component,propsObj,setComponent,resetComponent} = useDyncamicComponent()


onMounted(() => {
  if (props.entity === undefined) return
  if ('size' in props.entity || 'filedata' in props.entity) { // TODO: 文件预览
    const data = 'size' in props.entity ? props.entity : props.entity.filedata;
    if (data.contentType?.startsWith('image')) {// 图片预览
      return setComponent(ImageView,{share:data,finished:props.finished})
    }
    if ( data.contentType?.startsWith('video') || videoExt.includes(data.extension ?? '-') ) { // 视频预览
      return setComponent(
        h(
          fullScreenModal,
          {open:true,destroyOnClose: true,title:data.name,onCancel:()=>props.finished()}, //fullScreenModal的参数
          h( 
            VideoView,{share:data}
          )
        ),
        {}
      )
    }
    if (officeExt.includes(data.extension ?? '-')) { //office文件预览
      return setComponent(
        h(
          fullScreenModal,
          {open:true,fullScreen: true,width: '80vw',destroyOnClose: true,title:data.name,bodyHeight: '70vh',onCancel:()=>props.finished()}, //fullScreenModal的参数
          h( // fullScreenModal的子组件officeView
            OfficeView,{share:data}
          )
        ),
        {}
      )
    }
    if ( data.contentType?.startsWith('audio') || audioExt.includes(data.extension ?? '-') ) { // TODO:语音
      const dir = 'filedata' in props.entity ? props.entity.directory : undefined;
      return console.log('语音预览来这改');
      // return <AudioPlayer finished={props.finished} directory={dir} share={data} />;
    }
    if (data.contentType?.startsWith('text')) { // TODO:文本
      return console.log('文本预览来这改');
      // return <CodeEditor share={data} finished={props.finished} />;
    }
  }
  if ('key' in props.entity) { // TODO:
    switch (props.entity.typeName) {
      case '表单':
      case '事项配置':
      case '实体配置':
        return console.log('表单、事项配置、实体配置来这改');
        // return <FormView form={props.entity as any} finished={props.finished} />;
      case '迁移配置':
        return console.log('迁移配置来这改');
        // return <TransferView current={props.entity as any} finished={props.finished} />;
      case '页面模板':
        return console.log('页面模板来这改');
        // return <TemplateView current={props.entity as any} finished={props.finished} />;
      case '办事':
      case '子流程':
        return console.log('办事、子流程来这改');
        // return <WorkStart current={props.entity as any} finished={props.finished} />;
      case '加用户':
        return console.log('加用户来这改');
        // return <JoinApply current={props.entity as any} finished={props.finished} />;
      case '事项':
        return console.log('事项来这改');
        // return <TaskContent current={props.entity as any} finished={props.finished} />;
      default:
        if (remarkTypes[props.entity.typeName]) {
          return console.log('来这改');
        //   return (
        //     <EntityForm
        //       cmd={`remark${remarkTypes[props.entity.typeName]}`}
        //       entity={props.entity}
        //       finished={props.finished}
        //     />
        //   );
        }
        // TODO:
        // if (Object.values(TargetType).includes(props.entity.typeName as TargetType)) {
        //   // return console.log('来这改');
        //   // return (
        //   //   <EntityForm cmd="remark" entity={props.entity} finished={props.finished} />
        //   // );
        // }
    }
  } 
  // 实体信息预览
  return setComponent(EntityPreview,{entity:props.entity,finished:props.finished})
})


</script>
<template>
  <component :is="component" v-bind="propsObj"/>
</template>

<style lang='scss' scoped>
</style>