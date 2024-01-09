<template>
  <ElTabs :items="tabs">
    <ElTabPane name="uploading" label="上传中" >
      <ThingArchive :instances="Object.values(thingData.archives)" />,
    </ElTabPane> 
    <ElTabPane name="uploaded" label="已完成">
      <WorkFormViewer
        readonly
        :rules="[]"
        :changedFields="[]"
        :key="form.id"
        :form="form?.metadata"
        :fields="form.fields"
        :data="convertData()"
        :belong="form.directory.target.space"
      />
    </ElTabPane> 
  </ElTabs>
</template>

<script setup lang="ts"> 
import { ref } from 'vue';
import ThingArchive from './archive.vue'; 
import WorkFormViewer from '@/components/DataStandard/WorkForm/Viewer/index.vue';  
import { IForm } from '@/ts/core';
import { schema } from '@/ts/base';

const props = defineProps<{
  form: IForm;
  thingData: schema.XThing;
  onBack: () => void;
}>();
const tabs = ref([
  {
    key: '1',
    label: '归档痕迹',
  },
  {
    key: '2',
    label: '卡片信息',
  },
]);

const convertData = () => {
  let data = {};
  for (const [key, value] of Object.entries(props.thingData)) {
    const field = props.form.fields.find((a) => a.code == key);
    if (field) {
      data[field.id] = value;
    }
  }
  return data;
};

const goBack = () => {

};
</script>

<style scoped>
/* 样式 */
</style>
