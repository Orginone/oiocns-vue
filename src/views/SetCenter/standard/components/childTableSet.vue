<template>
  <el-dialog
    v-model="show"
    title="请选择类别作为子类"
    width="576px"
    :before-close="handleClose"
  >
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" status-icon>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="子表名称" prop="name">
            <el-input
              v-model="ruleForm.name"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="子表编码" prop="code">
            <el-input
              v-model="ruleForm.code"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-tree
      ref="treeRef"
      :data="speciesTree"
      node-key="id"
      check-strictly
      show-checkbox
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave(ruleFormRef)"
          >确定</el-button
        >
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
import { userCtrl as user } from "@/ts/coreIndex";

const props = defineProps({
  dialog: Boolean,
  speciesTree: Array,
  activeFormSetData: Object
});

const emit = defineEmits(["update:dialog", "setChildTableData"]);

const show = ref(false);

const ruleFormRef = ref(null);
const ruleForm = ref({
  name: "",
  code: "",
});
const rules = reactive({
  name: [{ required: true, message: "请输入子表名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入子表代码", trigger: "blur" }],
});

const treeRef = ref(null);
const getCheckedNodes = () => {
  const tempChecked = treeRef.value.getCheckedNodes();
  return tempChecked.map((item: any) => item.target);
};
const getFinalChildTableData = () => {
  const checkedNodes = getCheckedNodes();
  return {
    containSpecies: checkedNodes,
    speciesIds: checkedNodes.map((item: any) => item.id),
    name: ruleForm.value.name,
    code: ruleForm.value.code,
    belongId: user.space.id,
    operationId: props.activeFormSetData.Id,
    rule: "{}",
  };
};

const handleClose = () => {
  show.value = false;
  setTimeout(() => {
    emit("update:dialog", false);
  }, 500);
};

const handleSave = async (formEl: any) => {
  if (!formEl) return;
  await formEl.validate((valid: any) => {
    if (valid) {
      const childTableData = getFinalChildTableData();
      emit("setChildTableData", childTableData);
      handleClose();
    }
  });
};

onMounted(() => {
  show.value = props.dialog;
});
</script>

<style lang="scss" scoped></style>
