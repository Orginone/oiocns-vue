<script setup lang="ts">
import { IFile } from '@/ts/core'
import EntityIcon from '@components/Common/GlobalComps/entityIcon/index.vue'
import { useRouter } from 'vue-router'
import { cleanMenus } from '@/utils/tools'
import { loadFileMenus } from '@/executor/fileOperate'
import { command } from '@/ts/base'
import { onContextMenu } from '@/utils/contextMenu'


const props = defineProps<{
  item: IFile
}>()

const getContextMenu =  ()=> {
  return {
    items: cleanMenus(loadFileMenus(props.item)) || [],
    onClick: ({ key }: { key: string }) => {
      command.emitter('executor', key, props.item, 'preview')
    },
  }
}


</script>

<template>
  <div class="appCard" 
    @click="command.emitter('executor', 'open', item ,'preview')"
    @contextmenu="onContextMenu($event, getContextMenu())"
  >
    <ElBadge is-dot :hidden="!item.cache.tags?.includes('常用')">
      <EntityIcon :entity="item.metadata" :size="35" />
    </ElBadge>
    <div class="appName">{{ item.name}}</div>
    <div class="teamName">{{item.directory.target.name}}</div>
    <div class="teamName">{{item.directory.target.space.name }}</div>
  </div>  
</template>

<style lang="scss" scoped>
.appCard {
  padding: 12px;
  text-align: center;
  .appName {
    font-size: 14px;
    font-weight: bold;
    padding: 4px 0;
  }
  .teamName {
    color: #686868;
    font-size: 12px;
    padding: 3px 0;
  }
  &:hover {
    border-radius: 10px;
    // TODO:
    // background: @active-background;
    background-color: #e6f1ff;
  }
}
</style>
