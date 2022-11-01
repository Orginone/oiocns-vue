<template>
  <div class="market-layout">
    <MarketCard>
      <template #right>
        <el-button link type="primary" @click="createDialog = true">创建商店</el-button>
        <el-button link type="primary" @click="searchDialog = true">加入商店</el-button>
        <el-button link type="primary" @click="GoPage('/market/userApply')" style="margin-right: 10px">我的加入申请
        </el-button>

        <el-radio-group v-model="showType" size="small" class="button">
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
      </template>
    </MarketCard>

    <div class="market-content box">
      <div class="getApp-radio">
        <h4 class="box-ul-title">我的商店</h4>
        <div class="search">
          <el-input v-model="searchText" @input="searchList" placeholder="搜索商店" clearable />
        </div>
      </div>
      <div class="app-card" v-show="showType === 'card'">
        <template v-if="state.myMarket.length !== 0">
          <ShopCard v-for="item in state.myMarket" :info="item" :key="item.id" :overId="item.id" :softwareId="software"
            type="market" :class="{'dropdwon-active':item.id==state.dropDwonActiveId}">
            <template #icon>
              <HeadImg :name="item.name" :url="item.icon || storeImg" :imgWidth="48" :limit="1" :isSquare="true" />
            </template>
            <template #option>
              <div class="option-unit" v-if="item.belongId">
                <el-dropdown trigger="click" placement="top" v-if="item.id != software"
                  @visible-change="(value:boolean)=> optionDropdownChange(value,item.id)">
                  <div class="option-unit">设置</div>
                  <!-- <el-icon :size="18">
                      <Operation />
                    </el-icon> -->
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click.stop="handleClick(item)">
                        {{item.belongId == workspaceData.id ?'删除':'退出' }}商店
                      </el-dropdown-item>
                      <el-dropdown-item @click.stop="hadleUserManage(item)">
                        用户管理
                      </el-dropdown-item>
                      <el-dropdown-item @click.stop="showDetail(item)">
                        基础详情
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <el-divider direction="vertical" v-if="item.belongId"></el-divider>
              <div class="option-unit" @click="GoPageWithQuery('/market/appList', { data: item.id, type: 'manage' })">
                进入商店
              </div>
            </template>
            <!-- 标题下一行的内容 -->
            <template #description>
              <span>归属: {{ chat.getName(item.belongId) || '-' }}</span>
              <el-divider direction="vertical" style="margin: 0 8px;"></el-divider>
              <span class="shop-code" style="cursor: pointer;" @click.stop="copyCode(item.code)">
                编码: {{ item.code || '-' }}
                <el-icon>
                  <DocumentCopy />
                </el-icon>
              </span>
            </template>

            <template #body>
              <el-tooltip trigger="click" effect="customized" @click.stop>
                <template #content>
                  <div style="max-width: 280px;">
                    {{item?.remark }}
                  </div>
                </template>
                <p class="app-card-item-con-desc" @click.stop>简介: {{ item?.remark || '暂无' }}</p>
              </el-tooltip>
            </template>
          </ShopCard>
        </template>
      </div>
      
      <div v-show="showType === 'list'">
        <DiyTable ref="diyTable" :options="{ noPage: true, order: true }" :hasTitle="true" :tableData="state.myMarket"
          :tableHead="state.tableHead">
          <template #isPublic="scope">
            <el-tag style="margin-left: 10px" :type="scope.row.public == true ? 'success' : ''">{{
            scope.row.public == true ? '公开的' : '私有的'
            }}</el-tag>
          </template>
          <template #tag="scope">
            <el-tag v-if="scope.row.id != software" style="margin-left: 10px"
              :type="scope.row.createUser == workspaceData.id ? '' : 'success'">{{ scope.row.belongId ==
              workspaceData.id ? '创建的' : '加入的' }}</el-tag>
          </template>
          <template #operate="scope">
            <el-button v-if="scope.row.id != software" class="btn" type="primary" link small
              @click.stop="hadleUserManage(scope.row)">用户管理</el-button>
            <el-button class="btn" type="primary" link small @click.stop="marketQuit(scope.row)"
              v-if="scope.row.id != software">删除商店</el-button>
          </template>
        </DiyTable>
      </div>
    </div>
    <div class="page-flex" v-show="showType === 'card'">
        <Pagination ref="pageContent" @handleUpdate="handleUpdate"></Pagination>
      </div>
    <el-dialog append-to-body v-model="createDialog" title="创建商店" width="30%" class="" @close="closeCreateDialog">
      <el-form ref="formRef" :model="form.data">
        <el-form-item label="商店名称" prop="name" :rules="[
          { required: true, message: '请输入商店名称' },
          { min: 3, message: '商店名称至少有3个字', trigger: 'blur' },
        ]">
          <el-input v-model.number="form.data.name" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="商店编码" prop="code" :rules="[
          { required: true, message: '请输入商店编码，以便其他查询' },
        ]">
          <el-input v-model.number="form.data.code" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="商店简介" prop="remark" :rules="[
          { required: true, message: '请输入商店简介' },
        ]">
          <el-input v-model="form.data.remark" type="textarea" maxlength="120" show-word-limit
            :autosize="{ minRows: 4, maxRows: 6 }" autocomplete="off" />
        </el-form-item>
        <el-form-item label="商店是否公开" prop="public">
          <el-switch v-model="form.data.public" active-text="是" inactive-text="否" inline-prompt></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createDialog = false">取消</el-button>
          <el-button type="primary" @click="createShop(formRef)">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 商店 详情 -->
    <el-drawer v-model="detailDrawer" :size="600" :title="detailDrawer ?state?.current.name :''">
      <el-descriptions :column="1">
        <el-descriptions-item v-for="item in (state.detailColumn as DetailColumnType[])" :key="(item?.prop as string)">
          <template #label>
            {{item.label}}
          </template>
          <el-tag v-if="item.type==='tag'" :type="item.props?.type(state.current)">
            {{ item.render(state.current) }}
          </el-tag>
          <template v-else>
            {{item.render ? item.render(state.current) :state.current[item?.prop as string] ||`-`}}
          </template>
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>
    <searchMarket v-if="searchDialog" @closeDialog="closeDialog" :serachType="7" @checksSearch="checksSearch" />
  </div>
