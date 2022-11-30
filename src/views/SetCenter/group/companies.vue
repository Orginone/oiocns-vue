<template>
  <div class="card" ref="cardHeight">
    <div class="header">
      <div class="title">{{ props.selectItem.label }}</div>
      <div class="box-btns">
        <div v-if="props.selectItem?.data?.typeName == '集团'">
          <el-button v-if="allowEdit()" small link type="primary" @click="pullCompanysDialog = true">添加单位</el-button>
          <el-button v-if="allowEdit()" small link type="primary" @click="viewApplication">查看申请</el-button>
        </div>
        <div v-if="
          props.selectItem?.data?.typeName == '子集团' ||
          props.selectItem?.data?.typeName == '工作组'
        ">
          <el-button v-if="allowEdit()" small link type="primary" @click="showAssignDialog">分配单位</el-button>
        </div>
      </div>
    </div>

    <div :style="{ height: tabHeight - 30 + 'px' }">
      <div style="width: 100%; height: 100%">
        <DiyTable ref="diyTable" :hasTableHead="false" :tableData="companies" @handleUpdate="handleUpdate"
          :tableHead="tableHead">
          <template #operate="scope">
            <el-button link type="danger" size="small"
              v-if="allowEdit() && scope.row.id !== authority.getSpaceId()" @click="removeFrom(scope.row)">移除单位</el-button>
          </template>
        </DiyTable>
      </div>
    </div>
  </div>
  <searchCompany v-if="pullCompanysDialog" :checkList="companies" :selectLimit="0" :serachType="3"
    @closeDialog="closeDialog" @checksSearch="checksSearch" />
  <searchCompany v-if="assignDialog" :checkList="companies" :id="rootGroup.id" :selectLimit="0" :serachType="6"
    @closeDialog="hideAssignDialog" @checksSearch="checksCompanySearch" />
</template>
<script lang="ts" setup>
import $services from '@/services'
import DiyTable from '@/components/diyTable/index.vue'
import { onMounted, reactive, ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import searchCompany from '@/components/searchs/index.vue'
import authority from '@/utils/authority'
import GroupServices from '@/module/relation/group'
const groupServices = new GroupServices()
const props = defineProps<{
  selectItem: any // 节点数据
  tabHeight: any
}>()
const rootGroup = ref<any>({})
// 表格用户数据
let companies = ref<any>([])

const allowEdit = () => {
  if (props.selectItem.data && props.selectItem.data.id) {
    return authority.IsRelationAdmin([
      props.selectItem.data.id,
      props.selectItem.data.belongId
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

// 加载单位
const getCompanies = async () => {
  const item = props.selectItem?.data
  if(item){
    if (item.typeName == '集团') {
      rootGroup.value = JSON.parse(JSON.stringify(item))
    }
    const backData = await groupServices.getCompanies(props.selectItem)
    companies.value = backData.result
    pageStore.total = backData.total
    diyTable.value.state.page.total = pageStore.total
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

//拉单位进集团
const pullCompanys = async (arr: any) => {
  const data =  await groupServices.pullCompanys(props.selectItem.id,arr)
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
  router.push({ path: '/cardDetail', query: { type: 1, id: props.selectItem.id } })
}

// 移除n
const removeFrom = async (row: any) => {
  let rowObj = {
    name:row.name,
    id:row.id,
    typeName:props.selectItem.data.typeName
  }
  const data =  await groupServices.removeCompany(rowObj,props.selectItem.data.id)
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

// 分配单位到子集团
const assign = async (arr: any) => {
  const companyIds = arr
  const data = await groupServices.assignSubgroup(props.selectItem.id,companyIds)
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
  getCompanies()
})

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
.card {
  height: 100%;
  width: 100%;
  // background-color: #fff;
  padding: 10px 0;

  .header {
    display: flex;

    .title {
      text-align: left;
      font-size: 16px;
      width: 50%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: bold;
    }

    .box-btns {
      text-align: right;
      padding-right: 14px;
      padding-bottom: 10px;
      width: 70%;
    }
  }

  .search {
    width: 50%;
  }
}
</style>
