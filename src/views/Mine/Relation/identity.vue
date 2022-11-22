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
  import { reactive, ref, onMounted, computed } from 'vue';
  import DiyTable from "@/components/diyTable/index.vue";
  import { useUserStore } from "@/store/user";
  import { storeToRefs } from "pinia";

  const store = useUserStore();
  const { queryInfo } = storeToRefs(store);
  const tableData = computed(() => queryInfo.value.identitys)
//   onMounted(async () => {
//     const res = await $services.company.getAssignedDepartments({
//       data: {
//         offset: 0,
//         limit: 20
//       }
//     });
//     tableData.value = res.data.result || [];
//   })
  
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
      prop: 'belongId',
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