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
        :total="pageStore.total"
        @handleUpdate="handleUpdate"
        @selectionChange="selectionChange"
        :tableHead="tableHead"
      >
        <template #slot-tabs>
          <h4>关联角色</h4>
        </template>
        <template #buttons>
          <el-button @click="addRole()" class="btn-check" type="primary" link>
            添加身份
          </el-button>
        </template>
        <template #operate="scope">
          <el-dropdown>
            <span class="el-dropdown-link"> ··· </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="removeFrom(scope.row)" style="color: #f67c80">移除角色</el-dropdown-item>
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
  <el-dialog
    v-model="dialogTableVisible"
    custom-class="share-dialog"
    title="添加身份"
    width="1000px"
    draggable
    append-to-body
    :close-on-click-modal="false"
  >
    <ShareComponent
        dialogType="1"
        @closeDialog="closeDialog(false)"
        @add="add"
        :info="[]"
      >
      </ShareComponent>
  </el-dialog>
</template>
<script lang="ts" setup>
// @ts-nocheck
import diytab from "@/components/diyTable/index.vue";
import { ref, reactive, watch } from "vue";
import { setCenterStore } from '@/store/setting'
import ShareComponent from "../../GlobalComps/shareComponents.vue";
const dialogTableVisible = ref(false)
// 关闭弹窗
const closeDialog = (type: string, key: boolean) => {
  dialogTableVisible.value = key;
};

const add = async(val: any) => {
  const res = await store.currentSelectItme?.object.pullIdentitys(val)
  if(res) {
    closeDialog(false)
     ElMessage({
        message: '添加成功',
        type: 'success'
      })
    getUsers
  }
}

const addRole = () => {
  dialogTableVisible.value = true
}

// 表格展示数据
const pageStore = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})
const tableData = ref([])
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
    label: 'ID',
    prop: 'id',
  },
  {
    prop: 'name',
    label: '身份名称',
    name: 'name'
  },
  {
    label: '职权',
    prop: 'name',
  },
  {
    label: '备注',
    prop: 'remark',
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
const store = setCenterStore()
// 加载岗位下的角色
const getUsers = async () => {
  const backData =  await store.currentSelectItme.object?.loadIdentitys(true)
  if(backData.length){
    tableData.value =backData
    pageStore.total = backData.length
  }else{
    tableData.value =[];
    pageStore.total = 0
  }
}
const handleUpdate = (page: any) => {
  pageStore.currentPage = page.currentPage
  pageStore.pageSize = page.pageSize
  remoteMethod()
}
const checkList = reactive<any>([])
const selectionChange = (val: any) => {
  checkList.value = val
}

// 移除岗位下的角色
const removeFrom = (row: any) => {
  let url: string = 'removeIdentity';
  ElMessageBox.confirm(
    `是否移除该身份？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    const data = await store.currentSelectItme.object?.removeIdentitys([row.id])
    if(data){
      getUsers()
      ElMessage({
        message: '移除成功',
        type: 'success'
      })
    }
  })
    .catch(() => {
      console.log('移除成功!')
    })
}

watch(
  () => store.currentSelectItme,
  (newValue, _) => {
    if(newValue){
      if(newValue.label === '岗位管理') return
      getUsers()
    }
  },
  { immediate: false }
);
</script>
<style lang="scss" scoped>
  :deep .el-table th.el-table__cell {
    background-color: #eceffb!important;
  }
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
