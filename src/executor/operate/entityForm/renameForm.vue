<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="重命名"
      width="300"
      destroy-on-close
      show-close="false"
      :before-close="handleClose"
    >
      <el-input type="text" v-model="value" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="finished()">取消</el-button>
          <el-button type="primary" @click="onOk">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
  
<script lang="ts" setup>
import { IFile } from '@/ts/core';

// 接收参数
const props = defineProps<{
  file: IFile;
  finished: () => void;
}>()

let value = ref('')
const dialogVisible = ref(false)

const onOk = () => {
  if ('rename' in props.file) {
    props.file.rename(value).then(() => {
      props.finished();
    });
  }
}

onMounted(()=>{
  value.value = props.file.name
  dialogVisible.value = true
})
</script>

<style scoped>

</style>
