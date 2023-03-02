<template>
  <el-dialog
    v-model="show"
    title="请选择类别作为子类"
    width="576px"
    :before-close="handleClose"
  >
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
export default {
  name: "ChildTableSet",
};
</script>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps({
  dialog: Boolean,
});

const emit = defineEmits(["update:dialog"]);

const show = ref(false);

const handleClose = () => {
  show.value = false;
  setTimeout(() => {
    emit("update:dialog", false);
  }, 500);
};

const handleSave = () => {
  handleClose();
};

onMounted(() => {
  show.value = props.dialog;
});
</script>

<style lang="scss" scoped></style>
