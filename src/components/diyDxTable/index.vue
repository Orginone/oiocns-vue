<template>
  <DxDataGrid
    :data-source="dataSource"
    :remote-operations="false"
    :allow-column-reordering="true"
    :row-alternation-enabled="true"
    :show-borders="true"
    @content-ready="onContentReady"
  >
    <DxColumn
      v-for="(item, index) in props.tableHead"
      :index="index"
      :width="150"
      :data-field="item.id"
      :caption="item.name"
      data-type="string"
    >
      <template v-if="item.children">
        <DxColumn
          v-for="(child, childIndex) in item.children"
          :index="childIndex"
          :width="150"
          :data-field="child.id"
          :caption="child.name"
          data-type="string"
        ></DxColumn>
      </template>
    </DxColumn>
    <DxGrouping :auto-expand-all="false" />
    <DxPager :allowed-page-sizes="pageSizes" :show-page-size-selector="true" />
    <DxPaging :page-size="10" />
  </DxDataGrid>
</template>

<script lang="ts" setup>
import {
  ref,
  watch,
  reactive,
  nextTick,
  getCurrentInstance,
  onMounted,
} from "vue";
import { useRouter } from "vue-router";
import { Search } from "@element-plus/icons-vue";
// import { setCenterStore } from "@/store/setting";
// import {
//   docsCtrl,
//   userCtrl,
//   thingCtrl,
//   todoCtrl as todo,
//   INullSpeciesItem,
// } from "@/ts/coreIndex";
import { ElMessage } from "element-plus";
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
} from "devextreme-vue/data-grid";

import DataSource from "devextreme/data/data_source";
import "devextreme/data/odata/store";
const dataSource = new DataSource({
  store: [],
});
const props = defineProps<{
  tableHead: any;
}>();
const onContentReady = (e: any) => {
  // if (!collapsed) {
  //   e.component.expandRow(['EnviroCare']);
  //   collapsed = true;
  // }
};
const pageSizes = [10, 25, 50, 100];
</script>
<style lang="scss">
.menu-side {
  width: 197px;
  height: 100%;
  margin-right: 3px;
  padding-top: 10px;
  .el-menu {
    border: 0;
  }
  .el-sub-menu__title {
    height: 40px;
    line-height: 40px;
  }
  .el-menu-item {
    height: 45px;
    line-height: 45px;
  }
}
.el-tabs__header {
  margin-bottom: 0 !important;
}
/*去掉tabs底部的下划线*/
.el-tabs__nav-wrap::after {
  position: static !important;
}
</style>
<style lang="scss" scoped>
* {
  font-family: "微软雅黑";
}
.tree-wrap {
  height: calc(500px);
  overflow-y: auto;
}
.thing-box {
  display: flex;
  width: 100%;
  height: 100%;
  .content-main {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-left: 3px;
  }
  .main {
    background: #fff;
    margin-top: 3px;
    .from-title {
      height: 50px;
      line-height: 50px;
      font-weight: bold;
      padding-left: 20px;
      border-bottom: 1px solid #eee;
    }
  }
}
.main-form {
  display: flex;
  flex-wrap: wrap;
  padding-top: 20px;
}
.form-item {
  width: 47%;
  display: flex;
  justify-content: center;
  .el-form-item__content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-form-item__label {
    padding-right: 5px !important;
  }
  i {
    margin-left: 0 !important;
    margin-right: 10px;
  }
  .form-flex {
    display: flex;
    align-items: center;
  }
}
.main-table {
  padding: 20px;
  background: #fff;
}
</style>
