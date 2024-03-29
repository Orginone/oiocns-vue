<!-- 存储-文件系统 -->
<script setup lang="ts">

import IconMode from './iconMode.vue'
import ListMode from './listMode.vue'
import useStorage from '@/hooks/useStorage'
import SegmentContent from '@/components/Common/SegmentContent/index.vue'
import { IDEntity } from '@/ts/core'
import TagsBar from '../tagsBar/index.vue'

const props = defineProps<{
  content: IDEntity[]
  /** 展示的文件类型 */
  accepts?: string[]
  /** 选中的文件列表 */
  selectFiles: IDEntity[]
  excludeIds?: string[]
  /** 分类标签数组 */
  initTags: string[]
  /** 是否展示额外标签 */
  extraTags: boolean
  /** 额外的标签数组 */
  excludeTags?: string[]
  preDirectory?: IDEntity
  /** 获得焦点的文件 */
  focusFile?: IDEntity | undefined
  badgeCount?: (tag: string) => number
  tagChanged?: (tag: string) => void
  fileOpen: (file: IDEntity | undefined, dblclick: boolean) => void;
  contextMenu: (file?: IDEntity) => {
    items: any
    onClick: (item: any) => void
  }
}>()


/** 当前tag,默认为第一个 */
const currentTag=ref(props.initTags.length > 0 ? props.initTags[0] : '')
const [segmented, setSegmented] = useStorage('segmented', 'list')

/** 经过筛选的内容 */
const filteredContent = computed(() => {
  if (props.extraTags) {
    if (currentTag.value == '已选中') {
      return props.selectFiles
    }
    const tagFilter = (file: IDEntity) => {
      let success = true;
      if (props.excludeIds && props.excludeIds.length > 0) {
        success = !props.excludeIds.includes(file.id);
      }
      // 根据选中标签、未删除进行筛选
      if (success) {
        if (currentTag.value !== '全部' && currentTag.value != '最近') {
          success = file.groupTags.includes(currentTag.value);
        } else {
          success = !file.groupTags.includes('已删除');
        }
      }
      if (success && props.accepts && props.accepts.length > 0) {
        success = file.groupTags.some((i) => props.accepts!.includes(i));
      }
      return success
    }
    return props.content.filter(tagFilter)
  }
  return props.content
})
</script>

<template>
  <!-- 标签栏 -->
  <TagsBar
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
    :onChanged="(t) => currentTag = t"
  />
  <!-- 文件列表 -->
  <SegmentContent
    :onSegmentChanged="setSegmented"
    :descriptions="`${filteredContent.length}个项目`"
  >
    <IconMode
      v-if="segmented === 'icon'"
      :selectFiles="selectFiles"
      :focusFile="focusFile"
      :content="filteredContent"
      :fileOpen="fileOpen"
      :contextMenu="contextMenu"
    />
    <ListMode
      v-else
      :selectFiles="selectFiles"
      :focusFile="focusFile"
      :content="filteredContent"
      :fileOpen="fileOpen"
      :contextMenu="contextMenu"
    />
    <!-- 为空 -->
    <ElEmpty v-if="content.length === 0" description="暂无数据"></ElEmpty>
  </SegmentContent>
</template>

<style lang="scss" scoped>

</style>
