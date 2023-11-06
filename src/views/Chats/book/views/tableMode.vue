<script setup lang="ts">

import { IFile, ISession } from '@/ts/core'
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import { showChatTime } from '@/utils/tools'
import DxDataGrid, { DxColumn, DxScrolling } from 'devextreme-vue/data-grid'
import { loadChatOperation } from './common'

const props = defineProps<{
  chats: ISession[];
  select: ISession | undefined;
  sessionOpen: (file: ISession | undefined, dblclick: boolean) => void;
}>()

const cxtItem = ref<ISession>()

</script>

<template>
  <ElDropdown
    trigger='contextmenu'
  >
    <div
      :style="{ width: '100%', height: '100%' }"
      @contextmenu="e => e.stopPropagation()"
    >
      <DxDataGrid
        id="grid"
        width="100%"
        height="100%"
        keyExpr="id"
        columnAutoWidth
        allowColumnResizing
        hoverStateEnabled
        :selectedRowKeys="select ? [select.id] : []"
        :selection="{ mode: 'single' }"
        columnResizingMode='nextColumn'
        :showColumnLines="false"
        :onRowClick="e => sessionOpen(e.data, false)"
        :onRowDblClick="e => sessionOpen(e.data, true)"
        :headerFilter="{
          visible: true,
          allowSearch: true,
        }"
        :onContextMenuPreparing="(e) => setCxtItem(e.row?.data)"
        :dataSource="chats"
      >
        <DxScrolling mode="virtual" />
          <!-- 名称 -->
          <DxColumn
            :width="250"
            dataField="name"
            caption="名称"
          >
            TODO:名称
            <!-- cellRender={(e) => {
              return (
                <>
                  <EntityIcon entity={e.data.metadata} showName size={20} />{' '}
                  <Badge
                    className="site-badge-count-109"
                    count={e.data.chatdata.noReadCount}
                    size="small"
                  />
                </>
              )
            }} -->
          </DxColumn>
          <!-- 代码 -->
          <DxColumn dataField="code" caption="代码" :width="200" />
          <!-- 标签 -->
          <DxColumn
            dataField="chatdata.labels"
            caption="标签"
            :width="200"
            dataType='datetime'
            :allowFiltering="false"
          >
            TODO:标签
            <!-- cellRender={(e) => {
              return (
                <>
                  {e.data.chatdata.labels
                    .filter((i: any) => i.length > 0)
                    .map((label: any) => {
                      return (
                        <Tag key={label} color={label === '置顶' ? 'red' : 'success'}>
                          {label}
                        </Tag>
                      );
                    })}
                </>
              );
            }} -->
          </DxColumn>
          <!-- 最近时间 -->
          <DxColumn
            dataField="metadata.updateTime"
            caption="最近时间"
            :width="200"
            :allowFiltering="false"
            :calculateDisplayValue="(e: IFile) => {
              return showChatTime(e.metadata.updateTime)
            }"
          >
            TODO:最近时间
            <!-- cellRender={(e) => {
                return (
                  <Text type="secondary">
                    {e.data.chatdata.lastMessage
                      ? showChatTime(e.data.chatdata.lastMessage?.createTime)
                      : ''}
                  </Text>
                );
              }} -->
          </DxColumn>
          <!-- 描述 -->
          <DxColumn
            :width="250"
            dataField="remark"
            caption="描述"
            :allowFiltering="false"
          >
          TODO:描述
          <!-- cellRender="(e) => {
              return (
                <>
                  {e.data.chatdata.mentionMe && (
                    <span style={{ color: 'red' }}>[有人@我]</span>
                  )}
                  <span>{e.data.information}</span>
                </>
              )
            }" -->
          </DxColumn>
      </DxDataGrid>
    </div>
    <!-- 下拉内容 -->
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item 
          v-for="item in loadChatOperation(cxtItem)" :key="item.title"
          @click="item.onClick"
        >
          {{ item.title }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </ElDropdown>
</template>

<style lang="scss" scoped>

</style>
