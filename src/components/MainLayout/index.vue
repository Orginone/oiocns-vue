<!-- 内容区模板布局 -->
<!-- 包含：左侧、内容区顶部(面包屑、操作区)、内容区 -->
<!-- 插槽：rightBar、default -->
<script setup lang="ts">

import CustomMenu from '@/components/CustomMenu/index.vue'
import CustomBreadcrumb from '@/components/CustomBreadcrumb/index.vue'
import { MenuItemType, OperateMenuType } from '@/typings/globelType';
import { MoreFilled,Back,Right } from '@element-plus/icons-vue'
import { DxResizable } from 'devextreme-vue'
import BarIcon from '@/components/Common/GlobalComps/customIcon.vue'
import useStorage from '@/hooks/useStorage'
import EntityPreview from './preview/index.vue'
import { cleanMenus } from '@/utils/tools'
import {ArrowRight} from '@element-plus/icons-vue'


  const props = defineProps<{
    previewFlag?: string;
    leftShow?: boolean;
    rightShow?: boolean;
    siderMenuData: MenuItemType;
    selectMenu: MenuItemType;
    notExitIcon?: boolean;
    hiddenHead?:boolean;
    onSelect?: (item: MenuItemType) => void;
    onMenuClick?: (item: MenuItemType, menuKey: string) => void;
  }>()

  const [leftSider, setLeftSider] = useStorage<boolean>('leftSider', false)
  const [rightSider, setRightSider] = useStorage<boolean>('rightSider', false)
  const [mainWidth, setMainWidth] = useStorage<string | number>('mainWidth', '40%')
  const parentMenu =ref(props.selectMenu.parentMenu ?? props.siderMenuData); 
  watch(
    ()=>props.siderMenuData,
    (val,preVal)=>{
      parentMenu.value = props.selectMenu.parentMenu ?? props.siderMenuData;
    },
    {
        immediate:true,
        deep:true,
    }
  )
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
    props.onSelect?.apply(this, [item])
  }
</script>

<template>
  <ElContainer class="main_layout">
    <!-- MainLayout-header -->
    <ElHeader class="header" v-if="!hiddenHead">
      <!-- 面包屑+左侧栏 -->
      <CustomBreadcrumb
        :selectKey="selectMenu.key"
        :item="siderMenuData"
        :onSelect="(item:MenuItemType) => {
          onSelectClick(item);
        }"
      />
      <!-- 右侧操作&右侧插槽 -->
      <div>
        <ElSpace wrap :size="20">
          <!-- 切换主侧栏 -->
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
          <!-- 右侧栏插槽 -->
          <slot name="rightBar" />
        </ElSpace>
      </div>
    </ElHeader>
    <!-- MainLayout-body -->
    <ElContainer class="body">

      <!-- body-左侧菜单目录 -->
      <ElAside v-if="leftShow || leftSider" class="sider" width="250px">
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
        <!-- 菜单 -->
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
      </ElAside>
      <!-- body-右侧 -->
      <ElMain  class="main">
        <!-- 文件目录 -->
        <DxResizable
          handles='right'
          :width="(rightShow || rightSider) ? mainWidth : '100%'"
          :onResize="(e:any) => setMainWidth(e.width)"
        >
          <!-- 内容-默认插槽 -->
          <div class="content" style="width: 100%;" >
            <slot />
          </div>
        </DxResizable>
        <!-- 预览-->
        <div class="content" v-show="rightShow || rightSider">
          <EntityPreview v-if="previewFlag?.length>0" :entity="selectMenu.item" :flag="previewFlag" />
        </div>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<style lang="scss" scoped>
// @import '~antd/es/style/themes/variable';
.main_layout {
  height: 100%;
  .header {
    // TODO:-color: @component-background;
    // border-radius: @border-radius-base;
    // border-bottom: 2px solid @border-color;
    background-color: #fafafa;
    padding: 12px;
    border-radius: 4px;
    border-bottom: 2px solid #efefef;
    -webkit-box-shadow: inset -20px 0px 10px 10px #f8f9ff;
    box-shadow: inset -20px 0 10px 10px #f8f9ff;
    display: flex;
    justify-content: space-between;
    height: 53px;
  }
  .sider {
    width: 250px;
    height: 100%;
    // background-color: @component-background;
    background-color: #fafafa;
    // border-right: 1px solid @border-color;
    border-right: 1px solid #efefef;
    .menuBar {
      display: flex;
      padding: 0 30px;
      margin-top: 10px;
      justify-content: space-between;
    }
    .container {
      height: calc(100% - 60px);
      // padding: 0 @padding-xs;
      padding: 0 10px;
      overflow-y: scroll;
    }
    .title {
      // border-radius: @border-radius-base;
      border-radius: 10px;
      clear: both;
      padding: 8px;
      text-align: center;
      cursor: pointer;
      .backup {
        color: #154ad8;
        float: left;
        padding: 6px;
      }
      .label {
        font-size: 16px;
        white-space: nowrap;
        width: 160px;
        padding: 6px;
      }
    }
  }
  .body {
    height: calc(100% - 60px);
    display: flex;
    flex-direction: row;
    .main {
      display: flex;
      padding: 0;
    }
    .content {
      flex: 1;
      display: flex;
      height: 100%;
      padding: 12px;
      border-right: 1px solid #efefef;
      // background-color: @component-background;
      // border-radius: @border-radius-base;
      background-color:#fafafa;
      border-radius: 10px;
      overflow-y: hidden;
      flex-direction: column;
    }
  }
}
:deep(.el-dropdown-menu__item){
  margin: 0 6px !important;
  padding: 0 !important;
}
.menu-item-btn {
  cursor: pointer;
  display: flex;
  align-items: start;
  padding: 6px;
  border-radius: 4px;
  // justify-content: space-between;
  &:hover {
    background-color: #f2f4f9;
  }
  >i {
    margin-right: 6px;
  }
}
</style>
