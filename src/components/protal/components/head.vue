<template>
  <div class="header">
    <!-- <el-carousel indicator-position="none" height="330px">
      <el-carousel-item v-for="item in state.imgData" :key="item" >
        <img :src='item.img' alt="">
      </el-carousel-item>
    </el-carousel> -->
      <img src="@/assets/img/banner1.png" alt="">
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import { computed,onMounted,reactive } from 'vue'
import banner0 from '@/assets/img/banner0.png'
import banner1 from '@/assets/img/banner1.png'
import banner2 from '@/assets/img/banner2.png'
import banner3 from '@/assets/img/banner3.png'
import banner4 from '@/assets/img/banner4.png'

const store = useUserStore()
const { queryInfo } = storeToRefs(store)
const state = reactive({
  imgData: [
    {id: 1, img: banner0},
    {id: 2, img: banner1},
    {id: 3, img: banner2},
    {id: 4, img: banner3},
    {id: 5, img: banner4}
  ]
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
  height: 330px;
  img{
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
