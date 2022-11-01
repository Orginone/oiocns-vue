<template>
  <div class="homeLayout">

    <!-- 头部 用户信息 -->
    <div class="headers">

      <Head />
    </div>

    <el-row :gutter="10" class="articleTop">
      <!-- 邀请更多成员 -->
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="articleTop-left">
        <Invitate />
      </el-col>
      <el-col xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="articleTop-right">
        <!-- 创建组织单位 -->
        <Organization />
      </el-col>
    </el-row>

    <el-row :gutter="10" class="articleBtm">
      <!-- 常用应用推荐 -->
      <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16" class="articleBtm-box">
        <div class="articleBtm-right">

          <AppCommon @joinFriend="joinFriend" />
        </div>
        <!-- 探索更多功能 -->
        <div class="articleBtm-rightBtm">
          <AppMarket />
        </div>
      </el-col>
      <el-col :span="8" :xs="24" :sm="24" :md="24" :lg="8" :xl="8" style="margin-top: 10px;">
        <!-- 后台管理 -->

        <ManageSystem />

      </el-col>
    </el-row>
    <searchFriend v-if="dialogVisible" @closeDialog="dialogVisible = false" :serachType="1"
      @checksSearch="checksSearch" />
    <!-- <el-dialog v-model="dialogVisible" title="添加好友" width="30%"> -->

    <!-- <el-select v-model="value" filterable remote reserve-keyword placeholder="请输入要查找的好友名"
        :remote-method="remoteMethod" :loading="loading" style="width: 100%;">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitFriends">确认</el-button>
        </span>
      </template> -->
    <!-- </el-dialog> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import searchFriend from '@/components/searchs/index.vue'
import Menu from '@/views/Layout/components/menu.vue'
import Head from '@/components/protal/components/head.vue'
import Invitate from '@/components/protal/components/invitate.vue'
import Organization from '@/components/protal/components/organization.vue'
import AppMarket from '@/components/protal/components/appMarket.vue'
import AppCommon from '@/components/protal/components/appCommon.vue'
import ManageSystem from '@/components/protal/components/manageSystem.vue'
import FriendServices from '@/module/relation/friend'
import $services from '@/services'
import { ElMessage } from 'element-plus'

interface ListItem {
  value: string
  label: string
}
type arrList = {
  id: string
}
const friendServices = new FriendServices()
const isShowMenu = ref<boolean>(false)
const options = ref<ListItem[]>([])
const value = ref('')
const loading = ref(false)
onMounted(() => {
  isShowMenu.value = true
})
const addFriends = (arr: Array<arrList>) => {
  const data = friendServices.applyJoin(arr)
  if (data) {
    ElMessage({
      message: '申请成功',
      type: 'warning'
    })
    dialogVisible.value = false
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
    dialogVisible.value = false
  }
}
const dialogVisible = ref(false)
const joinFriend = () => {
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
// :deep(.el-row) {
//   margin-left: 0 !important;
//   margin-right: 0 !important;
// }

.homeLayout {
  padding-top: 4px;
  overflow-x: hidden;
  height: 100%;

}

.headers {
  width: 100%;
  height: 14%;
  min-height: 90px;
}

.articleTop {
  // display: flex;
  // width: 100%;
  height: 18%;
  margin-top: 10px;
  min-height: 120px;

  &-left {
    // width: 50%;
    height: 100%;
    // margin-right: 10px;
  }

  &-right {
    // width: 50%;
    height: 100%;
  }
}

.articleBtm {
  // min-height: 450px;
  min-height: 64%;

  &-box {
    // height: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }

  &-right {
    // width: 100%;
    min-height: 320px;
  }

  &-rightBtm {
    flex: 1;
    // width: 100%;
    margin-top: 10px;
    // height: calc(100% - 330px);

  }


}
</style>
