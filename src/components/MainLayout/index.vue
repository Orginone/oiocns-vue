<!-- 内容区模板布局 -->
<!-- 包含：左侧、内容区顶部(面包屑、操作区)、内容区 -->
<!-- 插槽：rightBar、default -->
<script setup lang="ts">

// import { Col, Divider, Dropdown, Layout, Row, Space, Typography, Button } from 'antd';
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
    onSelect?: (item: MenuItemType) => void;
    onMenuClick?: (item: MenuItemType, menuKey: string) => void;
  }>()

  const [leftSider, setLeftSider] = useStorage<boolean>('leftSider', false);
  const [rightSider, setRightSider] = useStorage<boolean>('rightSider', false);
  const [mainWidth, setMainWidth] = useStorage<string | number>('mainWidth', '40%');
  const parentMenu = props.selectMenu.parentMenu ?? props.siderMenuData;
  
  const outside = props.selectMenu.menus?.filter((item) => item.model === 'outside') ?? [];
 
  const inside = props.selectMenu.menus?.filter((item) => item.model != 'outside') ?? [];
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
  };
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
      await item.beforeLoad();
    }
    props.onSelect?.apply(this, [item]);
  }
</script>

<template>
  <ElContainer class="main_layout">
    <!-- header -->
    <ElHeader class="header">
      <!-- 面包屑 -->
      <div>
        <CustomBreadcrumb
          :selectKey="selectMenu.key"
          :item="siderMenuData"
          :onSelect="(item:MenuItemType) => {
            onSelectClick(item);
          }"
        />
      </div>
      <!-- 切换主测栏-辅助侧栏-右侧插槽-else -->
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
          <!-- 头部——右侧操作 -->
          <template v-if="outside.length > 0">
            <div
              v-for="item in outside" :key="item.key"
              :title="item.label"
              style="font-size: 18px;cursor: pointer;"
              @click="onOperateMenuClick(props.selectMenu, item.key)"
            >
              <component :is="item.icon.name" v-bind="item.icon.args"/>
            </div>
          </template>
          <!-- 头部——右侧操作——更多操作 -->
          <ElDropdown
            v-if="inside.length > 0"
            placement="bottom"
            :trigger="['click', 'contextmenu']"
          >
            <ElIcon :size="22" style="cursor: pointer;"><MoreFilled /></ElIcon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item 
                  v-for="item in cleanMenus(inside)" 
                  :key="item.key"
                >
                  <!-- 含子项 -->
                  <template v-if="item?.children?.length>0">
                    <ElPopover trigger="hover" placement="left-start" :show-arrow="false">
                      <template #reference>
                        <div class="menu-item-btn" @click="onOperateMenuClick(selectMenu, item.key);">
                          <div style="width: 85px;display: flex;align-items: center;justify-content: space-between;">
                            <component v-if="item.icon" :is="item.icon.name" v-bind="item.icon.args"/>
                            <span>{{ item.label }}</span>
                            <el-icon style="margin-right: 0;"><ArrowRight /></el-icon>
                          </div>
                        </div>
                      </template>
                      <template #default>
                        <div
                          class="menu-item-btn"  
                          v-for="i in item.children" :key="i.key" 
                          @click="onOperateMenuClick(selectMenu, i.key);"
                        >
                          <component :is="i.icon?.name" v-bind="i.icon?.args"/>
                          {{ i.label }}
                        </div>
                      </template>
                    </ElPopover>
                  </template>
                  <!-- 不含子项 -->
                  <template v-else>
                    <div class="menu-item-btn"  @click="onOperateMenuClick(selectMenu, item.key)">
                      <component v-if="item.icon" :is="item.icon.name" v-bind="item.icon.args"/>
                      <span>{{ item.label }}</span>
                    </div>
                  </template>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </ElDropdown>
        </ElSpace>
      </div>
    </ElHeader>
    <!-- body -->
    <ElContainer class="body">
      <!-- body-左侧目录 -->
      <ElAside v-if="leftShow || leftSider" class="sider" width="250px">
        <div class="title">
          <span v-if="parentMenu.key != props.siderMenuData.key" class="backup" @click="onSelectClick(parentMenu)">
            <ElIcon :size="20"><Back/></ElIcon>
          </span>
          <div class="label" @click="onSelectClick(parentMenu)">
            <span style="margin-right: 6px;">
              <component :is="parentMenu.icon.name" v-bind="parentMenu.icon.args"/>
            </span>
            <ElText truncated>{{parentMenu.label}}</ElText>
          </div>
        </div>
        <!-- 菜蛋 -->
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
      <ElMain v-if="rightShow || rightSider" class="main">
        <!-- 左侧 -->
        <DxResizable
          handles='right'
          :width="mainWidth"
          :onResize="(e:any) => setMainWidth(e.width)"
        >
          <div class="content" style="width: 100%;">
            <!-- 内容-默认插槽 -->
            <slot />
          </div>
        </DxResizable>
        <!-- 右侧 -->
        <div class="content">
          <EntityPreview v-if="previewFlag?.length>0" :entity="selectMenu.item" :flag="previewFlag" />
        </div>
      </ElMain>
      <!-- 内容-默认插槽 -->
      <ElMain v-else class="content">
        <slot></slot>
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
