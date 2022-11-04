<template>
  <div class="center">
    <div class="left">
      <div class="L_top">
        <p class="lsolid"></p>
        <span class="csolid">快捷入口</span>
        <p class="rsolid"></p>
        <el-icon class="eidtIcon"><Edit /></el-icon>
      </div>
      <div class="L_bottom">
        <div class="lb_col">
            <el-card class="card" shadow="hover"> 
              <el-icon>
                <User />
              </el-icon><span>Always</span> </el-card>
              <el-card class="card" shadow="hover"> 
              <el-icon>
                <User />
              </el-icon><span>Always</span> </el-card>
              <el-card class="card" shadow="hover"> 
              <el-icon>
                <User />
              </el-icon><span>Always</span> </el-card>
              <el-card class="card" shadow="hover"> 
              <el-icon>
                <User />
              </el-icon><span>Always</span> </el-card>
              <el-card class="card" shadow="hover"> 
              <el-icon>
                <User />
              </el-icon><span>Always</span> </el-card>
              <el-card class="card" shadow="hover"> 
              <el-icon>
                <User />
              </el-icon><span>Always</span> </el-card>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="R_top">
        <p class="lsolid"></p>
        <span class="csolid">常用应用</span>
        <p class="rsolid"></p>
        <el-icon class="eidtIcon"><Edit /></el-icon>
      </div>
      <div class="R_bottom">
        <div class="rb_col">
            <div class="card">
              <span><img src="@/assets/img/app2.png" alt=""></span>
              <span>资产监管平台</span>
              <span>简单、高效、开放的监管工具</span>
            </div>
            <div class="card">
              <span><img src="@/assets/img/app2.png" alt=""></span>
              <span>资产监管平台</span>
              <span>简单、高效、开放的监管工具</span>
            </div>
            <div class="card">
              <span><img src="@/assets/img/app2.png" alt=""></span>
              <span>资产监管平台</span>
              <span>简单、高效、开放的监管工具</span>
            </div>
            <div class="card">
              <span><img src="@/assets/img/app2.png" alt=""></span>
              <span>资产监管平台</span>
              <span>简单、高效、开放的监管工具</span>
            </div>
            <div class="card">
              <span><img src="@/assets/img/app2.png" alt=""></span>
              <span>资产监管平台</span>
              <span>简单、高效、开放的监管工具</span>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import { computed,onMounted,ref } from 'vue'

const store = useUserStore()
const { queryInfo } = storeToRefs(store)

onMounted(() => {

})
  
</script>

<style lang='scss' scoped>

.center {
  width: 100%;
  height: 100%;
  display: flex;
  .left{
    width: 30%;
    background: white;
    border-radius: 5px;
    margin-right: 6px;
    .eidtIcon{
      margin-left: 20px;
    }
    .lsolid{
      width: 80px;
      margin-right: 15px;
      border-bottom: 1px solid #ccc;
    }
    .rsolid{
      width: 80px;
      margin-left: 15px;
      border-bottom: 1px solid #ccc;
    }
    .csolid{
      font-size: 16px;
      font-weight: bold;
    }
    .L_top{
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
    }
    .L_bottom{
      margin-top: 20px;
    }
    .lb_col{
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-wrap: wrap;
      .card{
        margin: 5px 10px;
        width: 25%;
        display: flex;
        justify-content: center;
        span{
          margin-left: 10px;
        }
      }
    }
  }
  .right{
    width: 70%;
    background: white;
    border-radius: 5px;
    .eidtIcon{
      margin-left: 20px;
    }
    .lsolid{
      width: 120px;
      margin-right: 15px;
      border-bottom: 1px solid #ccc;
    }
    .rsolid{
      width: 120px;
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
      margin-top: 20px;
    }
    .R_bottom{
      margin-top: 20px;
    }
    .rb_col{
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .card{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        span:nth-child(1) {
          width: 60px;
          height: 60px;
          margin: 10px 0;
          img{
            width: 100%;
            border-radius: 15px;
            height: auto;
          }
        }
        span:nth-child(2) {
          font-size: 15px;
          font-weight: bold;
          margin: 5px 0;
        }
        span:nth-child(3) {
          font-size: 12px;
          color: #ccc;
        }
      }
    }
  }
}
</style>
