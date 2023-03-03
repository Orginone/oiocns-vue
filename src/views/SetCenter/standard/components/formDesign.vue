<template>
  <section>
    <v-form-designer
      ref="vfDesigner"
      :banned-widgets="banned"
      :designer-config="designerConfig"
      :attrList="attrList"
    >
      <template #customToolButtons>
        <el-button link type="primary" @click="childTableSetDialog = true"
          >子表设置</el-button
        >
        <el-button link type="primary" @click="saveFormJson">保存</el-button>
        <el-button link type="primary" @click="$router.go(-1)">返回</el-button>
      </template>
      <template #childTable>
        <ChildTableView v-if="childTableData.length" v-model:childTableData="childTableData" v-model:activeChildTable="activeChildTable" />
      </template>
    </v-form-designer>
    <ChildTableSet
      v-if="childTableSetDialog"
      v-model:dialog="childTableSetDialog"
      :speciesTree="speciesTree"
      @setChildTableData="setChildTableData"
    />
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
import ChildTableSet from "./childTableSet.vue";
import ChildTableView from './childTableView.vue'

const store: any = setCenterStore();

const currentData = computed(() => {
  return store.currentSelectItme;
});

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

const attrList = ref<any>(null);
const childTableSetDialog = ref<boolean>(false);

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

const speciesTree = ref<any>([]);
const loadSpeciesTree = async () => {
  const species = await user.space.loadSpeciesTree();
  speciesTree.value = species.children;
};

const childTableData = ref<any>([])
const activeChildTable = ref<any>("")
const setChildTableData = (val: any) => {
  console.log(val);
  childTableData.value.push(val)
  activeChildTable.value = val.code
};

onMounted(() => {
  loadSpeciesTree();
  loadSpeciesAttrs(currentData.value);
});
</script>

<style lang="scss" scoped></style>
