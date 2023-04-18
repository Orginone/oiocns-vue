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
import { reactive, ref, onMounted, Ref } from 'vue';
import DiyTable from "@/components/diyTable/index.vue";
import $services from "@/services";
import { useAsyncComputed } from '@/hooks/useAsyncComputed';
import { chatCtrl as chat} from '@/ts/coreIndex';

import { Search } from '@element-plus/icons-vue'

const ready = ref(false);

const tableData = ref<any[]>([]);
const showSearch = ref(false);
const searchText = ref("");
async function loadData() {
  // const res = await $services.company.getAssignedDepartments({
  //   data: {
  //     offset: 0,
  //     limit: 20,
  //     filter: searchText.value || null
  //   }
  // });
  // tableData.value = res.data.result || [];
  // const rows: Ref<any>[] = tableData.value.map(d => ref<any>(d));
  // for (const row of rows) {
  //   useAsyncComputed(row, "belongId", "belongName", async v => chat.getName(v))
  // }  
}
onMounted(() => {
  loadData();

  setTimeout(() => {
    ready.value = true;    
  }, 100);
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
    label: '部门编码',
  },
  {
    prop: 'name',
    label: '部门名称',
  },
  {
    prop: 'belongName',
    label: '创建单位',
  },
  {
    prop: 'team.remark',
    label: '简介',
    width: '300'
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