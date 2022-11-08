<template>
  <div class="mine">
    {{ dataSource.data }}
    <div class="zhanweibr">面包屑占位</div>
    <userInfoBox></userInfoBox>
    <div class="tabBox">
      <div class="titleBox">
        <p class="title">证书管理</p>
        <div class="btns">
          <span class="titlebtn">删除</span>
          <span class="titlebtn">查看申请记录</span>
          <span class="titlebtn">加入平台</span>
          <span class="titlebtn">创建地址</span>
        </div>
      </div>
      <diytab
        :style="{ height: 300 + 'px', width: '100%' }"
        ref="diyTable"
        :hasTableHead="true"
        :tableData="tableData"
        :options="options"
        :tableHead="tableHead"
        @handleUpdate="handleUpdate"
        @selectionChange="selectionChange"
      >
        <template #remark="scope">
          <el-tooltip
            :content="scope.row.remark"
            placement="bottom"
            effect="light"
          >
            <template #content>
              <div class="tooltip-text" style="width: 300px">
                {{ scope.row.remark }}
              </div>
            </template>
            <div class="remark-text">
              {{ scope.row.remark }}
            </div>
          </el-tooltip>
        </template>
      </diytab>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, reactive } from "vue";
import $services from "@/services";
import diytab from "@components/diyTable/index.vue";
import userInfoBox from "../components/userInfoBox/index.vue";
import useSearch from "@/hooks/useSearch";

const { dataSource, refresh, changeOffset, changeFilter } = useSearch(
  $services.market.searchAll
);

// #region 表格部分
const diyTable = ref(null);
const pageStore = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0,
});
const tableData = reactive([]);
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
    prop: "paymentType",
    label: "付款方式",
  },
  {
    prop: "price",
    label: "价格",
    name: "price",
  },
  {
    prop: "status",
    label: "状态",
    name: "status",
  },
  {
    prop: "createTime",
    label: "创建时间",
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
:deep(.titleBox) {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  background: #fff;
  .title {
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    color: #303133;
  }
  .titlebtn {
    font-size: 14px;
    line-height: 18px;
    color: #154ad8;
    cursor: pointer;
    user-select: none;
    margin: 0 16px;
  }
}
.zhanweibr {
  height: 63px;
  margin-bottom: 5px;
  background: #fff;
}

.mine {
  padding: 5px 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .tabBox {
    background: #fff;
    border-radius: 5px;
    margin-top: 5px;
    padding-top: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    :deep(.diy-table) {
      flex: 1;
    }
  }
}
</style>
