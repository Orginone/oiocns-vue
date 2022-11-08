<template>
  <div class="zhanwei">
    <div class="zhanweicebian">侧边导航占位</div>
    <div class="zhanweiright">
      <div class="zhanweibr">面包屑占位</div>
      <div class="mine">
        <!-- title组件 (可能有全局组件) -->
        <div class="titleBox">
          <p class="title">当前用户</p>
          <div class="btns">
            <span class="titlebtn" @click="changePass">修改密码</span>
            <span class="titlebtn" @click="resetPass">重置密码</span>
          </div>
        </div>
        <div class="userInfoBox">
          <img src="/src/assets/img/头像.png" alt="" class="avatar" />
          <div class="showDetail">
            <div v-for="row in showDetail" class="showDetailRow">
              <p
                v-for="item in row"
                class="detailItem"
                :style="{ width: item.width ? item.width : '300px' }"
              >
                <b class="userLabel">{{ item.label }}：</b>
                <span class="userShowValue">{{
                  getDescendantProp(queryInfo, item.field) || "-"
                }}</span>
              </p>
            </div>
          </div>
        </div>
        <!-- 更多信息 -->
        <div class="expan">
          <span @click="isExpan = !isExpan">
            <b>{{ isExpan ? "收起" : "更多信息" }}</b>
            <el-icon :class="{ isExpan }">
              <ArrowDownBold />
            </el-icon>
          </span>
        </div>
        <div class="userInfoBox" v-show="isExpan">
          <div class="showDetail">
            <div v-for="row in expanDetail" class="showDetailRow">
              <p
                v-for="item in row"
                class="detailItem"
                :style="{ width: item.width ? item.width : '300px' }"
              >
                <b class="userLabel">{{ item.label }}：</b>
                <span class="userShowValue">{{
                  getDescendantProp(queryInfo, item.field) || "-"
                }}</span>
              </p>
            </div>
          </div>
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
import diytab from "@components/diyTable/index.vue";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
import { getDescendantProp } from "@/utils/tools";
import { ShowDetailRow } from "./type";

const store = useUserStore();
const { queryInfo } = storeToRefs(store);
// #region 展示信息
const isExpan = ref<boolean>(false);
const diyTable = ref(null);
// 显示配置
const showDetail = reactive<ShowDetailRow[][]>([
  [{ label: "姓名", field: "team.name" }],
  [
    { label: "性别", field: "name" },
    { label: "邮箱", field: "name" },
    { label: "联系方式", field: "name" },
  ],
  [{ label: "地址", field: "name", width: "100%" }],
]);
const expanDetail = reactive<ShowDetailRow[][]>([
  [
    { label: "职位", field: "team.name" },
    { label: "级别", field: "team.name" },
  ],
  [
    { label: "其他信息", field: "name" },
    { label: "其他信息", field: "name" },
  ],
  [
    { label: "其他信息", field: "name" },
    { label: "其他信息", field: "name" },
  ],
]);
// #endregion

// #region 表格部分
const pageStore = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0,
});
const tableData = reactive([]);
const checkList = reactive<any>([])
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

const changePass = () => {
  console.log("changePass");
};
const resetPass = () => {
  console.log("resetPass");
};

onMounted(() => {
  store.getQueryInfo(store.userToken);
  remoteMethod();
});
</script>
<style lang="scss" scoped>
.zhanweibr {
  height: 63px;
  margin-bottom: 5px;
  background: #fff;
}

.mine {
  background: #fff;
  border-radius: 5px;
  padding: 20px;

  .titleBox {
    display: flex;
    justify-content: space-between;
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

  .userInfoBox {
    padding: 0 37px;
    color: #606266;

    .avatar {
      width: 78px;
      height: 78px;
      border-radius: 50%;
      margin-bottom: 20px;
      margin-top: 28px;
    }

    .showDetail {
      margin-left: 10px;
      font-size: 14px;
      max-width: 1100px;

      .showDetailRow {
        line-height: 20px;
        display: flex;
        padding: 10px 0;

        .detailItem {
          display: flex;
          flex: 1;
        }
      }
    }
  }

  .expan {
    font-size: 14px;
    color: #154ad8;
    text-align: right;

    span {
      cursor: pointer;
      user-select: none;
    }

    .el-icon {
      vertical-align: revert;
      font-size: 10px;
      margin-left: 8px;
      transition: transform 0.3s;

      &.isExpan {
        transform: rotateX(180deg);
      }
    }
  }
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
  }

  .zhanweiright {
    padding: 5px 8px;
    flex: 1;
  }
}
</style>
