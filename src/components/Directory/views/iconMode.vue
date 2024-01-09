<script setup lang='ts'>
import { IDEntity } from '@/ts/core'
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import { onContextMenu } from './contextMenu'

defineProps<{
  focusFile: IDEntity | undefined
  content: IDEntity[]
  selectFiles: IDEntity[]
  fileOpen: (file: IDEntity | undefined, dblclick: boolean) => void;
  contextMenu: (file?: IDEntity) => any
}>()

</script>
<template>
  <div class="icon-mode" @contextmenu="onContextMenu($event,undefined,contextMenu)">
    <div v-for="el in content" :key ="el.key" @contextmenu.stop="onContextMenu($event,el,contextMenu)">
      <ElCard
        size="small"
        bodyClass="fileCard"
        :bodyStyle="selectFiles.includes(el) || focusFile?.key === el.key ? {backgroundColor: '#e6f1ff'} : {}" 
        shadow="never"
      >
        <div class="card-main"
          @click="fileOpen(el, false)"
          @dblclick="console.log(el),fileOpen(el, true)"
        >
          <div class="fileImage">
            <ElBadge :value="el.badgeCount" size="small" :hidden="el.badgeCount===0">
              <EntityIcon :entity="el.metadata" :size="50" />
            </ElBadge>
          </div>
          <div class="fileName" title="el.name">
            <ElText :title="el.name" truncated style="line-height: 1.5715;color: rgba(0,0,0,.85);">
              {{el.name}}
            </ElText>
          </div>
          <div class="fileName" :title="el.typeName">
            <ElText
              :style=" {fontSize: 12, color: '#888' }"
              :title="el.typeName"
              truncated
            >
              {{el.typeName}}
            </ElText>
          </div>                
        </div>
      </ElCard>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.icon-mode {
  padding: 16px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 16px;
  &::-webkit-scrollbar {
    background-color: transparent;
  }
}


.el-card {
  border: 0;
  background-color: transparent;
  :deep(.fileCard){
    width: 160px !important;
    padding: 12px;
    cursor: pointer;
    border-radius: 6px;
    width: 100%;
    flex: 1;
    overflow: auto;
    overflow-x: hidden;  
    &:hover {
      background-color: #efefef;
    }
  }
}

.fileImage {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.fileName {
  width: 100%;
  text-align: center;
}
</style>