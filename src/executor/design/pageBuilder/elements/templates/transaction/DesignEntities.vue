<script setup lang='ts'>
import { Enumerable } from '@/ts/base/common/linq'
import { kernel, schema } from '@/ts/base'
const props = defineProps<{
  size: number
  content: any
  span: number
}>()
const page = ref<number>(1)
const size = ref<number>(props.size)
</script>

<template>
  <!-- TODO:witdh不行试试fill -->
  <ElSpace style="width: 100%" direction="vertical">
    <ElRow :gutter="16">
      <template
        v-for="(_,index) in Enumerable.Range(1, size).ToArray()" :key="index"
      >
         <ElCol v-if="content" class="contentCard"
          :span="span" 
         >
          <ElSpace style="width: 100%;" direction="vertical">
            {{content({ data: {} as schema.XThing })}}
          </ElSpace>
        </ElCol>
        <ElEmpty v-else description='未放置组件' />
      </template>
    </ElRow>
    <div class="page">
      <ElPagination
        layout="prev, pager, next"
        :total="size * 5"
        background
        :current-page="page"
        :page-size="size"
      />
    </div>
  </ElSpace>
</template>

<style lang='scss' scoped>
.page {
  display: flex;
  justify-content: center;
}

</style>