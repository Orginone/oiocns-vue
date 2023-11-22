<script setup lang='ts'>
import { IDEntity } from '@/ts/core'
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'

const props = defineProps<{
  focusFile: IDEntity | undefined
  content: IDEntity[]
  selectFiles: IDEntity[]
  fileOpen: (file: IDEntity | undefined, dblclick: boolean) => void;
  contextMenu: (file?: IDEntity) => any
}>()

</script>
<template>
  <div class="icon-mode">
    <ElDropdown 
      :trigger="['contextmenu']" 
      class= "icon-mode-content"
    >
      <div @contextmenu="e => e.stopPropagation()">
        <template v-for="el in content" :key ="el.key" >
          <ElDropdown :trigger="['contextmenu']">
            <ElCard
              size="small"
              bodyClass="fileCard"
              :bodyStyle="selectFiles.includes(el) || focusFile?.key === el.key ? {backgroundColor: '#e6f1ff'} : {}"
              :key="el.key"  
              shadow="never"
            >
              <div class="card-main"
                @click="fileOpen(el, false)"
                @dblclick="fileOpen(el, true)"
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
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="op in contextMenu(el)" :key="op.title" @click="op.onClick">{{op.title}}</el-dropdown-item>
              </el-dropdown-menu>  
            </template>          
          </ElDropdown>
        </template>
      </div>
    </ElDropdown>
  </div>
</template>

<style lang='scss' scoped>
.icon-mode {
  padding: 16px;
  height: 100%;
  overflow: auto;
  &::-webkit-scrollbar {
    background-color: transparent;
  }
  .icon-mode-content {
    width: 100%;
    .el-tooltip__trigger {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: flex-start;
      gap: 8px;
    }
  }
}


.el-card.el-tooltip__trigger {
  border: none !important;
  background-color: transparent;
}
:deep(.fileCard){
  width: 160px !important;
  // min-width: 160px;
  height: 118px;
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
.active {
  // TODO:
  // color: @primary-color;
  color: red;
}
</style>