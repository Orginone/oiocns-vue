<template>
  <div class="center">
    <div class="left">
      <div class="L_top">
        <p class="lsolid"></p>
        <span class="csolid">快捷入口</span>
        <p class="rsolid"></p>
        <el-popover
          placement="right"
          :width="150"
          trigger="click"
        >
          <template #reference>
            <el-icon class="eidtIcon"><Edit /></el-icon>
          </template>
          <p 
          v-for="item in state.btnData" 
          :key='item.id' 
          :style="{cursor: 'pointer', margin: '5px', 
          color: state.flag === item.id ? 'red' : ''}" 
          @mouseover='onHover(item.id)' 
          @mouseout="onOut" >
            <component :is="item.icon" style="width: 16px;height: 16px;"></component>&nbsp;
            {{item.title}}
          </p>
        </el-popover>
      </div>
      <div class="L_bottom">
        <div class="lb_col">
            <el-card 
              :style="{cursor: 'pointer'}" 
              v-for="item in state.quickData" 
              :key="item.id" class="card" 
              :class="state.cardFlag === item.id ? 'card1' : ''" 
              @mouseover='cardOnHover(item.id)' 
              @mouseout="onOut" 
              @click="handleRouterChage(item.path)" > 
                <component :is="item.icon" style="width: 16px;height: 16px;"></component>
                <span>{{item.title}}</span>
            </el-card>
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
            <div class="card" v-for="item in appList" :key="item.id" @click="handleChooseItem(item)">
              <span><img src="@/assets/img/app2.png" alt=""></span>
              <span>{{item.name}}</span>
              <span>{{item.remark}}</span>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { appstore } from '@/module/store/app'
import { computed,onMounted,ref,reactive } from 'vue'

const store = useUserStore()
const router = useRouter()
const { queryInfo } = storeToRefs(store)
const state = reactive({
  btnData: [
    {id: '1', title: '添加入口', icon: 'CirclePlus'},
    {id: '2', title: '新标签页打开', icon: 'Star'},
    {id: '3', title: '删除入口', icon: 'Coffee'},
  ],
  quickData: [
    {id: '0', title: '加好友', icon: 'User', path: '/store'},
    {id: '1', title: '创单位', icon: 'Files', path: '/store'},
    {id: '2', title: '邀成员', icon: 'Position', path: '/store'},
    {id: '3', title: '建应用', icon: 'Sell', path: '/store'},
    {id: '4', title: '逛商城', icon: 'ShoppingCart', path: '/store'},
    {id: '5', title: '添数据', icon: 'Expand', path: '/store'},
  ],
  commonData: [
    {id: '0', title: '简单、高效、开放的监管工具', name: '资产监管平台'},
    {id: '1', title: '简单、高效、开放的监管工具', name: '资产监管平台'},
    {id: '2', title: '简单、高效、开放的监管工具', name: '资产监管平台'},
    {id: '3', title: '简单、高效、开放的监管工具', name: '资产监管平台'},
    {id: '4', title: '简单、高效、开放的监管工具', name: '资产监管平台'},
    {id: '5', title: '简单、高效、开放的监管工具', name: '资产监管平台'},
  ],
  flag: '',
  cardFlag: '',
})

const appList = ref<ProductType[]>([])

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

//常用应用跳转
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

// 页面跳转
const handleRouterChage = (path: string) => {
  router.push({path})
  // console.log("通用SDK调用示例",WorkModel.CurAppTodo);
}

const onHover = (id: string) => {
  state.flag = id
}
const onOut = () => {
  state.flag = ''
  state.cardFlag = ''
}
const cardOnHover = (id: string) => {
  state.cardFlag = id
}

onMounted(() => {
  getAppList()
})
  
</script>

<style lang='scss' scoped>

.center {
  width: 100%;
  height: 230px;
  padding: 10px 0px;
  display: flex;
  .left{
    width: 450px;
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
      font-size: 13px;
      .card1{
        margin: 5px 10px;
        width: 25%;
        height: 57px;
        display: flex;
        background: #2b6ed9;
        color: white;
        border-radius: 8px;
        justify-content: center;
        align-items: center;
        span{
          margin-left: 10px;
        }
      }
      .card{
        margin: 5px 10px;
        width: 25%;
        height: 57px;
        display: flex;
        border-radius: 8px;
        justify-content: center;
        align-items: center;
        span{
          margin-left: 10px;
        }
      }
    }
  }
  .right{
    width: calc(100% - 456px);
    overflow-x: auto;
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
      overflow-x: auto;
      display: flex;
      align-items: center;
      .card{
        width: 110px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
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
