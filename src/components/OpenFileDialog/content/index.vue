<script setup lang="ts">
import DirectoryViewer from '@/components/Directory/views/index.vue'
import useCtrlUpdate from '@/hooks/useCtrlUpdate'
import useTimeoutHanlder from '@/hooks/useTimeoutHanlder'
import { IDirectory, IFile } from '@/ts/core'
import { loadFileMenus } from '@/executor/fileOperate'
import { command } from '@/ts/base'
import orgCtrl from '@/ts/controller'
import useAsyncLoad from '@/hooks/useAsyncLoad'
import { cleanMenus } from '@/utils/tools'

const props = defineProps<{
  dialog?: boolean
  /** 可选文件类型 */
  accepts?: string[];
  selects?: IFile[];
  excludeIds?: string[];
  //** 预览区标识 */
  previewFlag?: string;
  onFocused?: (file: IFile | undefined) => void;
  onSelected?: (files: IFile[]) => void;
  current: IDirectory | undefined | 'disk';
}>()

  
  const dircetory=ref<IDirectory>(props.current === 'disk' ? orgCtrl.user.directory : props.current)
  const [key] = useCtrlUpdate(dircetory.value)
  const [loaded] = useAsyncLoad(() => dircetory.value.loadContent())
  const focusFile=ref<IFile>()
  const [submitHanlder,clearHanlder]=useTimeoutHanlder()
 
  // 当聚焦的文件变化时，触发预览文件命令
  watch(focusFile,(v) => {
    if (props.previewFlag) {
      command.emitter('preview', props.previewFlag, v);
    }
  })

  const contextMenu = (file?: IFile) => {
    var entity = file || dircetory.value;
    if ('targets' in entity) {
      entity = entity.directory;
    }
    return {
      items: cleanMenus(loadFileMenus(entity)) || [],
      onClick: ({ key }: { key: string }) => {
        command.emitter('executor', key, entity, dircetory.value.key);
      },
    };
  }

  const fileOpen = (file: IFile | undefined) => {
    if (file && props.dialog !== true) {
      if (!file.groupTags.includes('已删除')) {
        if (props.previewFlag === undefined && 'standard' in file) {
          command.emitter('executor', 'open', dircetory);
        } else {
          command.emitter('executor', 'open', file);
        }
      }
    }
  }

  /**
   * 选择文件
   * @param file 文件
   * @param selected 是否选中
   */
  const selectHanlder = (file: IFile, selected: boolean) => {
    if (props?.onSelected) {
      if (selected) {
        props.onSelected([...props.selects, file]);
      } else {
        props.onSelected(props.selects.filter((i) => i.key !== file.key));
      }
    }
  }

  const fileFocused = (file: IFile | undefined) => {
    if (file) {
      if (focusFile.value && file.key === focusFile.value.key) {
        return true;
      }
      return props.selects?.find((i) => i.key === file.key) !== undefined;
    }
    return false;
  }

  const focusHanlder = (file: IFile | undefined) => {
    const focused = fileFocused(file)
    if (focused) {
      focusFile.value = undefined
      props.onFocused?.apply(this, [undefined]);
    } else {
      focusFile.value = file
      props.onFocused?.apply(this, [file])
    }
    if (file && props.onSelected) {
      selectHanlder(file, !focused);
    }
  }

  const clickHanlder = (file: IFile | undefined, dblclick: boolean) => {
    if (dblclick) {
      clearHanlder();
      fileOpen(file);
    } else {
      submitHanlder(() => focusHanlder(file), 200);
    }
  }

  // 文件数据
  const contents = computed(() => {
    const contents: IFile[] = [];
    if (props.current === 'disk') {
      contents.push(
        orgCtrl.user.directory,
        ...orgCtrl.user.companys.map((i) => i.directory),
      );
    } else {
      contents.push(...props.current!.content());
    }
    
    
    return contents;
  })

</script>

<template>
  <div class="directory-viewer" v-if="current" :v-loading="!loaded" element-loading-text="'加载中...'">
    <DirectoryViewer
      :key="key"
      extraTags
      :initTags="['全部']"
      :accepts="accepts"
      :excludeIds="excludeIds"
      :selectFiles="selects || []"
      :focusFile="focusFile"
      :content="contents"
      :fileOpen="(entity, dblclick) => clickHanlder(entity as IFile, dblclick)"
      :contextMenu="(entity) => contextMenu(entity as IFile)"
    />
  </div>
</template>

<style lang="scss" scoped>
.directory-viewer {
  height: 100%;
}
</style>