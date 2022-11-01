<template>
  <el-dialog append-to-body v-model="dialogShow.value" :title="title" width="30%">
    <el-select
      v-model="value"
      filterable
      remote
      reserve-keyword
      :placeholder="placeholder"
      :remote-method="remoteMethod"
      :loading="loading"
      style="width: 100%"
    >
      <el-option
        v-for="item in state.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import $services from '@/services'
  import { ElMessage } from 'element-plus'

  const props = defineProps({
    dialogShow: {
      type: Object
    },
    title: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  })
  const state = reactive({
    options: []
  })
  const value = ref('')
  // const options = ref<ListItem[]>([])
  const loading = ref(false)
  const emit = defineEmits([
    'closeDialog',
    'switchCreateCompany',
    'remoteMethod',
    'joinSubmit',
    'submit'
  ])

  const remoteMethod = (query: string) => {
    if (query) {
      emit('remoteMethod', query, (res: Array<object>) => {
        if (res.length > 0) {
          state.options = res
          loading.value = false
        } else {
          state.options = []
          loading.value = false
        }
      })
    } else {
      state.options = []
    }
  }

  const submit = () => {
    emit('submit', value.value)
  }
  const closeDialog = () => {
    emit('closeDialog', props.dialogShow)
  }
</script>

<style scoped></style>
