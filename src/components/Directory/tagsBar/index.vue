<!-- 标签条 -->
<script setup lang="ts">
import { schema } from '@/ts/base'
import { IEntity } from '@/ts/core'
import { Back,Right } from '@element-plus/icons-vue'

const props = defineProps<{
  title?: string
  select: string
  showTags?: boolean
  initTags: string[]
  excludeTags: string[]
  extraTags: boolean
  showBack?: boolean
  selectFiles: IEntity<schema.XEntity>[];
  badgeCount?: (tag: string) => number;
  entitys: IEntity<schema.XEntity>[]
  onChanged: (tag: string) => void
  onBack: () => void
}>()



/** 分组标签集 */
const groupTags = computed(() => {
  const tags = props.initTags.map((tag) => { // 初始化标签
    return { tag, count: 0 }
  })
  if(props.badgeCount) { // 计算角标
    tags.forEach((tag) => {
      tag.count = props.badgeCount(tag.tag)
    })
  }
  if (props.selectFiles.length > 0) { // 已选中
    tags.push({ tag: '已选中', count: props.selectFiles.length })
  }
  if (props.extraTags) { // 额外标签
    props.entitys.forEach((entity) => {
      entity.groupTags.forEach((tag) => {
        if (!props.excludeTags.includes(tag)) {
          const index = tags.findIndex((i) => i.tag === tag);
          if (index > -1) {
            tags[index].count += 1;
          } else {
            tags.push({ tag, count: 1 });
          }
        }
      });
    });
  }
  return tags.sort((a, b) => {
    const aqz = a.tag === '已删除' ? 10 : 0;
    const bqz = b.tag === '已删除' ? 10 : 0;
    return aqz - bqz;
  })
})

</script>

<template>
  <div class="tags">
    <!-- 分类标签组 -->
    <div class="tags-left">
      <div class="title">{{ title }}</div>
      <ElButton v-if="showBack"
        link
        title="返回"
        :icon="Back"
        @click="onBack"
      />
      <div class="tags_body" v-if="showTags">
        <div class="tags-item" v-for="item in groupTags" :key="item.tag"
          :class="item.tag === props.select ? 'tags-item-active' : ''" 
          @click="onChanged(item.tag)"
        >
          {{item.tag}}
          <span v-if="item.count>0" class="tags-item-count">·{{item.count}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tags {
  width: 100%;
  display: flex;
  // justify-content: end;
  align-items: center;
  margin-bottom: 8px;
}
.tags-left {
  width: 0;
  flex: 1;
  gap: 8px;
  display: flex;
  align-items: center;
  .title {
    //styleName: 20/CN-Medium;
    font-family: PingFang SC;
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    letter-spacing: 0em;
    text-align: left;
    color: #000000;
  }
  .tags_body {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    overflow: hidden;
  }
  .tags-item {
    cursor: pointer;
    height: 24px;
    border-radius: 4px;
    // TODO: color/surface/默认边框
    border: 0.5px solid #DCDDE1;
    // TODO: color/surface/次要容器背景
    background-color: #F7F8FA ;
    padding: 1px 10px;
    display: flex;
    align-items: center;
    gap: 2px;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    // TODO: color/text & icon/text - color-3
    color: #6F7686;
    &:hover {
      // TODO:
      // background-color:@active-background;
      background-color: #e6f1ff;
    }
    &-active {
      font-weight: 500;
      // TODO: color/text & icon/text - color-white
      color: #FFFFFF;
      border-color: transparent;
      //  TODO: color/brand/Normal
      background-color: #366EF4 !important;
    }
  }
}

</style>
