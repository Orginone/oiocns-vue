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
        <el-button type="text" @click="showSearchDrawer = true">
          <el-icon :size="18"><Search /></el-icon>
        </el-button>
        <el-button type="text">
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
      <el-drawer v-model="showSearchDrawer" direction="rtl">
        <template #header>
          <h4 style="color: #505050">筛选</h4>
        </template>
        <template #default>
            <el-input placeholder="搜索关键词" :prefix-icon="Search" />
        </template>
        <template #footer>
          <div style="flex: auto">
            <el-button @click="handleReset">重置</el-button>
            <el-button color="#0f39d1" @click="handleFilter">筛选</el-button>
          </div>
        </template>
      </el-drawer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

// 打开搜索抽屉
const showSearchDrawer = ref(false);
// 重置搜索条件
const handleReset = () => {
  console.log("重置");
};
// 筛选条件
const handleFilter = () => {
  console.log("筛选");
};

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
  (newValue, oldValue) => {
    breadList.value = newValue?.matched;
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.example-container {
  height: 56px;
  background: #f0f2f5;
  padding-bottom: 3px;
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

:deep .el-input__wrapper {
  padding-left: 15px !important;
  box-sizing: border-box; 
  border: none !important; 
  box-shadow: none !important; 
  padding: 0px; //前边边距去掉 
  border-radius: 15px; 
  background: #f2f4f9;
}
</style>
