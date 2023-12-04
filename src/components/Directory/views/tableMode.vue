<script setup lang='ts'>
import { IDEntity } from '@/ts/core'
import { showChatTime } from '@/utils/tools'
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue';
import type { TableColumnCtx, TableInstance } from 'element-plus'
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
import { formatSize } from '@/ts/base/common'
const props = defineProps<{
  content: IDEntity[];
  selectFiles: IDEntity[];
  focusFile: IDEntity | undefined;
  fileOpen: (file: IDEntity | undefined, dblclick: boolean) => void;
  contextMenu: (file?: IDEntity) => any
}>()


const tableRef = ref<TableInstance>()
const current = ref<IDEntity>()
const x = ref(0)
const y = ref(0)
</script>
<template>
  <div class="table-mode" v-if="content.length>0">
    <ElTable
      ref="tableRef"
      row-key="code"
      :data="content"
      style="width: 100%;cursor: pointer;"
      row-style="position: relative;"
      fit
      @row-click="row=>fileOpen(row, false)"
      @row-dblclick="row=>fileOpen(row, true)"
      @row-contextmenu="(row,_,e)=>{
        e.preventDefault()
        current=row
        x=e.clientX
        y=e.clientY
      }"
    >
      <ElTableColumn prop="name"
        label="名称"
        sortable
        :filters="content.map(i => {
          return {
            text: i.name,
            value: i.name
          }
        })"
        :filter-method="(value,row)=>row.name===value"
      >
        <template #default="{row}">
          <div class="avatar" style="margin: 10px 20px 0 0;float:left">
            <ElBadge 
              :value="row.badgeCount" 
              size="small"
              :hidden="row.badgeCount===0"
            >
              <EntityIcon :entity="row.metadata" :size="40" />
            </ElBadge>
          </div>
          <div style="display: flex;flex-direction: column;">
            <span class="name" style="color: #333;">{{row.name}}</span>
            <span class="remark" style="color: rgb(153, 153, 153);position: absolute;bottom: 0;text-wrap: nowrap;">{{row.remark}}</span>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="code"
        label="代码"
        sortable
        :filters="content.map(i => {
          return {
            text: i.code,
            value: i.code
          }
        })"
        :filter-method="(value,row)=>row.code===value"
      />
      <ElTableColumn prop="typeName"
        label="类型"
        sortable
        :filters="Array.from(new Set(content.map(i => {return {text: i.typeName,value: i.typeName}}).map(JSON.stringify))).map(JSON.parse)"
        :filter-method="(value,row)=>row.typeName===value"
      />
      <ElTableColumn prop="metadata.createTime"
        label="创建时间"
        sortable
        :filters="content.map(i => {
          return {
            text: i.metadata.createTime,
            value: i.metadata.createTime
          }
        })"
        :filter-method="(value,row)=>row.metadata.createTime===value"
      >
        <template #default="{row}">
          {{showChatTime(row.metadata.createTime)}}
        </template>
      </ElTableColumn>
      <ElTableColumn prop="updateTime"
        label="变更时间"
        sortable
        :filters="content.map(i => {
          return {
            text: i.updateTime,
            value: i.updateTime
          }
        })"
        :filter-method="(value,row)=>row.updateTime===value"
      >
        <template #default="{row}">
          {{showChatTime(row.updateTime)}}
        </template>
      </ElTableColumn>
      <ElTableColumn prop="filedata.size" v-if="'filedata' in content[0]" 
        label="大小"
        sortable
      >
        <template #default="{row}">
          {{formatSize(row.filedata.size)}}
        </template>
      </ElTableColumn>
    </ElTable>
    <!-- TODO:右键菜单 -->
    <Teleport to="body">
      <div class="contextmenu" :style="{top: y+'px', left: x+'px'}">
        <div class="contextmenu-item" v-for="item in contextMenu(current)" :key="item.key" @click="item.onClick">
          {{ item.title }}
        </div>
      </div>
    </Teleport>
    
  </div>
</template>

<style lang='scss' scoped>
.table-mode {
  position: relative;
  width: 100%;
}
.contextmenu {
  position: absolute;
  z-index: 100000;
}
</style>