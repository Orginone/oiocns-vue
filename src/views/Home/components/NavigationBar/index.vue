<!-- 门户顶部导航条组件 -->
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { NavigationItem } from '@/views/Home/index.vue';
import BaseTitle from '../BaseTitle/index.vue';
import { MoreFilled,RemoveFilled,CirclePlusFilled } from '@element-plus/icons-vue';
// 接收常用页面列表
defineProps<{
  list: NavigationItem[]
}>()
// 切换激活页面事件
const emits = defineEmits<{
  (e: 'change', item: NavigationItem): void
}>()
// 全部页面列表
const allPages: NavigationItem[] = [
  {
    key: 'app',
    label: '工作台',
    backgroundImageUrl: '/img/banner/digital-asset-bg.png',
    component: defineAsyncComponent(() => import('@/views/Home/components/Content/WorkBench/index.vue')),
  },
  {
    key: 'cohort',
    label: '群动态',
    backgroundImageUrl: '/img/banner/activity-bg.png',
    component: defineAsyncComponent(() => import('@/views/Home/components/Content/Activity/Cohort.vue')),
  },
  {
    key: 'friends',
    label: '好友圈',
    backgroundImageUrl: '/img/banner/circle-bg.jpeg',
    component: defineAsyncComponent(() => import('@/views/Home/components/Content/Activity/Friends.vue')),
  },
  {
    key: 'warehouse',
    label: '公物仓',
    backgroundImageUrl: '/img/banner/activity-bg.png',
    component: defineAsyncComponent(() => import('@/views/Home/components/Content/Warehouse.vue')),
  },
  {
    key: 'digital-asset',
    label: '数据资产',
    backgroundImageUrl: '/img/banner/digital-asset-bg.png',
    component: defineAsyncComponent(() => import('@/views/Home/components/Content/DigitalAsset.vue')),
  },
]
// 当前激活
const current = ref(0);
// 展示更多
const more = ref(false);
// 移除页面
const removeRegularNavigationItem = (item:NavigationItem) => {
  ElMessage.success('移除页面');
};

const addRegularNavigationItem = (item:NavigationItem) => {
  ElMessage.success('添加页面');
};

const onSave = () => {
  ElMessage.success({duration:500,message:'保存成功'});
  more.value = false;
};

const setCurrent = (index:number) => {
  current.value = index;
};

const setMore = (value:boolean) => {
  more.value = value;
};
</script>

<template>
  <div class="navigationBar" :class="{ 'navigationBarOpen': more }">
    <!-- 更多展开 -->
    <div v-if="more" class="navigationBarConfig">
      <div class="navigationBarConfigHeader">
        <BaseTitle title="页面管理" />
        <ElButton type="primary" @click="onSave">保存</ElButton>
      </div>
      <!-- 常用页面 -->
      <div class="navigationBarConfigSection">
        <h5>常用页面</h5>
        <ElSpace :size="16">
        <div 
          v-for="(item, index) in list" :key="index"
          class="badge"
        >
          {{ item.label }}
          <el-icon 
            @click="removeRegularNavigationItem(item)" 
            class="badge-icon" 
            color="red"
          >
            <RemoveFilled/>
          </el-icon>  
        </div>
        </ElSpace>
      </div>
      <!-- 全部页面 -->
      <div class="navigationBarConfigSection">
        <h5>常用页面</h5>
        <ElSpace :size="16">
        <div 
          v-for="(item, index) in allPages" :key="index"
          class="badge"
        >
          {{ item.label }}
          <el-icon 
            @click="addRegularNavigationItem(item)" 
            class="badge-icon" 
            color="blue"
          >
            <CirclePlusFilled/>
          </el-icon>  
        </div>
        </ElSpace>
      </div>
    </div>
    <!-- 未展开 -->
    <template v-else>
      <div class="navigationBarContent">
        <div 
          v-for="(item, index) in list" :key="item.key"
          :class="
            current === index
              ? 'navigationBarContent__itemActive'
              : 'navigationBarContent__item'
          "
          @click="setCurrent(index); emits('change',item)"
        >
          {{ item.label }}
        </div>
      </div>
      <!-- 更多按钮 -->
      <el-icon 
        :size="24"
        @click="setMore(true)" 
        class="navigationBarMore"
      >
        <MoreFilled/>
      </el-icon>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.navigationBar {
  border-radius: 30px;
  position: fixed;
  top: 16px;
  right: calc(50vw - 160px);
  margin-left: 60px;
  // TODO:
  // background-color: rgba(@component-background, 0.7);
  background-color: rgba(white,0.7);
  display: flex;
  font-size: 14px;
  // TODO:
  // color: @text-color;
  color: #000;
  align-items: center;
  padding: 6px 12px;
  transition: 0.2s;
  &Content {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex: 1;
    &__item {
      transition: .2s;
      cursor: pointer;
      padding: 4px 16px;
      &:hover {
        border-radius: 30px;
        // TODO:
        // background-color:@active-background;
        background-color: #e6f1ff;
      }
      &Active {
        cursor: not-allowed;
        padding: 4px 16px;
        border-radius: 30px;
        // TODO:
        // color: @text-color-inverse;
        color:white;
        // background-color:@focus-background;
        background-color: #3838b9;
      }
    }
  }

  &More {
    // TODO:
    // color: @text-color-inverse;
    color:white;
    font-size: 30px;
    cursor: pointer;
    margin-left: 20px;
  }

  &Open {
    height: auto;
    padding: 30px 20px 40px;
    // TODO:
    // background-color: @component-background;
    background-color: var(--el-bg-color-page);
    z-index: 1;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
  }


  &Config {
    width: 100%;
    &Header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
    }

    &Section {
      margin-bottom: 20px;
    }

    &PageCard {
      padding: 8px 24px;
      color: #424A57;
      background-color: #F7F8FA;
      border-radius: 27px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}


</style>