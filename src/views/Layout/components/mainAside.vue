<template>
  <div v-show="visible" class="menuRight" :style="{ left: left + 'px', top: top + 'px' }">
    <div class="menuRight-fixed" @click="clickFixed">固定在菜单上</div>
    <div class="menuRight-cancel" @click="cancelFixed">取消固定</div>
  </div>
  <div class="mainAside-wrap">
    <ul class="top-ul">
      <li
        :class="[
          'aside-li',
          activeAppId == item.id
            ? 'active'
            : !activeAppId && activeRouter.includes(item.path)
            ? 'active'
            : ''
        ]"
        v-for="item in state.mainMenus.filter((a) => !a?.bottom)"
        @click="handleRouterChage(item)"
        @contextmenu.prevent="rightClick($event, item)"
        :key="item.id"
        :title="item.name"
      >
        <el-icon v-if="!item.type" class="aside-li-icon" :size="20">
          <component :is="item.icon" />
        </el-icon>
        <img v-else :src="item.icon" style="width: 26px; height: 26px; border-radius: 50%" />
        <span class="aside-li-name">{{ item.name?.substr(0, 2) }}</span>
      </li>
    </ul>
    <ul class="top-ul">
      <li
        :class="['aside', activeRouter.includes(item.path) ? 'active' : '']"
        v-for="item in state.mainMenus.filter((a) => a?.bottom === true)"
        @click.stop="handleRouterChage(item)"
        :key="item.id"
      >
        <div
          :class="['apps', activeRouter.includes(item.path) ? 'active' : '']"
          v-if="item.name === '应用'"
        >
          <el-popover placement="right-end" title="所有应用" :width="500" trigger="hover">
            <div style="height: 500px">
              <el-input placeholder="搜索" v-model="searchValue" prefix-icon="Search" />
              <CanUseApp @AppChange="onAppClick" @onCanUseAppIdChange="hadleCanUseAppChange" />
            </div>
            <template #reference>
              <div class="title">
                <el-icon class="icon2" :size="20">
                  <component :is="item.icon" />
                </el-icon>
                <span class="name2">{{ item.name }}</span>
              </div>
            </template>
          </el-popover>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, watch, reactive, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useCommonStore } from '@store/common'
  import { ElMessage } from 'element-plus'
  import CanUseApp from './canUseApp.vue'
  import { anystore } from '@/hubs/anystore'

  const router = useRouter()
  const commonStore = useCommonStore()
  const activeRouter = ref<string>('')
  const searchValue = ref<string>('')
  type StateType = {
    mainMenus: MenuItemType[]
    clickMenu: Array<MenuItemType>
    storeObj: MenuItemType
  }
  const state: StateType = reactive({
    mainMenus: [
      { name: '工作台', icon: 'DataAnalysis', path: '/workHome' },
      { name: '关系', icon: 'SetUp', path: '/relation' },
      { name: '仓库', icon: 'Box', path: '/market' },
      { name: '应用', icon: 'Menu', path: '#', bottom: true }
    ],
    clickMenu: [],
    storeObj: {
      id: '',
      name: '',
      icon: '',
      path: ''
    }
  })
  const visible = ref(false)
  const left = ref(0)
  const top = ref(0)
  onMounted(() => {
    window.addEventListener('click', clickother)
    setTimeout(() => {
      getFixedData()
    }, 2000)
  })

  onUnmounted(() => {
    window.removeEventListener('click', clickother)
  })

  const clickother = () => {
    visible.value = false
  }
  // 当前激活应用
  const activeAppId = ref<string>('')

  // 判断是否已经存在菜单
  const onAppClick = (data: any) => {
    data.type = 'app'
    activeAppId.value = data.appInfo.id ?? ''
    commonStore.iframeLink = data?.link
    commonStore.iframeID = data.appInfo.id
    let bool = state.mainMenus.filter((el) => {
      return el.id == data.id
    })
    if (bool.length == 0) {
      state.mainMenus.push(data)
    }
    data.appInfo.id && router.push(data.path)
  }
  const rightClick = (event: any, item: any) => {
    if (item.type == 'app') {
      state.storeObj = item
      visible.value = true
      top.value = event.pageY - 30
      left.value = event.pageX + 30
    }
  }
  const getFixedData = () => {
    anystore.subscribed(`${anystore.spaceId.value}.menu`, 'user', (data) => {
      if (Array.isArray(data)) {
        // 过滤取消分配 或者 取消分配的应用
        data = data.filter((item) => {
          return (canUseAppId.value && canUseAppId.value.includes(item.id)) ?? true
        })
        state.mainMenus = state.mainMenus.concat(data)
        state.clickMenu = data
      }
    })
  }
  const canUseAppId = ref<string[]>()
  const hadleCanUseAppChange = (idArr: string[]) => {
    canUseAppId.value = idArr
  }
  const cancelFixed = () => {
    let findIndex = null
    let arr = JSON.parse(JSON.stringify(state.clickMenu))
    let bool = state.clickMenu.find((el, index) => {
      findIndex = index
      return el.id == state.storeObj.id
    })
    if (bool && bool.fixed) {
      arr.splice(findIndex, 1)
    }
    anystore
      .set(
        `${anystore.spaceId.value}.menu`,
        {
          operation: 'replaceAll',
          data: arr
        },
        'user'
      )
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '取消成功',
            type: 'success'
          })
        }
      })
  }
  const clickFixed = () => {
    let bool = state.clickMenu.find((el) => {
      return el.id == state.storeObj.id
    })

    if (!bool) {
      state.storeObj.fixed = true
      state.clickMenu.push(state.storeObj)
    }
    anystore
      .set(
        `${anystore.spaceId.value}.menu`,
        {
          operation: 'replaceAll',
          data: state.clickMenu
        },
        'user'
      )
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '固定成功',
            type: 'success'
          })
        }
      })
  }

  const handleRouterChage = (item: any) => {
    if (item.name !== '应用') {
      activeAppId.value = item?.id || ''
      // active.value = item.name
      if (activeAppId.value) {
        commonStore.iframeLink = item?.link
        commonStore.iframeID = item?.id
      }
      router.push({ path: item.path })
    } else {
      // active.value = item.name
    }
  }

  watch(
    () => router.currentRoute.value.path,
    (newValue, oldValue) => {
      activeRouter.value = newValue
    },
    { immediate: true }
  )
