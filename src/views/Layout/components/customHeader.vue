<template>
  <el-row class="page-custom-header">
    <!-- 左侧 -->
    <el-col class="head-title" :span="4">
      <div style="display: flex; align-items: center; height: 100%" @mouseleave="handleClose()">
        <div class="select-item__imgSelect" style="margin-right: 5px">
          {{ workHead() }}
        </div>
        <div class="col-box" @click="onClickUnit">
          <div class="col-text">{{ workspaceData?.name || '' }}</div>
          <div class="col-icon">
            <el-icon>
              <CaretBottom
                :style="
                  btnType
                    ? 'transform: rotate(180deg);transition: all 0.5s;'
                    : 'transform: rotate(0);transition: all 0.5s;'
                "
              />
            </el-icon>
          </div>
        </div>

        <div @mouseover="handleOpen()" class="select-drop" :style="getDropMenuStyle">
          <div class="select-box" v-infinite-scroll="load" infinite-scroll-immediate>
            <div
              class="seletc-drop__box"
              v-for="item in store.loadCompanys"
              :key="item.id"
              @click="switchCompany(item)"
            >
              <div class="select-drop__flex">
                <div class="select-item__imgSelect">
                  {{ item.team ? item.team.name.slice(0, 1) : item.name.slice(0, 1) }}
                </div>
                <div class="select-item__titleSelect">{{
                  item.team ? item.team.name : item.name
                }}</div>
              </div>
            </div>
          </div>

          <div class="joinBox">
            <el-button class="joinBtn" @click="createCompany" text type="primary"
              >创建单位</el-button
            >
            <el-button class="joinBtn" @click="friendShow" text type="primary">加入单位</el-button>
          </div>
        </div>
      </div>
    </el-col>
    <!-- 中间搜索 -->
    <!-- <el-col :span="6" class="col-center" v-if="false">
      <el-popover trigger="click" :visible="visible" placement="bottom" :width="100">
        <template #reference>
          <el-input
            ref="searchRef"
            class="right-con"
            v-model="SearchInfo"
            :style="{ width: '100%', height: '40px' }"
            placeholder="请输⼊想搜索的功能"
          >
            <template #prepend>
              <el-button :icon="Search" @click="showSearchInfo" />
            </template>
          </el-input>
        </template>
        <SearchDialog></SearchDialog>
      </el-popover>
    </el-col> -->
    <!-- 右侧 -->
    <el-col :span="20" class="flex col-right">
      <el-space class="right-navbar">
        <li
          v-for="(item, index) in state.mainMenus.filter((a) => !a?.bottom)"
          @click="handleRouterChage(item)"
          :key="index"
          :title="item.name"
        >
          <el-icon class="aside-li-icon" :size="20">
            <component :is="item.icon" />
          </el-icon>
        </li>
        <el-link
          title="消息"
          :underline="false"
          class="header-message-icon"
          @click="() => router.push('/chat')"
        >
          <el-icon v-if="chat.authed.value" class="header-message-icon link" :size="12">
            <Link />
          </el-icon>
          <el-badge :value="chat.getNoReadCount()" v-if="chat.getNoReadCount().length > 0">
            <el-icon class="header-message-icon" :size="20">
              <ChatDotSquare />
            </el-icon>
          </el-badge>
          <el-icon class="header-message-icon" :size="20" v-else>
            <ChatDotSquare />
          </el-icon>
        </el-link>
        <el-switch
          title="模式"
          v-model="isDark"
          active-icon="Moon"
          inactive-icon="Sunny"
          inline-prompt
        ></el-switch>
        <el-dropdown trigger="hover" size="large" class="dropdown-menu">
          <span class="el-dropdown-link">
            <headImg :name="queryInfo.name" :limit="1" :imgWidth="24" :isSquare="false"></headImg>
            <!-- <span>{{  queryInfo.name  }}</span> -->
            <!-- <el-icon style="margin-left: 15px">
              <CaretBottom />
            </el-icon> -->
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="toWork" icon="Setting">首页配置</el-dropdown-item>
              <el-dropdown-item @click="toUserSetting" icon="Postcard">个人中心</el-dropdown-item>
              <el-dropdown-item v-if="isUnitWork" @click="toCompanySetting" icon="Postcard"
                >单位中心</el-dropdown-item
              >
              <el-dropdown-item icon="Help">帮助中心 </el-dropdown-item>
              <el-dropdown-item icon="Switch">切换语言 </el-dropdown-item>
              <el-dropdown-item icon="Brush">切换主题 </el-dropdown-item>
              <el-dropdown-item @click="exitLogin" icon="SwitchButton" divided
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-space>
    </el-col>
  </el-row>
  <searchCompany
    v-if="searchDialog"
    :serachType="3"
    @closeDialog="closeDialog"
    @checksSearch="checksSearch"
  >
  </searchCompany>
  <template v-for="item in dialogShow" :key="item.key">
    <CreateUnitDialog
      v-if="item.key == 'unit' && item.value"
      :dialogShow="item"
      @closeDialog="closeDialog"
      @switchCreateCompany="switchCreateCompany"
    ></CreateUnitDialog>
    <SearchDialog
      v-if="item.key == 'search' && item.value"
      :dialogShow="item"
      :search="SearchInfo"
      @closeDialog="closeDialog"
    ></SearchDialog>
  </template>
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted, reactive, computed } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/store/user'
  import $services from '@/services'
  import { ElMessage } from 'element-plus'
  import CreateUnitDialog from './createUnitDialog.vue'
  import searchCompany from '@/components/searchs/index.vue'
  import JoinUnitDialog from './joinUnitDialog.vue'
  import SearchDialog from './searchDialog.vue'
  import headImg from '@/components/headImg.vue'
  import { useDark, useToggle } from '@vueuse/core'
  import { chat } from '@/module/chat/orgchat'

  const isDark = useDark()
  // const toggleDark = useToggle(isDark)

  const store = useUserStore()
  const SearchInfo = ref('')
  const router = useRouter()
  let current = ref(1)
  const visible = ref(false)
  const showSearch = ref(false)
  const btnType = ref(false)
  const { queryInfo } = storeToRefs(store)
  const workspaceData = store.workspaceData
  const dropdown = ref()
  const workHead = () => {
    if (workspaceData?.name == '个人空间') {
      return '我'
    }
    return workspaceData?.name[0] || ''
  }
  const isUnitWork = ref<boolean>(workspaceData.id != queryInfo.value.id)

  const state = reactive({
    mainMenus: [
      { name: '工作台', icon: 'DataAnalysis', path: '/workHome' },
      { name: '关系', icon: 'SetUp', path: '/relation' },
      { name: '仓库', icon: 'Box', path: '/market' },
      { name: '网盘', icon: 'Files', path: '/cloud' },
      { name: '待办', icon: 'Notebook', path: '/cardDetail' },
      { name: '应用', icon: 'Menu', path: '#', bottom: true }
    ]
  })

  const getDropMenuStyle = computed(() => {
    if (!btnType.value) {
      return 'height:0px'
    } else {
      let height = store.userCompanys.length < 6 ? store.userCompanys.length : 6
      return store.userCompanys.length ? 'height:' + (height * 45 + 56) + 'px;' : 'height:56px'
    }
  })

  const handleRouterChage = (item: any) => {
    router.push({ path: item.path })
  }

  const load = async () => {
    let currentPage = 0
    current.value = current.value + 1
    currentPage = (current.value - 1) * 10 + 1
    await store.getCompanyList(currentPage, workspaceData.id, true)
  }
  const dialogShow = reactive([
    {
      key: 'unit',
      value: false
    },
    {
      key: 'join',
      value: false
    },
    {
      key: 'search',
      value: false
    }
  ])
  const showSearchInfo = () => {
    visible.value = !visible.value
  }
  const searchDialog = ref<boolean>(false)
  type arrList = {
    id: string
  }
  const checksSearch = (val: any) => {
    if (val.value.length > 0) {
      let arr: Array<arrList> = []
      val.value.forEach((element: any) => {
        arr.push(element.id)
      })
      console.log('val', arr)
      joinSubmit(arr)
    } else {
      searchDialog.value = false
    }
  }
  const friendShow = () => {
    searchDialog.value = true
  }
  const joinSubmit = (arr: any) => {
    $services.company
      .applyJoin({
        data: {
          id: arr.join('')
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          searchDialog.value = false
          ElMessage({
            message: '申请成功',
            type: 'success'
          })
        }
      })
  }

  const onClickUnit = async () => {
    btnType.value = !btnType.value
    if (!store.userCompanys || store.userCompanys.length == 0) {
      await store.getCompanyList(0, workspaceData.id, false)
    }
  }
  const handleClose = () => {
    btnType.value = false
  }
  const handleOpen = () => {
    btnType.value = true
  }
  const createCompany = () => {
    dialogShow.map((el) => {
      if (el.key == 'unit') {
        el.value = true
        btnType.value = false
      }
    })
  }
  const closeDialog = (key: string) => {
    searchDialog.value = false
    dialogShow.map((el) => {
      if (el.key == key) {
        el.value = false
      }
    })
  }
  const onClickDrop = async () => {
    if (store.userCompanys.length == 0) {
      current.value = 0
      await store.getCompanyList(current.value, workspaceData.id, false)
    }
  }

  const switchCreateCompany = (data: { id: string }) => {
    $services.person
      .changeWorkspace({
        data: {
          id: data.id
        }
      })
      .then(async (res: ResultType) => {
        if (res.code == 200) {
          sessionStorage.setItem('TOKEN', res.data.accessToken)
          await store.getQueryInfo(res.data.accessToken)
          current.value = 0
          store.createUnit(res.data).then(() => {
            location.href = '/'
          })
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
  const switchCompany = (data: { id: string }) => {
    $services.person
      .changeWorkspace({
        data: {
          id: data.id
        }
      })
      .then(async (res: ResultType) => {
        if (res.code == 200) {
          sessionStorage.setItem('TOKEN', res.data.accessToken)
          await store.getQueryInfo(res.data.accessToken)
          store.getWorkspaceData(res.data.workspaceId, true).then(() => {
            location.href = '/'
          })
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
  const toWork = () => {
    router.push('/workHome')
  }
  const toUserSetting = () => {
    router.push('/user')
  }
  const toCompanySetting = () => {
    router.push('/company')
  }
  const exitLogin = () => {
    sessionStorage.clear()
    store.resetState()
    chat.stop()
    router.push('/login')
  }
</script>

<style lang="scss" scoped>
  .select-box {
    overflow: auto;
    padding-left: 8px;
  }

  .col-text {
    white-space: nowrap;
    font-size: 16px;
  }

  .seletc-drop__box {
    cursor: pointer;
    // height: 40px;

    &:hover {
      background: var(--el-color-primary-light-9);
      color: var(--el-dropdown-menuItem-hover-color);
    }
  }

  .select-drop__flex {
    display: flex;
    padding: 10px;
    align-items: center;

    // margin: 10px;
    &:hover {
      background: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
    }
  }

  .select-item__imgSelect {
    height: 25px;
    width: 25px;
    border-radius: 50%;
    background: var(--el-color-primary);
    font-size: 15px;
    color: #fff;
    line-height: 25px;
    text-align: center;
  }

  .select-item__titleSelect {
    height: 25px;
    line-height: 25px;
    font-size: 16px;
    font-weight: 400;
    margin-right: 12px;
    margin-left: 15px;
  }

  .select-drop {
    position: absolute;
    top: 49px;
    left: -20px;
    overflow: hidden;
    background: var(--el-bg-color-overlay);
    display: flex;
    flex-direction: column;
    transition: all 0.5s;
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.161);
    border-radius: 0 0 4px 4px;

    min-width: 250px;
  }

  .col-box {
    cursor: pointer;
    display: flex;

    .el-icon {
      margin-left: 10px;
    }
  }

  :deep(.el-popover.el-popper) {
    width: 100%;
  }

  .joinBox {
    display: flex;
    border-top: 1px solid var(--el-border-color);
  }

  .joinBtn {
    margin: 10px;
    display: flex;
    height: 35px;
    // background: ;
    text-align: center;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    padding: 10px 20px;
    color: var(--el-color-info);

    // &:hover {
    //   color: #154ad8;
    // }
  }

  .el-dropdown-link {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .smallIcon {
      font-size: 18px;
      border-radius: 50px;
      width: 20px;
      transform: scale(0.7, 0.7);
    }
  }

  .page-custom-header {
    // height: 60px;
    // line-height: 60px;

    .el-col {
      display: flex;
      align-items: center;
    }

    .logo {
      margin-right: 10px;
    }

    .col-right {
      justify-content: flex-end;

      .right-con {
        margin-right: 18px;
      }

      .right-navbar {
        height: 100%;
      }

      :deep(.right-navbar .el-space__item) {
        padding: 0 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      :deep(.right-navbar .el-space__item .el-switch) {
        height: var(--el-header-height);
      }

      :deep(.right-navbar .el-space__item:hover) {
        cursor: pointer;
        background: rgba(0, 0, 0, 0.03);
        height: 100%;
        color: #409eff;
      }

      // .dropdown-menu {
      //   padding:  0 12px;
      // }
      .header-message-icon {
        cursor: pointer;

        &:hover {
          color: var(--el-color-primary);
        }
      }

      .link {
        right: 15px;
        margin-bottom: 18px;
        position: absolute;
        color: var(--el-color-primary);
      }
    }
  }
</style>
