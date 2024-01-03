<script lang="ts" setup>
// import SchemaForm from '@/components/SchemaForm';
import { IDirectory, IForm } from "@/ts/core";
// import UploadItem from '../../tools/uploadItem';
// import { EntityColumns } from './entityColumns';
import { schema } from "@/ts/base";

// 接收参数
const props = defineProps<{
  formType: string;
  typeName: string;
  current: IDirectory | IForm;
  finished: () => void;
}>();

let title = ref("");
let directory: IDirectory;
let form: IForm | undefined;
const readonly = props.formType === "remark";
let initialValue: any = props.current.metadata;
onMounted(() => {
  switch (props.formType) {
    case "new":
      title.value = "新建" + props.typeName;
      initialValue = {};
      directory = props.current as IDirectory;
      break;
    case "update":
      form = props.current as IForm;
      directory = form.directory;
      title.value = "更新" + props.typeName;
      break;
    case "remark":
      form = props.current as IForm;
      directory = form.directory;
      title.value = "查看" + props.typeName;
      break;
    default:
      return;
  }
});
</script>
<template>
  <el-dialog
    v-model="true"
    title="重命名"
    width="300"
    destroy-on-close
    show-close="false"
    :before-close="handleClose"
  >
    <ElCol :span="24" title="图标">
      <div class="col-content">
        <ElFormItem label="图标">
          <UploadItem
            :readonly="readonly"
            :typeName="typeName"
            :icon="initialValue.icon"
            :directory="props.current.directory"
            :onChanged="(icon) => (ruleForm.icon = icon)"
          />
        </ElFormItem>
      </div>
    </ElCol>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="finished()">取消</el-button>
        <el-button type="primary" @click="onOk">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped></style>
