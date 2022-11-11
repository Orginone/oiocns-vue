<template>
<el-drawer v-model="showSearchDrawer" @close="emit('update:showSearchDrawer', false)" direction="rtl" size="22%">
    <template #header>
        <h4 style="color: #505050">筛选</h4>
    </template>
    <template #default>
        <my-form 
            ref="myFormRef"
            :list="formList"
            @submitForm="searchPage"
        />
    </template>
    <template #footer>
        <div style="flex: auto">
        <el-button @click="handleReset">重置</el-button>
        <el-button color="#0f39d1" @click="handleFilter">筛选</el-button>
        </div>
    </template>
</el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import MyForm from './MyForm.vue'

const props = defineProps<{
    showSearchDrawer: boolean; 
}>()

const emit = defineEmits<{
    (e: 'update:showSearchDrawer', isShow: boolean): void
}>()

// 搜索表单信息
const formList: any[] = reactive([
  { label: '单据编号', propName: 'applyNumber', placeholder: '请输入' },
  { type: 'date-picker', label: '审核时间',  propName: 'startTime', pickerType: 'date', format: 'YYYY-MM-DD', valueFormat: 'YYYY-MM-DD', placeholder: '请选择日期' },
  { type: 'date-picker', label: '记账时间',  propName: 'startTime2',  pickerType: 'daterange', format: 'YYYY-MM-DD', valueFormat: 'YYYY-MM-DD' },
  { type: 'select', label: '处置方式', propName: 'status', placeholder: '请选择', options: [] },
  { type: 'select', label: '状态', propName: 'status', placeholder: '请选择', options: [] },
  { type: 'select', label: '接受状态', propName: 'status', placeholder: '请选择', options: [] },
  { type: 'select', label: '是否核销', propName: 'status', placeholder: '请选择', options: [] },
  ]
)
const myFormRef = ref()
// 重置搜索条件
const handleReset = () => {
  myFormRef.value.resetForm()
};
// 筛选条件
const handleFilter = () => {
  myFormRef.value.submitForm()
};
// 可以取到子组件传递过来的数据
const searchPage =  (ruleForm: any)=> {
  console.log(ruleForm, 'ruleForm');
}

</script>

<style lang="scss" scoped>

</style>