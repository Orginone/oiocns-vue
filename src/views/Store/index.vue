<template>
  <div class="main">
    <div class="content">
      <appDetail
        :detailDialog="dialogType.detailDialog"
        @closeDialog="closeDialog('detailDialog', false)"
      ></appDetail>
      <opened></opened>
      <div class="table">
        {{state.ownProductList}}
        <DiyTable
          :style="{ width: '100%' }"
          ref="diyTable"
          :hasTabs="true"
          :tableName="'我的应用'"
          :hasTitle="true"
          :hasTableHead="true"
          :tableData="state.ownProductList"
          :options="options"
          :total="pageStore.total"
          @handleUpdate="handleUpdate"
          @selectionChange="selectionChange"
          :tableHead="state.tableHead"
        >
          <template #slot-tabs>
            <div class="table-tabs">
              <el-menu
                :default-active="tableActiveIndex"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
              >
                <el-menu-item index="1">全部</el-menu-item>
                <el-menu-item index="2">创建的</el-menu-item>
                <el-menu-item index="3">购买的</el-menu-item>
                <el-menu-item index="4">共享的</el-menu-item>
                <el-menu-item index="5">分配的</el-menu-item>
              </el-menu>
            </div>
          </template>
          <template #buttons>
            <el-button class="btn-check" type="primary" @click="goBuy()" link
              >购买</el-button
            >
            <el-button class="btn-check" @click="goCreate()" type="primary" link
              >创建</el-button
            >
            <el-button class="btn-check" type="primary" link>暂存</el-button>
          </template>
          <template #name="scope">
            {{ scope.row.name }}
          </template>
          <template #tag="scope">
            <el-tag
              v-if="
                scope.row.endTime == undefined ||
                new Date().getTime() < formartDateTime(scope.row?.endTime)
              "
              style="margin-left: 10px"
              :type="
                authority.IsApplicationAdmin(scope.row.belongId)
                  ? ''
                  : 'success'
              "
            >
              {{
                authority.IsApplicationAdmin(scope.row.belongId)
                  ? "可管理"
                  : "可使用"
              }}</el-tag
            >
            <el-tag
              v-if="new Date().getTime() > formartDateTime(scope.row?.endTime)"
              style="margin-left: 10px"
              :type="'danger'"
              >失效</el-tag
            >
            <el-tag style="margin-left: 10px">{{ scope.row.source }}</el-tag>
          </template>
          <template #operate="scope">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link"> ··· </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="
                      scope.row.authority == '所属权' &&
                      scope.row.belongId == store.workspaceData.id
                    "
                    link
                    type="primary"
                    @click="handleCommand('own', 'putaway', scope.row)"
                    >上架</el-dropdown-item
                  >
                  <el-dropdown-item
                    link
                    type="primary"
                    v-if="scope.row.belongId == store.workspaceData.id"
                    @click="handleCommand('own', 'share', scope.row)"
                  >
                    共享</el-dropdown-item
                  >
                  <el-dropdown-item
                    link
                    type="primary"
                    v-if="authority.IsCompanySpace()"
                    @click="handleCommand('own', 'distribution', scope.row)"
                    >分配
                  </el-dropdown-item>
                  <el-dropdown-item
                    link
                    type="primary"
                    @click="goDetail(scope.row.id)"
                  >
                    查看详情
                  </el-dropdown-item>
                  <el-dropdown-item
                    link
                    type="primary"
                    @click="deleteApp(scope.row)"
                    >移除应用</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="
                      scope.row.resourcesList &&
                      scope.row.resourcesList.length > 0
                    "
                  >
                    <el-dropdown trigger="hover" placement="top-end">
                      流程业务
                      <template #dropdown>
                        <el-dropdown-menu
                          style="padding-left: 10px; min-width: 100px"
                        >
                          <el-dropdown-item
                            v-for="resource in scope.row.resourcesList"
                            :key="resource.formId"
                            @click="enterProcess(resource)"
                            >{{ resource.business }}</el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #slot-card>
            <div class="card-list">
              <div
                class="card-item"
                v-for="(item, index) in state.ownProductList"
                :key="index"
              >
                <div class="item-head">
                  <div class="item-img">{{ item.name.substring(0,1) }}</div>
                  <div class="item-head-content">
                    <p>
                      <span
                        >{{ item.name }}
                      </span>
                        <el-dropdown>
                          <span class="el-dropdown-link drop-list"> ··· </span>
                          <template #dropdown>
                            <el-dropdown-menu>
                              <el-dropdown-item
                                v-if="
                                  item.authority == '所属权' &&
                                  item.belongId ==
                                    store.workspaceData.id
                                "
                                link
                                type="primary"
                                @click="
                                  handleCommand('own', 'putaway', item)
                                "
                                >上架</el-dropdown-item
                              >
                              <el-dropdown-item
                                link
                                type="primary"
                                v-if="
                                  item.belongId ==
                                  store.workspaceData.id
                                "
                                @click="handleCommand('own', 'share', item)"
                              >
                                共享</el-dropdown-item
                              >
                              <el-dropdown-item
                                link
                                type="primary"
                                v-if="authority.IsCompanySpace()"
                                @click="
                                  handleCommand('own', 'distribution', item)
                                "
                                >分配
                              </el-dropdown-item>
                              <el-dropdown-item
                                link
                                type="primary"
                                @click="goDetail(item.id)"
                              >
                                查看详情
                              </el-dropdown-item>
                              <el-dropdown-item
                                link
                                type="primary"
                                @click="deleteApp(item.id)"
                                >移除应用</el-dropdown-item
                              >
                              <el-dropdown-item
                                v-if="
                                  item.resourcesList &&
                                  item.resourcesList.length > 0
                                "
                              >
                                <el-dropdown trigger="hover" placement="top-end">
                                  流程业务
                                  <template #dropdown>
                                    <el-dropdown-menu
                                      style="padding-left: 10px; min-width: 100px"
                                    >
                                      <el-dropdown-item
                                        v-for="resource in item?.resourcesList"
                                        :key="resource.formId"
                                        @click="enterProcess(resource)"
                                        >{{ resource.business }}</el-dropdown-item
                                      >
                                    </el-dropdown-menu>
                                  </template>
                                </el-dropdown>
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </template>
                        </el-dropdown>
                    </p>
                    <!-- <p>73MB</p> -->
                  </div>
                </div>
                <div class="item-content">
                  {{item.remark}}
                </div>
                <div class="tag">
                  <el-tag class="tag-item" type="info">{{item.typeName}}</el-tag>
                </div>
                <div class="time">创建于 {{ item.createTime }}</div>
              </div>
            </div>
          </template>
        </DiyTable>
      </div>
    </div>
    <el-dialog
      v-if="dialogType.cohortVisible"
      v-model="dialogType.cohortVisible"
      custom-class="share-dialog"
      title="应用分配"
      width="1000px"
      draggable
      :close-on-click-modal="false"
    >
      <ShareComponent
        dialogType="1"
        @closeDialog="closeDialog('cohortVisible', false)"
        :info="selectProductItem"
      >
      </ShareComponent>
    </el-dialog>
    <el-dialog
      v-if="dialogType.shareVisible"
      v-model="dialogType.shareVisible"
      custom-class="share-dialog"
      title="应用共享"
      width="1000px"
      draggable
      :close-on-click-modal="false"
    >
      <ShareComponent
        dialogType="2"
        :type="store.workspaceData.type"
        @closeDialog="closeDialog('shareVisible', false)"
        :info="selectProductItem"
      ></ShareComponent>
    </el-dialog>
    <ProcessDesign ref="processDesignRef" />
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import {
  onMounted,
  reactive,
  ref,
  watch,
  nextTick,
  getCurrentInstance,
} from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import DiyTable from "@/components/diyTable/index.vue";
import authority from "@/utils/authority";
import { appstore } from "@/module/store/app";
import opened from "./components/opened.vue";
import appDetail from "./components/appDetail.vue";
import ShareComponent from "./components/shareComponents.vue";
import ProcessDesign from "@/components/wflow/ProcessDesign.vue";

