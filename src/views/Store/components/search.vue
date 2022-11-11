<template>
    <el-dialog class="search-dialog" :show-close="false" append-to-body v-model="createDialog" title="搜索商店" width="45%"  @close="closeCreateDialog">
     <div class="search-box">
        <div class="search-head">
            <el-input class="w-50 m-2" style="width:200px"  placeholder="请输入搜索内容" :prefix-icon="Search"/>
            <div class="search-total">共15家商店</div>
        </div>
        <div class="search-list">
                <div class="list-item" v-for="(item,index) in 4" :key="index">
                    <div class="item-left">
                        <div class="item-name"><img src="@/assets/img/appIcon.png" alt="">杭商城</div>
                        <div class="item-text">模板模板模板模板模板模板</div>
                    </div>
                    <div class="itme-right">
                        <el-radio label=""></el-radio>
                    </div>
                </div>
            
        </div>
     </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button link @click="createDialog = false" style="color:#1549D8">取消</el-button>
          <el-button type="primary" @click="createShop()">确认</el-button>
        </span>
      </template>
    </el-dialog>    
</template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted, nextTick } from "vue";
  import { Search } from '@element-plus/icons-vue'
  const props = defineProps({
    dialogShow: {
      type: Object
    }
  })
  const closeDialog = () => {
    emit('closeDialog', props.dialogShow)
  }
  const createDialog = ref(false) // 创建商店
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
  const checkList = ref([]);
  const closeCreateDialog = ()=>{

  }
  const createShop = () =>{

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
  </style>
  <style lang="scss" scoped>
    .search-dialog{
        font-size: 14px;
        .search-box{
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 3px;
            .search-head{
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .search-list{
                margin-top: 16px;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                max-height: 300px;
                overflow-y: auto;
                .list-item{
                    width: calc(50% - 6px);
                    display: flex;
                    justify-content: space-between;
                    border: 1px solid #eee;
                    border-radius: 3px;
                    padding: 10px 10px;
                    box-sizing:border-box;
                    margin-bottom: 12px;
                    .item-left{
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                    }
                    .item-name{
                        display: flex;
                        align-items: center;
                        margin-bottom: 6px;
                        img{
                            width: 20px;
                            margin-right: 10px;
                        }
                    }
                    .item-text{
                        color: #5F6165;
                    }
                }
            }
            
        }
    }
  </style>
  