<template>
  <div class="main">
    <div class="nav-list">

    </div>
    <div class="content">
      <div class="menu"></div>
      <div class="detail">
        <div class="detail-title">最近打开</div>
        <div class="detail-list">
          <div class="list-item" v-for="(item,index) in 5" :key="index">
            <div class="row row-left">
              <img src="./../../assets/img/whatsapp.png" alt="" />
              <div class="version">V 1.1</div>
            </div>
            <div class="row row-content">
              <div class="title">
                <span>资产内功</span>
                <span>
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      ···
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item >审核申请</el-dropdown-item>
                        <el-dropdown-item >查看详情</el-dropdown-item>
                        <el-dropdown-item >查看详情</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </span>
              </div>
              <div class="describe">资产内功资产内功资产内功资产内功资产内功资产内功资产内功资产内功资产内功</div>
            </div>
          </div>
        </div>
      </div>
      <div class="table">
        <diytab
          :style="{width:'100%'}"
          ref="diyTable"
          :hasTabs="true"
          :tableName="'测试表格名称'"
          :hasTitle="true"
          :hasTableHead="true"
          :tableData="tableData"
          :options="options"
          @handleUpdate="handleUpdate"
          @selectionChange="selectionChange"
          :tableHead="tableHead"
        >
          <template #slot-tabs>
            <div class="table-tabs">
              <el-menu
                :default-active="activeIndex"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
              >
                <el-menu-item index="1">全部</el-menu-item>
                <el-menu-item index="2">创建的</el-menu-item>
                <el-menu-item index="3">购买的</el-menu-item>
                <el-menu-item index="4">共享的</el-menu-item>
                <el-menu-item index="5">分配的</el-menu-item>
              </el-menu>
            </div>
          </template>
          <template #buttons>
            <el-button type="primary">按钮</el-button>
            <el-button type="primary">按钮</el-button>
            <el-button type="primary">按钮</el-button>
          </template>
          <template #remark="scope">
            <el-tooltip :content="scope.row.remark" placement="bottom" effect="light">
              <template #content> 
                <div class="tooltip-text" style="width:300px">{{scope.row.remark}}</div>
              </template>
              <div class="remark-text">
              {{scope.row.remark}}
              </div>
            </el-tooltip>
          </template>
          <template #option>
            操作
          </template>
          <template #slot-card>
            <div class="card-list">
              <div class="card-item" v-for="(item,index) in 0" :key="index">
                <div class="item-head">
                  <div class="item-img">人</div>
                  <div class="item-head-content">
                      <p>
                        <span>应用名称 <el-tag class="ml-2" type="success">免费</el-tag></span>
                       
                        <el-dropdown>
                          <span class="el-dropdown-link drop-list">
                            ···
                          </span>
                          <template #dropdown>
                            <el-dropdown-menu>
                              <el-dropdown-item >审核申请</el-dropdown-item>
                              <el-dropdown-item >查看详情</el-dropdown-item>
                              <el-dropdown-item >查看详情</el-dropdown-item>
                            </el-dropdown-menu>
                          </template>
                        </el-dropdown>
                      </p>
                      <p>73MB</p>
                  </div>
                </div>
                <div class="item-content">
                  用于维护精益项目提报信息和申请管理，本数据仅限于企业内部进行项目管理时使用根据...
                </div>
                <div class="tag">
                  <el-tag class="tag-item" type="info" >类型</el-tag>
                </div>
                <div class="time">
                  创建于 2022-11-02 15:06
                </div>
              </div>
            </div>
          </template>
        </diytab>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
  import diytab from '@/components/diyTable/index.vue'
  import { ref, reactive, onMounted, nextTick } from 'vue'
  const dialogVisible = ref<boolean>(true)
  const diyTable = ref(null)
  // 表格展示数据
  const pageStore = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0
  })
  const tableData = ref([{
    paymentType:'线上',
    price:'100',
    status:'200',
    createTime:'2022-11-01 16:01',
  }])
  const activeName = ref<string>(); //table tab index
  const handleClick = (key?:any)=>{
    console.log(key)
  }

  interface ListItem {
    code: string
    name: string
    trueName: string
    teamCode: string
    remark: string
  }

  onMounted(() => {
    remoteMethod()
  })
  const remoteMethod = () => {
  }

  const handleUpdate = (page: any) => {
    pageStore.currentPage = page.currentPage
    pageStore.pageSize = page.pageSize
    remoteMethod()
  }
  const checkList = reactive<any>([])
  const selectionChange = (val: any) => {
    checkList.value = val
  }

  const tableHead = ref([{
      prop: 'paymentType',
      label: '付款方式',
    },
    {
      prop: 'price',
      label: '价格',
      name: 'price'
    },
    {
      prop: 'status',
      label: '状态',
      name: 'status'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      name: 'createTime'
    },
    {
      type: 'slot',
      label: '操作',
      fixed: 'right',
      align: 'center',
      width: '150',
      name: 'operate'
    }
  ])
  const options = ref<any>({
    checkBox: false,
    order: true,
    selectLimit: 1,
    defaultSort: { prop: 'createTime', order: 'descending' },
    treeProps: {
      children: 'children',
      hasChildren: 'hasChildren'
    }
  })
  const commontActive = ()=>{

  }
  
