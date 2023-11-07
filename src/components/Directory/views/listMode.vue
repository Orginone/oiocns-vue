<script setup lang="ts">
import { IDEntity } from '@/ts/core';
// import { Badge, Dropdown, List, MenuProps, Tag } from 'antd';
import { showChatTime } from '@/utils/tools'
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue';


const props = defineProps<{
  content: IDEntity[];
  selectFiles: IDEntity[];
  focusFile: IDEntity | undefined;
  fileOpen: (file: IDEntity | undefined, dblclick: boolean) => void;
  contextMenu: (file?: IDEntity) => any
}>()


</script>

<template>
  <template v-for="item in content" :key="item.key">
    <div class="list_item" :style="{backgroundColor: focusFile?.id === item.id ? '#e6f1ff' : ''}">
      <ElDropdown trigger='contextmenu'>
        <!-- 内容 -->
        <div class="list_item_meta"
          @click="fileOpen(item, false)"
          @dblclick="fileOpen(item, true)"
        >
          <!-- 头像 -->
          <ElBadge 
            :value="item.badgeCount" 
            size="small"
            :hidden="item.badgeCount===0"
          >
            <EntityIcon :entity="item.metadata" :size="40" />
          </ElBadge>
          <!-- middle -->
          <div class="middle">
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
          <!-- 右侧时间 -->
          <div class="right-time" :key="item.id" :title="item.updateTime">
            {{showChatTime(item.updateTime)}}
          </div>
        </div>
        <!-- 右键dropdown菜单 -->
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="op in contextMenu(item)" :key="op.title" @click="op.onClick">{{op.title}}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </ElDropdown>
    </div>
  </template>
  <div class="blank_area"></div>
</template>

<style lang="scss" scoped>
.list_item {
  cursor: pointer;
  padding: 12px 10px;
  border-radius: 10px;
  border-bottom: 1px solid #ebeef5;
  &_meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .middle {
      margin-left: 16px;
      .description {
        color: rgba(0,0,0,.45);
      font-size: 14px;
      line-height: 1.5715;
      }
    }
    .right-time {
      margin-left: 48px;
      color: rgba(0,0,0,.45);
      font-size: 14px;
      line-height: 1.5715;
      text-align: center;
      text-wrap: nowrap;
    }
  }
}

// .item_title {
//   display: inline;
//   margin-right: 10px;
// }

.list_item:hover {
  background-color: #f1f1f1;
}

.list_item_select {
  cursor: pointer;
  padding: 0 10px;
  border-radius: 10px;
  border-bottom: 1px solid #ebeef5;
  // background-color: @active-background;
}

.blank_area {
  width: 100%;
  min-height: 160px;
  max-height: calc(100% - 80px);
}

:deep(.el-dropdown){
  width: 100%;
  display: block;
}
:deep(.el-tag){
  margin-right: 8px;
}
</style>
