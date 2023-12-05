<script setup lang="ts">
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue';
// import { Select } from 'antd';
// import React, { memo, useEffect, useState } from 'react';


const props = defineProps<{
  /** 引用成员列表 */
  people: Array<any> 
  /** 选择回调 */
  onSelect?: any
}>()

const { people, onSelect} = props;
const select = ref<string>()
const selectRef = ref(null)
onMounted(()=>{
  selectRef.value.focus()
})



</script>

<template>
  {{ select }}
  <ElSelect v-model="select" ref="selectRef" placement="top" automatic-dropdown @change="onSelect(people.find((p) => p.id === select))">
    <el-option
      v-for="item in people"
      :key="item.id"
      :value="item.id"
    >
        <EntityIcon :entityId="item.id" showName />
    </el-option>
  </ElSelect>
</template>

<style lang="scss" scoped>
.el-select {
  height: 0;
  width: 200px;
  overflow: hidden;
}


.select {
  max-height: 220px;
  overflow: auto;
  display: flex;
  flex-direction: column;

  .option {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 5px 12px;
    cursor: pointer;
    &Selected {
      background-color: #f2f4f9;
    }
  }
}

</style>
