<template>
  <el-card class="appCommon" body-style="padding:0">
    <template #header>
      <div class="appCommon-title">我的应用</div>
    </template>

    <div class="appCommon-content">
      <div
        class="appCommon-content-box"
        v-for="(item, index) in appList"
        :key="index"
        @click="handleChooseItem(item)"
      >
        <HeadImg :name="item.name" :url="item.icon" :imgWidth="40" :limit="1" :isSquare="false" />
        <!-- <img src="@/assets/img/app_icon.png" alt="" /> -->
        <div class="textBox">
          <div class="textBox-top">{{ item.name }}</div>
          <div class="textBox-btm">{{ item.remark }}</div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
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
    commonStore.iframeLink = data?.link
    router.push(data.path)
  }
  const getAppList = async () => {
    const result = await appstore.searchUsefulProduct()
    appList.value = result.map((item: any) => {
      return { ...item, icon: img1 }
    })
    console.log('====', appList.value)
  }
  onMounted(() => {
    getAppList()
  })
</script>

<style lang="scss" scoped>
  .appCommon {
    width: 100%;
    height: 100%;
    background: var(--el-bg-color-overlay);
    // display: flex;
    // flex-direction: column;
    overflow: hidden;

    &-title {
      font-size: 16px;
      // border-bottom: 1px solid rgb(232, 232, 232);
      // font-weight: 600;
      // padding: 20px;
      // margin-bottom: 10px;
    }

    &-content {
      // display: flex;
      // width: 100%;
      // height: 100%;
      // flex: 1;
      // flex-wrap: wrap;
      // justify-content: space-around;
      display: grid;
      width: 100%;
      // grid-template-rows: repeat(2, 1fr);
      grid-template-columns: repeat(3, 1fr);
      grid-auto-flow: row;

      &-box {
        cursor: pointer;
        // width: 30%;
        // height: 40%;
        border-bottom: 1px solid var(--el-card-border-color);
        border-left: 1px solid var(--el-card-border-color);
        display: flex;
        align-items: center;
        padding: 37px 24px;
        transition: all var(--el-transition-duration);

        &:hover {
          background-color: var(--el-border-color-extra-light);
          color: var(--brand-color-light);
          box-shadow: 0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%),
            0 5px 12px 4px rgb(0 0 0 / 9%);
        }

        // img {
        //   width: 60px;
        //   height: 60px;
        // }
      }

      &-icon {
        background-color: #e9ebf5;
        border-radius: 50%;
        width: 56px;
        height: 56px;
      }
    }
  }

  .textBox {
    margin-left: 20px;

    &-top {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      // color: var(--el-text-color-regular);
    }

    &-btm {
      font-size: 14px;
      color: var(--el-color-info);
    }
  }
</style>
