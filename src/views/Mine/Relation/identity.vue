<template>
    <div class="use-dept">
      <DiyTable :style="{ width: '100%' }" ref="diyTable" 
        :tableHead="tableHead"
        :tableData="tableData" 
        :options="options" 
        @selectionChange="selectionChange">
      </DiyTable>
    </div>
  </template>
  <script setup lang="ts">
  import { reactive, ref, onMounted, computed, Ref } from 'vue';
  import DiyTable from "@/components/diyTable/index.vue";
  import { useUserStore } from "@/store/user";
  import { storeToRefs } from "pinia";
  import { chatCtrl as chat} from '@/ts/coreIndex';
import _ from 'lodash';
import { useAsyncComputed } from '@/hooks/useAsyncComputed';

  const store = useUserStore();
  const { queryInfo } = storeToRefs(store);
  const tableData = ref<any[]>([])
  onMounted(() => {
    tableData.value = _.cloneDeep(queryInfo.value.identitys);
    const rows: Ref<any>[] = tableData.value.map(d => ref(d));
    for (const row of rows) {
      useAsyncComputed(row, "belongId", "belongName", async v => chat.getName(v))
    }
  })
  
  const options = ref<any>({
    checkBox: true,
    order: true,
    selectLimit: 1,
    defaultSort: { prop: 'createTime', order: 'descending' },
    treeProps: {
      children: 'children',
      hasChildren: 'hasChildren'
    }
  })
  const tableHead = ref([
    {
      prop: 'code',
      label: '岗位编码',
    },
    {
      prop: 'name',
      label: '岗位名称',
    },
    {
      prop: 'belongName',
      label: '归属',
    },
    {
      prop: 'remark',
      label: '简介',
    },
    {
      type: 'slot',
      label: '操作',
      fixed: 'right',
      align: 'center',
      width: '150',
      name: 'operate'
    }
  ])
  
  
  const checkList = ref<any[]>([]);
  function selectionChange(val: any) {
    checkList.value = val
  }
  </script>