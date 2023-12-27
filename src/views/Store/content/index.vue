<!-- 通讯录 -->
<script setup lang="ts">
import { IDirectory, IFile, IWorkTask,ITarget } from "@/ts/core";
import { command, } from "@/ts/base";
import orgCtrl from "@/ts/controller";
import DirectoryViewer from "@/components/Directory/views/index.vue";
import useCtrlUpdate from "@/hooks/useCtrlUpdate";
import useTimeoutHanlder from "@/hooks/useTimeoutHanlder";
/**
 * 数据-内容导航
 */
const props = defineProps<{
    selectMenu: any;
}>();
const current = <ITarget | 'disk'>('disk');
const key = useCtrlUpdate(current === 'disk' ? orgCtrl.user : current);
const currentTag = ref<string>('全部');
const focusFile = ref<IFile>();
const [submitHanlder, clearHanlder] = useTimeoutHanlder();

const setCurrentTag = (val:string) => {
  currentTag.value = val;
}
const setFocusFile = (file: IFile) => {
  focusFile.value = file;
};
onMounted(() => {
  command.emitter("preview", "store", focusFile.value);
  setCurrentTag('全部');
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
const getContent = () => {
    const contents = ref<IFile[]>([]);
    if (current === 'disk') {
      contents.value.push(orgCtrl.user, ...orgCtrl.user.companys);
    } else {
      contents.value.push(...current.content());
    }
    return contents.value;
};
watch(props.selectMenu,()=>{
    getContent();
})
</script>

<template>
  <div
    class="directory-viewer"
    :v-loading="false"
    element-loading-text="'加载中...'"
  >
    <div class="head">
      <OrgIcons store selected />
      <span>数据</span>
    </div>
    <DirectoryViewer
      extraTags
      :initTags="['全部']"
      :selectFiles="[]"
      :focusFile="focusFile"
      :currentTag="currentTag"
      :height='"calc(100% -100px)"'
      :content="getContent()"
      :tagChanged="(t) => setCurrentTag(t)"
      :fileOpen="(entity, dblclick) => clickHanlder(entity as IFile, dblclick)"
      :contextMenu="() => {  return { items: [],  }}"
    />
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
