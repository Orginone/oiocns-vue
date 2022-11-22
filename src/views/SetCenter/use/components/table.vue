<template>
    <div class="content box">
      <div class="body" ref="bodyWrap">
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
            <h4>应用列表</h4>
          </template>
          <template #buttons>
            <el-button class="btn-check" type="primary" link>创建应用</el-button>
          </template>
          <template #operate="scope">
            <el-dropdown>
              <span class="el-dropdown-link"> ··· </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="showDiong">应用分配</el-dropdown-item>
                  <el-dropdown-item @click="showDiong">查看详情</el-dropdown-item>
                  <el-dropdown-item @click="showDiong" style="color: #f67c80">退订</el-dropdown-item>
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
  import diytab from "@/components/diyTable/index.vue";
  import { ref } from "vue";
  
  // 表格展示数据
  const pageStore = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0
  })
  const tableData = ref([{
    account:'自动化测试',
    nickname:'ZDHCS889',
    name:'Web应用',
    phone:'所属权',
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
      label: '应用名称',
    },
    {
      prop: 'nickname',
      label: '应用编码',
      name: 'nickname'
    },
    {
      prop: 'name',
      label: '应用类型',
      name: 'name'
    },
    {
      prop: 'phone',
      label: '持有权限',
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
      box-sizing: border-box;
      .body {
        height: 100%;
        background: #fff;
        display: flex;
        flex-direction: column;
        flex: 1;
        .btn-check{
          font-size: 14px;
          padding: 8px 16px;
          color: #154ad8;
        }
        .btn-check:hover{
            background: #154ad8;
            color: #fff;
            padding: 8px  16px;
        }
      }
    }
  </style>
  