</script>

<style lang="scss" scoped>
  .menuRight {
    width: 100px;
    height: 60px;
    position: absolute;
    background-color: #fff;
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
        background-color: #f8f7f9;
      }
    }

    &-cancel {
      padding: 10px 0;
      width: 100%;
      text-align: center;

      &:hover {
        background-color: #f8f7f9;
      }
    }
  }

  .mainAside-wrap {
    min-width: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100vh - 50px);
    padding-bottom: 10px;
    box-sizing: border-box;

    .top-ul {
      width: 60px;
      overflow-x: hidden;
    }

    .aside-li {
      display: flex;
      flex-direction: column;
      padding: 4px;
      font-size: 12px;
      align-items: center;
      transform: scale(0.9);
      cursor: pointer;

      &-icon {
        padding: 8px 0;
        margin: 4px;
      }

      &-name {
        font-weight: bold;
        font-size: 10px;
      }

      .overTxt {
        font-size: 12px;
        transform: scale(0.7);
      }

      &.active {
        background-color: var(--el-menu-hover-bg-color);
        color: var(--el-color-primary);
        border-radius: 10%;
      }
    }

    .aside {
      display: flex;
      flex-direction: column;
      padding: 4px;
      margin: 6px 6px 0;
      font-size: 12px;
      align-items: center;
      transform: scale(90%);

      .me {
        display: flex;
        flex-direction: column;
        cursor: pointer;

        align-items: center;
        transform: scale(90%);

        .icon1 {
          padding: 8px 0;
          margin: 4px;
        }

        .name1 {
          font-weight: bold;
          font-size: 10px;
        }

        &.active {
          background-color: var(--el-menu-hover-bg-color);
          color: var(--el-color-primary);
          border-radius: 10%;
        }
      }

      .apps {
        display: flex;
        flex-direction: column;
        cursor: pointer;

        align-items: center;
        transform: scale(90%);

        .title {
          display: flex;
          flex-direction: column;
          font-size: 12px;
          align-items: center;

          .icon2 {
            padding: 8px 0;
            margin: 4px;
          }

          .name2 {
            font-weight: bold;
            font-size: 10px;
          }
        }

        &.active {
          background-color: var(--el-menu-hover-bg-color);
          color: var(--el-color-primary);
          border-radius: 10%;
        }
      }

      &.active {
        background-color: var(--el-menu-hover-bg-color);
        color: var(--el-color-primary);
        border-radius: 10%;
      }
    }
  }
</style>
