<template>
  <div class="unitLayout">
    <div class="tableBtn">
      <div class="tableBtn-title">{{ groupName }}</div>
      <el-button small link type="primary" @click="pullGroupDialog = true">共享集团</el-button>
    </div>
    <DiyTable class="diytable" ref="diyTable" :tableData="tableData" :tableHead="tableHead">
      <template #operate="scope">
        <el-button link type="danger" size="small" @click="cancelShare(scope.row.id)"
          >取消共享</el-button
        >
      </template>
    </DiyTable>
  </div>
  <searchCompany
    v-if="pullGroupDialog"
    :checkList="tableData"
    :tableData="tableData"
    :id="groupId"
    :selectLimit="0"
    :serachType="7"
    @closeDialog="closeDialog"
    @checksSearch="checksSearch"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref, reactive } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import $services from '@/services'
  import searchCompany from './components/index.vue'
  const route = useRoute()
  const router = useRoute()
  const diyTable = ref(null)
  const groupId = ref<string>('')
  const props = defineProps({
    groupId: String,
    appInfo: String,
    groupName: String
  })
  const tableHead = ref([
    {
      prop: 'name',
      label: '名称',
      name: 'name'
    },
    {
      prop: 'code',
      label: '编码'
    },
    {
      prop: 'remark',
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
  const state = reactive({
    options: {
      expandAll: false,
      checkBox: true,
      order: false,
      noPage: true
    }
  })
  // 表格用户数据
  let tableData = ref<any>([])
  const pullGroupDialog = ref<boolean>(false)
  onMounted(() => {
    groupId.value = props.groupId
    getShareHistory()
  })

  const shareGroup = () => {
    console.log(diyTable.value.state.multipleSelection)
  }

  // const selectionChange = (data: any) => {
  //   console.log(data)
  // }

  const handleLazyTree = async (tree: any, callback: any) => {
    $services.company
      .getSubgroups({
        data: { id: tree.id, offset: 0, limit: 10000, filter: '' }
      })
      .then((res: ResultType) => {
        callback(res.data.result)
      })
    // callback(res.data.data)
  }

  const getData = () => {
    $services.company
      .companyGetGroups({
        data: {
          offset: 0,
          limit: 1000
        }
      })
      .then((res: ResultType) => {
        if (res.data.result && res.data.result.length > 0) {
          let obj = res.data.result.find((el: any) => {
            return el.id == props.groupId
          })
          obj.hasChildren = true
          tableData.value.push(obj)
        } else {
          tableData = []
        }
      })
  }
  const closeDialog = () => {
    pullGroupDialog.value = false
  }
  type arrList = {
    id: string
  }
  const checksSearch = (val: any) => {
    let selectId: any[] = []
    val.value.forEach((el: { id: any }) => {
      selectId.push(el.id)
    })
    $services.product
      .groupShare({
        data: {
          productId: props.appInfo,
          teamId: props.groupId,
          targetIds: selectId
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '共享成功',
            type: 'success'
          })
          getShareHistory()
        }
        pullGroupDialog.value = false
      })
  }
  //取消共享
  const cancelShare = (id: string) => {
    $services.product
      .deleteGroupShare({
        data: {
          productId: props.appInfo,
          teamId: props.groupId,
          targetIds: [id]
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '取消共享成功',
            type: 'success'
          })
          getShareHistory()
        }
        pullGroupDialog.value = false
      })
  }

  //
  const getShareHistory = () => {
    $services.product
      .searchGroupShare({
        data: {
          id: props.appInfo,
          teamId: props.groupId,
          offset: 0,
          limit: 10000,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          tableData.value = res.data.result ? res.data.result : []
        }
      })
  }
</script>

<style lang="scss" scoped>
  .tableBtn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    &-title {
      font-weight: 600;
    }
  }
  .diytable {
    flex: 1;
  }
  .unitLayout {
    width: 100%;
    height: 500px;
    background: #fff;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
</style>
