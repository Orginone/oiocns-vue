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
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCommonStore } from '@store/common'
import img1 from '@/assets/img/group22.png'
import marketCtrl from '@/ts/controller/store/marketCtrl';

const emit = defineEmits(['joinFriend'])
const router = useRouter()
const appList = ref<ProductType[]>([])
const commonStore = useCommonStore()

const jumpDetail = (item:any)=>{
  router.push('/store/appManagement?id='+item.id)
}
const getAppList = async () => {
  marketCtrl.Market.getOwnProducts(false).then((res)=>{
    console.log('res',res)
    let arr:any = []
    res.forEach(element => {
      let obj = {
        name: element.prod.name,
        updateTime:element.prod.updateTime,
        createTime:element.prod.createTime,
        typeName:element.prod.typeName,
        updateUser:element.prod.updateUser,
        authority:element.prod.authority,
        belongId:element.prod.belongId,
        code:element.prod.code,
        source:element.prod.source,
        remark:element.prod.remark,
        icon:img1
      }
      arr.push(obj)
    });
    appList.value = arr;
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
