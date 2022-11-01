<template>
  <el-card class="manageSystem">
    <template #header>
    <div class="manageSystem-title">轻松上手后台管理</div>
    </template>
    <div class="content">
      <el-card shadow="hover" body-style="display:flex;align-items:center;padding:16px 20px;"

      class="contentBox"
        v-for="(item, index) in dataList" :key="index" @click="gotoRouter(item)">

        <div class="textBox">
          <div class="textBox-top">
            <el-icon class="item-icon" :size="22">
              <component :is="item.icon" />
            </el-icon>
            <span style="margin-left:8px">{{ item.name }}</span>
          </div>
          <div class="textBox-desc">{{ item.introduce }}</div>
        </div>
        <el-button link type="primary" icon="ArrowRight" style="font-size: 16px;">

          <!-- <el-icon :size="16" color="#909399" >
            <ArrowRight />
          </el-icon> -->
        </el-button>
      </el-card>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
const dataList = reactive([
  {
    img: 'work_big',
    name: '去办“事”',
    introduce: '专属⼯作台。在这⾥查看待办，完成⼯作',
    src: '/cardDetail?type=1',
    icon: 'Finished',
  },
  {
    name: '管理“物”',
    introduce: '探索应⽤，⾼效管理',
    icon: 'MessageBox',
  },
  {
    name: '查看“群”',
    introduce: '查看群消息，完善群架构',
    src: '/chat',
    icon: 'Connection',
  },
  {
    name: '完善“⼰”',
    introduce: '完善信息设置，切换个⼈与⼯作空间',
    icon: 'user',
  }
])
const router = useRouter()
const gotoRouter = (data: any) => {
  router.push(data.src)
}
</script>

<style lang="scss" scoped>
.item-icon {
  color: var(--el-color-primary);
}

.content {
  // flex: 1;
  // width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  // padding: 20px;
}

.textBox {
  flex: 1;

  // margin-left: 20px;
  &-top {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 14px;
  }

  &-desc {
    color: #909399;
    // height: 40px;
    // padding-right: 24px;
    font-size: 12px;
  }
}

.manageSystem {
  width: 100%;
  height: 100%;
  background: var(--el-bg-color-overlay);
  // display: flex;
  // flex-direction: column;

  &-title {
    font-size: 16px;
    // border-bottom: 1px solid rgb(232, 232, 232);
    // font-weight: 600;
    // padding:  16px 20px;
  }
}

.contentBox {
  // position: relative;
  cursor: pointer;
  margin-bottom: 10px;
  // margin: 16px auto;
  width: 100%;
  // height: 75px;
  border: 0;
  // display: flex;
  // align-items: center;
  // padding: 20px;
  // img {
  //   width: 20px;
  //   height: 20px;
  // }
}
</style>
