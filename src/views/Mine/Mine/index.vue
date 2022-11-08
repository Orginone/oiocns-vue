<template>
  <div class="zhanwei">
    <div class="zhanweicebian">
      <ul>
        <li>个人信息</li>
        <li>通行设置</li>
        <li>好友设置</li>
        <li>群组设置</li>
        <li>卡包设置</li>
        <li>首页设置</li>
        <li>帮助设置</li>
      </ul>
    </div>
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
.zhanweibr {
  height: 63px;
  margin-bottom: 5px;
  background: #fff;
}

// 占位
.zhanwei {
  height: 100%;
  // background-color: #fff;
  display: flex;

  .zhanweicebian {
    width: 220px;
    height: 100%;
    background: #fff;
    li {
      line-height: 3;
    }
  }

  .mine {
    padding: 5px 8px;
    flex: 1;
  }
}
</style>
