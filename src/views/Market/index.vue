<template>
  <div class="market-layout">
    <MarketCard :isSee="true">
      <template #right>
        <div class="edit-wrap">
          <el-button small link type="primary" @click="GoPage('/market/appApply')"
            >我的上架申请</el-button
          >
          <!-- <el-button small link type="primary" @click="GoPage('/market/register')" >注册应用 </el-button> -->
          <!-- <el-button small link type="primary" @click="GoPage('/market/softShare')"
            >从开放市场中添加应用</el-button> -->
          <!-- <el-button small link type="primary" @click="GoPage('/market/marketList')" >商店列表 </el-button> -->
          <el-button small link type="primary" @click.stop="GoPage('/market/order/buy')"
            >采购订单</el-button
          >
          <el-button small link type="primary" @click.stop="GoPage('/market/order/sell')"
            >售卖订单</el-button
          >
          <el-badge :value="shopcarNum" style="padding-left: 10px" v-if="shopcarNum > 0">
            <el-button small link type="primary" @click.stop="GoPage('/market/shopCar')"
              >购物车</el-button
            >
          </el-badge>
          <el-button small link type="primary" @click.stop="GoPage('/market/shopCar')" v-else
            >购物车</el-button
          >
        </div>
        <div>
          <el-radio-group v-model="mode" size="small" class="button">
            <el-radio-button label="list">
              <el-icon :size="18">
                <Tickets />
              </el-icon>
            </el-radio-button>
            <el-radio-button label="card">
              <el-icon :size="18">
                <Menu />
              </el-icon>
            </el-radio-button>
          </el-radio-group>
        </div>
      </template>
    </MarketCard>
    <div class="market-content box">
      <el-row :gutter="10">
        <el-col :span="6">
          <MarketCreate :info="add" @myclick="GoPage('/market/softShare')" />
        </el-col>
        <el-col :span="6">
          <MarketCreate info="从 ⌈商店⌋ 添加" @myclick="GoPage('/market/marketList')" />
        </el-col>
        <el-col :span="6">
          <MarketCreate info="创建应用" @myclick="GoPage('/market/register')" />
        </el-col>
      </el-row>

      <div class="getApp-radio">
        <h4 class="box-ul-title">我的应用</h4>
        <div class="search">
          <el-input v-model="searchText" @input="searchList" placeholder="搜索应用" clearable />
        </div>
      </div>
      <!-- 卡片视图 -->
      <div v-show="mode === 'card'">
        <div class="app-card">
          <ShopCard
            v-for="item in state.ownProductList"
            :info="item"
            :key="item.id"
            :over-id="item.id"
            type="soft"
            :class="{ 'dropdwon-active': item.id == state.dropDwonActiveId }"
          >
            <template #icon>
              <HeadImg
                :name="item.name"
                :url="item.icon"
                :imgWidth="48"
                :limit="1"
                :isSquare="false"
              />
            </template>

            <!-- 附属标题区 -->
            <template #description>
              <span>归属: {{ chat.getName(item.belongId) || '未知' }}</span>
              <el-divider direction="vertical"></el-divider>
              <span>版本： 0.0.1</span>
            </template>
            <!-- 内容区 -->
            <template #body>
              <el-tooltip trigger="click" effect="customized">
                <template #content>
                  <div style="max-width: 280px">
                    {{ item?.remark || '暂无' }}
                  </div>
                </template>
                <p class="app-card-item-con-desc">简介: {{ item?.remark || '暂无' }}</p>
              </el-tooltip>
            </template>
            <!-- 操作区 -->
            <template #option>
              <div class="option-unit">
                <el-dropdown
                  trigger="click"
                  @command="(value:any) => handleCommand('own', value, item)"
                  placement="top"
                  @visible-change="(value:boolean)=> optionDropdownChange(value,item.id)"
                >
                  <div class="option-unit">设置</div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <div v-for="action in actionOptionsOfOwn" :key="action.value">
                        <div v-if="new Date().getTime() < formartDateTime(item?.endTime)">
                          <el-dropdown-item
                            v-if="
                              item.authority == '所属权' &&
                              item.belongId == store.workspaceData.id &&
                              action.label == '上架'
                            "
                            :command="action.value"
                            >{{ action.label }}</el-dropdown-item
                          >
                          <el-dropdown-item
                            v-if="item.belongId == store.workspaceData.id && action.label == '共享'"
                            :command="action.value"
                            >{{ action.label }}</el-dropdown-item
                          >
                          <el-dropdown-item
                            v-if="store.workspaceData.type == 2 && action.label == '分配'"
                            :command="action.value"
                            >{{ action.label }}</el-dropdown-item
                          >
                        </div>
                        <el-dropdown-item v-if="action.label == '详情'" :command="action.value">{{
                          action.label
                        }}</el-dropdown-item>
                      </div>
                      <el-dropdown-item v-if="item.resourcesList && item.resourcesList.length>0">

                        <el-dropdown
                          trigger="hover"
                          placement="right-end"
                        >
                        流程业务
                        <template #dropdown>
                         <el-dropdown-menu style="padding-left:10px;min-width:100px">
                          <el-dropdown-item v-for="resource in item.resourcesList" :key="resource.formId"  @click="enterProcess(resource)">{{resource.business}}</el-dropdown-item>
                         </el-dropdown-menu>
                        </template>
                      </el-dropdown>

                      </el-dropdown-item>
                      <el-dropdown-item
                        @click="GoPageWithQuery('/market/publishList', { id: item.id })"
                        >应用上架列表
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <el-divider direction="vertical"></el-divider>
              <div class="option-unit" @click="deleteApp(item)">移除应用</div>
            </template>
          </ShopCard>
        </div>
      </div>
      <div class="tab-card" v-show="mode === 'list'">
        <DiyTable
          ref="diyTable"
          :hasTitle="true"
          @handleUpdate="handleUpdate"
          v-if="state.ownProductList"
          :tableData="state.ownProductList"
          :tableHead="state.tableHead"
        >
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
            <el-button
              v-if="scope.row.authority == '所属权' && scope.row.belongId == store.workspaceData.id"
              link
              type="primary"
              @click="handleCommand('own', 'putaway', scope.row)"
              >上架</el-button
            >
            <el-button
              link
              type="primary"
              v-if="scope.row.belongId == store.workspaceData.id"
              @click="openShareDialog"
            >
              共享</el-button
            >
            <el-button
              link
              type="primary"
              v-if="authority.IsCompanySpace()"
              @click="cohortVisible = true"
              >分配
            </el-button>
            <el-button link type="primary" @click="GoPage(`/market/detail/${scope.row.id}`)">
              查看详情
            </el-button>

            <el-button link type="primary" @click="deleteApp(scope.row)">移除应用</el-button>
          </template>
        </DiyTable>
      </div>
      <div class="page-flex" v-show="mode === 'card'">
        <Pagination ref="pageContent" @handleUpdate="handleUpdate"></Pagination>
      </div>
    </div>
    <el-dialog
      v-model="publishVisible"
      title="应用上架"
      width="600px"
      draggable
      :close-on-click-modal="false"
    >
      <putaway-comp
        :info="selectProductItem"
        ref="putawayRef"
        @closeDialog="publishVisible = false"
      >
        <template #btns>
          <div class="putaway-footer" style="text-align: right">
            <el-button @click="publishVisible = false">取消</el-button>
            <el-button type="primary" @click="putawaySubmit()"> 确认</el-button>
          </div>
        </template>
      </putaway-comp>
    </el-dialog>
    <el-dialog
      v-if="cohortVisible"
      v-model="cohortVisible"
      custom-class="share-dialog"
      title="应用分配"
      width="1000px"
      draggable
      :close-on-click-modal="false"
    >
      <ShareComponent
        dialogType="1"
        @closeDialog="cohortVisible = false"
        :info="selectProductItem"
      ></ShareComponent>
    </el-dialog>
    <el-dialog
      v-if="shareVisible"
      v-model="shareVisible"
      custom-class="share-dialog"
      title="应用共享"
      width="1000px"
      draggable
      :close-on-click-modal="false"
    >
      <ShareComponent
        dialogType="2"
        :type="store.workspaceData.type"
        @closeDialog="shareVisible = false"
        :info="selectProductItem"
      ></ShareComponent>
    </el-dialog>
    <!-- <el-dialog
      v-model="processType"
      custom-class="share-dialog"
      width = "55%"
      title="流程设计"
      draggable
      :close-on-click-modal="false"
    >
      <div class="process-row">
        <div class="row-title">选择表单</div>
        <el-select v-model="resourcesValue" class="m-2" placeholder="Select" size="large" @change="formChange">
          <el-option
            v-for="(item,index) in resourcesList"
            :key="item.id"
            :label="item.business"
            :value="index"
          />
        </el-select>
       <div v-if="!bindedFlow.bindShow && (resourcesValue || resourcesValue==0)"><div v-if="bindedFlow.flow" style="margin-left: 10px;">  <el-link type="primary" @click="subProcess(false)">《{{bindedFlow.flow.name}}》</el-link> <el-link type="danger" style="margin-left: 10px;font-size: 10px;" @click="gotoBind">重新绑定</el-link> <el-link type="danger" style="margin-left: 10px;font-size: 10px;" @click="subProcess(true)">新增设计</el-link></div><div v-else style="margin-left: 10px;"><el-link type="primary" @click="subProcess(true)">新增设计</el-link>    <el-link type="danger" style="margin-left: 10px;" @click="gotoBind">绑定</el-link></div></div> 
      </div>

      <div class="process-row" v-if="bindedFlow.bindShow">
        <div class="row-title">绑定流程</div>
        <el-select v-model="flowsValue" class="m-2" placeholder="Select" size="large" @change="bindFlow">
          <el-option
            v-for="(item,index) in flowsList"
            :key="item.id"
            :label="item.name"
            :value="index"
          />
        </el-select>
      </div>
    </el-dialog> -->
    <ProcessDesign ref="processDesignRef" />
  </div>
