<template>
  <div class="header">
    <div class="header-left">
      <img class="header-left-img" src="@/assets/img/头像.png" alt="" />
      <!-- <div class="header-left__avater">俞</div> -->
      <div class="header-left-box">
        <div class="header-left-box__top">{{ getTimeState() }} {{ queryInfo.name }}!</div>
        <div class="header-left-box__btm">管理⼈员 | 本次登录 {{ getTime }}</div>
      </div>
    </div>
    <div class="header-right">
      <!-- <el-divider direction="vertical" style="height:40px;"/>
      
      <div class="header-right-box">
        <div class="header-right-top">申请</div>
        <el-link class="header-right-btm" @click="jumpApproval('2')" :underline="false" >
            {{applyNum}}
        </el-link>
      </div> -->
      <!-- <div class="divide"></div>
      <div class="header-right-box">
        <div class="header-right-top">团队内排名</div>
        <div class="header-right-btm">
          <div class="header-right-btm__btmText">/24</div>
          <div>0</div>
        </div>
      </div>
      <div class="divide"></div>
      <div class="header-right-box">
        <div class="header-right-top">项目访问</div>
        <div class="header-right-btm">0</div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import { computed,onMounted,ref } from 'vue'
import $services from '@/services'
import { useRoute, useRouter } from 'vue-router'

const store = useUserStore()
const { queryInfo } = storeToRefs(store)

const getTimeState = () => {
  // 获取当前时间
  let timeNow = new Date()
  // 获取当前小时
  let hours = timeNow.getHours()
  // 设置默认文字
  let state = ``
  // 判断当前时间段
  if (hours >= 0 && hours <= 10) {
    state = `早上好,`
  } else if (hours > 10 && hours <= 14) {
    state = `中午好,`
  } else if (hours > 14 && hours <= 18) {
    state = `下午好,`
  } else if (hours > 18 && hours <= 24) {
    state = `晚上好,`
  }
  return state
}
const getTime = computed(() => {
  let date = new Date()
  let y = date.getFullYear() //年
  let m: any = date.getMonth() + 1 //月，月是从0开始的所以+1
  let d: any = date.getDate() //日
  let h: any = date.getHours()
  let min: any = date.getMinutes()
  m = m < 10 ? '0' + m : m //小于10补0
  d = d < 10 ? '0' + d : d //小于10补0
  min = min < 10 ? '0' + min : min //小于10补0
  return y + '-' + m + '-' + d + ' ' + h + ':' + min //返回时间形式yyyy-mm-dd
})
onMounted(() => {

})

const router = useRouter()
const jumpApproval = (type:string)=>{
 router.push({ path: '/cardDetail' ,query: {type:type,id: "0"}})
}
  
</script>

<style lang='scss' scoped>

.header {
  width: 100%;
  height: 100%;
  // min-height: 90px;
  background-color: var(--el-bg-color-overlay);
  display: flex;
  justify-content: space-between;
  padding-right: 24px;
  &-left {
    display: flex;
    align-items: center;
    &-img {
      margin-left: 20px;
      margin-right: 20px;
    }
    &__avater {
      margin-left: 20px;
      text-align: center;
      line-height: 60px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgb(35, 72, 211);
      color: #fff;
      font-size: 26px;
      margin-right: 20px;
    }
    &-box {
      margin-top: 10px;
      &__top {
        font-weight: 600;
        font-size: 18px;
        margin-bottom: 10px;
      }
      &__btm {
        font-weight: 600;
        font-size: 12px;
        margin-bottom: 10px;
        color: rgb(192, 192, 192);
      }
    }
  }
  &-right {
    display: flex;
    align-items: center;
    &-box {
      padding-right: 32px;
      padding-left: 32px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &-top {
      margin-bottom: 5px;
      color: #909399;
    }
    &-btm {
      display: flex;
      font-size: 22px;
      // font-weight: 600;
      flex-direction: row-reverse;
      // color: $colorBlueMain;
      &__btmText {
        font-size: 14px;
        color: rgb(143, 143, 143);
        line-height: 28px;
      }
    }
  }
}
</style>