// import {MarketModel} from "@/ts/market";
// import {StoreModel} from "@/ts/store";
// import {PersonalModel} from '@/ts/personal'
import marketCtrl from '@/ts/controller/store/marketCtrl';

const goCreate = () => {
  router.push({ path: "/store/appRegister" });
};
const dialogType: any = reactive({
  detailDialog: false, //应用详情弹窗
  cohortVisible: false, //共享弹窗
  shareVisible: false, //分享
  groupVisible: false, //集团
});
// 关闭弹窗
const closeDialog = (type: string, key: boolean) => {
  dialogType[type] = key;
};

const processDesignRef = ref();
const isCard = ref(true);
const instance = getCurrentInstance();

// 注册页面实例
const router = useRouter();
const store = useUserStore();

// 路由跳转
const searchText = ref<string>("");
const diyTable = ref(null);

// 表格展示数据
const pageStore = reactive({
  tableData: [],
  currentPage: 1,
  pageSize: 20,
  total: 0,
});

// 表格变更
const selectionChange = () => {
  console.log("aaa");
};
// tableNav变更
const tableActiveIndex = ref<string>();
const handleSelect = (key: string) => {
  tableActiveIndex.value = key;
};

//去应用商店
const goBuy = () => {
  router.push("/store/shop");
};
//去应用详情
const goDetail = (id: string) => {
  router.push({ path: "/store/appManagement", query: { id: id } });
};
type StateType = {
  ownProductList: any[]; //我的应用
  ownTotal: number;
  shareTotal: number;
  marketOptions: any[]; //所有市场列表
  options: any[]; //集团列表
  selectLabel: selectType; // 选中的集团名称
  tableHead: any[];
  dropDwonActiveId: string; // 当前dropdwon打开时选中的id
};
const options = ref<any>({
  checkBox: false,
  order: true,
  selectLimit: 1,
  noPage:false,
  switchType:true,
  defaultSort: { prop: "createTime", order: "descending" },
  treeProps: {
    children: "children",
    hasChildren: "hasChildren",
  },
});
const lista = ref<any>([])
const state: StateType = reactive({
  ownProductList: [],
  ownTotal: 0,
  shareTotal: 0,
  marketOptions: [],
  options: [],
  dropDwonActiveId: "",
  selectLabel: {
    label: "",
    id: "",
  },
  tableHead: [
    {
      type: "slot",
      prop: "name",
      name: "name",
      label: "应用名称",
      width: "200",
    },
    {
      type: "slot",
      prop: "tag",
      name: "tag",
      label: "应用状态",
      width: "200",
    },
    {
      prop: "code",
      label: "应用编码",
      width: "150",
    },
    {
      prop: "source",
      label: "应用来源",
    },
    {
      prop: "typeName",
      label: "应用类型",
      width: "150",
    },
    {
      prop: "authority",
      label: "持有权限",
    },
    {
      prop: "createTime",
      label: "创建时间",
      width: "200",
    },
    {
      type: "slot",
      label: "操作",
      fixed: "right",
      align: "center",
      width: "100",
      name: "operate",
    },
  ],
});
const title = ref<string>("");
onMounted(() => {
  // 获取列表
  getProductList(); 
    
});

