<template>
  <el-dialog
    v-model="show"
    title="预览"
    width="768px"
    :before-close="handleClose"
  >
    <VFormRender ref="preForm" :form-json="formJson" :preview-state="true">
    </VFormRender>
    <ChildTableView
      v-if="childTableData.length"
      :isEdit="false"
      activeChildTable="-1"
      :speciesTree="[]"
      :childTableData="childTableData"
    />
  </el-dialog>
</template>

<script lang="ts">
export default {
  name: "Preview",
};
</script>

<script setup lang="ts">
import ChildTableView from './childTableView.vue'
const props = defineProps({
  dialog: Boolean,
  childTableData: Array,
  formJson: Object,
});
const emit = defineEmits(["update:dialog"]);

const show = ref(false);

const handleClose = () => {
  show.value = false;
  setTimeout(() => {
    emit("update:dialog", false);
  }, 500);
};

onMounted(() => {
  show.value = props.dialog;
});
</script>

<style lang="scss" scoped></style>
