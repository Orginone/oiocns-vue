<template>
    <div class="use-dept">
        <DiyTable :style="{ width: '100%' }" ref="diyTable" :tableHead="tableHead" :tableData="tableData"
            :options="options" @selectionChange="selectionChange">
        </DiyTable>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, Ref } from 'vue';
import DiyTable from "@/components/diyTable/index.vue";
import $services from "@/services";
import { useAsyncComputed } from '@/hooks/useAsyncComputed';
import { chatCtrl as chat} from '@/ts/coreIndex';

const tableData = ref<any[]>([])
onMounted(async () => {
    const res = await $services.company.getAssignedJobs({
        data: {
            offset: 0,
            limit: 20
        }
    });
    tableData.value = res.data.result || [];
    const rows: Ref<any>[] = tableData.value.map(d => ref<any>(d));
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
        label: '工作组编码',
    },
    {
        prop: 'name',
        label: '工作组名称',
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