const handleUpdate = (page: any) => {
  pageStore.currentPage = page.current;
  pageStore.pageSize = page.pageSize;
  getProductList();
};
// 获取我的应用列表
const getProductList = () => {
  // appstore.getProductList(pageStore, searchText.value,(res:any)=>{
  //   state[`ownProductList`] = [...res.result]
  //   let resData = JSON.parse(JSON.stringify(state[`ownProductList`]))
  //   for (let product of resData) {
  //       appstore.getResource(product.id,(res:any)=>{
  //         let flowArr: any = [];
  //         var arr = JSON.parse(JSON.stringify(res.result))
  //         arr.filter((element: any) => element.flows && element.flows.length > 0)
  //           .forEach((element: any) => {
  //             let arr = JSON.parse(element.flows);
  //             let itemArr: any = [];
  //             arr.forEach((el: any) => {
  //               el.appId = product.id;
  //               el.appName = product.name;
  //               el.sourceId = element.id;
  //               itemArr.push(el);
  //             });
  //             flowArr.push(...itemArr);
  //           });
  //         product.resourcesList = flowArr;
  //         pageStore.total = res.total;
  //         diyTable.value.state.page.total = res.total
  //       });
  //   }
  // })

  marketCtrl.Market.getOwnProducts(false).then((res:any)=>{
    let arr:any = []
    res.forEach((element:any) => {
      let obj = {
        name: element.prod.name,
        updateTime:element.prod.updateTime,
        createTime:element.prod.createTime,
        typeName:element.prod.typeName,
        updateUser:element.prod.updateUser,
        authority:element.prod.authority,
        belongId:element.prod.belongId,
        code:element.prod.code,
        source:element.prod.source
      }
      arr.push(obj)
    });
    state[`ownProductList`] = arr;

  })
};

