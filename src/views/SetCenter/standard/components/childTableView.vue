<template>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    :closable="isEdit"
    @tab-remove="removeTab"
  >
    <el-tab-pane
      v-for="item in props.childTableData"
      :key="item.code"
      :label="item.name"
      :name="item.code"
    >
      <DxTable v-if="item.tableHead" :tableHead="item.tableHead" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
export default {
  name: "ChildTableView",
};
</script>

<script setup lang="ts">
import { userCtrl as user, thingCtrl as thing } from "@/ts/coreIndex";
import DxTable from '@/components/diyDxTable/index.vue'

const props = defineProps<{
  childTableData: any[];
  activeChildTable: string;
  speciesTree: any[];
  isEdit: boolean;
}>();
const emit = defineEmits(["update:childTableData", "update:activeChildTable"]);

const editableTabsValue = ref("");
editableTabsValue.value = props.childTableData[0].code;

watch(
  () => props.activeChildTable,
  (val) => {
    editableTabsValue.value = val;
  }
);

watch(
  () => props.childTableData,
  (val) => {
    val.forEach(async (item) => {
      if (!item.tableHead) {
        const tableHead = [];
        for (let i = 0; i < item.containSpecies.length; i++) {
          let { result: res } = await thing.getChildTableAttrs(
            item.speciesIds[i],
            user.space.id
          );
          res = res.filter(item => item.name !=='唯一标识')
          const temp = { id: item.containSpecies[i].id, name: item.containSpecies[i].name, children: res };
          tableHead.push(temp);
        }
        item.tableHead = tableHead
      }
    });
  },
  { deep: true, immediate: true }
);

const removeTab = (targetName: any) => {
  console.log(targetName);

  const tabs = props.childTableData;
  let activeName = editableTabsValue.value;
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.code === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          activeName = nextTab.name;
        }
      }
    });
  }

  editableTabsValue.value = activeName;
  const tempTabs = tabs.filter((tab) => tab.code !== targetName);
  emit("update:childTableData", tempTabs);
};
</script>

<style lang="scss" scoped></style>
