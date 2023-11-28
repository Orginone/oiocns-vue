<!-- 多级菜单组件抽取 -->
<template>
  <el-menu
    :default-active="activeIndex"
    :class="customMenuClass"
    mode="vertical"
    @select="handleSelect"
    :ellipsis="false"
  >
    <template v-for="(item, index) in items?.children">
      <template v-if="item.children.length > 0">
        <el-sub-menu
          :index="String(item.key)" :key="item.key"
          popper-class="el-sub-menu-popper-class"
        >
          <template #title>
            <span>{{ item.label }}-1</span>
          </template>
          <menu-list :items="item"></menu-list>
        </el-sub-menu>
      </template>
      <template v-else>
        <el-menu-item :index="String(item.key)" :key="item.key">
          <span>{{ item.label }}-2</span>
        </el-menu-item>
      </template>
    </template>
  </el-menu>
</template>
<script setup lang="ts">
import { findMenuItemByKey } from "@/utils/tools";
import orgCtrl, { Controller } from "@/ts/controller";
import * as config from "@/views/setting/config/menuOperate";
import { setCenterStore } from "@/store/setting";
import {storeToRefs} from 'pinia';
const store= setCenterStore();
const ctrl = orgCtrl;
const props = defineProps({
  customMenuClass: {
    type: String,
    required: false,
    default: "el-menu-class",
  },
  items: {
    type: Object,
    required: true,
  },
  activeIndex: {
    type: String,
    required: false,
    default: "",
  },
});
const handleSelect = async (key: string) => {
  ctrl.currentKey = key;
  let newMenus = await config.loadBrowserMenu();
  var item = findMenuItemByKey(newMenus, ctrl.currentKey);
  if (item.beforeLoad) {
    await item.beforeLoad();
  }
  store.setCurrItem(item);
  if (item === undefined) {
    item = newMenus;
  }
};
</script>
<style lang="scss" scoped>
.el-menu-class {
  .el-menu-item:not(.is-disabled):hover {
    background-color: rgba(127, 255, 212, 0.3);
  }
}
</style>
<style lang="scss"></style>
