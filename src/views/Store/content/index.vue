<!-- 通讯录 -->
<script setup lang="ts">
import { IDirectory, IFile, IWorkTask } from "@/ts/core";
import { command, } from "@/ts/base";
import orgCtrl from "@/ts/controller";
import DirectoryViewer from "@/components/Directory/views/index.vue";
import { loadFileMenus } from "@/executor/fileOperate";
import { cleanMenus } from "@/utils/tools";
import useCtrlUpdate from "@/hooks/useCtrlUpdate";
import useTimeoutHanlder from "@/hooks/useTimeoutHanlder";
import { useFlagCmdEmitter } from "@/hooks/useCtrlUpdate";
const props = defineProps<{
  current: IDirectory | "disk";
}>();
const dircetory = ref<IDirectory>(
  props.current === "disk" ? orgCtrl.user.directory : props.current
);

const focusFile = ref<IFile>();
const setFocusFile = (file: IFile) => {
  focusFile.value = file;
};
onMounted(() => {
  command.emitter("preview", "store", focusFile.value);
});
watch(focusFile, () => {
  command.emitter("preview", "store", focusFile.value);
});
const focusHanlder = (file: IFile | undefined) => {
  const focused = file && focusFile && file?.key === focusFile.value?.key;
  if (focused) {
    setFocusFile(undefined);
  } else {
    setFocusFile(file);
  }
};
const [submitHanlder, clearHanlder] = useTimeoutHanlder();
const clickHanlder = (file: IFile | undefined, dblclick: boolean) => {
  if (dblclick) {
    clearHanlder();
    if (file) {
      if (
        file.key === orgCtrl.user.key &&
        [orgCtrl.user.key, ...orgCtrl.user.companys.map((i) => i.key)].includes(
          orgCtrl.currentKey
        )
      ) {
        command.emitter("executor", "open", "disk");
      } else {
        command.emitter("executor", "open", file);
      }
    }
  } else {
    submitHanlder(() => focusHanlder(file), 200);
  }
};
// const contents = ref<any>([]);
const getContent = () => {
  const contents: IFile[] = [];
  if (props.current === 'disk') {
    contents.push(
      orgCtrl.user.directory,
      ...orgCtrl.user.companys.map((i) => i.directory),
    );
  } else {
    contents.push(...props.current.content());
  }
  console.log('contents',contents);

  return contents;
};
const contextMenu = (file?: IFile) => {
  const entity = file ?? dircetory.value;
  return {
    items: cleanMenus(loadFileMenus(entity)) || [],
    onClick: ({ key }: { key: string }) => {
      console.log("点击事件", key, entity, dircetory.value.key)
      command.emitter("executor", key, entity, dircetory.value.key);
    },
  };
};
</script>

<template>
  <div
    class="directory-viewer"
    :v-loading="false"
    element-loading-text="'加载中...'"
  >
    <DirectoryViewer
      extraTags
      :initTags="['全部']"
      :selectFiles="[]"
      :content="getContent()"
      :preDirectory="(orgCtrl.currentKey === 'disk' ? undefined : current.superior)"
      :fileOpen="(entity, dblclick) => clickHanlder(entity as IFile, dblclick)"
      :contextMenu="(entity) => contextMenu(entity as IWorkTask)"
    />
  </div>
</template>

<style lang="scss" scoped>
.directory-viewer {
  height: 100%;
}
.book {
  height: 100%;
}
</style>
