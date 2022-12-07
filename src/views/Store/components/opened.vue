<template>
  <div class="detail">
    <div class="detail-title">最近打开</div>
    <div class="detail-list">
      <div class="list-item" v-for="(item, index) in appList"
        :key="index"
        >
        <div class="row row-left">
          <img :src="item.icon" alt="" />
          <div class="version">v0.1</div>
        </div>
        <div class="row row-content">
          <div class="title">
            <span class="title-text">{{item.name}}</span>
            <span>
              <el-dropdown>
                <span class="el-dropdown-link"> ··· </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleChooseItem(item)">打开</el-dropdown-item>
                    <el-dropdown-item @click="jumpDetail(item)">详情</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </span>
          </div>
          <div class="describe">
            {{item.remark}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
import { appstore } from '@/module/store/app'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCommonStore } from '@store/common'
import img1 from '@/assets/img/group22.png'
const emit = defineEmits(['joinFriend'])
const router = useRouter()
const appList = ref<ProductType[]>([])
const commonStore = useCommonStore()
const handleChooseItem = async (app: any) => {
  const { result = [], total = 0 } = await appstore.queryOwnResource(app.id)
  if (total === 0) {
    return ElMessage({
      type: 'error',
      message: '该应用资源缺失,请联系管理员'
    })
  }
  const { link } = result[0]
  let data = { type: '', appInfo: app, icon: img1, link, path: '/online' }
  data.type = 'app'
  commonStore.iframeLink = data.link
  commonStore.appInfo = data.appInfo
  router.push(data.path)
}
const jumpDetail = (item:any)=>{
  router.push('/store/appManagement?id='+item.id)
}
const getAppList = async () => {
  appstore.searchUsefulProduct((res:any)=>{
    appList.value = res.data.result.map((item: any) => {
      return { ...item, icon: img1 }
    })
  })
 
}
onMounted(() => {
  getAppList()
})
onMounted(() => {
});
const showDiong = () => {};
const commontActive = () => {};
</script>
<style lang="scss">
.drop-link {
  cursor: pointer;
  padding: 2px 10px;
  border-radius: 10px;
}
.drop-link:hover {
  background: var(--el-bg-color-overlay);
}
</style>
<style lang="scss" scoped>
.detail {
  background: #fff;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  max-height: 200px;
  min-height: 130px;
  padding: 12px;
  margin-top:3px;
  .detail-title {
    font-size: 14px;
    color: #303133;
    margin-bottom: 10px;
  }
  .detail-list {
    display: flex;
    flex-wrap: nowrap;
    height: 102px;
    flex: 1;
  }
  .list-item {
    width: 187px;
    min-width: 187px;
    display: flex;
    flex-wrap: nowrap;
    border: 1px solid #eee;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 12px 12px;
    margin-right: 10px;
    .row {
      img {
        width: 52px;
        height: 52px;
        border-radius: 10px;
      }
      .version {
        font-size: 12px;
        color: #606266;
        margin-top: 5px;
      }
      .title {
        color: #303133;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title-text{
          width:75px;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        span:nth-child(2n) {
          display: flex;
          align-items: center;
        }
      }
      .describe {
        color: #606266;
        font-size: 12px;
        -webkit-line-clamp: 2;
        margin-top: 3px;

        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .row-left {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 10px;
    }
  }
}
</style>
