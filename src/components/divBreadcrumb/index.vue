<template>
  <div class="example-container">
    <div class="content">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="(item, index) in breadList"
          :key="index"
          :to="{ path: item.path }"
        >
          <el-dropdown @command="handleCommand" v-if="!!item.children.length" placement="bottom-start">
            <span style="cursor: pointer">
              <el-icon
                :size="12"
                v-if="item?.meta?.icon"
                color="#3e5ed8"
                class="breadcrumbIcon"
              >
                <component :is="item?.meta?.icon" /> </el-icon
              >{{ item?.meta?.title ?? "工作台" }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(childrenitem, childrenindex) in item?.children"
                  :command="childrenitem.path"
                  :key="childrenindex"
                  :disabled="currentRoute === childrenitem.path"
                  >{{ childrenitem.meta?.title }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span style="cursor: pointer" v-else>
            <el-icon
              :size="12"
              v-if="item?.meta?.icon"
              color="#3e5ed8"
              class="breadcrumbIcon"
            >
              <component :is="item?.meta?.icon" /> </el-icon
            >{{ item?.meta?.title ?? "工作台" }}
          </span>
        </el-breadcrumb-item>
      </el-breadcrumb>

      <el-row style="padding: 0 15px">
        <el-row style="margin-right: 5px">
          <transition name="el-zoom-in-center">
            <el-input
              v-show="showSearch"
              placeholder="搜索"
              :prefix-icon="Search"
              size="small"
            />
          </transition>
        </el-row>
        <el-button type="text" v-if="searchType === '2'" @click="showSearch = !showSearch">
          <el-icon :size="18"><Search /></el-icon>
        </el-button>
        <el-button type="text" v-if="searchType === '1'" @click="showSearchDrawer = true">
          <el-icon :size="18"><Search /></el-icon>
        </el-button>
        <el-button type="text" @click="showShareDrawer = true">
          <el-icon :size="18"><Promotion /></el-icon>
        </el-button>
        <el-button type="text">
          <el-icon :size="18"><ChatLineSquare /></el-icon>
        </el-button>
        <el-button type="text">
          <el-icon :size="18"><MoreFilled /></el-icon>
        </el-button>
      </el-row>
      <!-- 搜索抽屉 -->
      <search-drawer v-model:showSearchDrawer="showSearchDrawer" />
      <!-- 分享抽屉 -->
      <share-drawer v-model:showShareDrawer="showShareDrawer" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import shareDrawer from './components/shareDrawer.vue'
import searchDrawer from './components/searchDrawer.vue'

// 打开分享抽屉
const showShareDrawer = ref(false)
// 打开搜索抽屉
const showSearchDrawer = ref(false);
// 打开搜索框
const showSearch = ref(false);
// 当前页面搜索类型 默认：1: 抽屉  2：input
const searchType = ref('1');

const router = useRouter();
// 全部路由信息
const breadList = ref([]);

const handleCommand = (command: string) => {
  router.push({ path: command });
};

// 获取当前路由
const currentRoute = computed(() => router.currentRoute.value.fullPath);

watch(
  () => router.currentRoute.value,
  (newValue, _) => {
    breadList.value = newValue?.matched;
    searchType.value = <string>newValue?.meta?.searchType ?? '1';
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.example-container {
  height: 56px;
  background: #f0f2f5;
  box-sizing: border-box;

  .content {
    height: 100%;
    padding-left: 20px;
    background-color: var(--el-bg-color-overlay);
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .breadcrumbIcon {
      margin-right: 5px;
    }
  }
}
:deep .el-drawer > .el-drawer__header {
  background-color: #ffffff !important;
  height: 60px !important;
  border-bottom: 1px solid #f0f2f5;
}
:deep .el-drawer > .el-drawer__footer {
  border-top: 1px solid #f0f2f5;
}
::v-deep .el-drawer__body {
  overflow: hidden !important;
}
::v-deep .el-input__wrapper {
  margin: 2px;
  padding-left: 15px !important;
  box-sizing: border-box; 
  border: none !important; 
  box-shadow: none !important; 
  padding: 0px; //前边边距去掉 
  border-radius: 15px; 
  background: #f2f4f9;
}
</style>
