<template>
  <section>
    <v-form-designer
      ref="vfDesigner"
      :banned-widgets="banned"
      :designer-config="designerConfig"
    >
      <template #customToolButtons>
        <el-button link type="primary" @click="saveFormJson">保存</el-button>
        <el-button link type="primary" @click="$router.go(-1)">返回</el-button>
      </template>
    </v-form-designer>
  </section>
</template>

<script lang="ts">
export default {
  name: "VFormDemo",
};
</script>

<script setup lang="ts">
const banned = ["button", "divider", "html-text"];
const designerConfig = {
  languageMenu: false,
  externalLink: false,
  // formTemplates: false, // 禁止表单模版
  // eventCollapse: false, // 禁止表单和组件的事件
  toolbarMaxWidth: 530,
};

const vfDesigner = ref<any>(null);
const saveFormJson = () => {
  const formJson = vfDesigner.value.getFormJson();
  console.log(formJson);
};
</script>

<style lang="scss" scoped></style>
