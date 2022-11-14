<template>
  <div class="content box">
    <div class="info" ref="infoWrap">
      <Info ref="info" />
    </div>
    <div class="body" ref="bodyWrap">
      <div class="body-tabs">
        <el-menu
        :default-active="tableActiveIndex"
        mode="horizontal"
      >
        <el-menu-item index="1">部门成员</el-menu-item>
        <el-menu-item index="2">部门应用</el-menu-item>
      </el-menu>
      <hr >
      </div>
      <diytab
        :style="{ width: '100%' }"
        ref="diyTable"
        :hasTabs="true"
        :tableName="'浙江省财政厅'"
        :hasTitle="true"
        :hasTableHead="true"
        :tableData="tableData"
        :options="options"
        @handleUpdate="handleUpdate"
        @selectionChange="selectionChange"
        :tableHead="tableHead"
      >
        <template #slot-tabs>
          <div class="table-tabs">
            <el-menu
              :default-active="tableActiveIndex2"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect"
            >
              <el-menu-item index="1">全部</el-menu-item>
              <el-menu-item index="2">已开通</el-menu-item>
              <el-menu-item index="3">未开通</el-menu-item>
            </el-menu>
          </div>
        </template>
        <template #buttons>
          <el-button class="btn-check" type="primary" link>岗位设置</el-button>
          <el-button class="btn-check" type="primary" link>添加成员</el-button>
          <el-button class="btn-check" type="primary" link>查看申请</el-button>
        </template>
        <template #operate="scope">
          <el-dropdown>
            <span class="el-dropdown-link"> ··· </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="showDiong">修改信息</el-dropdown-item>
                <el-dropdown-item @click="showDiong">变更部门</el-dropdown-item>
                <el-dropdown-item @click="showDiong">岗位设置</el-dropdown-item>
                <el-dropdown-item @click="showDiong">部门设置</el-dropdown-item>
                <el-dropdown-item @click="showDiong">停用</el-dropdown-item>
                <el-dropdown-item @click="showDiong" style="color: #f67c80">移出单位</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template #slot-card>
          <!-- <card></card> -->
        </template>
      </diytab>
    </div>
  </div>
</template>
<script lang="ts" setup>
// @ts-nocheck
import Info from "./components/info.vue";
import diytab from "@/components/diyTable/index.vue";
import { ref } from "vue";

const info = ref(null);

// 表格展示数据
const pageStore = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})
const tableActiveIndex = ref<string>('1'); //table nav index
const tableActiveIndex2 = ref<string>('1');
const tableData = ref([{
  account:'admin',
  nickname:'测试人员',
  name:'张叁',
  phone:'18092941459',
}])
const options = ref<any>({
  checkBox: true,
  order: true,
  selectLimit: 1,
  defaultSort: { prop: 'createTime', order: 'descending' },
  treeProps: {
    children: 'children',
    hasChildren: 'hasChildren'
  }
})
const tableHead = ref([
  {
    prop: 'account',
    label: '账号',
  },
  {
    prop: 'nickname',
    label: '昵称',
    name: 'nickname'
  },
  {
    prop: 'name',
    label: '姓名',
    name: 'name'
  },
  {
    prop: 'phone',
    label: '手机号',
    name: 'createTime'
  },
  {
    type: 'slot',
    label: '操作',
    fixed: 'right',
    align: 'center',
    width: '150',
    name: 'operate'
  }
])
const handleUpdate = (page: any) => {
  pageStore.currentPage = page.currentPage
  pageStore.pageSize = page.pageSize
  remoteMethod()
}
const checkList = reactive<any>([])
const selectionChange = (val: any) => {
  checkList.value = val
}

const dataSource = ref<Tree[]>([
  {
    id: 1,
    label: "浙江省财政厅",
    children: [
      {
        id: 2,
        label: "资产处",
      },
    ],
  },
]);
</script>
<style lang="scss" scoped>
  .el-dropdown-link{
    padding: 2px 10px;
    cursor: pointer;
    border-radius: 10px;
  }
  .el-dropdown-link:hover{
    background:#1642cb;
    color: #fff;
  }
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 3px 0;
    box-sizing: border-box;
    .info {
      padding: 0 0 3px 0;
      box-sizing: border-box;
    }
    .body {
      height: 100%;
      background: #fff;
      display: flex;
      flex-direction: column;
      flex: 1;
      .btn-check{
        padding: 8px 16px;
        color: #154ad8;
      }
      .btn-check:hover{
          background: #154ad8;
          color: #fff;
          padding: 8px  16px;
      }
      .body-tabs {
        margin: 0px 20px;
        margin-top: 10px;
        position: relative;
        hr {
          position: absolute;
          width: 100%;
          border-top: none;
          border-left: none;
          margin-top: -3px;
          border-bottom: solid 3px var(--el-menu-border-color);
        }
        .el-menu-item {
          margin-right: 20px;
          padding: 0;
        }
        .el-menu--horizontal{
          border: 0;
          // border-bottom: solid 3px var(--el-menu-border-color);
          height: 40px;
        }
        .is-active{
          background: #fff;
          z-index: 2;
          border-bottom: 3px solid var(--el-menu-active-color);
        }
        .el-menu--horizontal:hover, .el-menu-item:hover{
          background: #fff;
        }
      }
      .table-tabs{
        width: 500px;
        .el-menu--horizontal{
          border: 0;
        }
        .el-menu-item{
          padding: 0;
          margin-right: 16px;
          margin-bottom: 3px;
          border: 0 !important;
        }
        .is-active{
          background: #fff;
        }
        .is-active::after{
          content:'';
          position: absolute;
          left: 0;
          margin-left: calc(50% - 9px);
          bottom: 25%;
          width:18px;
          border-radius: 5px;
          height: 2px;
          background: #154ad8;
        }
        .el-menu--horizontal:hover, .el-menu-item:hover{
          background: #fff;
        }
      }
    }
  }
</style>
