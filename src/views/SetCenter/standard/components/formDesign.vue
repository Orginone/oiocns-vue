<template>
  <section>
    <v-form-designer
      ref="vfDesigner"
      :banned-widgets="banned"
      :designer-config="designerConfig"
      :childTableData="childTableData"
      :attrList="attrList"
    >
      <template #customToolButtons>
        <el-button link type="primary" @click="childTableSetDialog = true"
          >子表设置</el-button
        >
        <el-button link type="primary" @click="preivewDialog = true"
          >预览</el-button
        >
        <el-button link type="primary" @click="saveFormJson">保存</el-button>
        <el-button link type="primary" @click="$router.go(-1)">返回</el-button>
      </template>
      <template #childTable>
        <ChildTableView
          v-if="childTableData.length"
          :isEdit="true"
          :speciesTree="speciesTree"
          v-model:childTableData="childTableData"
          v-model:activeChildTable="activeChildTable"
        />
      </template>
    </v-form-designer>
    <ChildTableSet
      v-if="childTableSetDialog"
      v-model:dialog="childTableSetDialog"
      :speciesTree="speciesTree"
      :activeFormSetData="activeFormSetData"
      @setChildTableData="setChildTableData"
    />
    <Preview
      v-if="preivewDialog"
      v-model:dialog="preivewDialog"
      :childTableData="childTableData"
      :formJson="vfDesigner.getFormJson()"
    />
  </section>
</template>

<script lang="ts">
export default {
  name: "VFormDesign",
};
</script>

<script setup lang="ts">
import { setCenterStore } from "@/store/setting";
import { userCtrl as user } from "@/ts/coreIndex";
import ChildTableSet from "./childTableSet.vue";
import ChildTableView from "./childTableView.vue";
import { useAnyData } from "@/store/anydata";
import { thingCtrl as thing } from "@/ts/coreIndex";
import { getFiedlByReact, initWidgetList } from "./getFieldByReact";
import Preview from "./preview.vue";

const anyStoreData = useAnyData();
const store: any = setCenterStore();

const activeFormSetData = anyStoreData.activeFormSetData;

const currentData = computed(() => {
  return store.currentSelectItme;
});

const banned = ["button", "divider", "html-text"];
const designerConfig = {
  languageMenu: false,
  externalLink: false,
  formTemplates: false, // 禁止表单模版
  eventCollapse: false, // 禁止表单和组件的事件
  toolbarMaxWidth: 530,
  resetFormJson: true,
  previewFormButton: false,
};

const vfDesigner = ref<any>(null);

const saveFormJson = async () => {
  const formJson = vfDesigner.value.getFormJson();
  saveFormJsonInRemark(formJson);
  const params = {
    ...activeFormSetData,
    items: [...getAttrByFormat(formJson.widgetList), ...childTableData.value],
  };

  const createParams = {
    spaceId: user.space.id,
    operationId: activeFormSetData.id,
    operationItems: [
      ...getAttrByFormat(formJson.widgetList),
      ...childTableData.value,
    ],
  };
  await thing.setDesign(params, createParams);
  ElMessage.success("保存成功");
};

const saveFormJsonInRemark = (formJson: any) => {
  const remark = JSON.parse(activeFormSetData.remark);
  remark.fromByVue = JSON.stringify(formJson);
  activeFormSetData.remark = JSON.stringify(remark);
};

const getAttrByFormat = (widgetList: any) => {
  const attrFields = getAttrFields(widgetList);
  const attrByFormat = attrFields.map((item: any) => {
    return {
      id: item.basic.id,
      name: item.basic.name,
      code: item.basic.code,
      belongId: activeFormSetData.belongId,
      operationId: activeFormSetData.id,
      attrId: item.basic.attrId || item.basic.id,
      attr: item.basic,
      rule: JSON.stringify(getAttrRule(item)),
    };
  });

  return attrByFormat;
};

const getAttrRule = (item: any) => {
  return {
    title: item.basic.name,
    type: "string",
    widget: item.adaptType,
    required: false,
    readOnly: false,
    hidden: false,
    placeholder: "",
  };
};

const getAttrFields = (list: any) => {
  const attrFields: any = [];
  getAttrFieldFromGrid(list, attrFields);
  return attrFields;
};

const getAttrFieldFromGrid = (list: any, attrFields: any) => {
  list.map((col: any) => {
    if (col.category) {
      getAttrFieldFromGrid(
        col.type === "grid-col" ? col.widgetList : col.cols,
        attrFields
      );
    } else {
      col.options.fromAttr && attrFields.push(col);
    }
  });
};

const attrList = ref<any>(null);
const attrDictionary = ref<any>(null);
const childTableSetDialog = ref<boolean>(false);

const loadSpeciesAttrs = async (species: any) => {
  const page = {
    offset: 0,
    limit: 100000,
  };
  const res = await species.loadAttrs(user.space.id, true, true, page);
  if (res.result) {
    attrDictionary.value = res.result;
  }
};

const speciesTree = ref<any>([]);
const loadSpeciesTree = async () => {
  const species = await user.space.loadSpeciesTree();
  speciesTree.value = species.children;
};

const childTableData = ref<any>([]);
const activeChildTable = ref<any>("");
const fieldsByReact = ref<any>(null);
const setChildTableData = (val: any) => {
  childTableData.value.push(val);
  activeChildTable.value = val.code;
};

const getChildTableData = async () => {
  const params = {
    id: activeFormSetData.id,
    spaceId: user.space.id,
    page: {
      offset: 0,
      limit: 10000,
      filter: "",
    },
  };
  const { data: res } = await thing.getOperationItems(params);
  let tempChildTableData: any = [];
  if (res.result) {
    tempChildTableData = res.result.filter((item: any) => item.containSpecies);
  }

  tempChildTableData.forEach((data: any) => {
    data.speciesIds = data.containSpecies.map((item: any) => item.id);
  });
  childTableData.value = tempChildTableData;

  let tempFieldData: any = [];
  if (res.result) {
    tempFieldData = res.result.filter((item: any) => !item.containSpecies);
  }
  const fieldsFilterFromDic: any = [];
  tempFieldData.map((item: any) => {
    const tempField = attrDictionary.value.filter(
      (attrItem: any) => attrItem.id === item.attrId
    )[0];
    tempField && fieldsFilterFromDic.push(tempField);
  });
  fieldsByReact.value = tempFieldData;
};

const isReactChangeField = () => {
  const remark = JSON.parse(activeFormSetData.remark);
  if (remark.fromByVue) {
    const { widgetList } = JSON.parse(remark.fromByVue);
    const fieldsFromVue = getAttrByFormat(widgetList);
    return fieldsFromVue.length === fieldsByReact.value.length;
  }
  return false;
};

const preivewDialog = ref(false);

onMounted(async () => {
  await loadSpeciesTree();
  await loadSpeciesAttrs(currentData.value);
  await getChildTableData();
  const remark = JSON.parse(activeFormSetData.remark);
  if (isReactChangeField()) {
    vfDesigner.value.setFormJson(JSON.parse(remark.fromByVue));
  } else {
    /**
     * 格式化从 react 创建的表单字段
     */
    const formJson = initWidgetList();
    fieldsByReact.value.map((field: any) => {
      const tempField = getFiedlByReact(field);
      formJson.widgetList.push(tempField);
    });
    vfDesigner.value.setFormJson(formJson);
  }
  attrList.value = attrDictionary.value;
});
</script>

<style lang="scss" scoped></style>
