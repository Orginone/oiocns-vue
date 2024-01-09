<script setup lang="ts">
import FullScreenModal from "@/components/Common/fullScreenModal.vue";
import { IForm } from "@/ts/core";
import * as config from "./config";
import EntityIcon from "@/components/Common/GlobalComps/entityIcon/index.vue";
import MinLayout from "@/components/MainLayout/minLayout.vue";
import useMenuUpdate from "@/hooks/useMenuUpdate";
import WorkForm from "@/components/DataStandard/WorkForm/index.vue";
import GenerateThingTable from "@/executor/tools/generate/thingTable.vue";
import CustomStore from "devextreme/data/custom_store";
import { kernel } from "@/ts/base";
import { Controller } from "@/ts/controller";
import ThingView from "./detail/index.vue";
import useAsyncLoad from "@/hooks/useAsyncLoad";

const props = defineProps<{
  form: IForm;
  finished: () => void;
}>();
const select = ref<any>(undefined);
const setSelcet = (val: any) => {
  select.value = val;
};
const loaded = ref<boolean>(false);
loaded.value =  await props.form.loadContent()

const {
  key,
  rootMenu,
  selectMenu,
  onSelectMenu: setSelectMenu,
} = useMenuUpdate(
  () => config.loadSpeciesItemMenu(props.form),
  new Controller(props.form.key)
);

console.log("form.canDesign", props.form.fields);
</script>
<template>
  <FullScreenModal
    :centered="true"
    :open="true"
    :fullScreen="true"
    :width="'80vw'"
    :title="form.name"
    :bodyHeight="'80vh'"
    :icon="''"
    :destroyOnClose="true"
    @onCancel="finished"
  >
    <MinLayout
      v-if="loaded"
      :selectMenu="selectMenu"
      :onSelect="
        (data) => {
          setSelectMenu(data);
        }
      "
      :siderMenuData="rootMenu"
    >
      <template v-if="form.canDesign">
        <template v-if="select">
          <ThingView
            :form="form"
            :thingData="select"
            @onBack="() => setSelcet(undefined)"
          />
        </template>
        <template v-else>
          <GenerateThingTable
            :key="form.key"
            :height="'100%'"
            :fields="form.fields"
            :scrolling="{
              mode: 'infinite',
              showScrollbar: 'onHover',
            }"
            :pager="{ visible: false }"
            @onRowDblClick="(e: any) => setSelcet(e.data)"
            :filterValue="JSON.parse(form.metadata.searchRule ?? '[]')"
            :dataSource="
              new CustomStore({
                key: 'id',
                async load(loadOptions) {
                  loadOptions.userData = [`F${form.id}`];
                  if (selectMenu.item?.value) {
                    loadOptions.userData.push(selectMenu.item.value);
                  } else if (selectMenu.item?.code) {
                    loadOptions.userData.push(selectMenu.item.code);
                  }
                  const result = await kernel.loadThing(
                    form.belongId,
                    [form.belongId],
                    loadOptions
                  );
                  return result;
                },
              })
            "
            :remoteOperations="true"
            :toolbar="{
              visible: true,
              items: [
                {
                  name: 'columnChooserButton',
                  location: 'after',
                },
                {
                  name: 'searchPanel',
                  location: 'after',
                },
              ],
            }"
            :dataMenus="{
              items: [
                {
                  key: 'createNFT',
                  label: '生成存证',
                  icon: '',
                  onClick: () => {
                    message.success('存证成功!');
                  },
                },
                {
                  key: 'copyBoard',
                  label: '复制数据',
                  icon: '',
                },
                {
                  key: 'startWork',
                  label: '发起办事',
                  icon: '',
                },
              ],
              onMenuClick(key, data) {
                // console.log(key, data);
              },
            }"
          />
        </template>
      </template>
      <template v-else>
        <WorkForm :form="form" />
      </template>
    </MinLayout>
  </FullScreenModal>
</template>
