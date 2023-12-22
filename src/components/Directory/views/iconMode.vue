<script setup lang='ts'>
import { IDEntity } from '@/ts/core'
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import { onContextMenu } from '@/utils/contextMenu'

defineProps<{
  focusFile?: IDEntity | undefined
  content: IDEntity[]
  selectFiles?: IDEntity[]
  fileOpen: (file: IDEntity | undefined, dblclick: boolean, e?: MouseEvent) => void;
  contextMenu: (file?: IDEntity) => any
}>()

</script>
<template>
  <div class="icon-mode" @contextmenu="onContextMenu($event,undefined,contextMenu)">
    <div class="icon-item" v-for="el in content" :key="el.id"
      @contextmenu.stop="onContextMenu($event,el,contextMenu)"
      @click="(e)=>fileOpen(el, false,e)"
      @dblclick="fileOpen(el, true)"
    >
      <div class="fileImage" >
        <ElBadge :value="el.badgeCount" size="small" :hidden="el.badgeCount===0">
          <EntityIcon :entityId="el.metadata.id" :size="48" />
        </ElBadge>
      </div>
      <div class="fileName" :title="el.name">
        {{el.name}}
      </div>               
    </div>
  </div>
</template>

<style lang='scss' scoped>
.icon-mode {
  width: 100%;
  padding: 16px 0;
  overflow-y: scroll;
  display: flex;
  align-content: start;
  flex-wrap: wrap;
  column-gap: 2px;
  row-gap: 24px;
  &::-webkit-scrollbar {
    background-color: transparent;
  }
  .icon-item {
    width: 116.5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    &:hover {
      // TODO:
      background-color: antiquewhite;
    }
    .fileName {
      //styleName: 14/CN-Regular;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      letter-spacing: 0em;
      text-align: left;
      //  TODO: color/text & icon/text - color-1
      color: #15181D;
    }
  }
}

</style>