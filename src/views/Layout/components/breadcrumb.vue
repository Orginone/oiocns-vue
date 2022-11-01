<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
      <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
let breadList = null
watch(
  () => router.currentRoute.value,
  (newValue, oldValue) => {
    console.log('====', newValue)
    nextTick(() => {
      getData(newValue)
    })
  },
  { immediate: true }
)
let getData = (data: any) => {
  console.log('2222', data)
}
</script>

<style lang="scss" scoped>
:deep(.el-breadcrumb) {
  margin-top: 16px;
  margin-left: 32px;
}
</style>