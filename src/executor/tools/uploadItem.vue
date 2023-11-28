<template>
  <div>
    <el-space>
      <el-avatar :size="64">
        <template #default>
          <el-image v-if="avatar" style="background: '#f9f9f9', color: '#606060', font-size: 10px" :src="avatar" />
          
        </template>
      </el-avatar>
    </el-space>
  </div>
</template>

<script setup lang="ts">
import { model, parseAvatar } from '@/ts/base';
import { IDirectory } from '@/ts/core';

// 接收参数
const props = defineProps<{
  icon: string;
  typeName: string;
  directory: IDirectory;
  readonly?: boolean;
  onChanged: (icon: string) => void;
}>()

let avatar = ref<model.FileItemShare | undefined>(
  parseAvatar(props.icon),
)

</script>

<script lang="ts">
export default {
  name: "UploadItem",
}
</script>

<style lang="scss" scoped>

</style>