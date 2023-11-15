import { getResouces } from '@/config/location'
const resource = getResouces()

/** 导航项类型 */
export interface NavigationItem {
  key: string
  label: string
  type: 'inner' | 'page'
  backgroundImageUrl: string
  component: ReturnType<typeof defineAsyncComponent>
}

/** 全部页面列表 */
export const allPages: NavigationItem[] = [
  {
    key: 'dashboard',
    label: '工作台',
    type: 'inner',
    backgroundImageUrl: `/img/${resource.location}/banner/workbench.png`,
    component: defineAsyncComponent(() => import('@/views/Home/components/Content/WorkBench/index.vue')),
  },
  {
    key: 'cohort',
    label: '群动态',
    type: 'inner',
    backgroundImageUrl: `/img/${resource.location}/banner/groupactivity.png`,
    component: defineAsyncComponent(() => import('@/views/Home/components/Content/Activity/Cohort.vue')),
  },
  {
    key: 'friends',
    label: '好友圈',
    type: 'inner',
    backgroundImageUrl: `/img/${resource.location}/banner/friendactivity.png`,
    component: defineAsyncComponent(() => import('@/views/Home/components/Content/Activity/Friends.vue')),
  },
]