<script setup lang="ts">
import { IDEntity, ISession } from "@/ts/core";
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
const props = defineProps<{
  entity: IDEntity | ISession;
  actions?: {
    key: string;
    label: string;
  }[];
  selectKey?: string;
  number?: number;
  children?:any; // 子组件
  onActionChanged?: (key: string) => void;
}>()
</script>
<template>
  <div class="groupDetail">
    <div class="list_item_meta">
      <div class="list_item_meta_avatar">
        <!-- 头像 -->
          <EntityIcon :entity="props.entity.metadata" :size="60" />
      </div>
      <div class="list_item_meta_content">
        <!-- 名称&标签 -->
        <div style="margin-bottom: 4px">
          <span
            style="
              margin-right: 10px;
              margin-bottom: 4px;
              color: rgba(0, 0, 0, 0.85);
              font-size: 14px;
              line-height: 1.5715;
            "
          >
            {{ props.entity.name }}
          </span>
          <ElTag
            v-for="label in props.entity.groupTags.filter((i) => i.length > 0)"
            :key="label"
            :type="label === '置顶' ? 'danger' : 'success'"
          >
            {{ label }}
          </ElTag>
        </div>
      </div>
    </div>
    <slot name="content"></slot>
  </div>
</template>

<style lang="scss" scoped>
  .groupDetail{
    height: 100%;
  }
  .list_item_meta {
    display: flex;
    margin-left:10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    .list_item_meta_content {
      display: flex;
      flex-direction: column;
      margin-left: 16px;
      div{
        display: flex;
        flex-direction: column;
      }
      .description {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        line-height: 1.5715;
      }
    }
  }
  .list_item_time {
    margin-left: 48px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 1.5715;
    text-align: center;
    text-wrap: nowrap;
    display: flex;
    align-items: center;
  }

.list_item:hover {
  background-color: #f1f1f1;
}

:deep(.el-tag) {
  margin-right: 8px;
}
:deep(.el-badge__content.is-fixed) {
}
</style>
