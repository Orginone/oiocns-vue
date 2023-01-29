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
            <h4>单位首页配置</h4>
          </template>
          <template #buttons>
            <el-button type="primary" link @click="dialogFormVisible = true">添加方案</el-button>
          </template>
          <template #operate="scope">
            <el-dropdown>
              <span class="el-dropdown-link"> ··· </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="customBtn(scope.row)">自定义排版</el-dropdown-item>
                  <el-dropdown-item @click="shareBtn">分享</el-dropdown-item>
                  <el-dropdown-item @click="deleteBtn(scope.row)" style="color: #f67c80">删除方案</el-dropdown-item>
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
              <el-input v-model="form.schemaName"/>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="form.remark"/>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="cancelDialog">取消</el-button>
              <el-button type="primary" @click="addSchema">
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
  import { useUserStore } from '@/store/user'
  import { useAnyData } from '@/store/anydata'
  import { useRouter } from 'vue-router'
  import { portalCtrl, logger } from '@/ts/coreIndex';
  import { ElMessage } from 'element-plus';
  import { getUuid  } from '@/utils/tools'
  import dayjs from 'dayjs'
  
  const store = useUserStore()
  const otherData = useAnyData()
  const router = useRouter()
  const dialogFormVisible = ref(false)
  const formLabelWidth = '140px'

  const form = reactive({
    schemaName: '',
    remark: '',
  })
  // 表格展示数据
  const pageStore = reactive({
    currentPage: 0,
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
      prop: 'schemaName',
      label: '方案名称',
    },
    {
      prop: 'nickname',
      label: '创建人',
      name: 'nickname'
    },
    {
      prop: 'remark',
      label: '备注',
      name: 'remark'
    },
    {
      prop: 'createTime',
      label: '创建时间'
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
    pageStore.currentPage = page.current
    pageStore.pageSize = page.pageSize
    getSchema()
  }
  
  
  const shareBtn = () => {}
  
  const checkList = reactive<any>([])
  const selectionChange = (val: any) => {
    checkList.value = val
  }
  
  const cancelDialog = () => {
    dialogFormVisible.value = false;
    form.schemaName = "";
    form.remark = "";
  }
  /**
   * 查询方案
   */
  const getSchema = async () => {
    const params = {
      workspaceId: store.workspaceData.id,
      skip: pageStore.currentPage,
      limit: pageStore.pageSize
    }
    const res = await portalCtrl.getPortal(params)
    console.log(res);
    tableData.value = res.data      
  }
  /**
   * 删除按钮
   */
  const deleteBtn = (val) => {
    ElMessageBox.confirm(
      '请确认是否要删除这条数据',
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
      )
      .then(async () => {
        const param = {
          workspaceId: store.workspaceData.id,
          match: val
        }
        portalCtrl.delPortal(param)
        await getSchema()
        await getListLength()
        ElMessage.success('操作成功')
      })
      .catch(() => {})
  }
    
    /**
     * 新增方案
     */
  const addSchema = async () => {
    const params = {
      workspaceId: store.workspaceData.id,
      content: {
        schemaName: form.schemaName,
        remark: form.remark,
        nickname: store.userInfo.person.name,
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        id: getUuid(),
        temps: [],
      }
    } 
      
    await portalCtrl.addPortal(params)
    ElMessage({
      message: '创建成功',
      type: 'success'
    })
    getSchema()
    getListLength()
    cancelDialog()
  }
  /**
    * 自定义排版跳转
    */
  const customBtn = (val) => {    
    otherData.setActiveSchema(val)
    router.push({
        path: '/work',
        query: {
          onValue: 0
         }
     })
  }
  /**
   * 获取数据长度
   */
  const getListLength = async () => {
    const params = {
      workspaceId: store.workspaceData.id,
      skip: 0,
      limit: 99999
    }
      
    const res = await portalCtrl.getPortal(params)
     pageStore.total = res.data.length
  }

  onMounted(() => {
    setTimeout(() => {
      getSchema();
      getListLength(); 

    }, 500);
  })

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
      }
    }
  </style>
  