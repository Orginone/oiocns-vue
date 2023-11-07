<script setup lang="ts">
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue';
import { onKeyDown } from '@vueuse/core';
// import { Select } from 'antd';
// import React, { memo, useEffect, useState } from 'react';


const props = defineProps<{
  /** 引用成员列表 */
  people: Array<any> 
  onSelect?: any
  editRef?: any
}>()

const { people, onSelect} = props;
const select = ref(people[0])
// TODO:聚焦
const selectRef = ref(null)
onMounted(()=>{
  props.editRef.blur()
})

// 回车选择
const onKeyDown = (e:any)=>{
  console.log(11111);
  
  e.stopPropagation;
  e.preventDefault;
  console.log(1111);
  onSelect(select.value)
}

</script>

<template>
  <ElPopover 
    :visible="true" 
    :teleported="false" 
    placement="top-start" 
    :show-arrow="false"
    :width="200"
    :popper-style="{padding: '4px 0'}"
  >
    <template #reference>
      <div></div>
    </template>
    <input type="text">
    <ul  class="select" @keydown="console.log(22222)">
      <li 
        v-for="item in people" :key="item.id" 
        :class="item.id===select.id?'option optionSelected':'option'"
        @mouseenter="select=item"
        @click="onSelect(item)"
      >
        <EntityIcon :entityId="item.id" :size="30" />
        <strong style="margin-left: 6px;">{{item.name}}</strong>
      </li>
    </ul>
  </ElPopover>
</template>

<style lang="scss" scoped>
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
