<template>
  <section>
    <v-form-designer
      ref="vfDesigner"
      :banned-widgets="banned"
      :designer-config="designerConfig"
      :attrList="attrList"
    >
      <template #customToolButtons>
        <el-button link type="primary" @click="childTableSetDialog = true">子表设置</el-button>
        <el-button link type="primary" @click="saveFormJson">保存</el-button>
        <el-button link type="primary" @click="$router.go(-1)">返回</el-button>
      </template>
    </v-form-designer>
    <ChildTableSet v-if="childTableSetDialog" v-model:dialog="childTableSetDialog" />
  </section>
</template>

<script lang="ts">
export default {
  name: "VFormDemo",
};
</script>

<script setup lang="ts">
import { setCenterStore } from "@/store/setting";
import { userCtrl as user } from "@/ts/coreIndex";
import ChildTableSet from './childTableSet.vue'

const store: any = setCenterStore();

const currentData = computed(() => {
  return store.currentSelectItme;
});

const attrList = ref<any>(null);

const childTableSetDialog = ref<boolean>(false)

const loadSpeciesAttrs = async (species: any) => {
  const page = {
    offset: 0,
    limit: 100000,
  };
  const res = await species.loadAttrs(user.space.id, true, true, page);
  if (res.result) {
    attrList.value = res.result;
  }
};

const loadSpeciesTree = async () => {
  const species = await user.space.loadSpeciesTree()
  console.log(species);
  
}

onMounted(() => {
  loadSpeciesTree() 
  loadSpeciesAttrs(currentData.value);
});

const banned = ["button", "divider", "html-text"];
const designerConfig = {
  languageMenu: false,
  externalLink: false,
  // formTemplates: false, // 禁止表单模版
  // eventCollapse: false, // 禁止表单和组件的事件
  toolbarMaxWidth: 600,
};

const vfDesigner = ref<any>(null);
const saveFormJson = () => {
  const formJson = vfDesigner.value.getFormJson();
  console.log(formJson);
};
</script>

<style lang="scss" scoped></style>
