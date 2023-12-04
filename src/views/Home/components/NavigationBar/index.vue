<!-- 门户顶部导航条组件 -->
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { NavigationItem,allPages } from './config'
import BaseTitle from '../BaseTitle/index.vue'
import { MoreFilled,RemoveFilled,CirclePlusFilled } from '@element-plus/icons-vue'
import { IPageTemplate } from '@/ts/core/thing/standard/page'
import { command } from '@/ts/base'
import orgCtrl from '@/ts/controller'
import { generateUuid } from '@/utils/excel'
import ViewerHost from '@/executor/open/page/view/ViewerHost.vue'
import ViewerManager from '@/executor/open/page/view/ViewerManger'
import { h } from 'vue'

const props = defineProps<{
  /** 固定页面列表 */
  list: NavigationItem[] 
}>()
const emits = defineEmits<{
  (e: 'change', item: NavigationItem): void
}>()
// 当前激活
const current = ref(0)
// 是否展示更多
const more = ref(false)
// 被设为常用的页面
const pages = ref<IPageTemplate[]>()
// 首页显示的页面
const homePages = ref<NavigationItem[]>()
// 订阅页面变化，获取并处理被设为常用的页面
const id = command.subscribeByFlag('pages', async () => {
  pages.value = await orgCtrl.loadPages()
  homePages.value = [
    ...props.list,
    ...pages.value
    .filter((item) => item.cache.tags?.includes('常用'))
    .map((item:IPageTemplate)=>{
      const navigation: NavigationItem = {
        key: generateUuid(),
        label: item.name,
        backgroundImageUrl: '',
        type: 'page',
        component: h(ViewerHost,{ctx:{view:new ViewerManager(item)}}),
        // component: h(ViewerHost),
      } 
      return navigation
    })   
  ]
})
// 取消订阅
onBeforeUnmount(() => command.unsubscribeByFlag(id))
/** 移除页面 */
const removeRegularNavigationItem = (item: IPageTemplate) => {
  item.cache.tags = item.cache.tags?.filter((i) => i != '常用');
  item.cacheUserData(true)
  ElMessage.success('移除页面')
}
/** 添加页面 */
const addRegularNavigationItem = (item: IPageTemplate) => {
  item.cache.tags = item.cache.tags || []
  item.cache.tags.push('常用')
  item.cacheUserData(true)
  ElMessage.success('添加页面')
}
/** 保存 */
const onSave = () => {
  ElMessage.success({duration:500,message:'保存成功'})
  more.value = false
}
</script>

<template>
  <div class="navigationBar" :class="{ 'navigationBarOpen': more }">
    <!-- 编辑状态 -->
    <div v-if="more" class="navigationBarConfig">
      <div class="navigationBarConfigHeader">
        <BaseTitle title="页面管理" />
        <ElButton type="primary" @click="onSave">保存</ElButton>
      </div>
      <!-- 常用页面 -->
      <div class="navigationBarConfigSection">
        <h5 class="title">常用页面</h5>
        <ElSpace :size="16">
          <div 
            v-for="(item, index) in pages.filter((item) => item.cache.tags?.includes('常用'))" :key="index"
            class="badge"
          >
            <div class="name">{{ item.name }}</div>
            <div class="icon">
              <el-icon
                @click="removeRegularNavigationItem(item)" 
                class="badge-icon" 
                color="red"
              >
                <RemoveFilled/>
              </el-icon>                
            </div>
          </div>
        </ElSpace>
      </div>
      <!-- 全部页面 -->
      <div class="navigationBarConfigSection">
        <h5 class="title">全部页面</h5>
        <ElSpace :size="16">
        <div 
          v-for="(item, index) in pages" :key="index"
          class="badge"
        >
          <div class="name">{{ item.name }}</div>
          <div class="icon" v-if="!item.cache.tags?.includes('常用')">
            <el-icon 
              @click="addRegularNavigationItem(item)" 
              class="badge-icon" 
              color="blue"
            >
              <CirclePlusFilled/>
            </el-icon>  
          </div>
        </div>
        </ElSpace>
      </div>
    </div>
    <!-- 未展开状态 -->
    <template v-else>
      <div class="navigationBarContent">
        <div 
          v-for="(item, index) in homePages" :key="item.key"
          :class="
            current === index
              ? 'navigationBarContent__itemActive'
              : 'navigationBarContent__item'
          "
          @click="current = index; emits('change',item)"
        >
          {{ item.label }}
        </div>
      </div>
      <!-- 更多按钮 -->
      <el-icon 
        :size="24"
        @click="more = true" 
        class="navigationBarMore"
      >
        <MoreFilled/>
      </el-icon>
    </template>
  </div>
</template>

<style lang="scss" scoped>
// TODO:
.navigationBar {
  z-index: 10;
  border-radius: 30px;
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  // background-color: rgba(@component-background, 0.7);
  background-color: rgba(250,250,250,.6);
  display: flex;
  font-size: 14px;
  // color: @text-color;
  color: #000;
  align-items: center;
  padding: 6px 12px;
  transition: 0.2s;
  &Content {
    display: flex;
    justify-content: center;
    gap: 8px;
    flex: 1;
    &__item {
      transition: .2s;
      cursor: pointer;
      padding: 5px 16px;
      &:hover {
        border-radius: 30px;
        // background-color:@active-background;
        background-color: #e6f1ff;
      }
      &Active {
        cursor: not-allowed;
        padding: 4px 16px;
        border-radius: 30px;
        // color: @text-color-inverse;
        color:white;
        // background-color:@focus-background;
        background-color: #3838b9;
      }
    }
  }

  &More {
    // color: @text-color-inverse;
    color:black;
    font-size: 30px;
    cursor: pointer;
    margin-left: 20px;
  }

  &Open {
    height: auto;
    padding: 30px 20px 40px;
    // background-color: @component-background;
    background-color: #fafafa;
    z-index: 1000;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
  }


  &Config {
    // width: 100%;
    min-width: 400px;
    max-width: 800px;
    &Header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
    }

    &Section {
      margin-bottom: 20px;
      .title {
        margin-bottom: 0.5em;
        color: rgba(0,0,0,.85);
        font-weight: 600;
        font-size: 16px;
        line-height: 1.5;
      }
      .badge {
        cursor: pointer;
        position: relative;
        .name {
          padding: 8px 15px;
        }
        .icon {
          position: absolute;
          top: 0;
          right: 0;
        }
      }
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