</template>
<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { onMounted, reactive, ref, watch, nextTick } from 'vue'
  import ShopCard from './components/shopCard.vue'
  import PutawayComp from './components/putawayComp.vue'
  import { actionOptionsOfOwn } from './config'
  import ShareComponent from './components/shareComponents.vue'
  import { useRouter } from 'vue-router'
  import type { FormInstance } from 'element-plus'
  import MarketCreate from './components/marketCreate.vue'
  import MarketCard from '@/components/marketCard/index.vue'
  import { useUserStore } from '@/store/user'
  import DiyTable from '@/components/diyTable/index.vue'
  import $services from '@/services'
  import Pagination from '@/components/pagination/index.vue'
  import {chat} from '@/module/chat/orgchat'
  import authority from '@/utils/authority'
  import { storeToRefs } from 'pinia'
  import { appstore } from '@/module/store/app'
  import DefaultNodeProps from '@/components/wflow/process/DefaultNodeProps'
  // import MarketServices from './market.services'
  // hoverItem--鼠标移入item的id 用于展示按钮区域
  // console.log('MarketServices',MarketServices);
  import ProcessDesign from '@/components/wflow/ProcessDesign.vue';
  const processDesignRef = ref();
  const add: string = '从 ⌈开放市场⌋ 添加'
  const isCard = ref(true)
  const mode = ref('card')
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
  // 集团共享
  const groupVisible = ref<boolean>(false)
  // 共享功能
  const cohortVisible = ref<boolean>(false)

  const shareVisible = ref<boolean>(false)
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

  const GoPageWithQuery = (path: string, query: any) => {
    router.push({ path, query })
  }
  //应用搜索
  const GoPage = (path: string) => {
    router.push(path)
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
        label: '应用名称'
      },
      {
        type: 'slot',
        prop: 'tag',
        name: 'tag',
        label: '应用状态'
      },
      {
        prop: 'code',
        label: '应用编码'
      },
      {
        prop: 'source',
        label: '应用来源'
      },
      {
        prop: 'typeName',
        label: '应用类型'
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
        width: '300',
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
  // 关闭共享弹窗
  // const closeDialog = () => {
  //   shareVisible.value = false
  // }
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
          console.log(element,'aaaaa')
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
    diyTable.value.state.page.total = res.total
    pageContent.value.state.page.total = res.total
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
        publishVisible.value = true
        break
      case 'unsubscribe':
        break
      case 'distribution':
        cohortVisible.value = true
        break
      case 'detail':
        GoPage(`/market/detail/${item.id}`)
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
    shareVisible.value = true
  }

  // 上架应用功能
  const publishVisible = ref<boolean>(false)
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

  // const startProcess = async (product:any) =>{
  //   resourcesValue.value = null
  //   processType.value = true;
  //   getFlowList(product.id)
  //   const result = await appstore.getResource(product.id)
  //   let flowArr:any = []
  //   result.forEach((element:any) => {
  //     let arr = JSON.parse(element.flows);
  //     let itemArr:any = []
  //     arr.forEach((el:any) => {
  //       el.appId = selectProductItem.value.id;
  //       el.appName = selectProductItem.value.name
  //       el.sourceId = element.id;
  //       itemArr.push(el)
  //     });
  //     flowArr.push(...itemArr)
  //   });
  //   resourcesList.value = flowArr
  // }

  const resourcesValue = ref<number>()
  const enterProcess = (resource:any)=>{
    processDesignRef.value.startDesign(resource);
  }
  // const subProcess = (createNew:boolean)=>{
  //   let obj:any = resourcesList.value[resourcesValue.value]
  //   obj.flow = createNew? null: bindedFlow.flow
  //   processDesignRef.value.startDesign(obj);
  //   processType.value = false;
  // }
