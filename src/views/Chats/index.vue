<script setup lang="ts">
import Content from "./content/index.vue";
import * as config from "./config/menuOperate";
import MainLayout from "@/components/MainLayout/index.vue";
import useMenuUpdate from "@/hooks/useMenuUpdate";
import { Search } from "@element-plus/icons-vue";
import { command } from "@/ts/base";
import AppLayout from "@/components/MainLayout/appLayout.vue";
import orgCtrl from "@/ts/controller";
import { IDirectory, IFile, IWorkTask, ITarget, ISession } from "@/ts/core";
import { cleanMenus } from "@/utils/tools";
import { loadFileMenus, operatesToMenus } from "@/executor/fileOperate";
import DirectoryViewer from "@/components/Directory/views/index.vue";
import { useFlagCmdEmitter } from "@/hooks/useCtrlUpdate";

const selectOpen = false;
const currentTag = ref<string>("最近");
const focusFile = ref<ISession>();
const chats = ref<ISession[]>([]);
const setCurrentTag = (val: string) => {
  currentTag.value = val;
};

const { loaded, key: msgKey } = useFlagCmdEmitter("session");
watch([msgKey], () => {
  setChats(filterChats(currentTag.value));
});

let id = "";
onMounted(() => {
  id = command.subscribe((type, cmd, ...args) => {
    if (type !== "session" || args.length < 1) return;
    switch (cmd) {
      case "open":
        sessionOpen(args[0]);
        break;
    }
  });
});
onBeforeUnmount(() => {
  command.unsubscribe(id);
});
const setFocusFile = (file: ISession | undefined) => {
  focusFile.value = file;
};
const setChats = (val: ISession[]) => {
  chats.value = val;
};
// 搜索关键词
const filterChats = (tag: string) => {
  console.log("orgCtrl.chats", orgCtrl.chats);
  const temps = orgCtrl.chats.filter((i) => i.isMyChat);
  return temps
    .filter((a) => tag === "最近" || a.groupTags.includes(tag))
    .filter((i) => i.chatdata.lastMessage || i.chatdata.recently)
    .sort((a, b) => {
      var num = (b.chatdata.isToping ? 10 : 0) - (a.chatdata.isToping ? 10 : 0);
      if (num === 0) {
        if (b.chatdata.lastMsgTime == a.chatdata.lastMsgTime) {
          num = b.isBelongPerson ? 1 : -1;
        } else {
          num = b.chatdata.lastMsgTime > a.chatdata.lastMsgTime ? 5 : -5;
        }
      }
      return num;
    });
};

const contextMenu = (session: ISession | undefined) => {
  return {
    items: cleanMenus(loadFileMenus(session)) || [],
    onClick: ({ key }: { key: string }) => {
      command.emitter("executor", key, session);
    },
  };
};

const sessionOpen = (session: ISession | undefined) => {
  if (session?.key === focusFile?.key) {
    setFocusFile(undefined);
    command.emitter("preview", "chat");
  } else {
    setFocusFile(session);
    command.emitter("preview", "chat", session);
  }
};
const renderMore = () => {};
watch(currentTag, () => {
  setChats(filterChats(currentTag.value));
});
</script>

<template>
  <div class="book" v-loading="!loaded" element-loading-text="加载中...">
    <AppLayout :previewFlag="'chat'">
      <template v-slot:content>
        <div class="head">
          <OrgIcons chat selected />
          <span>沟通</span>
        </div>
        <DirectoryViewer
          :extraTags="false"
          :height="'calc(100% - 100px)'"
          :initTags="['最近', '常用', '@我', '未读', '好友', '同事', '群聊']"
          :selectFiles="[]"
          :focusFile="focusFile"
          :content="chats"
          :badgeCount="
            (tag) =>
              filterChats(tag)
                .map((i) => i.badgeCount ?? 0)
                .reduce((total, count) => total + count, 0)
          "
          :currentTag="currentTag"
          :tagChanged="(t) => setCurrentTag(t)"
          :fileOpen="(entity) => sessionOpen(entity as ISession)"
          :contextMenu="(entity) => contextMenu(entity as ISession)"
          :rightBars="renderMore()"
        />
      </template>
    </AppLayout>
  </div>
</template>

<style lang="scss" scoped>
.head{
  display:flex;
  align-items: center;
  padding-left: 10px;
  margin: 12px;
  margin-left: 0;
  span{
    font-size: 16px;
    margin-left: 10px;
  }
}
.directory-viewer {
  height: 100%;
}
.book {
  height: 100%;
}
</style>
