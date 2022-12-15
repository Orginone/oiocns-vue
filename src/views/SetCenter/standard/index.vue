<template>
    <div class="main">
      <div class="content">
        <div class="detail">
          <el-descriptions
              class="margin-top"
              title="万物的基本信息"
              :column="2"
              border
          >
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  共享组织
                </div>
              </template>
              kooriookami
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  分类编码
                </div>
              </template>
              18100000000
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  开放域
                </div>
              </template>
              Suzhou
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  创建时间
                </div>
              </template>
              School
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  分类定义
                </div>
              </template>
              No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="table">
          <DiyTable
              :style="{ width: '100%' }"
              ref="diyTable"
              :hasTabs="true"
              :hasTitle="false"
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
                    :default-active="`1`"
                    class="el-menu-demo"
                    mode="horizontal"
                    :ellipsis="false"
                >
                  <el-menu-item index="1">全部</el-menu-item>
                </el-menu>
              </div>
            </template>
            <template #buttons>
              <el-button class="btn-check" type="primary" link>新增特性</el-button>
            </template>
            <template #operate="scope">
              <el-dropdown>
                <span class="el-dropdown-link"> ··· </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="showDiong">编辑</el-dropdown-item>
                    <el-dropdown-item @click="showDiong" style="color: #f67c80">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <template #slot-card>
              <!-- <card></card> -->
            </template>
          </DiyTable>
        </div>
      </div>
    </div>
</template>
<script lang="ts" setup>
  // @ts-nocheck
  import DiyTable from "@/components/diyTable/index.vue";
  import { ref } from "vue";
  // 表格展示数据
  const pageStore = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0
  })
  const tableData = ref([{
    account:'业务名',
    nickname:'string',
    name:'3~20',
    phone:'王伍',
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
      prop: 'code',
      label: '特性编码',
    },
    {
      prop: 'nickname',
      label: '特性名称',
      name: 'nickname'
    },
    {
      prop: 'name',
      label: '特性类型',
      name: 'name'
    },
    {
      prop: 'phone',
      label: '特性分类',
      name: 'createTime'
    },
    {
      prop: 'phone',
      label: '共享组织',
      name: 'createTime'
    },
    {
      prop: 'phone',
      label: '特性定义',
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
    .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      background: #f0f4f8;
      .detail {
        background: #fff;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        max-height: 300px;
        min-height: 130px;
        padding: 12px;
        margin-top:3px;
      }
      .table {
        background: #fff;
        margin-top: 3px;
        height: calc(100vh - 290px);

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
</style>