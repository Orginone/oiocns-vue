<template>
  <div class="certificate">
    <!-- <userInfoBox></userInfoBox> -->
    <div class="tabBox">
      <diytab
        :style="{ height: 300 + 'px', width: '100%' }"
        ref="diyTable"
        order
        tableName="证书管理"
        :titleBtns="titleBtns"
        :hasTableHead="true"
        :tableData="dataSource.data"
        :options="options"
        :tableHead="tableHead"
        @handleUpdate="handleUpdate"
        @selectionChange="selectionChange"
      >
        <!-- <template #titleSuffix>112332</template> -->
        <template #slot-card="scope">
          <div class="cardData">
            <div class="cardItem" v-for="item in dataSource.data">
              <div class="colorBox"></div>
              <p>证书名称证书</p>
            </div>
          </div>
        </template>
      </diytab>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, reactive } from "vue";
import $services from "@/services";
import diytab from "@components/diyTable/index.vue";
import { BtnItem } from "@/components/titleBox/index.vue";
import useSearch from "@/hooks/useSearch";

const { dataSource, refresh, changeOffset, changeFilter } = useSearch(
  $services.market.searchAll
);

const titleBtns = reactive<BtnItem[]>([
  { name: "删除", event: () => {} },
  { name: "查看申请记录", event: () => {} },
  { name: "加入平台", event: () => {} },
  { name: "创建地址", event: () => {} },
]);
// #region 表格部分
const diyTable = ref(null);
const pageStore = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0,
});
const checkList = reactive<any>([]);
const options = ref<any>({
  checkBox: true,
  order: true,
  selectLimit: 1,
  defaultSort: { prop: "createTime", order: "descending" },
  treeProps: {
    children: "children",
    hasChildren: "hasChildren",
  },
});
const tableHead = ref([
  {
    prop: "title",
    label: "卡包名称",
  },
  {
    prop: "price",
    label: "选择网络",
    name: "price",
  },
  {
    prop: "status",
    label: "地址",
    name: "status",
  },
  {
    prop: "createTime",
    label: "加入时间",
    name: "createTime",
  },
]);

const handleUpdate = (page: any) => {
  pageStore.currentPage = page.currentPage;
  pageStore.pageSize = page.pageSize;
  remoteMethod();
};

const remoteMethod = () => {};

const selectionChange = (val: any) => {
  checkList.value = val;
};
// #endregion

onMounted(() => {
  // remoteMethod();
  console.log(dataSource, 1);
});
</script>
<style lang="scss" scoped>
.certificate {
  // padding: 5px 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .tabBox {
    background: #fff;
    border-radius: 5px;
    margin-top: 5px;
    flex: 1;
    display: flex;
    flex-direction: column;
    :deep(.diy-table) {
      flex: 1;
    }
  }
  .cardData {
    display: flex;
    flex-wrap: wrap;
    .cardItem {
      width: 104px;
      height: 106px;
      text-align: center;
      border-radius: 3px;
      transition: background 0.3s;
      padding: 12px;
      &:hover {
        background: #f5f6fc;
      }
      .colorBox {
        width: 50px;
        height: 50px;
        background: #2f96f9;
        border-radius: 3px;
        margin: auto;
        margin-bottom: 8px;
      }
      p {
        font-size: 12px;
        line-height: 16px;
        width: 100%;
        color: #303133;
        white-space: pre;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