// 移除app
const deleteApp = (item: any) => {
  ElMessageBox.confirm(`确认删除  ${item.name}?`, "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const success = await appstore.deleteApp(item.id);
      if (success) {
        getProductList();
        ElMessage({
          type: "success",
          message: "操作成功",
        });
      }
    })
    .catch(() => {});
};

// 记录当前操作的 应用信息
const selectProductItem = ref<any>();
// 处理 设置 菜单选择事件
const handleCommand = (
  type: "own" | "other",
  command: string | number | object,
  item: any
) => {
  selectProductItem.value = item;
  console.log("selectProductItem", selectProductItem.value);
  switch (command) {
    case "share": //分享
      openShareDialog();
      break;
    case "putaway": //上架
      router.push({
        path: "/store/putShelves",
        query: { name: item.name, id: item.id, typeName: item.typeName },
      });
      break;
    case "unsubscribe":
      break;
    case "distribution": //分配
      dialogType.cohortVisible = true;
      break;
    case "detail": //详情
      break;
    default:
      break;
  }
};

//  打开集团选择弹窗
const openShareDialog = () => {
  dialogType.shareVisible = true;
};

const formartDateTime = (dateStr: any) => {
  if (dateStr) {
    var timestamp = new Date(dateStr).getTime();
    return timestamp;
  } else {
    return new Date().getTime() + 1000;
  }
};

const enterProcess = (resource: any) => {
  console.log("resource", resource);
  processDesignRef.value.startDesign(resource);
};

instance?.proxy?.$Bus.on("clickBus", (num) => {
  console.log(num);
});
</script>
<style lang="scss">
.el-dropdown-link {
  padding: 2px 10px;
  cursor: pointer;
  border-radius: 10px;
}

.el-dropdown-link:hover {
  background: #1642cb;
  color: #fff;
}
</style>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;

  .nav-list {
    width: 150px;
    height: 100%;
    background: #fff;
    border-right: 1px solid #ebeef5;
  }

  .content {
    width: calc(100vw - 200px);
    display: flex;
    flex-direction: column;
    background: #f0f4f8;

    .menu {
      height: 40px;
      width: 100%;
      background: #aab;
      margin-bottom: 6px;
    }

    .table {
      background: #fff;
      margin-top: 3px;
      height: calc(100vh - 260px);

      .btn-check {
        padding: 8px 16px;
        color: #154ad8;
      }

      .btn-check:hover {
        background: #154ad8;
        color: #fff;
        padding: 8px 16px;
      }

      .table-tabs {

        .el-menu--horizontal {
          border: 0;
        }

        .el-menu-item {
          padding: 0;
          margin-right: 16px;
          margin-bottom: 3px;
          border: 0 !important;
        }

        .is-active {
          background: #fff;
        }

        .is-active::after {
          content: "";
          position: absolute;
          left: 0;
          margin-left: calc(50% - 9px);
          bottom: 25%;
          width: 18px;
          border-radius: 5px;
          height: 2px;
          background: #154ad8;
        }

        .el-menu--horizontal:hover,
        .el-menu-item:hover {
          background: #fff;
        }
      }
    }
  }
}
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
          color: #0C4EFF;
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
