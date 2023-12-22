<script setup lang='ts'>
import { MenuItemType, OperateMenuType } from 'typings/globelType'
import useStorage from '@/hooks/useStorage'
import EntityPreview from './preview/index.vue'
import { cleanMenus } from '@/utils/tools'
import {ArrowRight} from '@element-plus/icons-vue'
import { MoreFilled,Back,Right } from '@element-plus/icons-vue'
import { DxResizable } from 'devextreme-vue'
import BarIcon from '@/components/Common/GlobalComps/customIcon.vue'
import CustomMenu from '@/components/CustomMenu/index.vue'
import CustomBreadcrumb from '@/components/CustomBreadcrumb/index.vue'

const props = defineProps<{
  previewFlag?: string;
  leftShow?: boolean;
  rightShow?: boolean;
  // children?: React.ReactNode; // 子组件
  siderMenuData: MenuItemType;
  // rightBar?: React.ReactNode;
  selectMenu: MenuItemType;
  onSelect?: (item: MenuItemType) => void;
  onMenuClick?: (item: MenuItemType, menuKey: string) => void;
}>()

const [leftSider, setLeftSider] = useStorage<boolean>('leftSider', false)
  const [rightSider, setRightSider] = useStorage<boolean>('rightSider', false)
  const [mainWidth, setMainWidth] = useStorage<string | number>('mainWidth', '40%')
  const parentMenu = props.selectMenu.parentMenu ?? props.siderMenuData

  const findMenus = (
  key: string,
  menus?: OperateMenuType[],
): OperateMenuType | undefined => {
  for (const menu of menus ?? []) {
    if (menu.key === key) {
      return menu;
    } else {
      const find = findMenus(key, menu.children);
      if (find) {
        return find;
      }
    }
  }
}

  /** 点击操作菜单 */
  const onOperateMenuClick = async (item: MenuItemType, key: string) => {
    const menu = findMenus(key, item.menus);
    if (menu?.beforeLoad) {
      await menu.beforeLoad()
    }
    props.onMenuClick?.apply(this, [item, key])
  }

  const onSelectClick = async (item: MenuItemType) => {
    if (item.beforeLoad) {
      await item.beforeLoad()
    }
    console.log('点击返回的item',item);
    props.onSelect?.apply(this, [item])
  }
</script>

<template>
  <div class="main-layout">
    <div class="main-layout-header">
      <CustomBreadcrumb
        :selectKey="selectMenu.key"
        :item="siderMenuData"
        :onSelect="(item:MenuItemType) => {
          console.log('item',item);
          onSelectClick(item);
        }"
      />
      <!-- 右侧操作&右侧插槽 -->
      <div>
        <ElSpace wrap :size="20">
          <div>
            <a
              v-if="!leftShow"
              title='切换主测栏'
              style="font-size: 18px;"
              @click="setLeftSider(!leftSider)"
            >
              <BarIcon type="left" :size="18" :width="8" :selected="leftSider" />
            </a>
            <a
              v-if="!rightShow"
              title='切换辅助侧栏'
              style="font-size: 18px;"
              @click="setRightSider(!rightSider)"
            >
            <BarIcon type="right" :size="18" :width="8" :selected="rightSider" />
            </a>
          </div>
          <slot name="rightBar" />
        </ElSpace>
      </div>
    </div>
    <div class="main-layout-body">
      <!-- 菜单目录 -->
      <div v-if="leftShow || leftSider" class="sider" width="250px">
        <div class="title">
          <span v-if="parentMenu?.key != props?.siderMenuData?.key" class="backup" @click="onSelectClick(parentMenu)">
            <ElIcon :size="20"><Back/></ElIcon>
          </span>
          <div class="label" @click="onSelectClick(parentMenu)">
            <span style="margin-right: 6px;">
              <component :is="parentMenu?.icon?.name" v-bind="parentMenu?.icon?.args"/>
            </span>
            <ElText truncated>{{parentMenu?.label}}</ElText>
          </div>
        </div>
        <div class="container" id="templateMenu">
          <CustomMenu
            :item="parentMenu"
            :collapsed="false"
            :selectMenu="selectMenu"
            :onSelect="(item:MenuItemType) => {
              onSelectClick(item);
            }"
            :onMenuClick="onOperateMenuClick"
          />
        </div>
      </div>
      
      <div class="main-layout-body-list">
        <slot />
      </div>
      <!-- 详情-->
      <div class="main-layout-body-detail">
        <EntityPreview :flag="previewFlag" />
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.main-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  // TODO: color/surface/品牌背景色
  background-color: #F2F3FF;
  .main-layout-header {
    padding: 10px 16px;
    display: flex;
    justify-content: space-between;
    height: 60px;
  }

  .main-layout-body {
    height: 0;
    flex: 1;
    display: flex;
    border-radius: 12px 0 0 0;
    overflow: hidden;
    .main-layout-body-list {
      width: 400px;
      padding: 16px;
      // TODO: color/surface/主要容器背景&弹窗背景
      background-color: #FFFFFF;
    }
    .main-layout-body-detail {
      width: 0;
      flex:1;
      background-color: #FCFCFC;
    }
  }
 
}
</style>