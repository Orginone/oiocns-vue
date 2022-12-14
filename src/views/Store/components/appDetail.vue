<template>
    <el-dialog class="detail-wrap" custom-class="previewClass" :show-close="false" append-to-body v-model="props.detailDialog" title="应用详情" width="550px"  @close="closeDialog(false)">
        <div class="detail-box">
          <div class="detail-head">
            <div class="head-left">
              <img src="@/assets/img/appIcon.png" alt="">
              <div class="detail-title">表单申请管理</div>
            </div>
            <div class="head-right">
               <span class="">获取</span>
            </div>
          </div>
          <div class="detail-content">
            <el-menu
              :default-active="activeIndex"
              class="el-menu-list"
              mode="horizontal"
              @select="handleSelect"
            >
              <el-menu-item index="1">应用介绍</el-menu-item>
              <el-menu-item index="3">评价</el-menu-item>
              <el-menu-item index="4">信息</el-menu-item>
            </el-menu>
            <div class="detail">
                我是应用信息
            </div>
          </div>
        </div>
    </el-dialog>    
</template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted, nextTick } from "vue";
  const props = defineProps({
    detailDialog: {
      type:Boolean
    }
  })
  interface fromType {
    name:string,
    code:string,
    remark:string,
    public:string,
  }
  const form = reactive<fromType>({
    name:'',
    code:'',
    remark:'',
    public:'',
  });
  const emit = defineEmits([
    'closeDialog'
  ])

  const closeDialog = (type:boolean)=>{
    emit('closeDialog', type)
  }

  const activeIndex = ref('1')

  const activeIndex2 = ref('1')

  const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }

  onMounted(() => {
    remoteMethod();
  });
  
  const remoteMethod = () => {};

  </script>
  <style lang="scss">
    .create-shop-box{
        .el-dialog__header{
            background: #fff;
        }
    }
    .previewDialog .el-dialog {
      .el-dialog__header {
        display: none;
      }
      .dj-dialog-content {
        padding: 0;
        overflow: unset;
      }
    }
    .detail-content{
      padding-bottom: 10px;
      .el-menu--horizontal{
        border-bottom: 0;
      }
      .el-menu--horizontal > .el-menu-item.is-active{
        border-bottom: 0;
        background: #fff;
      }
      .el-menu--horizontal > .el-menu-item{
        border-bottom: 0;
      }
      .el-menu--horizontal .el-menu-item:not(.is-disabled):focus{
        background: #fff;
      }
      .el-menu-item{
        position: relative;
        height: 35px;
        line-height: 35px;
        padding-left: 0;
      }
      .is-active::after{
        content:"";
        position: absolute;
        width: 10px;
        height: 2px;
        bottom: 3px;
        background: #154AD8;
      }
    }
  </style>
  <style lang="scss" scoped>
  
    .detail-box{
      font-size: 14px;
      .detail-head{
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .head-left{
          display: flex;
          align-items: center;
          img{
            width: 50px;
            margin-right: 10px;
          }
        }
        .head-right{
          display: flex;
          align-items: center;
          span{
            padding: 3px 12px;
            border-radius: 15px;
            display: inline-block;
            color: #204dd0;
            border: 1px solid #204dd0;
          }
        }
      }
      .detail{
        margin-top: 20px;
      }
    }
  </style>
  