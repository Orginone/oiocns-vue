<!-- 通讯录 -->
<script setup lang="ts">
import { ITarget, IFile, IWorkTask } from "@/ts/core";
import { command } from "@/ts/base";
import orgCtrl from "@/ts/controller";
import DirectoryViewer from "@/components/Directory/views/index.vue";
import { loadFileMenus,operatesToMenus } from "@/executor/fileOperate";
import { cleanMenus } from "@/utils/tools";
import useCtrlUpdate from "@/hooks/useCtrlUpdate";
import useTimeoutHanlder from "@/hooks/useTimeoutHanlder";
import { useFlagCmdEmitter } from "@/hooks/useCtrlUpdate";
import { targetOperates } from '@/ts/core/public';

const current = ref<ITarget | string>('disk');
const currentTag = ref<string>('全部');
const focusFile = ref<IFile>();
const setCurrent = (val:ITarget|string) => {
  console.log('val',val);
  current.value = val;
}
const setFocusFile = (file: IFile) => {
  focusFile.value = file;
};
const setCurrentTag = (val:string) => {
  currentTag.value = val;
}
onMounted(() => {
  command.emitter("preview", "relation", focusFile.value);
});
watch(focusFile, () => {
  command.emitter("preview", "relation", focusFile.value);
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
const clickHanlder = (file: ITarget | undefined, dblclick: boolean) => {
  if (dblclick) {
      clearHanlder();
      if (file) {
        setCurrent(file);
      }
    } else {
      submitHanlder(() => focusHanlder(file), 300);
    }
};
// const contents = ref<any>([]);
const getContent = () => {
  const contents: IFile[] = [];
  if (current.value === "disk") {
    contents.push(orgCtrl.user, ...orgCtrl.user.companys);
  } else {
    contents.push(...current.value.content());
  }
  return contents;
};
const contextMenu = (file?: IFile) => {
  const entity = file ?? current.value;
  if (entity != 'disk') {
    return {
      items: cleanMenus(loadFileMenus(entity)) || [],
      onClick: ({ key }: { key: string }) => {
        command.emitter('executor', key, entity);
      },
    };
  } else {
    return {
      items:
        cleanMenus(
          operatesToMenus(
            [targetOperates.NewCompany, targetOperates.JoinCompany],
            orgCtrl.user,
          ),
        ) || [],
      onClick: ({ key }: { key: string }) => {
        command.emitter('executor', key, orgCtrl.user);
      },
    };
  }
};
const setCurrents = () => {
  console.log('setCurrents',current.value.superior);
  setCurrent(current.value.superior)
} 
</script>

<template>
  <div
    class="directory-viewer"
    :v-loading="false"
    element-loading-text="'加载中...'"
  >
    <div class="head" v-if="current === 'disk'">
      <OrgIcons store selected />
      <span>关系</span>
    </div>
    <div class="head" v-else>
      <el-icon  class="back" @click="setCurrents()"><ArrowLeft /></el-icon>
      <EntityIcon :entity="current.metadata" :size="22" />
      <span>{{current.name}}</span>
    </div>
    <DirectoryViewer
      extraTags
      :initTags="['全部']"
      :selectFiles="[]"
      :currentTag="currentTag"
      :focusFile="focusFile"
      :content="getContent()"
      :tagChanged="(t) => setCurrentTag(t)"
      :fileOpen="(entity, dblclick) => clickHanlder(entity as IFile, dblclick)"
      :contextMenu="(entity) => contextMenu(entity as IWorkTask)"
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
  .back{
    margin-right: 20px;
  }
}
.directory-viewer {
  height: 100%;
}
.book {
  height: 100%;
}
</style>
