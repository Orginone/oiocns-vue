<!-- 存储-文件系统 -->
<script setup lang="ts">

import IconMode from './iconMode.vue'
import ListMode from './listMode.vue'
import useStorage from '@/hooks/useStorage'
import SegmentContent from '@/components/Common/SegmentContent/index.vue'
import { IDEntity } from '@/ts/core'
import TagsBar from '../tagsBar/index.vue'
import SearchBar from '../SearchBar/index.vue'

const props = defineProps<{
  content: IDEntity[];
  accepts?: string[];
  selectFiles: IDEntity[];
  excludeIds?: string[];
  initTags: string[];
  extraTags: boolean;
  excludeTags?: string[];
  preDirectory?: IDEntity;
  focusFile?: IDEntity;
  rightBars?: any;
  height?: number | string;
  currentTag: string;
  badgeCount?: (tag: string) => number
  tagChanged?: (tag: string) => void
  fileOpen: (file: IDEntity | undefined, dblclick: boolean) => void;
  contextMenu: (file?: IDEntity) => any;
}>()


const filterText = ref<string>('');
const [segmented, setSegmented] = useStorage('segmented', 'list')

const getContent = (filter: boolean = true) => {
    const filterExp = (file: IDEntity) => {
      return (
        file.code?.includes(filterText.value) ||
        file.name.includes(filterText.value) ||
        file.remark.includes(filterText.value) ||
        file.typeName.includes(filterText.value) ||
        file.groupTags.filter((i) => i.includes(filterText.value)).length > 0
      );
    };
    if (props.extraTags) {
      if (filter && props.currentTag == '已选中') {
        return props.selectFiles.filter(filterExp);
      }
      const tagFilter = (file: IDEntity) => {
        let success = true;
        if (props.excludeIds && props.excludeIds.length > 0) {
          success = !props.excludeIds.includes(file.id);
        }
        if (filter && success) {
          if (props.currentTag !== '全部' && props.currentTag != '最近') {
            success = file.groupTags.includes(props.currentTag);
          } else {
            success = !file.groupTags.includes('已删除');
          }
        }
        if (success && props.accepts && props.accepts.length > 0) {
          success = file.groupTags.some((i) => props.accepts!.includes(i));
        }
        return success;
      };
      return props.content.filter(filterExp).filter(tagFilter);
    }
    return props.content.filter(filterExp);
  };
  const setFilter = (val:string) => {
    filterText.value = val;
    getContent();
  }
</script>

<template>
  <!-- 搜索栏 -->
  <SearchBar
    :select="currentTag"
    :showBack="preDirectory != undefined"
    :onBack="()=>fileOpen(preDirectory,true)"
    :extraTags="extraTags"
    :excludeTags="excludeTags || []"
    :initTags="initTags"
    :selectFiles="selectFiles"
    :entitys="content"
    :badgeCount="badgeCount"
    :menus="contextMenu()"
    :onValueChanged="(value:string) => setFilter(value)"
  />
  <!-- 标签栏 -->
  <TagsBar
    :select="currentTag"
    :showBack="preDirectory != undefined"
    :extraTags="extraTags"
    :excludeTags="excludeTags || []"
    :initTags="initTags"
    :selectFiles="selectFiles"
    :entitys="getContent(false)"
    :badgeCount="badgeCount"
    :onBack="()=>fileOpen(preDirectory,true)"
    :onChanged="(t) => props.tagChanged && props.tagChanged(t)"
  />
  <!-- 文件列表 -->
  <SegmentContent
    :onSegmentChanged="setSegmented"
    :descriptions="`${getContent().length}个项目`"
  >
    <IconMode
      v-if="segmented === 'icon'"
      :selectFiles="selectFiles"
      :focusFile="focusFile"
      :content="getContent()"
      :fileOpen="props.fileOpen"
      :contextMenu="props.contextMenu"
    />
    <ListMode
      v-else
      :selectFiles="selectFiles"
      :focusFile="focusFile"
      :content="getContent()"
      :fileOpen="props.fileOpen"
      :contextMenu="props.contextMenu"
    />
    <!-- 为空 -->
    <ElEmpty v-if="content.length === 0" description="暂无数据"></ElEmpty>
  </SegmentContent>
</template>

<style lang="scss" scoped>

</style>
