<template>
  <div class="card-box" v-if="state.dataList.length>0">
    <div class="card-box-items" v-for="(item,index) in state.dataList" :key="index">
      <div class="card-meta">
        <div class="card-meta-avatar">
          <img src="@assets/img/头像.png" class="avatar" />
        </div>
        <div class="card-meta-detail">
          <div class="card-meta-title">{{item.name}}</div>
          <div class="card-meta-desc">{{item.remark}}</div>
        </div>
      </div>
      <div class="card-actions" @click="unbinding(item)">解绑</div>
    </div>
  </div>
  <div class="noData-box" v-else>
    <el-empty>
      <el-button type="primary" @click="showDialog">立即绑定</el-button>
    </el-empty>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted,toRefs } from 'vue'
import {userCtrl,appCtrl} from '@/ts/coreIndex'
import {ElMessageBox, ElMessage} from "element-plus";

type StateType = {
  dataList: any[]; //表格数据
};

const state = reactive({
  dataList: [],
  timer:null
})

onMounted(() => {
  initData()
})

const props = defineProps({
  bindAppMes: {
    type: Object
  }
})

//加载数据
const initData = async () =>{
  for(var i = 0;i<5; i++){
    state.timer = setInterval(async() => {
      const tableData = await appCtrl.products;
      if(tableData){
        const needData = tableData.map((item) => {
          return {
            name: item.prod.name,
            id: item.prod.id,
            remark: item.prod.remark,
          };
        });
        const result = await userCtrl.space.getDefines(false); //流程列表
        if (result && result.length > 0 && props.bindAppMes.id) {
          const currentValue = await userCtrl.space.queryFlowRelation(false); //查询所有绑定值
          if (currentValue && currentValue.length > 0) {
            //遍历获取当前流程
            const filterIdData = currentValue.filter((item) => {
              return item.defineId === (props.bindAppMes?.id || result[0].id);
            });
            // 获取的值有限 循环拿应用name和remark
            const getResult = filterIdData.map((item: any) => {
              const findAppId = needData.find((innerItem) => innerItem.id === item.productId);
              item.name = findAppId?.name;
              item.remark = findAppId?.remark;
              return item;
            });
            state.dataList = getResult
          } else {
            state.dataList = []
          }
        }
        clearInterval(state.timer)
      }else{
        initData()
      }
    },500)
  }
}

const unbinding = (item: any) => {
  ElMessageBox.confirm(`确定删除当前已绑定的应用?`, "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      userCtrl.space
        .unbindingFlowRelation({
          defineId: item?.defineId,
          productId: item.productId,
          functionCode: item.functionCode,
          spaceId: userCtrl.space.id,
        })
        .then((result) => {
          if (result) {
            initData();
            ElMessage({
              type: 'success',
              message: '解绑成功！'
            })
          } else {}
        });
    })
    .catch(() => {});
}

const emit = defineEmits(['showDialog'])

const showDialog = () => {
  emit('showDialog')
}

defineExpose({
  ...toRefs(state),
  initData
})

</script>

<style lang="scss" scoped>
.card-box{
  width: calc(100% - 40px);
  height: calc(100% - 20px);
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  .card-box-items{
    width: 252px;
    height: 140px;
    border-radius: 4px;
    position: relative;
    border:1px solid #ebeef5;
    padding: 24px;
    margin-right: 20px;
    .card-meta{
      display: flex;
      .card-meta-avatar{
        padding-right: 16px;
        .avatar{
          width: 32px;
          height: 32px;
        }
      }
      .card-meta-title{
        font-size: 16px;
        margin-bottom: 8px;
        font-weight: 500;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: rgba(0, 0, 0, 0.85);
      }
      .card-meta-desc{
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
      }
    }
    .card-actions{
      width: calc(100% - 48px);
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      text-align: center;
      position: absolute;
      bottom: 0;
      border-top: 1px solid #ebeef5;
      cursor: pointer;
    }
  }
}
.noData-box{
  width: calc(100% - 40px);
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
</style>