</script>
<style lang="scss">
  .drop-link{
    cursor: pointer;
    padding: 2px 10px;
    border-radius: 10px;
  }
  .drop-link:hover{
    background: var(--el-bg-color-overlay);
  }
</style>
<style lang="scss" scoped>
  .main{
    width: 100%;
    height: 100%;
    display: flex;
    flex: 1;
    .nav-list{
      width: 150px;
      height: 100%;
      border-right: 1px solid #EBEEF5;
    }
    .content{
      width:calc(100vw - 150px);
      display: flex;
      flex-direction: column;
      background: #f0f4f8;
      .menu{
        height: 40px;
        width: 100%;
        background: #aab;
        margin-bottom: 6px;
      }
      .detail{
        background: #fff;
        margin-bottom: 6px;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        max-height: 200px;
        padding: 16px;
        .detail-title{
          font-size: 14px;
          color: #303133;
          margin-bottom: 10px;
        }
        .detail-list{
          display: flex;
          flex-wrap: nowrap;
          height: 102px;
          flex: 1;
        }
        .list-item{
          width: 187px;
          min-width: 187px;
          height: 102px;
          display: flex;
          flex-wrap: nowrap;
          border: 1px solid #eee;
          border-radius: 10px;
          box-sizing: border-box;
          padding: 18px 12px;
          margin-right: 10px;
          .row{
            img{
              width: 52px;
              height: 52px;
              border-radius: 10px;
            }
            .version{
              font-size: 12px;
              color: #606266;
              margin-top: 5px;
            }
            .title{
              color: #303133;
              font-size: 14px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              span:nth-child(2n){
                display: flex;
                align-items: center;
              }
            }
            .describe{
              color:#606266;
              font-size: 12px;
              -webkit-line-clamp: 2;
              margin-top: 3px;

              display: -webkit-box;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .row-left{
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 10px;

          }
        }
      }
      .table{
        background: #fff;
        display: flex;
        flex: 1;
        .table-tabs{
          width: 500px;
          .el-menu--horizontal{
            border: 0;
          }
          .el-menu-item{
            padding: 0;
            margin-right: 16px;
            margin-bottom: 3px;
            border: 0 !important;
          }
          .is-active{
            background: #fff;
          }
          .is-active::after{
            content:'';
            position: absolute;
            left: 0;
            margin-left: calc(50% - 9px);
            bottom: 25%;
            width:18px;
            border-radius: 5px;
            height: 2px;
            background: #154ad8;
          }
          .el-menu--horizontal:hover, .el-menu-item:hover{
            background: #fff;
          }
        }
      }
    }
    .card-list{
      padding: 10px 0;
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;
      .card-item{
        width: 279px;
        box-sizing: border-box;
        padding: 14px;
        border-radius: 5px;
        margin-right: 12px;
        margin-bottom: 12px;
        border: 1px solid #e9e9e9;
        .item-head{
          display: flex;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
          align-items: center;
          .item-img{
            background: #D4F0FC;
            text-align: center;
            width: 40px;
            height: 40px;
            line-height: 40px;
            border-radius: 50%;
            margin-right: 15px;
            font-size: 14px;
            color: #55b0eb;
          }
        }
        .item-head-content{
          display: flex;
          flex: 1;
          flex-direction: column;
          p:nth-child(1){
            display: flex;
            justify-content: space-between;
            align-items: center;
            span{
              margin-right: 5px;
            }
            .drop-list{
              display: flex;
              flex-direction: column;
              align-items: center;
            }
          }
          p:nth-child(2){
            color:#9c9c9c;
            font-size: 14px;
          }
        }
        .item-content{
          font-size: 12px;
          margin: 12px 0;
          color: #7f7f7f;
        }
        .tag{
          margin: 12px 0;
        }
        .time{
          font-size: 12px;
          color:#7f7f7f;
        }
      }
    }
  }
  .foot {
    display: flex;
    width: 100%;
    margin-top: 30px;
    justify-content: flex-end;
  }
  .remark-text{
    white-space: nowrap;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tooltip-text{
    width: 400px;
    max-height: 300px;
    overflow-y: auto;
  }
  .tabs-btn{
    display: flex;
  }
</style>
