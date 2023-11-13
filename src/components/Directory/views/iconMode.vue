<script setup lang="ts">
import { ISession } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue';

const props = defineProps<{
  chats: ISession[];
  select: ISession | undefined;
  sessionOpen: (file: ISession | undefined, dblclick: boolean) => void;
}>()



</script>

<template>
<div class="content" @contextmenu="e => e.stopPropagation()">
  <!-- TODO: -->
  <template class="file" v-for="el in props.chats" :key="el.key">
    <ElDropdown  trigger="contextmenu">
      <!-- 下拉菜单的内容 -->
      <ElCard
        :body-class="select?.id === el.id ? 'fileCard_select' : 'fileCard'"
        shadow="never"
        @click="async () => await sessionOpen(el, false)"
        @double-click="async () => await sessionOpen(el, true)"
        @contextMenu="e => e.stopPropagation()"
      >
        <!-- 图片 -->
        <div class="fileImage">
          <ElBadge :value="el.chatdata.noReadCount" :hidden="!el.chatdata.noReadCount">
            <ElBadge v-if="el.chatdata.isToping" type="danger" />
            <EntityIcon :entity="el.metadata" :size="50" />
          </ElBadge>
        </div>
        <!-- 文件名 -->
        <div class="fileName" :title="el.name">
          <ElText truncated>
            {{el.name}}
          </ElText>
        </div>
        <!-- 文件类型名 -->
        <div class="fileName" :title="el.typeName">
          <ElText type="info" truncated size="small">
            {{el.typeName}}
          </ElText>
        </div>
      </ElCard>
      <!-- 下拉列表 -->
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item in loadChatOperation(el)" @click="item.onClick">
            {{ item.title }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </ElDropdown>
  </template>
</div>
</template>

<style lang="scss" scoped>
// @import '~antd/es/style/themes/variable';
.content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 16px;
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
  //TODO: color: @primary-color;
  color: yellow;
}
</style>
../common