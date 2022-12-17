<template>
  <div class="card" ref="cardHeight">
    <div :style="{ height: tabHeight + 'px' }">
      <div style="width: 100%; height: 100%">
        <DiyTable 
          ref="diyTable"
          :hasTitle="true" 
          :tableName="props.selectItem?.label ?? props.selectItem?.name" 
          :hasTableHead="true" 
          :tableData="companies"
          @handleUpdate="handleUpdate"
          :tableHead="tableHead"
        >
          <template #buttons>
            <div style="display: flex;align-items: center">
              <el-button v-if="allowEdit() && props.selectItem?.item?.typeName == '集团'" class="btn-check" type="primary" link @click="handleShare()">分享集团</el-button>
              <el-divider v-if="props.selectItem?.item?.typeName == '集团'" direction="vertical"/>
              <el-button class="btn-check" type="primary" link>岗位设置</el-button>
              <el-divider direction="vertical"/>
              <el-button class="btn-check" v-if="allowEdit() && props.selectItem?.item?.typeName == '集团'" small link type="primary" @click="pullCompanysDialog = true">添加单位</el-button>
              <el-divider v-if="props.selectItem?.item?.typeName == '集团'" direction="vertical"/>
              <el-button class="btn-check" v-if="allowEdit() && props.selectItem?.item?.typeName == '集团'" small link type="primary" @click="viewApplication">查看申请</el-button>
              <el-button class="btn-check" v-if="allowEdit() && props.selectItem?.item?.typeName == '子集团'" small link type="primary" @click="showAssignDialog">分配单位</el-button>
            </div>
          </template>
          <template #operate="scope">
            <el-dropdown>
              <span class="el-dropdown-link"> ··· </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="removeFrom">调整节点</el-dropdown-item>
                  <el-dropdown-item @click="removeFrom">集团岗位</el-dropdown-item>
                  <el-dropdown-item v-if="allowEdit() && scope.row.id !== authority.getSpaceId()" @click="removeFrom(scope.row)" style="color: #f67c80">移出集团</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </DiyTable>
      </div>
    </div>
  </div>
  <searchCompany v-if="pullCompanysDialog" :checkList="companies" :selectLimit="0" :serachType="3"
    @closeDialog="closeDialog" @checksSearch="checksSearch" />
  <searchCompany v-if="assignDialog" :checkList="companies" :id="rootGroup.id" :selectLimit="0" :serachType="6"
    @closeDialog="hideAssignDialog" @checksSearch="checksCompanySearch" />
  <el-dialog customClass="QrDialog" v-model="dialogVisible" title="邀请加入集团" width="30%">
    <p>方式一：分享二维码，邀请加入集团</p>
    <div class="QrDiv" :key="props.selectItem?.id">
      <QrCodeCustom :qrText="props.selectItem?.label ?? props.selectItem?.name" />
    </div>
    <p>方式二：分享到群组，邀请加入集团</p>
    <div class="share-link">分享到群组...</div>
    <template #footer>
      <span>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import DiyTable from '@/components/diyTable/index.vue'
