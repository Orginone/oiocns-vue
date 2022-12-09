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
            <h4>单位首页配置</h4>
          </template>
          <template #buttons>
            <el-button class="btn-check" type="primary" link @click="dialogFormVisible = true">添加方案</el-button>
          </template>
          <template #operate="scope">
            <el-dropdown>
              <span class="el-dropdown-link"> ··· </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="customBtn">自定义排版</el-dropdown-item>
                  <el-dropdown-item @click="shareBtn">分享</el-dropdown-item>
                  <el-dropdown-item @click="deleteBtn" style="color: #f67c80">删除方案</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #slot-card>
            <!-- <card></card> -->
          </template>
        </diytab>
        <el-dialog v-model="dialogFormVisible" title="添加方案">
          <el-form :model="form">
            <el-form-item label="方案名称" :label-width="formLabelWidth">
              <el-input v-model="form.name"/>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="form.remarks"/>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" @click="dialogFormVisible = false">
                确认
              </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </template>
  <script lang="ts" setup>
  // @ts-nocheck
  import diytab from "@/components/diyTable/index.vue";
  import { ref } from "vue";
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const dialogFormVisible = ref(false)
  const formLabelWidth = '140px'

  const form = reactive({
    name: '',
    remarks: '',
  })
  // 表格展示数据
  const pageStore = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0
  })
  const tableData = ref([{
    account:'方案1',
    nickname:'张叁',
    name:'管理员',
    phone:'通用布局',
    phone2: ''
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
      label: '方案名称',
    },
    {
      prop: 'nickname',
      label: '创建人',
      name: 'nickname'
    },
    {
      prop: 'name',
      label: '角色',
      name: 'name'
    },
    {
      prop: 'phone',
      label: '备注',
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
  const customBtn = () => {
    router.push({
        path: '/work',
        query: {
          onValue: 0
        }
      })
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
  