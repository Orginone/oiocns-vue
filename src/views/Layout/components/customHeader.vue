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

        <div v-if="modelIsShow" @mouseover="handleOpen()" class="select-drop" :style="getDropMenuStyle">
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
    <!-- 右侧 -->
    <el-col :span="20" class="flex col-right">
      <el-space class="right-navbar">
        <el-link
          title="首页"
          :underline="false"
          @click="() => router.push('/workHome')"
        >
           <img class="logo" src="@/assets/img/logo3.jpg" alt="">
        </el-link>
        <!-- <el-link
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
        </el-link> -->
        <li class="top-icon"
          v-for="(item, index) in state.mainMenus"
          @click="handleRouterChage(item)"
          :key="index"
          :title="item.name"
        >
          <el-badge :value="item.count || 0" :hidden="!item.showCount">
            <i class="icon-list iconfont" :class="item.icon" ></i>
          </el-badge>
        </li>
        <el-dropdown trigger="hover" size="large" class="dropdown-menu">
          <span class="el-dropdown-link">
            <headImg :name="queryInfo.name" :limit="1" :imgWidth="24" :isSquare="false"></headImg>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="toWork" icon="Setting">首页配置</el-dropdown-item>
              <el-dropdown-item @click="toSetting" icon="Setting">设置中心</el-dropdown-item>
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
  import { ref,reactive, computed, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/store/user'
  import $services from '@/services'
  import { ElMessage } from 'element-plus'
  import CreateUnitDialog from './createUnitDialog.vue'
  import searchCompany from '@/components/searchs/index.vue'
  import SearchDialog from './searchDialog.vue'
  import headImg from '@/components/headImg.vue'
  import { useDark } from '@vueuse/core'
  // import { chat } from '@/module/chat/orgchat'
  // import { CommunicateModel as chat } from '@/oiocns-ts/src';
  import { CommunicateModel as chat, WorkModel as todo } from '@orginone/oiocns-ts';
  import { USERCTRL ,TargetType} from '@/ts/coreIndex'

  const isDark = useDark()
  const store = useUserStore()
  const SearchInfo = ref('')
  const router = useRouter()
  let current = ref(1)
  const visible = ref(false)
  const modelIsShow = ref(true)
  const showSearch = ref(false)
  const btnType = ref(false)
  const { queryInfo,workspaceData } = storeToRefs(store)
  // const workspaceData = store.workspaceData
  const dropdown = ref()
  const workHead = () => {
    if (workspaceData.value?.name == '个人空间') {
      return '我'
    }
    return workspaceData.value?.name[0] || ''
  }
  const isUnitWork = ref<boolean>(workspaceData.value.id != queryInfo.value.id)

  const state = reactive({
    mainMenus: [
      { name: '沟通', icon: 'icon-message', path: '/chat', showCount: true, count: 0 },
      { name: '办事', icon: 'icon-todo', path: '/service', showCount: true, count: 0 },
      { name: '仓库', icon: 'icon-store', path: '/store' },
      { name: '设置', icon: 'icon-setting', path: '/setCenter' },  
    ]
  })
  onMounted(() => {
    // TODO: 目前消息只有全局脏检查订阅，不能单独订阅
    chat.subscribe(() => {
      console.warn("触发全局订阅回调");
      const count = chat.getNoReadCount();
      state.mainMenus[0].count = count;
    });

    todo.subscribe(async () => {
      console.warn("触发全局订阅回调");
      const count = await todo.TaskCount();
      state.mainMenus[1].count = count;
    });
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
    await store.getCompanyList(currentPage, workspaceData.value.id, true)
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
      joinSubmit(arr)
    } else {
      searchDialog.value = false
    }
  }
  const friendShow = () => {
    searchDialog.value = true
  }
  const joinSubmit = (arr: any) => {
    USERCTRL.user
      .applyJoinCompany(arr.join(''), TargetType.Company)
      .then((isSuc:boolean) => {
        if (isSuc) {
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
    modelIsShow.value = true;
    if (!store.userCompanys || store.userCompanys.length == 0) {
      await store.getCompanyList(0, workspaceData.value.id, false)
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
      await store.getCompanyList(current.value, workspaceData.value.id, false)
    }
  }

  const switchCreateCompany = (data: { id: string }) => {
    btnType.value = false
    modelIsShow.value = false
    store.setCurSpace(data.id)
    // $services.person
    //   .changeWorkspace({
    //     data: {
    //       id: data.id
    //     }
    //   })
    //   .then(async (res: ResultType) => {
    //     if (res.code == 200) {
    //       sessionStorage.setItem('TOKEN', res.data.accessToken)
    //       await store.getQueryInfo(res.data.accessToken)
    //       current.value = 0
    //       store.createUnit(res.data).then(() => {
    //         location.href = '/'
    //       })
    //     } else {
    //       ElMessage({
    //         message: res.msg,
    //         type: 'warning'
    //       })
    //     }
    //   })
  }
  const switchCompany = (data: { id: string }) => {
    handleClose();
    modelIsShow.value = false
    store.setCurSpace(data.id)
    // $services.person
    //   .changeWorkspace({
    //     data: {
    //       id: data.id
    //     }
    //   })
    //   .then(async (res: ResultType) => {
    //     if (res.code == 200) {
    //       sessionStorage.setItem('TOKEN', res.data.accessToken)
    //       await store.getQueryInfo(res.data.accessToken)
    //       store.getWorkspaceData(res.data.workspaceId, true).then(() => {
    //         location.href = '/'
    //       })
    //     } else {
    //       ElMessage({
    //         message: res.msg,
    //         type: 'warning'
    //       })
    //     }
    //   })
  }
  const toWork = () => {
    router.push('/workHome')
  }
  const toUserSetting = () => {
    router.push('/mine')
  }
  const toSetting = () => {
    router.push('/setCenter')
  }
  const toCompanySetting = () => {
    router.push('/company')
  }
  const exitLogin = () => {
    sessionStorage.clear()
    store.resetState()
    // chat.stop()
    router.push('/login')
  }
</script>

<style lang="scss" scoped>
  .logo{
    width: 18px;
  }
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

  .top-icon {
    :deep(.el-badge__content) {
      transform: translateY(25%) translateX(100%);
    }
  }

  .page-custom-header {
    height: 45px;
    line-height: 45px;
    display: flex;
    align-items: center;
    .el-col {
      display: flex;
      align-items: center;
    }


    .col-right {
      justify-content: flex-end;

      .right-con {
        margin-right: 18px;
      }

      .right-navbar {
        height: 100%;
        display: flex;
        align-items: center;
      }

      :deep(.right-navbar .el-space__item) {
        padding: 0 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0;
        li{
          display: flex;
         
          .icon-list{
            font-size: 22px;
            color: #A6AEC7; 
          }
        }
      }

      :deep(.right-navbar .el-space__item .el-switch) {
        height: var(--el-header-height);
      }

      :deep(.right-navbar .el-space__item:hover) {
        cursor: pointer;
        background: rgba(0, 0, 0, 0.03);
        height: 100%;
        color: #154AD8;
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
