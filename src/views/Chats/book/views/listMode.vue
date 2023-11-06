<script setup lang="ts">
import { ISession } from '@/ts/core';
import css from '../index.module.less';
import { showChatTime } from '@/utils/tools';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon/index.vue';
import { loadChatOperation } from './common';

const props = defineProps<{
  chats: ISession[];
  select: ISession | undefined;
  sessionOpen: (file: ISession | undefined, dblclick: boolean) => void;
}>()

const cxtItem = ref<ISession>()
</script>

<template>
<ul class="demo-loadmore-list"
>
  <li v-for="item in chats" :key="item.key">
    <div class="book_ul" :style="{backgroundColor: select?.id === item.id ? '#e6f1ff' : ''}">
      <ElDropdown trigger='contextmenu'>
        <div class="book_item"
          @contextmenu="cxtItem = item"
          @click="sessionOpen(item, false)"
          @dblclick="sessionOpen(item, true)"
        >
          <!-- 头像 -->
          <ElBadge :value="item.chatdata.noReadCount" size="small">
            <TeamIcon :entity="item.metadata" :size="40" />
          </ElBadge>
          <!--  -->
          <div>
            <span style="margin-right: 10px;">{{item.chatdata.chatName}}</span>
            <ElTag 
              v-for="label in item.chatdata.labels.filter((i) => i.length > 0)" 
              :key="label" 
              :color="label === '置顶' ? 'red' : 'success'"
            >
              {{label}}
            </ElTag>
          </div>
          <!-- description -->
          <template>
            <span v-if="item.chatdata.mentionMe" :style="{ color: 'red' }">[有人@我]</span>
            <span>{{item.information}}</span>
          </template>
          <!-- 右侧时间 -->
          <ElText type="info">
            {{item.chatdata.lastMessage && showChatTime(item.chatdata.lastMessage?.createTime)}}
          </ElText>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="op in loadChatOperation(cxtItem)" :key="op.title" @click="op.onClick">{{op.title}}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </ElDropdown>
    </div>
  </li>
</ul>

</template>

<style lang="scss" scoped>
.book_ul {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #ebeef5;
  .check {
    margin-right: 12px;
  }
  // TODO:
  // :global {
  //   .ogo-list-item {
  //     width: 100%;
  //   }
  // }
  .book_item {
    cursor: pointer;
    margin: 0 10px;
  }
}
.book_ul:hover {
  background-color: #f1f1f1;
}

.select {
  background-color: #e6e6e6;
}

.pageCard {
  height: calc(100% - 35px);
  // TODO:
  // & > :global(.ogo-card-body) {
  //   height: calc(100% - 10px);
  //   padding: 2px 6px;
  // }
  // & > :global(.dx-datagrid-headers) {
  //   border-bottom: none;
  // }
  .mainContent {
    height: calc(100% - 20px);
    overflow: auto;
  }
}

</style>
