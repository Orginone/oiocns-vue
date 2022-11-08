<template>
  <div class="footer">
    <div class="R_top">
      <p class="lsolid"></p>
      <span class="csolid">数据检测</span>
      <p class="rsolid"></p>
      <el-icon class="eidtIcon" @click="editBtn"><Edit /></el-icon>
    </div>
    <div class="R_bottom">
      <div class="rb_col">
          <div v-for="item in state.data" :key='item.id' class='card' :class="{card1:state.flag === item.id}" @mouseover='onHover(item.id)' @mouseout="onOut">
            <span><oneBar v-if="item.id == 1 || item.id == 3" /><twoBar v-else-if="item.id == 2 || item.id == 4" /><threeBar v-else /></span>
            <span>{{item.title}}</span>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import onBar from './modules/oneBar.vue'
import twoBar from './modules/twoBar.vue'
import threeBar from './modules/threeBar.vue'
import { onMounted, reactive } from 'vue'

const store = useUserStore()
const { queryInfo } = storeToRefs(store)
const state = reactive({
  flag: '',
  data: [
    {id: 1, title: '资产监管平台'},
    {id: 2, title: '资产监管平台'},
    {id: 3, title: '资产监管平台'},
    {id: 4, title: '资产监管平台'},
    {id: 5, title: '资产监管平台'},
  ]
})
const onHover = (id) => {
  state.flag = id
}

const onOut = () => {
  state.flag = ''
}

const editBtn = () => {

}

onMounted(() => {

})
  
</script>

<style lang='scss' scoped>

.footer{
    width: 100%;
    height: 100%;
    background: white;
    border-radius: 5px;
    padding-top: 20px;
    box-sizing: border-box;
    .eidtIcon{
      margin-left: 20px;
    }
    .lsolid{
      width: 200px;
      margin-right: 15px;
      border-bottom: 1px solid #ccc;
    }
    .rsolid{
      width: 200px;
      margin-left: 15px;
      border-bottom: 1px solid #ccc;
    }
    .csolid{
      font-size: 16px;
      font-weight: bold;
    }
    .R_top{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .R_bottom{
      margin-top: 30px;
    }
    .rb_col{
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .card1 {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 30px 60px;
        box-sizing: border-box;
        border-radius: 30px;
        box-shadow: 0 0 5px 0 rgba($color: #ccc, $alpha: 1.0);
        span:nth-child(1) {
          width: 100px;
          height: 100px;
        }
        span:nth-child(2) {
          font-size: 15px;
          font-weight: bold;
          margin: 15px 0;
        }
      }
      .card{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 30px 60px;
        position: relative;
        box-sizing: border-box;
        span:nth-child(1) {
          width: 100px;
          height: 100px;
        }
        span:nth-child(2) {
          font-size: 15px;
          font-weight: bold;
          margin: 15px 0;
        }
      }
    }
  }
</style>
