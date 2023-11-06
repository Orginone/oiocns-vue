<script setup lang="ts">
import { schema } from '@/ts/base'
import { IEntity } from '@/ts/core'

const props = defineProps<{
  select: string;
  initTags: string[];
  selectFiles: IEntity<schema.XEntity>[];
  badgeCount?: (tag: string) => number;
  entitys: IEntity<schema.XEntity>[];
  onChanged: (tag: string) => void;
}>()

// 获取分组标签集
const groupTags = () => {
  const tags = props.initTags.map((tag) => {
    return { tag, count: 0 };
  });
  if (props.selectFiles.length > 0) {
    tags.push({ tag: '已选中', count: props.selectFiles.length });
  }
  // console.log('tagsbar.props.entitys[0]', props.entitys[0])
  
  props.entitys.forEach((entity) => {
    entity.groupTags?.forEach((tag) => {
      const index = tags.findIndex((i) => i.tag === tag);
      if (index > -1) {
        tags[index].count += 1;
      } else {
        tags.push({ tag, count: 1 });
      }
    });
  });
  return tags.sort((a, b) => {
    const aqz = a.tag === '已删除' ? 10 : 0;
    const bqz = b.tag === '已删除' ? 10 : 0;
    return aqz - bqz;
  });
}

</script>

<template>
  <div class="tags_bar">
    <ElSpace spacer="|" :size="16">
       <!-- {groupTags().map((item) => loadBarItem(item.tag, item.count))} -->
      <template v-for="item in groupTags()" :key="item.tag">
        <ElBadge 
          :hidden="badgeCount && badgeCount(item.tag)>0"  
          :value="badgeCount && badgeCount(item.tag)" 
        >
          <!-- TODO::key="item.tag + '_bdg'" size="small" offset={[-7, 7]} -->
          <div 
            :class="item.tag === props.select ? 'tags_item_active' : 'tags_item'" 
            @click="onChanged(item.tag)"
          >
            {{item.tag}}
            <span v-if="item.count>0" class="item_count">{{item.count}}</span>
          </div>
        </ElBadge>
      </template>
    </ElSpace>
  </div>
</template>

<style lang="scss" scoped>
.tags_bar {
  width: 100%;
  height: 35px;
  overflow-y: hidden;
  overflow-x: scroll;
  border-bottom: 1px solid #efefef;
  .tags_item {
    cursor: pointer;
    white-space: nowrap;
    padding: 4px 16px;
    font-size: 12px;
    height: 26px;
    .item_count {
      color: #2b00ff;
      font-style: italic;
      transform: scale(0.9);
    }
    &:hover {
      border-radius: 30px;
      // TODO:background-color:@active-background;
      background-color: #e6f1ff;
    }
    &_active {
      cursor: not-allowed;
      border-radius: 30px;
      padding: 4px 16px;
      font-size: 12px;
      height: 26px;
      .item_count {
        font-style: italic;
        transform: scale(0.9);
      }
      // TODO: color: @text-color-inverse;
      color: white;
      // TODO:background-color:@focus-background;
      background-color: #3838b9;
    }
  }
}
</style>