import { onMounted, reactive, ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import searchCompany from '@/components/searchs/index.vue'
import authority from '@/utils/authority'
import QrCodeCustom from '@/components/qrCode/index.vue'
const props = defineProps<{
  selectItem: any // 节点数据
  tabHeight: any
}>()
const rootGroup = ref<any>({})
// 表格用户数据
let companies = ref<any>([])

const allowEdit = () => {
  if (props.selectItem && props.selectItem.id) {
    return authority.IsRelationAdmin([
      props.selectItem?.item?.target?.id,
      props.selectItem?.item?.target?.belongId
    ])
  }
  return false
}
const router = useRouter()
// 表格数据加载状态
const loading = ref<boolean>(false)
// 表格展示数据
const pageStore = reactive({
  tableData: [],
  currentPage: 1,
  pageSize: 20,
  total: 0
})

const diyTable = ref(null)

const tableHead = ref([
  {
    prop: 'name',
    label: '简称',
    name: 'name'
  },
  {
    prop: 'code',
    label: '信用代码'
  },
  {
    prop: 'team.name',
    label: '全称',
    name: 'teamName'
  },
  {
    prop: 'team.code',
    label: '代码'
  },
  {
    prop: 'team.code',
    label: '简介',
    name: 'teamCode'
  },
   {
    prop: '',
    label: '所属集团',
    name: ''
  },
  {
    type: 'slot',
    label: '操作',
    fixed: 'right',
    align: 'center',
    name: 'operate'
  }
])

const handleUpdate = (page: any) => {
  pageStore.currentPage = page.currentPage
  pageStore.pageSize = page.pageSize
  getCompanies()
}

// 加载岗位下的用户
const getCompanies = async (currentData = props.selectItem) => {
  console.log('props.selectItem: ', props.selectItem);
  if(currentData){
    const backData =  await currentData.item?.loadMembers({
      filter: "",
      limit: 20,
      offset: 0
    })
    if(backData?.result){
      companies.value =backData.result;
      pageStore.total = backData.total
      diyTable.value.state.page.total = pageStore.total
    }else{
      companies.value =[];
      pageStore.total = 0
    }
  }
}

const pullCompanysDialog = ref<boolean>(false)
const closeDialog = () => {
  pullCompanysDialog.value = false
}
type arrList = {
  id: string
}
const checksSearch = (val: any) => {
  if (val.value.length > 0) {
    let arr: Array<arrList> = []
    val.value.forEach((element: any) => {
      arr.push(element.id)
    })
    pullCompanys(arr)
  } else {
    pullCompanysDialog.value = false
  }
}
const checksCompanySearch = (val: any) => {
  if (val.value.length > 0) {
    let arr: Array<arrList> = []
    val.value.forEach((element: any) => {
      arr.push(element.id)
    })
    assign(arr)
  } else {
    assignDialog.value = false
  }
}

//拉单位进集团(待提供接口)
const pullCompanys = async (arr: any) => {
  // const data =  await groupServices.pullCompanys(props.selectItem.id,arr)
  if (data) {
    ElMessage({
      message: '添加成功',
      type: 'success'
    })
    getCompanies()
    pullCompanysDialog.value = false;
  }
}

//查看申请
const viewApplication = (row: any) => {
  router.push({ path: '/service/group', query: { type: 1, id: props.selectItem.id } })
}

// 移除(待提供接口)
const removeFrom = async (row: any) => {
  let rowObj = {
    name:row.name,
    id:row.id,
    typeName:props.selectItem.typeName
  }
  // const data =  await groupServices.removeCompany(rowObj,props.selectItem.id)
  if(data){
    ElMessage({
      message: '操作成功',
      type: 'success'
    })
    getCompanies()
  }
}

const assignDialog = ref<boolean>(false)
const hideAssignDialog = () => {
  assignDialog.value = false
}

const showAssignDialog = () => {
  assignDialog.value = true
}

// 分配单位到子集团(待提供接口)
const assign = async (arr: any) => {
  const companyIds = arr
  // const data = await groupServices.assignSubgroup(props.selectItem.id,companyIds)
  if(data){
    ElMessage({
      message: '分配成功',
      type: 'success'
    })
    hideAssignDialog()
    getCompanies()
  }
}

const cardHeight = ref(null)
const tabHeight = ref<number>(100)
onMounted(() => {
  nextTick(() => {
    let headerHeight = cardHeight.value?.clientHeight
    tabHeight.value = headerHeight
  })
})

// 分享集团
const dialogVisible = ref(false)
const handleShare = () => {
  dialogVisible.value = true
}

watch(props, () => {
  pageStore.currentPage = 1;
  getCompanies()
  nextTick(() => {
    let headerHeight = cardHeight.value?.clientHeight
    tabHeight.value = headerHeight
  })
})
watch(props.tabHeight, () => {
  let headerHeight = cardHeight.value?.clientHeight
  tabHeight.value = headerHeight
});

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
.QrDialog {
  .txt {
    margin: 0 0 10px 15px;
    text-align: center;
  }
  .QrDiv {
    text-align: center;
  }
}

.card {
  height: 100%;
  width: 100%;
  // background-color: #fff;
  padding: 10px 0;
  .btn-check{
    padding: 8px 16px;
    color: #154ad8;
  }
  .btn-check:hover{
    background: #154ad8;
    color: #fff;
    padding: 8px  16px;
  }
  .search {
    width: 50%;
  }
}
</style>
