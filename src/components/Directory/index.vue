<script setup lang="ts">

// import DirectoryViewer from './views'
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
// import useTimeoutHanlder from '@/hooks/useTimeoutHanlder'
import { IDirectory, IFile } from '@/ts/core';
import { loadFileMenus } from '@/executor/fileOperate';
import { command } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import useAsyncLoad from '@/hooks/useAsyncLoad';
// import { Spin } from 'antd';
import { cleanMenus } from '@/utils/tools';

const props = defineProps<{
  dialog?: boolean;
  accepts?: string[];
  selects?: IFile[];
  excludeIds?: string[];
  previewFlag: string;
  onFocused?: (file: IFile | undefined) => void;
  onSelected?: (files: IFile[]) => void;
  current: IDirectory | undefined | 'disk';
}>()

</script>

<template>
TODO:Directory
</template>

<style lang="scss" scoped>

</style>
