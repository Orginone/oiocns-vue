<script setup lang="ts">
import { IDEntity } from '@/ts/core'
import { showChatTime } from '@/utils/tools'
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import { onContextMenu } from './contextMenu'

defineProps<{
  content: IDEntity[];
  selectFiles: IDEntity[];
  focusFile: IDEntity | undefined;
  fileOpen: (file: IDEntity | undefined, dblclick: boolean) => void;
  contextMenu: (file?: IDEntity) => {
    items: any[]
    onClick: (item: any) => void
}
}>()

</script>

<template>
  <div class="list-mode" @contextmenu="onContextMenu($event,undefined,contextMenu)">
    <div class="list_item" v-for="item in content" :key="item.key"
      :style="selectFiles.includes(item) || focusFile?.key === item.key ? {backgroundColor: '#e6f1ff'} : {}"
      @click="fileOpen(item, false)"
      @dblclick="fileOpen(item, true)"
      @contextmenu.stop="onContextMenu($event,item,contextMenu)"
    >
      <div class="list_item_meta">
        <div class="list_item_meta_avatar">
          <!-- 头像 -->
          <ElBadge 
            :value="item.badgeCount" 
            size="small"
            :hidden="item.badgeCount===0"
          >
            <EntityIcon :entity="item.metadata" :size="40" />
          </ElBadge>
        </div>
        <div class="list_item_meta_content">
          <!-- 名称&标签 -->
          <div style="margin-bottom: 4px;">
            <span style="margin-right: 10px;margin-bottom: 4px;color: rgba(0,0,0,.85);font-size: 14px;line-height: 1.5715;">
              {{item.name}}
            </span>
            <ElTag 
              v-for="label in item.groupTags.filter((i) => i.length > 0)" 
              :key="label" 
              :type="label === '置顶' ? 'danger' : 'success'"
            >
              {{label}}
            </ElTag>
          </div>
          <!-- 描述 | 消息 -->
          <div class="description">
            {{ item.remark || item.code }}
          </div>
        </div>

      </div>
      <div class="list_item_time" :key="item.id" :title="item.updateTime">
        {{showChatTime(item.updateTime)}}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-mode {
  height: 100%;
}
.list_item {
  cursor: pointer;
  padding: 12px 10px;
  border-radius: 10px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;  
  .list_item_meta {
    display: flex;
    .list_item_meta_content {
      margin-left: 16px;
      .description {
        color: rgba(0,0,0,.45);
      font-size: 14px;
      line-height: 1.5715;
      }
    }
  }
  .list_item_time {
    margin-left: 48px;
    color: rgba(0,0,0,.45);
    font-size: 14px;
    line-height: 1.5715;
    text-align: center;
    text-wrap: nowrap;
    display: flex;
    align-items: center;
  }
}

.list_item:hover {
  background-color: #f1f1f1;
}

:deep(.el-tag){
  margin-right: 8px;
}
:deep(.el-badge__content.is-fixed){
  
}
</style>
