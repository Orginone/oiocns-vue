<script setup lang="ts">
import { IDEntity,ISession } from '@/ts/core'
import { showChatTime } from '@/utils/tools'
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import { onContextMenu } from '@/utils/contextMenu'

const props = defineProps<{
  content: IDEntity[];
  selectFiles?: IDEntity[];
  focusFile?: IDEntity | undefined;
  fileOpen: (file: IDEntity | undefined, dblclick: boolean, e?: MouseEvent) => void;
  contextMenu: (file?: IDEntity) => {
    items: any[]
    onClick: (item: any) => void
}
}>()


</script>

<template>
  <div class="list-mode" @contextmenu="onContextMenu($event,contextMenu())">
    <div class="list-item" v-for="item in content" :key="item.id"
      :class="{ 
        'list-item-selected': selectFiles.includes(item) || focusFile?.key === item.key,
        'list-item-pinned': (item as ISession)?.chatdata?.isToping
      }"
      @click="fileOpen(item, false,$event)"
      @dblclick="fileOpen(item, true)"
      @contextmenu.stop="onContextMenu($event,contextMenu(item))"
    >
      <div class="list-item-avatar">
        <ElBadge 
          :value="item.badgeCount" 
          size="small"
          :hidden="item.badgeCount===0"
        >
          <EntityIcon :entityId="item.metadata.id" :size="48" />
        </ElBadge>
      </div>
      <div class="list-item-content">
        <div class="list-item-content-left">
            <div class="name">{{item.name}}</div>
            <div class="info">{{ item.remark || item.code }}</div>
        </div>
        <div class="list-item-content-right">
          <div class="time">{{showChatTime(item.updateTime)}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-mode {
  width: 100%;
}
.list-item {
  margin-bottom: 2px;
  width: 100%;
  cursor: pointer;
  padding: 8px 6px;
  border-radius: 4px;
  display: flex;
  gap: 10px;
  .list-item-avatar {
    width: 48px;
    height: 48px;
    border-radius: 4.5px;
  }
  .list-item-content {
    width: 0;
    flex: 1;
    display: flex;
    justify-content: space-between;
    .list-item-content-left {
      width: 0;
      flex:1;
      // TODO:
      .name {
        margin: 4px 0;
        height: 22px;
        //styleName: 14/CN-Medium;
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 500;
        line-height: 22px;
        letter-spacing: 0em;
        text-align: left;
        // TODO: color/text & icon/text - color-1
        color: #15181D;
      }
      .info {
        height: 20px;
        //styleName: 12/CN-Regular;
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        letter-spacing: 0em;
        text-align: left;
        // TODO: color/text & icon/text - color-3
        color: #6F7686;
        text-wrap: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .list-item-content-right {
      .time {
        font-family: Nunito Sans;
        font-size: 10px;
        font-weight: 400;
        line-height: 18px;
        letter-spacing: 0em;
        text-align: left;
        // TODO: color/text & icon/text - color-2
        color: #424A57;
      }
    }
  }
}

.list-item:hover,.list-item-selected,.list-item-pinned {
  // TODO: color/surface/次要容器背景
  background-color: #F7F8FA;
}
</style>