</template>

<script setup lang="ts">
import {chat} from '@/module/chat/orgchat'
import { reactive, onMounted, computed, ref } from 'vue'
import ShopCard from '../components/shopCard.vue'
import { useRouter } from 'vue-router'
import $services from '@/services'
import searchMarket from '@/components/searchs/index.vue'
import MarketCard from '@/components/marketCard/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/user'
import storeImg from '@/assets/img/app_icon.png'
import Pagination from '@/components/pagination/index.vue'
import type { FormInstance } from 'element-plus'
import { storeToRefs } from 'pinia'
import marketServices from "@/module/store/market"

type DetailColumnType = {
  prop: string,
  label:string, //
  props: any // 展示的节点配置
  type: string, // 展示节点类型
  render: (item:any)=> any, // 自定义渲染内容
}
const searchDialog = ref<boolean>(false)
const router = useRouter()
const store = useUserStore()
const { workspaceData } = storeToRefs(store)
const handleCurrentMy: any = computed(() => {
  return (state.pageMy.currentPage - 1) * state.pageMy.pageSize
})
const handleCurrentJoin: any = computed(() => {
  return (state.pageJoin.currentPage - 1) * state.pageJoin.pageSize
})
const GoPageWithQuery = (path: string, query: any) => {
  if (query.data == software.value) {
    router.push({ path: '/market/softShare', query })
  } else {
    router.push({ path, query })
  }
}
const formRef = ref<FormInstance>()
const pageContent = ref(null)
const showType = ref('card')
const add: string = '创建商店'
const add1: string = '加入商店'
const searchText = ref<string>('')
const software = ref<string>('')
const createDialog = ref(false) // 创建商店
const detailDrawer = ref(false) // 商店详情
const state = reactive({
  dropDwonActiveId: '',
  current: null, // 当前选中的商店对象
  softShareInfo: {
    id: ''
  },
  myMarket: [],
  joinMarket: [],
  pageMy: {
    total: 0, // 总条数
    currentPage: 1, // 当前页
    current: handleCurrentMy,
    pageSize: 12, // 每页条数
    layout: 'total, prev, pager, next'
  },
  pageJoin: {
    total: 0, // 总条数
    currentPage: 1, // 当前页
    current: handleCurrentJoin,
    pageSize: 12, // 每页条数
    layout: 'total, prev, pager, next'
  },
  addDialog: {
    value: false
  },
  tableHead: [
    {
      prop: 'name',
      label: '商店名称'
    },
    {
      prop: 'code',
      label: '商店编码'
    },
    {
      type: 'slot',
      prop: 'isPublic',
      name: 'isPublic',
      label: '是否公开'
    },
    {
      type: 'slot',
      prop: 'tag',
      name: 'tag',
      label: '应用权属'
    },
    {
      prop: 'remark',
      label: '商店简介'
    },
    {
      prop: 'createTime',
      label: '创建时间'
    },
    {
      type: 'slot',
      label: '操作',
      fixed: 'right',
      align: 'center',
      width: '200',
      name: 'operate'
    }
  ],
  detailColumn: [
    {
      prop: 'name',
      label: '商店名称'
    },
    {
      prop: 'code',
      label: '商店编码'
    },
    {
      prop: 'public',
      label: '是否公开',
      type: 'tag',
      props: {
        type: (item: any)=> {
          return item.public ? 'success' :'danger'
        }
      },
      render: (item: any)=> {
        return item.public ? '公开' :'私有'
      }
    },
    {
      type: 'tag',
      prop: 'belongId',
      label: '应用权属',
      props: {
        type: (item: any)=> {
          return item.belongId=== workspaceData?.value.id ? '' :'success'
        }
      },
      render: (item: any)  => {

        return item.belongId=== workspaceData?.value.id  ? '创建的' :'加入的'
      }
    },
    {
      prop: 'remark',
      label: '商店简介'
    },
    {
      prop: 'createUser',
      label: '归属人',
      render: (item: any)=> {
        return chat.getName(item.createUser)
      }
    },
    {
      prop: 'createTime',
      label: '创建时间'
    },

  ]
})


