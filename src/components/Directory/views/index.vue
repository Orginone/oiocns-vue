<!-- 存储-文件系统 -->
<script setup lang="ts">
import IconMode from './iconMode.vue'
import ListMode from './listMode.vue'
import SegmentContent from '@/components/Common/SegmentContent/index.vue'
import { IDEntity } from '@/ts/core'
import SearchBar from '../searchBar/index.vue'
import TagsBar from '../tagsBar/index.vue'
import useStorage from '@/hooks/useStorage'

type segmentedTypes = 'icon' | 'list' | 'table'

type Props = {
  content: IDEntity[]
  /** 选中的文件列表 */
  selectFiles?: IDEntity[]
  excludeIds?: string[]
  /** 是否展示标签 */
  showTags?: boolean
  /** 展示的文件类型 */
  accepts?: string[]  
  /** 初始化标签数组 */
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
  fileOpen: (file: IDEntity | undefined, dblclick: boolean, event?: MouseEvent) => void
  contextMenu: any
  /** 列表类型 */
  listType?: segmentedTypes
  /** 是否展示底部栏 */
  showFooter?: boolean
}
const props = withDefaults(defineProps<Props>(),{
  showTags: true,
  extraTags: false,
})

// 搜索框关键字
const filterText = ref('')



/** 当前tag,默认为第一个 */
const currentTag=ref(props.initTags.length > 0 ? props.initTags[0] : '')

// list类别
const [segmented,setSegmented] = useStorage('segmented', 'list')
const listType = computed(()=>props.listType || segmented.value)

/** 关键词搜索 */
const filterExp = (file: IDEntity) => {
  return (
    file.code?.includes(filterText.value) ||
    file.name.includes(filterText.value) ||
    file.remark.includes(filterText.value) ||
    file.typeName.includes(filterText.value) ||
    file.groupTags.filter((i) => i.includes(filterText.value)).length > 0
  )
}
/** 仅关键词筛选的content */
const keyFilteredContent = computed(() => {
  return props.content.filter(filterExp)
})
/** 关键词筛选、标签筛选后的content */
const displayContent = computed(() => {
  // TODO:
  // if (props.extraTags) {
    // 已选中
    if (currentTag.value == '已选中') return props.selectFiles.filter(filterExp)
    /** 标签筛选 */
    const tagFilter = (file: IDEntity) => {
      let success = true;
      if (props.excludeIds && props.excludeIds.length > 0) {
        success = !props.excludeIds.includes(file.id)
      }
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
    return keyFilteredContent.value.filter(tagFilter).filter(filterExp)
  // }
  return props.content.filter(filterExp)
})

</script>

<template>
  <div class="directory-viewer">
    <!-- 搜索框+功能按钮 -->
    <SearchBar v-model="filterText" :menus="props.contextMenu()">
      <template #rightBar>
        <slot name="rightBar"></slot>
      </template>
    </SearchBar>
    <!-- 标签组 -->
    <TagsBar
      :select="currentTag"
      :showBack="preDirectory != undefined"
      :onBack="()=>fileOpen(preDirectory,true)"
      :extraTags="extraTags"
      :excludeTags="excludeTags || []"
      :show-tags="showTags"
      :initTags="initTags"
      :selectFiles="selectFiles"
      :entitys="keyFilteredContent"
      :badgeCount="badgeCount"
      :menus="contextMenu()"
      :onChanged="(t) => currentTag = t"
    />
    <!-- 文件列表 -->
    <SegmentContent
      :descriptions="`${displayContent.length}个项目`"
      :showFooter="showFooter"
      :segmented="segmented"
      :on-segmented-change="t=>{setSegmented(t);segmented=t}"
    >  
      <IconMode v-if="listType === 'icon'"
        :selectFiles="selectFiles"
        :focusFile="focusFile"
        :content="displayContent"
        :fileOpen="fileOpen"
        :contextMenu="contextMenu"
      />
      <ListMode v-else-if="listType === 'list'"
        :selectFiles="selectFiles"
        :focusFile="focusFile"
        :content="displayContent"
        :fileOpen="fileOpen"
        :contextMenu="contextMenu"
      />
      <ElEmpty v-else-if="content.length === 0" description="暂无数据"></ElEmpty>
    </SegmentContent>
  </div>
</template>

<style lang="scss" scoped>
.directory-viewer {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

</style>
