<template>
  <div class="homeLayout">
    <!-- 头部 用户信息 -->
    <div class="headers">
      <Head />
    </div>
    <div class="centers">
      <Cent />
    </div>
    <div class="footers">
      <Foot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import FriendServices from '@/module/relation/friend'
import Head from '@/components/protal/components/head.vue'
import Cent from '@/components/protal/components/cent.vue'
import Foot from '@/components/protal/components/foot.vue'
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
  height: 100%;
  display: block;
  background: #eff4f8;
  overflow: auto;
}

.headers {
  width: 100%;
  height: 39%;
}
.centers{
  width: 100%;
  height: 25%;
}
.footers{
  width: 100%;
  height: 34%;
  margin-top: 10px;
}

</style>
