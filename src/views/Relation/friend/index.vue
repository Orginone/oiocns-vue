<template>
  <el-card style="border: 0" shadow="never" class="container">
    <!-- 组内成员信息 -->

    <div class="card-header">
      <span>我的好友</span>
      <div>
        <el-button small link type="primary" @click="friendShow">添加好友</el-button>
        <el-button small link type="primary" @click="friendApply">查看申请</el-button>
        <el-button small link type="primary" @click="toAuth">角色管理</el-button>
        <el-button small link type="primary" @click="toIdentity">岗位管理</el-button>
      </div>
    </div>
    <DiyTable
      :style="{ height: 'calc(100vh - 130px)', width: '100%' }"
      ref="diyTable"
      :total="pageStore.total"
      :hasTableHead="true"
      :tableData="state.friendList"
      :options="options"
      @handleUpdate="handleUpdate"
      :tableHead="tableHead"
    >
      <template #options="scope">
        <el-popconfirm title="您确认删除该好友吗?" @confirm="deleteFriend(scope.row.id)">
          <template #reference>
            <el-button type="danger" link>删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </DiyTable>
    <searchFriend
      v-if="searchDialog"
      @closeDialog="closeDialog"
      :serachType="1"
      @checksSearch="checksSearch"
    />
  </el-card>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import searchFriend from '@/components/searchs/index.vue'
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import {chat} from '@/module/chat/orgchat'
  import DiyTable from '@components/diyTable/index.vue'
  import FriendServices from '@/module/relation/friend'
  const friendServices  = new FriendServices()

  const router = useRouter()

  const searchDialog = ref<boolean>(false)

  type arrList = {
    id: string
  }
  const diyTable = ref(null)
  // 表格展示数据
  const pageStore = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0
  })
  const tableHead = ref([
    {
      prop: 'code',
      label: '账号',
      name: 'code'
    },
    {
      prop: 'name',
      label: '昵称',
      name: 'name'
    },
    {
      prop: 'trueName',
      label: '姓名',
      name: 'trueName'
    },
    {
      prop: 'teamCode',
      label: '手机号',
      name: 'teamCode'
    },
    {
      prop: 'remark',
      label: '座右铭',
      name: 'remark'
    },
    {
      type: 'slot',
      prop: 'options',
      label: '操作',
      name: 'options',
      fixed: 'right'
    }
  ])
  const options = ref<any>({
    checkBox: true,
    order: true,
    selectLimit: 1,
    defaultSort: { prop: 'createTime', order: 'descending' },
    treeProps: {
      children: 'children',
      hasChildren: 'hasChildren'
    }
  })
  const addFriends = (arr: Array<arrList>) => {
    const data =  friendServices.applyJoin(arr)
     if(data){
      ElMessage({
        message: '申请成功',
        type: 'warning'
      })
      searchDialog.value = false
      getFriendList()
     }
  }
  const handleUpdate = (page: any) => {
    pageStore.currentPage = page.currentPage
    pageStore.pageSize = page.pageSize
    getFriendList()
  }
  const handleSelect = (key: string, keyPath: string[]) => {
    // console.log(key, keyPath)
  }
  onMounted(() => {
    getFriendList()
  })

  const state = reactive({ qunList: [], friendList: [] })
  const getFriendList = async () => {
    const backData = await friendServices.getFriends();
    if(backData){
      state.friendList  = backData.friendList;
      diyTable.value.state.page.total = backData.total
    }
  }
  //删除好友
  const deleteFriend = async (id: string) => {
    const data = await friendServices.remove(id)
    if(data){
      ElMessage({
        message: '删除成功',
        type: 'warning'
      })
      getFriendList()
    }
  }
  const checksSearch = (val: any) => {
    if (val.value.length > 0) {
      let arr: Array<arrList> = []
      val.value.forEach((element: any) => {
        arr.push(element.id)
      })
      addFriends(arr)
    } else {
      searchDialog.value = false
    }
  }
  const closeDialog = () => {
    searchDialog.value = false
  }
  const friendShow = () => {
    searchDialog.value = true
  }
  const friendApply = () => {
    router.push({ path: '/cardDetail', query: { type: 1, id: chat.userId.value } })
  }

  // 跳转至角色管理页面
  const toAuth = () => {
    router.push({
      path: '/relation/authority',
      query: {
        title: '好友',
        belongId: chat.userId.value,
        name: '我的好友',
        code: 'friends',
        teamRemark: '给好友设置角色'
      }
    })
  }

  // 跳转至岗位管理页面
  const toIdentity = () => {
    router.push({
      path: '/relation/identity',
      query: {
        belongId: chat.userId.value,
        name: '我的好友',
        module: 'person',
        persons: 'getFriends'
      }
    })
  }
</script>
<style lang="scss" scoped>
  .container {
    width: 100%;
    // height: 100%;
    margin: 3px;
    // background: #f0f2f5;
    // padding: 5px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      // padding: 10px;
      // background: #fff;
      .edit {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .tab-list {
    height: 80vh;
  }
</style>