</script>

<style>
  .group-dialog > .el-dialog__body {
    padding: 10px 20px;
    height: 100px;
    display: flex;
    align-items: center;
  }

  .share-dialog > .el-dialog__header {
    text-align: center;
    font-weight: bold;
  }

  .share-dialog > .el-dialog__body {
    padding: 10px 20px;
  }
</style>

<style lang="scss" scoped>
  .header-box {
    display: flex;
  }

  .cohortLayout {
    width: 100%;
    height: 500px;
    overflow: auto;
  }

  .page-flex {
    height: 64px;
    width: 100%;
    overflow: hidden;
  }

  .menuRight {
    width: 100px;
    height: 60px;
    position: absolute;
    background-color: rgb(247, 247, 247);
    font-size: 12px;
    z-index: 999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &-fixed {
      padding: 5px 0;
      width: 100%;
      text-align: center;

      &:hover {
        background-color: #fff;
      }
    }

    &-cancel {
      padding: 10px 0;
      width: 100%;
      text-align: center;

      &:hover {
        background-color: #fff;
      }
    }
  }

  .el-select {
    width: 100%;
  }

  .market-layout {
    width: 100%;
    height: 100%;
    min-width: 1000px;
    position: relative;

    .market-head {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 60px;
      padding: 0 20px;
    }

    .market-content {
      // position: absolute;
      padding: 2px 2px 0;
      // margin-top: 4px;
      width: 100%;
      height: calc(100vh - 120px);
      overflow-y: auto;
    }

    .edit-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .app-card-item-con-desc {
      cursor: pointer;
      font-size: 13px;
      color: var(--el-text-color-regular);
      line-height: 1.8;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-inline-box; //将对象作为弹性伸缩盒子模型显示。
      -webkit-box-orient: vertical; // 从上到下垂直排列子元素
      -webkit-line-clamp: 2; //显示的行数
    }

    // body内每行 高度
    .card-body-cell {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .button {
      // position: absolute;
      // right: 50px;
      // bottom: 20px;
      margin-left: 10px;
    }

    .box {
      background-color: var(--el-bg-color);
      padding: 10px 24px;
      // height: 100%;

      // display: flex;
      // flex-direction: column;
      // flex: 1;
      &-title {
        font-weight: bold;
        padding: 8px 0;
      }

      .getApp-radio {
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-bottom: 20px;
        align-items: center;

        .box-ul-title {
          width: 50%;
          display: flex;
          justify-content: flex-start;
        }

        .search {
          width: 200px;
        }
      }

      .app-card {
        display: flex;
        flex-wrap: wrap;
        height: calc(100vh - 460px);
        align-content: flex-start;
        overflow-y: auto;
      }

      .tab-card {
        height: calc(100vh - 404px);
      }
    }
  }
  .process-row{
    display: flex;
    align-items: center;
    justify-content: left;
    margin: 20px;
    .row-title{
      width: 80px;
    }
    .m-2{
      max-width: 50%;
    }
  }
  .process-footer{
    margin: 30px 0s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
