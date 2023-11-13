<!-- 存储-文件系统 -->
<script setup lang="ts">

import IconMode from './iconMode.vue'
import ListMode from './listMode.vue'
import TableMode from './tableMode.vue'
import useStorage from '@/hooks/useStorage'
import SegmentContent from '@/components/Common/SegmentContent/index.vue'
import { IDEntity } from '@/ts/core';
import TagsBar from '../tagsBar/index.vue';

const props = defineProps<{
  content: IDEntity[]
  accepts?: string[]
  selectFiles: IDEntity[]
  excludeIds?: string[]
  initTags: string[]
  extraTags: boolean
  excludeTags?: string[]
  focusFile: IDEntity | undefined
  badgeCount?: (tag: string) => number
  tagChanged?: (tag: string) => void
  fileOpen: (file: IDEntity | undefined, dblclick: boolean) => void;
  contextMenu: (file?: IDEntity) => any
}>()

/** 当前tag */
const currentTag=ref('全部')
const [segmented, setSegmented] = useStorage('segmented', 'list')

/** 查询内容 */
const getContent = (filter: boolean = true) => {
  if (props.extraTags) {
    if (filter && currentTag.value == '已选中') {
      return props.selectFiles;
    }
    const tagFilter = (file: IDEntity) => {
      let success = true;
      if (props.excludeIds && props.excludeIds.length > 0) {
        success = !props.excludeIds.includes(file.id);
      }
      if (filter && success) {
        if (currentTag.value !== '全部') {
          success = file.groupTags.includes(currentTag.value);
        } else {
          success = !file.groupTags.includes('已删除');
        }
      }
      if (success && props.accepts && props.accepts.length > 0) {
        success = file.groupTags.some((i) => props.accepts!.includes(i));
      }
      return success;
    };
    return props.content.filter(tagFilter);
  }
  return props.content
}

</script>

<template>
  <!-- 标签栏 -->
  <TagsBar
    :select="currentTag"
    :extraTags="extraTags"
    :excludeTags="excludeTags || []"
    :initTags="initTags"
    :selectFiles="selectFiles"
    :entitys="getContent(false)"
    :badgeCount="badgeCount"
    :onChanged="(t) => currentTag = t"
  />
  <!-- 文件列表 -->
  <SegmentContent
    :onSegmentChanged="setSegmented"
    :descriptions="`${getContent().length}个项目`"
  >
    <!-- TODO:content-默认插槽 -->
    <!-- <TableMode
      v-if="segmented === 'table'"
      :selectFiles="selectFiles"
      :focusFile="focusFile"
      :content="getContent()"
      :fileOpen="fileOpen"
      :contextMenu="contextMenu"
    />
    <IconMode
      v-else-if="segmented === 'icon'"
      :selectFiles="selectFiles"
      :focusFile="focusFile"
      :content="getContent()"
      :fileOpen="fileOpen"
      :contextMenu="contextMenu"
    /> -->
    <ListMode
      :selectFiles="selectFiles"
      :focusFile="focusFile"
      :content="getContent()"
      :fileOpen="fileOpen"
      :contextMenu="contextMenu"
    />
  </SegmentContent>
</template>

<style lang="scss" scoped>

</style>
