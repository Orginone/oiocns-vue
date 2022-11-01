<template>
  <div class="unitLayout">
    <div class="tableBtn">
      <div class="tableBtn-title">{{ route.query.name }}</div>
      <el-button small link type="primary" @click="pullCompanysDialog = true">添加单位</el-button>
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
    v-if="pullCompanysDialog"
    :checkList="tableData"
    :tableData="tableData"
    :id="groupId"
    :selectLimit="0"
    :serachType="6"
    @closeDialog="closeDialog"
    @checksSearch="checksSearch"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import $services from '@/services'
  import searchCompany from './components/index.vue'
  const route = useRoute()
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
  // 表格用户数据
  let tableData = ref<any>([])
  const pullCompanysDialog = ref<boolean>(false)
  onMounted(() => {
    groupId.value = props.groupId
    getShareHistory()
  })
  const closeDialog = () => {
    pullCompanysDialog.value = false
  }
  type arrList = {
    id: string
  }
  //确定共享
  const checksSearch = (val: any) => {
    let selectId: any[] = []
    val.value.forEach((el: { id: any }) => {
      selectId.push(el.id)
    })
    $services.product
      .share({
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
        pullCompanysDialog.value = false
      })
  }
  //取消共享
  const cancelShare = (id: string) => {
    $services.product
      .deleteUnitShare({
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
        pullCompanysDialog.value = false
      })
  }
  //共享单位

  const getShareHistory = () => {
    $services.product
      .searchUnitShare({
        data: {
          id: props.appInfo,
          teamId: props.groupId,
          offset: 0,
          limit: 10000,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        console.log(res)
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
