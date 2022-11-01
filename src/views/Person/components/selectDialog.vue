<template>
  <el-dialog append-to-body v-model="dialogShow.value" title="加入单位" width="30%">
    <el-select
      v-model="value"
      filterable
      remote
      reserve-keyword
      placeholder="搜索单位"
      :remote-method="remoteMethod"
      :loading="loading"
      style="width: 100%"
    >
      <el-option
        v-for="item in options"
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
    }
  })
  interface ListItem {
    value: string
    label: string
  }

  const value = ref('')
  const options = ref<ListItem[]>([])
  const loading = ref(false)
  const emit = defineEmits(['closeDialog', 'switchCreateCompany'])

  const remoteMethod = (query: string) => {
    if (query) {
      $services.company
        .searchCompany({
          data: {
            text: query,
            offset: 0,
            limit: 10
          }
        })
        .then((res: ResultType) => {
          if (res.data.result) {
            let states = res.data.result
            let arr: { value: any; label: any }[] = []
            states.forEach((el: any) => {
              let obj = {
                value: el.id,
                label: el.name
              }
              arr.push(obj)
            })
            options.value = arr
            loading.value = false
          } else {
            options.value = []
            loading.value = false
          }
        })
    } else {
      options.value = []
    }
  }

  const submit = () => {}
  const closeDialog = () => {
    emit('closeDialog', 'join')
  }
</script>

<style scoped></style>