onMounted(() => {
  getMarketInfo()
  getMyMarketData()
  //getJoinMarketData()
})

const handleCurrentChange = (val: number) => {
  getMyMarketData()
  console.log(val)
}
const handleUpdate = (val: any) => {
  state.pageMy.currentPage = val

  getMyMarketData()
}
// 下拉框显示隐藏时触发
// value 是否显示，activeId 当前显示 的卡片内容id
const optionDropdownChange = (value: boolean, activeId: string) => {

  if (value) { //显示
    state.dropDwonActiveId = activeId
  } else {
    state.dropDwonActiveId = ''
  }
}
const GoPage = (path: string) => {
  router.push(path)
}
type arrList = {
  id: string
}
const hadleUserManage = (item: { id: number }) => {
  router.push({ path: '/market/userManage', query: { data: item.id } })
}

const gotoApp = (item: { id: string }) => {
  router.push({ path: '/market/appList', query: { data: item.id } })
}
const searchList = () => {
  state.pageMy.currentPage = 1
  getMyMarketData()
}
const checksSearch = (val: any) => {
  if (val.value.length > 0) {
    let arr: Array<arrList> = []
    val.value.forEach((element: any) => {
      arr.push(element.id)
    })
    submit(arr)
  } else {
    searchDialog.value = false
  }
}

const getMyMarketData = async() => {
  await marketServices.getMarketList({
        offset: state.pageMy.current,
        limit: state.pageMy.pageSize,
        filter: searchText.value
      });
      getPageDataFromServices()

}

