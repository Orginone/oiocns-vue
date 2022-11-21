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
import { reactive, ref, onMounted } from 'vue';
import DiyTable from "@/components/diyTable/index.vue";
import $services from "@/services";

const tableData = ref<any[]>([])
onMounted(async () => {
  const res = await $services.company.getAssignedDepartments({
    data: {
      offset: 0,
      limit: 20
    }
  });
  tableData.value = res.data.result || [];
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
    prop: 'belongId',
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