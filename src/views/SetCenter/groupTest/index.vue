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
        <el-menu-item index="1">集团成员</el-menu-item>
        <el-menu-item index="2">杭州电子科技大学</el-menu-item>
      </el-menu>
      <hr >
      </div>
      <diytab
        :style="{ width: '100%' }"
        ref="diyTable"
        :hasTabs="true"
        :hasTitle="true"
        :hasTableHead="true"
        :tableData="tableData"
        :options="options"
        @handleUpdate="handleUpdate"
        @selectionChange="selectionChange"
        :tableHead="tableHead"
      >
        <template #slot-tabs>
          <h4>浙江省资产年报集团</h4>
        </template>
        <template #buttons>
          <div style="display: flex;align-items: center">
            <el-button class="btn-check" type="primary" link>岗位设置</el-button><el-divider direction="vertical"/>
            <el-button class="btn-check" type="primary" link>添加成员</el-button><el-divider direction="vertical"/>
            <el-button class="btn-check" type="primary" link>查看申请</el-button>
          </div>
        </template>
        <template #operate="scope">
          <el-dropdown>
            <span class="el-dropdown-link"> ··· </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="showDiong">调整节点</el-dropdown-item>
                <el-dropdown-item @click="showDiong">集团岗位</el-dropdown-item>
                <el-dropdown-item @click="showDiong" style="color: #f67c80">移出集团</el-dropdown-item>
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
import { ref, getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance()

proxy?.$Bus.on('clickBus', (id) => {
  console.log(id);
})

const info = ref(null);

// 表格展示数据
const pageStore = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})
const tableActiveIndex = ref<string>('1'); //table nav index
const tableData = ref([{
  account:'浙江省财政厅',
  nickname:'1133000000022482170C',
  name:'浙江省财政厅',
  phone:'zjczt',
  phone2: '财政厅简介'
}])
const options = ref<any>({
  checkBox: false,
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
    label: '简称',
  },
  {
    prop: 'nickname',
    label: '信用代码',
    name: 'nickname'
  },
  {
    prop: 'name',
    label: '全称',
    name: 'name'
  },
  {
    prop: 'phone',
    label: '代码',
    name: 'createTime'
  },
  {
    prop: 'phone2',
    label: '简介',
    name: 'phone2'
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
    }
  }
</style>