const marketQuit = (item: any) => {
  ElMessageBox.confirm(`确认退出  ${item.name}?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async() => {
      await marketServices.quitMarket(item.id);
      getPageDataFromServices()
    })
    .catch(() => { })
}
const handleClick = (item: any) => {
  ElMessageBox.confirm(`确认删除  ${item.name}?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async() => {
      await marketServices.deleteMarket(item.id);
      getPageDataFromServices()
    })
    .catch(() => { })
}
// 从文件内获取展示数据
const getPageDataFromServices = ()=>{
    state.myMarket = marketServices.marketList
    state.pageMy.total = marketServices.marketTotal
    pageContent.value.state.page.total = marketServices.marketTotal
}

const form = reactive({
  data: {
    name: '',
    code: '',
    samrId: '',
    remark: '',
    authId: '',
    public: true

  }
})

//查看商店详情
const showDetail = (item: any) => {

  state.current = { ...item }
  detailDrawer.value = true
}
//创建商店
const createShop = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  const isValidate = await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
      return false
    }
  })
  if (!isValidate) return
  await marketServices.creatMarket({
        name: form.data.name,
        code: form.data.code,
        samrId: store.queryInfo.id,
        authId:
          store.workspaceData.type === 2
            ? store.workspaceData.authId
            : store.queryInfo.team.authId, // 空间为组织单位时取组织单位 的authId
        remark: form.data.remark,
        public: form.data.public
      });

        getPageDataFromServices()
        closeCreateDialog()
}

const submit = (data: any) => {
  $services.appstore
    .applyJoin({
      data: {
        id: data[0]
      }
    })
    .then((res: ResultType) => {
      if (res.success) {
        ElMessage({
          message: '加入成功',
          type: 'success'
        })
        searchDialog.value = false
        //getJoinMarketData()
      }
    })
}
// 关闭创建商店弹框
const closeCreateDialog = () => {
  createDialog.value = false
  formRef.value?.resetFields()
}

// 关闭搜索弹框
const closeDialog = (data: { value: boolean }) => {

  searchDialog.value = false
}
// 获取共享仓库信息
const getMarketInfo = async() => {
await marketServices.getPublicStore()
      store.softShareInfo=marketServices.PUBLIC_STORE
      software.value = marketServices.PUBLIC_STORE.id

}
// 复制商店编码
const copyCode = (needCopyText: string) => {
  let copyInput = document.createElement('input')
  copyInput.value = needCopyText
  document.body.appendChild(copyInput)
  copyInput.select()
  document.execCommand('Copy')
  ElMessage({
    message: '复制成功',
    type: 'success'
  })
  copyInput.remove()
}
</script>

<style lang="scss" scoped>
.triangle-private {
  margin-right: 0px;
  margin-top: 0px;
  width: 40px;
  height: 40px;
  background-color: rgb(255, 0, 0, 0.5);
  clip-path: polygon(0 0, 100% 100%, 100% 0%);
  font-size: 18px;
  color: #fff;
  text-align: right;
}

.triangle-public {
  margin-right: 0px;
  margin-top: 0px;
  width: 40px;
  height: 40px;
  background-color: rgb(0, 238, 255, 0.5);
  clip-path: polygon(0 0, 100% 100%, 100% 0%);
  font-size: 18px;
  color: #fff;
  text-align: right;
}

.market-layout {
  width: 100%;
  height: 100%;
  min-width: 1000px;

  .market-head {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 60px;
    padding: 0 20px;
  }

  .market-content {
    // margin-top: 4px;
    height: calc(100vh - 168px);
    overflow-y: auto;
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

  .shop-code {
    &:hover {
      color: var(--el-color-primary);
    }
  }

  .box {

    // height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;


    background-color: var(--el-bg-color);
    padding: 10px 24px;

    .getApp-radio {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;


      // .box-ul-title {
      //   width: 50%;
      //   display: flex;
      //   justify-content: flex-start;
      // }

      .search {
        width: 200px;

      }
    }

    // .page-flex {
    //   position: absolute;
    //   right: 40px;
    //   bottom: 36px;
    // }

    .app-card {
      display: flex;
      flex-wrap: wrap;
  
    }

  }
}
</style>
