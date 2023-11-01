<script lang="ts" setup>
import NavigationBar from './components/NavigationBar/index.vue'

/** 导航项类型 */
export interface NavigationItem {
  key: string;
  label: string;
  backgroundImageUrl: string;
  component: ReturnType<typeof defineAsyncComponent>;
}
/** 常用导航列表 */
const navigationList: NavigationItem[] = [
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
]
// 当前激活导航
const current = ref(navigationList[0])

</script>

<template>
  <div class="homepage"
    :style="{backgroundImage: `url(${current.backgroundImageUrl})`}"
  >
    <!-- 顶部导航 -->
    <NavigationBar 
      :list="navigationList" 
      @change="item=> current = item"
    />
    <!-- banner -->
    <div class="headBanner" :style="{backgroundImage: `url(${current.backgroundImageUrl})`}"/>
    <!-- 内容区域 -->
    <Suspense>
      <template #default>
        <component :is="current.component"></component>
      </template>
      <template #fallback>
        <div>加载中...</div>
      </template>
    </Suspense>
  </div>
</template>



<style lang="scss" scoped>
.homepage{
  display: flex;
  flex-direction: column;
  overflow: auto;

  .headBanner {
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-position: 50% 20%;
    background-size: cover;
  }
}
</style>
