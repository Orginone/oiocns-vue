<template>
  <div class="card-list">
    <div class="card-item" v-for="(item, index) in 8" :key="index">
      <div class="item-head">
        <div class="item-img">人</div>
        <div class="item-head-content">
          <p>
            <span>应用名称 <el-tag class="ml-2" type="success">免费</el-tag></span>
            <el-dropdown>
              <span class="el-dropdown-link drop-list"> ··· </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>审核申请</el-dropdown-item>
                  <el-dropdown-item>查看详情</el-dropdown-item>
                  <el-dropdown-item>查看详情</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </p>
          <p>73MB</p>
        </div>
      </div>
      <div class="item-content">
        用于维护精益项目提报信息和申请管理，本数据仅限于企业内部进行项目管理时使用根据...
      </div>
      <div class="tag">
        <el-tag class="tag-item" type="info">类型</el-tag>
      </div>
      <div class="time">创建于 2022-11-02 15:06</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import diytab from "@/components/diyTable/index.vue";
import opened from "./components/opened.vue";
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
.card-list {
    padding: 10px 0;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    .card-item {
      width: 279px;
      box-sizing: border-box;
      padding: 14px;
      border-radius: 5px;
      margin-right: 12px;
      margin-bottom: 12px;
      border: 1px solid #e9e9e9;
      .item-head {
        display: flex;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
        align-items: center;
        .item-img {
          background: #d4f0fc;
          text-align: center;
          width: 40px;
          height: 40px;
          line-height: 40px;
          border-radius: 50%;
          margin-right: 15px;
          font-size: 14px;
          color: #55b0eb;
        }
      }
      .item-head-content {
        display: flex;
        flex: 1;
        flex-direction: column;
        p:nth-child(1) {
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            margin-right: 5px;
          }
          .drop-list {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
        p:nth-child(2) {
          color: #9c9c9c;
          font-size: 14px;
        }
      }
      .item-content {
        font-size: 12px;
        margin: 12px 0;
        color: #7f7f7f;
      }
      .tag {
        margin: 12px 0;
      }
      .time {
        font-size: 12px;
        color: #7f7f7f;
      }
    }
}
</style>
