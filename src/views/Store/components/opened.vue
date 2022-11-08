<template>
  <div class="detail">
    <div class="detail-title">最近打开</div>
    <div class="detail-list">
      <div class="list-item" v-for="(item, index) in 5" :key="index">
        <div class="row row-left">
          <img src="@/assets/img/whatsapp.png" alt="" />
          <div class="version">V 1.1</div>
        </div>
        <div class="row row-content">
          <div class="title">
            <span>资产内控</span>
            <span>
              <el-dropdown>
                <span class="el-dropdown-link"> ··· </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>审核申请</el-dropdown-item>
                    <el-dropdown-item>查看详情</el-dropdown-item>
                    <el-dropdown-item>查看详情</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </span>
          </div>
          <div class="describe">
            资产内控资产内控资产内控资产内控资产内控
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import diytab from "@/components/diyTable/index.vue";
import { ref, reactive, onMounted, nextTick } from "vue";
const dialogVisible = ref<boolean>(true);
const diyTable = ref(null);
// 表格展示数据
const pageStore = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0,
});
const tableData = ref([
  {
    paymentType: "线上",
    price: "100",
    status: "200",
    createTime: "2022-11-01 16:01",
  },
]);
const activeName = ref<string>(); //table tab index
const tableActiveIndex = ref<string>(); //table nav index
const handleSelect = () => {
  console.log("index");
};
const handleClick = (key?: any) => {
  console.log(key);
};

interface ListItem {
  code: string;
  name: string;
  trueName: string;
  teamCode: string;
  remark: string;
}

onMounted(() => {
  remoteMethod();
});
const remoteMethod = () => {};

const handleUpdate = (page: any) => {
  pageStore.currentPage = page.currentPage;
  pageStore.pageSize = page.pageSize;
  remoteMethod();
};
const checkList = reactive<any>([]);
const selectionChange = (val: any) => {
  checkList.value = val;
};

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
  {
    type: "slot",
    label: "操作",
    fixed: "right",
    align: "center",
    width: "150",
    name: "operate",
  },
]);
const options = ref<any>({
  checkBox: false,
  order: true,
  selectLimit: 1,
  defaultSort: { prop: "createTime", order: "descending" },
  treeProps: {
    children: "children",
    hasChildren: "hasChildren",
  },
});
const showDiong = () => {};
const commontActive = () => {};
</script>
<style lang="scss">
.drop-link {
  cursor: pointer;
  padding: 2px 10px;
  border-radius: 10px;
}
.drop-link:hover {
  background: var(--el-bg-color-overlay);
}
</style>
<style lang="scss" scoped>
.detail {
  background: #fff;
  margin-bottom: 6px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  max-height: 200px;
  padding: 16px;
  .detail-title {
    font-size: 14px;
    color: #303133;
    margin-bottom: 10px;
  }
  .detail-list {
    display: flex;
    flex-wrap: nowrap;
    height: 102px;
    flex: 1;
  }
  .list-item {
    width: 187px;
    min-width: 187px;
    height: 102px;
    display: flex;
    flex-wrap: nowrap;
    border: 1px solid #eee;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 18px 12px;
    margin-right: 10px;
    .row {
      img {
        width: 52px;
        height: 52px;
        border-radius: 10px;
      }
      .version {
        font-size: 12px;
        color: #606266;
        margin-top: 5px;
      }
      .title {
        color: #303133;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span:nth-child(2n) {
          display: flex;
          align-items: center;
        }
      }
      .describe {
        color: #606266;
        font-size: 12px;
        -webkit-line-clamp: 2;
        margin-top: 3px;

        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .row-left {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 10px;
    }
  }
}
</style>
