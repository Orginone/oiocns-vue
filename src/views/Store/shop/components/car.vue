<template>
    <div class="main car-main">
      <div class="content">
        <div class="table">
          <el-checkbox-group v-model="checkList"  @change="handleCheckList">
           <div class="item" v-for="item in pageStore.tableData" >
            <el-checkbox  :key="item.id" :label="item.id">
              <div class="item-detail">
                <img :src="img1" alt="">
                <div class="detail-row">
                  <div class="car-item">
                    商品名称：{{ item.caption }}
                  </div>
                  <div class="car-item">
                    应用权限：{{ item.sellAuth }}
                  </div>
                </div>
              </div>
            </el-checkbox>
           </div>
          </el-checkbox-group>
        </div>
        <div class="foot">
          <div class="foot-left">
            <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            >全选</el-checkbox>
          </div>
          <div class="foot-right">
            <el-button link style="margin-left:10px" @click="batchDelete">删除</el-button>
            <el-button link type="primary" @click="batchPay">购买</el-button>
          </div>
        </div>
      </div>
    
    </div>
    
  </template>
  
  <script setup lang="ts">
    import diytab from '@/components/diyTable/index.vue'
    import { ref, reactive, onMounted, nextTick } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { PAGE_SIZES, PAGE_NUM } from '@/constant'
    import {marketCtrl} from '@/ts/coreIndex';
    import img1 from '@/assets/img/group22.png'

    const emit = defineEmits(['reLoad'])

    const diyTable = ref(null)
    // 表格展示数据
    const pageStore = reactive({
      tableData: [],
      tableHead: [
        { prop: 'caption',label: '商品名称' },
        { prop: 'information', label: '商品信息' },
        { prop: 'marketCode', label: '操作',type:'slot',name:'options' }
      ],
      total: 0
    })

    const state = reactive({
      page: {
        total: 0, // 总条数
        currentPage: 1, // 当前页
        pageSize: 20, // 每页条数
        pageSizes: [20, 30, 50], // 分页数量列表
        layout: 'total, prev, pager, next'
      },
      dialogShow: [
        {
          key: 'info',
          value: false
        }
      ]
    })
  
    onMounted(() => {
      pageStore.tableData = marketCtrl.shopinglist
      console.log('marketCtrl.shopinglist',marketCtrl.shopinglist)
      if(marketCtrl.shopinglist.length ==0){
        setTimeout(() => {
          pageStore.tableData = marketCtrl.shopinglist
        },2000);
      }
      console.log('marketCtrl',)

    })
    
    const isIndeterminate = ref(true)
  
    const checkAll = ref<any>([]);
    const checkList = ref<any>([]);
    // 全选
    const handleCheckAllChange = (val: any) => {
      let arr:any = [];
      pageStore.tableData.forEach((element,index) => {
        arr.push(element.id);
      });
      checkList.value = val ? arr : []
      isIndeterminate.value = false
    }
  
    const handleCheckList = (value: any) => {
      const checkedCount = value.length
      checkAll.value = checkedCount === pageStore.tableData.length
      isIndeterminate.value = checkedCount > 0 && checkedCount < pageStore.tableData.length
    }

    const options = ref<any>({
      checkBox: true,
      order: true,
      switch:false,
      selectLimit: 100,
      noPage:true,
      defaultSort: { prop: 'createTime', order: 'descending' },
      treeProps: {
        children: 'children',
        hasChildren: 'hasChildren'
      }
    })
  //从购物车移除
  const deleteStaging = async (item: any) => {
    if(!item?.length){
        item = [item]
    }
    await marketCtrl.deleteStaging(item);
    pageStore.tableData = marketCtrl.shopinglist
    emit('reLoad')
  }
  //批量购买
  const batchPay = async(item:any)=>{
    createOrderByStaging(checkList.value)
  }
  //批量删除   
  const batchDelete =async (item:any) => {
    deleteStaging(checkList.value)
    emit('reLoad')
  }
  //创建订单(批量)
  const createOrderByStaging = async (arr:any) => {
    if(arr.length<=0){
      ElMessage.warning('请选择商品')
    }
    ElMessageBox.confirm('此操作将生成交易订单。是否确认?', '确认订单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
    }).then(async () => {
        await marketCtrl.createOrder(arr);
        pageStore.tableData = marketCtrl.shopinglist
        emit('reLoad')
    }).catch(()=>{})
  }
    
  </script>
  <style lang="scss">
    .car-main{
      .el-dropdown-link{
        padding: 2px 10px;
        cursor: pointer;
        border-radius: 10px;
      }
      .el-dropdown-link:hover{
        background:#1642cb;
        color: #fff;
      }
    
    }
  </style>
  <style lang="scss" scoped>
    .main{
      width: 100%;
      height: 100%;
      display: flex;
      flex: 1;
      border: 0 !important;
      .content{
        width:calc(100vw - 150px);
        // height:calc(100vh - 50px);
        display: flex;
        flex-direction: column;
        background: #EFF4F9;
        overflow-y: auto;
        .table{
          display: flex;
          flex: 1;
          .el-checkbox-group{
            width: 100%;
          }
          .item{
            height: 100px;
            background: #fff;
            border-radius: 8px;
            border: 1px solid #f0f4f8;
            display: flex;
            font-size: 14px;
            padding: 10px 15px;
            margin: 20px;
            margin-bottom: 10px;
          }
          .el-checkbox{
            width: 100%;
            height: 100%;
          }
          .item-detail{
            display: flex;
            align-items: center;
            img{
              width: 45px;
            }
          }
          .detail-row{
            display: flex;
            flex-direction: column;
            margin-left: 10px;
            font-size: 12px;
            div{
              margin-bottom: 3px;
            }
          }
          .car-item{
            width: 100%;
          }
        }
      }
        .foot{
            background: #fff;
            display: flex;
            height: 50px;
            justify-content: space-between;
            align-items: center;
            padding:10px 20px;
            box-sizing: border-box;
            .foot-left{
              display: flex;
              flex-direction: row-reverse;
            }
        }
    }
  </style>
  