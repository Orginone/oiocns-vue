<template>
  <div class="main">
    <div class="content">
      <createShop :createDialog="dialogType.createDialog" @closeDialog="closeDialog('createDialog',false)"></createShop>
      <appDetail :detailDialog="dialogType.detailDialog" @closeDialog="closeDialog('detailDialog',false)"></appDetail>
      <opened></opened>
      <div class="table">
        <DiyTable
          :style="{width:'100%'}"
          ref="diyTable"
          :hasTabs="true"
          :tableName="'我的应用'"
          :hasTitle="true"
          :titleBtns="titleBtns"
          :hasTableHead="true"
          :tableData="state.ownProductList"
          :tabOption="tabOption"
          :options="options"
          @handleUpdate="handleUpdate"
          @selectionChange="selectionChange"
          :tableHead="state.tableHead"
        >
          <template #slot-tabs>
            <div class="table-tabs">
              <el-menu
                :default-active="tableActiveIndex"
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
            <el-button class="btn-check" type="primary" @click="goBuy()" link>购买</el-button>
            <el-button class="btn-check" @click="showCreate()" type="primary" link>创建</el-button>
            <el-button class="btn-check" type="primary" link>暂存</el-button>
          </template>
          <template #name="scope">
            {{ scope.row.name }}
          </template>
          <template #tag="scope">
            <el-tag
              v-if="
                scope.row.endTime == undefined ||
                new Date().getTime() < formartDateTime(scope.row?.endTime)
              "
              style="margin-left: 10px"
              :type="authority.IsApplicationAdmin(scope.row.belongId) ? '' : 'success'"
            >
              {{ authority.IsApplicationAdmin(scope.row.belongId) ? '可管理' : '可使用' }}</el-tag
            >
            <el-tag
              v-if="new Date().getTime() > formartDateTime(scope.row?.endTime)"
              style="margin-left: 10px"
              :type="'danger'"
              >失效</el-tag
            >
            <el-tag style="margin-left: 10px">{{ scope.row.source }}</el-tag>
          </template>
          <template #operate="scope">
            <el-dropdown >
              <span class="el-dropdown-link">
                ···
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item
                      v-if="scope.row.authority == '所属权' && scope.row.belongId == store.workspaceData.id"
                      link
                      type="primary"
                      @click="handleCommand('own', 'putaway', scope.row)"
                      >上架</el-dropdown-item>
                    <el-dropdown-item
                      link
                      type="primary"
                      v-if="scope.row.belongId == store.workspaceData.id"
                      @click="handleCommand('own', 'share', scope.row)"
                    >
                      共享</el-dropdown-item>
                    <el-dropdown-item
                      link
                      type="primary"
                      v-if="authority.IsCompanySpace()"
                      @click="dialogType.cohortVisible = true"
                      >分配
                    </el-dropdown-item>
                    <el-dropdown-item link type="primary" @click="dialogType.detailDialog = true">
                      查看详情
                    </el-dropdown-item>

                    <el-dropdown-item link type="primary" @click="deleteApp(scope.row)">移除应用</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #slot-card>
            <card></card>
          </template>
        </DiyTable>
      </div>
    </div>
    <el-dialog
      v-if="dialogType.cohortVisible"
      v-model="dialogType.cohortVisible"
      custom-class="share-dialog"
      title="应用分配"
      width="1000px"
      draggable
      :close-on-click-modal="false"
    >
      <ShareComponent
        dialogType="1"
        @closeDialog="closeDialog('cohortVisible',false)"
        :info="selectProductItem"
      ></ShareComponent>
    </el-dialog>
    <el-dialog
      v-if="dialogType.shareVisible"
      v-model="dialogType.shareVisible"
      custom-class="share-dialog"
      title="应用共享"
      width="1000px"
      draggable
      :close-on-click-modal="false"
    >
      <ShareComponent
        dialogType="2"
        :type="store.workspaceData.type"
        @closeDialog="closeDialog('shareVisible',false)"
        :info="selectProductItem"
      ></ShareComponent>
    </el-dialog>
  </div>
  
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { onMounted, reactive, ref, watch, nextTick,getCurrentInstance } from 'vue'
  import { BtnItem, TabType } from "@/components/titleBox/index.vue";
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/store/user'
  import DiyTable from '@/components/diyTable/index.vue'
  import $services from '@/services'
  import authority from '@/utils/authority'
  import { storeToRefs } from 'pinia'
  import { appstore } from '@/module/store/app'
  import DefaultNodeProps from '@/components/wflow/process/DefaultNodeProps'
  import opened from './components/opened.vue'
  import createShop from './components/createShop.vue'
  import appDetail from './components/appDetail.vue'
  import card from './components/card.vue'
  import ShareComponent from './components/shareComponents.vue'

  // import MarketServices from './market.services'
  // hoverItem--鼠标移入item的id 用于展示按钮区域
  // console.log('MarketServices',MarketServices);
  import ProcessDesign from '@/components/wflow/ProcessDesign.vue';

  const showCreate = () =>{
    dialogType.createDialog = true;
  }
  const dialogType:any = reactive({
    createDialog:false,  // 创建商店弹窗状态
    detailDialog:false,  //应用详情弹窗
    cohortVisible:false, //共享弹窗
    shareVisible:false , //分享
    groupVisible:false //集团
  })
  // 表格按钮事件
  const titleBtns = reactive<BtnItem[]>([
    { name: "购买", event: () => {
      router.push('/store/shop')
    } },
    { name: "创建", event: () => {
      router.push('/store/appRegister')
    } },
    { name: "暂存", event: () => {} }
  ]);
  // 表格table
  const tabOption = reactive<TabType[]>([
    { label: "全部", name: 0 },
    { label: "创建的", name: 1 },
    { label: "购买的", name: 2 },
    { label: "共享的", name: 3 },
    { label: "分配的", name: 4 },
  ]);
  // 关闭弹窗
  const closeDialog = (type:string,key:boolean) => {
    dialogType[type] = key
  }

  const processDesignRef = ref();
  const add: string = '从 ⌈开放市场⌋ 添加'
  const isCard = ref(true)
  const mode = ref('card')
  const instance = getCurrentInstance()

  // 注册页面实例
  const router = useRouter()
  const store = useUserStore()
  const bindedFlow = reactive({
    flow: null,
    bindShow: false
  })
  
  const flowsList = ref([])
  const flowsValue = ref(null)
  const getFlowList = (productId?:string)=>{
    $services.wflow.queryDefine({
					data:{
						id: 0,
            // productId: productId?productId:0,
						status: 1
					}
				})
				.then((res: ResultType) => {
					if(!res){
						ElMessage({
							message: '接口请求异常',
							type: 'warning'
						})
					}else if ( res.code == 200) {
						
						let openId = ""
						if(res && res.data && res.data.result){
							res.data.result = res.data.result.map((item:any)=>{item.resource = JSON.parse( item.content )['resource']; item.resource = DefaultNodeProps.getResource(item.resource,true) ;delete item.content ; delete item.flowNodes ;return item})
							flowsList.value = res.data.result
            }
							
					} else {
						ElMessage({
							message: res.msg,
							type: 'warning'
						})
					}
				})
  }
  const gotoBind = ()=>{
    flowsValue.value = null;
    bindedFlow.bindShow=true
  }
  const processClick = (e:any)=>{
    console.log('processClick',e)
  }

  const { queryInfo } = storeToRefs(store)

  // 当前用户的集团
  let groups = reactive([])

  // 当前选中的集团
  let selectedValue = ref<string>('')
  
  // 路由跳转
  const searchText = ref<string>('')
  const pageContent = ref(null)
  const diyTable = ref(null)

  // 表格展示数据
  const pageStore = reactive({
    tableData: [],
    currentPage: 1,
    pageSize: 20,
    total: 0
  })

  // 表格变更
  const selectionChange = () => {
    console.log('aaa')
  }
  // tableNav变更
  const tableActiveIndex = ref<string>();
  const handleSelect =(key:string)=>{
    tableActiveIndex.value = key
  }
  const GoPageWithQuery = (path: string, query: any) => {
    router.push({ path, query })
  }
  //去应用商店
  const goBuy = ()=>{
    router.push('/store/shop')
  }
  type StateType = {
    ownProductList: any[] //我的应用
    ownTotal: number
    shareTotal: number
    marketOptions: any[] //所有市场列表
    options: any[] //集团列表
    selectLabel: selectType // 选中的集团名称
    tableHead: any[]
    dropDwonActiveId: string // 当前dropdwon打开时选中的id
  }
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
  const state: StateType = reactive({
    ownProductList: [],
    ownTotal: 0,
    shareTotal: 0,
    marketOptions: [],
    options: [],
    dropDwonActiveId: '',
    selectLabel: {
      label: '',
      id: ''
    },
    tableHead: [
      {
        type: 'slot',
        prop: 'name',
        name: 'name',
        label: '应用名称',
        width:'200'
      },
      {
        type: 'slot',
        prop: 'tag',
        name: 'tag',
        label: '应用状态',
        width:'200'
      },
      {
        prop: 'code',
        label: '应用编码',
        width:'150'
      },
      {
        prop: 'source',
        label: '应用来源'
      },
      {
        prop: 'typeName',
        label: '应用类型',
        width:'150'
      },
      {
        prop: 'authority',
        label: '持有权限'
      },
      {
        prop: 'createTime',
        label: '创建时间',
        width: '200'
      },
      {
        type: 'slot',
        label: '操作',
        fixed: 'right',
        align: 'center',
        width: '100',
        name: 'operate'
      }
    ]
  })
  const title = ref<string>('')
  onMounted(() => {
    // 获取列表
    getProductList()
    getShopcarNum()
  })

  //列表
  watch([isCard], ([val], [valOld]) => {
    // 监听 展示方式变化
    nextTick(() => {
      if (val) {
        getProductList()
      } else {
        getProductList()
      }
    })
  })

  const shopcarNum = ref(0)
  const getShopcarNum = async () => {
    const total = await appstore.getShopcarNum()
    shopcarNum.value = total
  }

  const handleUpdate = (page: any) => {
    pageStore.currentPage = page.currentPage
    pageStore.pageSize = page.pageSize
    getProductList()
  }
  // 获取我的应用列表
  const getProductList = async () => {
    const res = await appstore.getProductList(pageStore, searchText.value)
    state[`ownProductList`] = [...res.result]
    for(let product of state[`ownProductList`]){      
        const result = await appstore.getResource(product.id)
        let flowArr:any = []
        result.filter((element:any)=>element.flows && element.flows.length>0).forEach((element:any) => {
          let arr = JSON.parse(element.flows);
          let itemArr:any = []
          arr.forEach((el:any) => {
            el.appId = product.id;
            el.appName = product.name
            el.sourceId = element.id;
            itemArr.push(el)
          });
          flowArr.push(...itemArr)
        });
        
        product.resourcesList = flowArr
    }
    state[`ownTotal`] = res.total
    pageStore.total = res.total
    // diyTable.value.state.page.total = res.total
    // pageContent.value.state.page.total = res.total
  }

  // 移除app
  const deleteApp = (item: any) => {
    ElMessageBox.confirm(`确认删除  ${item.name}?`, '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        const success = await appstore.deleteApp(item.id)
        if (success) {
          getProductList()
          ElMessage({
            type: 'success',
            message: '操作成功'
          })
        }
      })
      .catch(() => {})
  }

  // 记录当前操作的 应用信息
  const selectProductItem = ref<any>()
  // 处理 设置 菜单选择事件
  const handleCommand = (
    type: 'own' | 'other',
    command: string | number | object,
    item: any
  ) => {
    selectProductItem.value = item
    switch (command) {
      case 'share':
        openShareDialog()
        break
      case 'putaway':
        router.push({path: '/store/putShelves', query:{name:item.name,id:item.id,typeName:item.typeName}})
        break
      case 'unsubscribe':
        break
      case 'distribution':
        dialogType.cohortVisible.value = true
        break
      case 'detail':
        break
      // case '流程':
      //   startProcess(selectProductItem.value);
      //   break
      default:
        break
    }
  }

  // 下拉框显示隐藏时触发
  // value 是否显示，activeId 当前显示 的卡片内容id
  const optionDropdownChange = (value: boolean, activeId: string) => {
    if (value) {
      //显示
      state.dropDwonActiveId = activeId
    } else {
      state.dropDwonActiveId = ''
    }
  }

  //  打开集团选择弹窗
  const openShareDialog = () => {
    dialogType.shareVisible = true
  }

  // 上架应用功能
  const putawayRef = ref<any>()
  // 提交上架
  const putawaySubmit = () => {
    putawayRef.value.onPutawaySubmit()
  }
  //搜索应用
  const searchList = () => {
    pageStore.currentPage = 1
    getProductList()
  }
  const formartDateTime = (dateStr: any) => {
    if (dateStr) {
      var timestamp = new Date(dateStr).getTime()
      return timestamp
    } else {
      return new Date().getTime() + 1000
    }
  }
  const processType = ref<boolean>(false)
 
  type  resourcesType = {
    value:string,
    key:string,
    name:string,
    id:string,
    label:string,
    business:string
  }

  const resourcesList = ref< Array<resourcesType>>([])

  const resourcesValue = ref<number>()
  const enterProcess = (resource:any)=>{
    processDesignRef.value.startDesign(resource);
  }

  instance?.proxy?.$Bus.on('clickBus', (num) => {
    console.log(num)
  })
</script>
<style lang="scss">
  .el-dropdown-link{
    padding: 2px 10px;
    cursor: pointer;
    border-radius: 10px;
  }
  .el-dropdown-link:hover{
    background:#1642cb;
    color: #fff;
  }
</style>
<style lang="scss" scoped>
  .main{
    width: 100%;
    height: 100%;
    display: flex;
    .nav-list{
      width: 150px;
      height: 100%;
      background: #fff;
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
      .table{
        background: #fff;
        margin-top: 3px;
        height:calc(100vh - 250px);
        .btn-check{
          padding: 8px 16px;
          color: #154ad8;
        }
        .btn-check:hover{
            background: #154ad8;
            color: #fff;
            padding: 8px  16px;
        }
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
  }
</style>
