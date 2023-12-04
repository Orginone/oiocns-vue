<!-- 标签条 -->
<script setup lang="ts">
import { schema } from '@/ts/base'
import { IEntity } from '@/ts/core'
import { Back,Right } from '@element-plus/icons-vue'

const props = defineProps<{
  select: string
  initTags: string[]
  excludeTags: string[]
  extraTags: boolean
  showBack?: boolean
  menus: any
  selectFiles: IEntity<schema.XEntity>[];
  badgeCount?: (tag: string) => number;
  entitys: IEntity<schema.XEntity>[]
  onChanged: (tag: string) => void
  onBack: () => void
}>()

/** 获取分组标签集 */
const groupTags = () => {
  const tags = props.initTags.map((tag) => {
    return { tag, count: 0 };
  })
  if (props.selectFiles.length > 0) {
    tags.push({ tag: '已选中', count: props.selectFiles.length })
  }
  if (props.extraTags) {
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
  });
}
const tagsBarRef = ref(null)
/** 箭头滚动 */
const arrowLeft = (num: number) => {
  if (tagsBarRef.value) {
    tagsBarRef.value.scrollLeft = tagsBarRef.value.scrollLeft + num;
  }
}
</script>

<template>
  <div class="tags_bar">
    <!-- 返回按钮 -->
    <ElButton v-if="showBack"
      link
      title="返回"
      :icon="Back"
      @click="onBack"
    />
    <div class="tags_body">
      <ElSpace style="height: 26px;" :size="8" spacer="|">
        <template v-for="item in groupTags()" :key="item.tag">
          <ElBadge 
            :hidden="badgeCount && badgeCount(item.tag)===0"  
            :value="badgeCount && badgeCount(item.tag)" 
          >
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
  </div>
</template>

<style lang="scss" scoped>
.tags_bar {
  width: 100%;
  height: 35px;
  gap: 8px;
  display: flex;
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #efefef;
  &_btn {
    cursor: pointer;
  }
  .tags_body {
    overflow: auto;
    padding: 0 8px;
    width: 100%;
    &::-webkit-scrollbar {
      height: 4px;
      background-color: transparent;
    }
  }
  .tags_item {
    cursor: pointer;
    white-space: nowrap;
    padding: 4px 12px;
    font-size: 12px;
    height: 26px;
    display: flex;
    align-items: center;
    .item_count {
      color: #2b00ff;
      font-style: italic;
      transform: scale(0.9);
    }
    &:hover {
      border-radius: 30px;
      // TODO:
      // background-color:@active-background;
      background-color: #e6f1ff;
    }
    &_active {
      cursor: not-allowed;
      white-space: nowrap;
      border-radius: 30px;
      padding: 4px 16px;
      font-size: 12px;
      height: 26px;
      display: flex;
      align-items: center;
      .item_count {
        font-style: italic;
        transform: scale(0.9);
      }
      // TODO:
      color: white;
      background-color:#3838b9;
    }
  }
}

:deep(.el-badge__content.is-fixed){
  top: 8px;
  width: 16px;
  height: 16px;
}
</style>
