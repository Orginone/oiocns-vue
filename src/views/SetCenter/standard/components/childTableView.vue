<template>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    closable
    @tab-remove="removeTab"
  >
    <el-tab-pane
      v-for="item in props.childTableData"
      :key="item.code"
      :label="item.name"
      :name="item.code"
    >
      {{ item.speciesIds }}
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
export default {
  name: "ChildTableView",
};
</script>

<script setup lang="ts">
const props = defineProps<{
  childTableData: any[];
  activeChildTable: string;
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
