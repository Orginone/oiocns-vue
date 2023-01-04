<template>
  <el-dialog
    v-model="show"
    title="首页配置"
    width="568px"
    :before-close="handleClose"
  >
    <diytab
      :style="{ width: '100%' }"
      ref="diyTable"
      :tableData="tableData"
      :tableHead="tableHead"
      :options="{ noPage: true }"
    >
      <template #operate="scope">
        <el-button type="primary" text @click="handleSave(scope.row)">应用</el-button>
      </template>
    </diytab>
  </el-dialog>
</template>

<script lang="ts">
export default {
  name: "setIndexDialog",
};
</script>

<script setup lang="ts">
import { ref, defineProps, onMounted } from "vue";
import diytab from "@/components/diyTable/index.vue";
import { portalCtrl, logger } from "@/ts/coreIndex";
import { useUserStore } from "@/store/user";
import { useAnyData } from '@/store/anydata'

const store = useUserStore();
const otherStore = useAnyData();
const props = defineProps<{
  dialogShow: { key: string; value: boolean };
}>();

const tableHead = [
  {
    prop: "schemaName",
    label: "方案名称",
  },
  {
    type: "slot",
    label: "操作",
    fixed: "right",
    align: "center",
    width: "150",
    name: "operate",
  },
];

const tableData = ref([]);

/**
 * 查询方案
 */
const getSchema = async () => {
  const params = {
    workspaceId: store.workspaceData.id,
    skip: 0,
    limit: 9999,
  };
  const res = await portalCtrl.getPortal(params);
  tableData.value = res.data;
  tableData.value.unshift({
    schemaName: '默认配置'
  })
};

const show = ref<boolean>(false);

const handleClose = () => {
  show.value = false;
  setTimeout(() => {
    props.dialogShow.value = false;
  }, 500);
};

const handleSave = (val: any) => {
  if(val.schemaName === '默认配置') {
   otherStore.setDefaultLayout(true); 
  } else {
    otherStore.setDefaultLayout(false);
    otherStore.setUsingSchema(val)
  }
  handleClose();
};

onMounted(() => {
  show.value = props.dialogShow.value;
  getSchema();
});
</script>

<style lang="scss" scoped></style>
