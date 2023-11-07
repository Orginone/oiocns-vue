<script setup lang="ts">
// import { RiMore2Fill } from '@/icons/ri';
// import { Dropdown, Menu, MenuProps, Typography, Input, Badge } from 'antd';
// import React, { useEffect, useState } from 'react';
import { Search } from '@element-plus/icons-vue'
import { MenuItemType } from 'typings/globelType'
import MenuLabel from './MenuLabel.vue'


const props = defineProps<{
  collapsed: boolean;
  selectMenu: MenuItemType;
  item: MenuItemType;
  onSelect?: (item: MenuItemType) => void;
  onMenuClick?: (item: MenuItemType, menuKey: string) => void;
}>()

const loadMenus: any = (items: MenuItemType[], expKeys: string[]) => {
    const result:any = [];
    if (Array.isArray(items)) {
      for (const item of items) {
        result.push({
          key: item.key,
          title: item.label,
          // TODO: label: renderLabel(item),
          children: loadMenus(item.children, expKeys),
          icon: item.expIcon && expKeys.includes(item.key) ? item.expIcon : item.icon,
        });
      }
    }
    return result;
  };
const loopFilterTree = (data: MenuItemType[]) => {
  const result: any[] = [];
  for (const item of data) {
    const newItem = { ...item };
    let exsit = false;
    const title: string = newItem.label;
    if (title) {
      exsit = title.includes(filter.value);
    }
    const children: any[] = item.children;
    if (children && Array.isArray(children)) {
      const result = loopFilterTree(children);
      exsit = exsit || result.length > 0;
      newItem.children = result;
    }
    if (exsit) {
      result.push(newItem);
    }
  }
  return result;
}
/** 还原打开的keys */
const loadOpenKeys = (items: MenuItemType[], key: string) => {
  const result: string[] = [];
  if (Array.isArray(items)) {
    for (const item of items) {
      if (item.key === key) {
        result.push(key);
      } else {
        const nodes = loadOpenKeys(item.children, key);
        if (nodes.length > 0) {
          result.push(...nodes);
          result.unshift(item.key);
        }
      }
    }
  }
  return result;
};
  /** 渲染标题,支持更多操作 */
  // const renderLabel = (item: MenuItemType) => {
  //   return (
  //     <span
  //       @click="() => {
  //         if (item.key != props.selectMenu.key) {
  //           props.onSelect?.apply(this, [item]);
  //         }
  //       }"
  //       className={style.customlabel}
  //       onMouseLeave={() => {
  //         setVisibleMenu(false);
  //       }}>
  //       <Typography.Text className={style.label} ellipsis={{ tooltip: item.label }}>
  //         {item.label}
  //       </Typography.Text>
  //       {item.count && item.count > 0 ? (
  //         <span className={style.badge}>
  //           <Badge key={item.key} count={item.count} size="small" />
  //         </span>
  //       ) : (
  //         <></>
  //       )}
  //       {Array.isArray(item.menus) && item.menus.length > 0 && (
  //         <span onClick={(e: any) => e.stopPropagation()} className={style.moreButton}>
  //           {props.selectMenu.key === item.key && (
  //             <Dropdown
  //               menu={{
  //                 items: cleanMenus(item.menus),
  //                 onClick: ({ key }) => {
  //                   setVisibleMenu(false);
  //                   props.onMenuClick?.apply(this, [item, key]);
  //                 },
  //               }}
  //               placement="bottom"
  //               open={visibleMenu}
  //               onOpenChange={(open: boolean) => {
  //                 setVisibleMenu(open);
  //               }}
  //               trigger={['click', 'contextMenu']}>
  //               {!props.collapsed ? (
  //                 <RiMore2Fill style={{ fontSize: 22, marginTop: 10 }} />
  //               ) : (
  //                 <></>
  //               )}
  //             </Dropdown>
  //           )}
  //         </span>
  //       )}
  //     </span>
  //   );
  // };
  
  const filter=ref<string>('')
  const selectedKeys=ref<string[]>([props.selectMenu.key])
  const openKeys=ref<string[]>([])
  const visibleMenu=ref<boolean>()

  // 数据
  const data=ref(loadMenus(props.item.children, []))

  console.log('data',data.value[0]);//////////////////////////////////////////////////////////////////////////
  
  
  // TODO:watch(()=>props,()=>{
  //   reloadData(loadOpenKeys(props.item.children, props.selectMenu.key))
  // })
  onMounted(()=>{
    reloadData(loadOpenKeys(props.item.children, props.selectMenu.key))
  })

  // 
  watch([visibleMenu, filter], () => {
    reloadData(openKeys.value)
  })
  // onMounted(() => {
  //   reloadData(openKeys.value);
  // })

  // 
  const reloadData = (keys: string[]) => {
    data.value = loadMenus(loopFilterTree(props.item.children), keys)
    openKeys.value = keys
    selectedKeys.value = [props.selectMenu.key]
  }
</script>

<template>
  <template v-if="item">
    <span :style="{ display: 'flex', justifyContent: 'center' }">
      <ElIcon v-if="collapsed"><Search /></ElIcon>
      <ElInput
        v-else
        :input-style="{ height: '36px', fontSize: '15px' }"
        placeholder="搜索"
        :prefix-icon="Search"
        v-model="filter"
      />
    </span>

    <ElMenu
      class="customMenu"
      menu-trigger="click"
      :oncontextmenu="(e:any) => {
        e.preventDefault();
        visibleMenu = true
      }"
      :unique-opened="true"
      @select="(index) => openKeys=data[index]"
    >
      <ElSubMenu v-for="item in data" :index="item.key">
        <template #title>
          <!-- TODO: <component :is="item.icon" /> -->
          <MenuLabel :selectMenu="selectMenu" :item="item" :collapsed="collapsed" :on-select="onSelect" :on-menu-click="onMenuClick" />
        </template>
        <!-- <ElMenuItem 
          v-for="i in item.children" :key="i.key"
        >
          TODO: <component :is="i.icon" />
          <span>{{ i.title }}</span>
        </ElMenuItem> -->
      </ElSubMenu>
    </ElMenu>
  </template>
</template>

<style lang="scss" scoped>
// @import '~antd/es/style/themes/variable';

.operateMenu {
  font-size: 14px;
  width: 100%;
  margin: 5px 0px;
  padding: 10px;
  color: #888;
  font-weight: bold;
  background-color: inherit;
}

.customMenu {
  overflow-y: scroll;
  overflow-x: hidden;
  border: none;
  // :global {
  //   .ogo-menu-item-group-title {
  //     padding-left: 0;
  //   }
  //   .ogo-menu-sub.ogo-menu-inline {
  //     // TODO:background: @component-background;
  //     background-color: red;
  //   }

  //   .ogo-menu-item,
  //   .ogo-menu-submenu-expand-icon,
  //   .ogo-menu-submenu-arrow,
  //   .ogo-menu-submenu .ogo-badge,
  //   .ogo-menu-item .ogo-badge,
  //   .ogo-menu-submenu {
  //     // TODO: color: @system-menu-color;
  //     background-color: red;
  //   }
  //   .ogo-menu-submenu-selected,
  //   .ogo-menu-submenu-selected .ogo-badge,
  //   .ogo-menu-item-selected .ogo-badge,
  //   .ogo-menu-item:hover,
  //   .ogo-menu:not(.ogo-menu-horizontal) .ogo-menu-item-selected {
  //     // TODO:color: @text-color;
  //     // background-color: @custom-menu-active-background;
  //     color: red;
  //     background-color: red;
  //   }
  //   .ogo-menu-submenu-selected .ogo-menu-submenu-title .ogo-menu-item-icon,
  //   .ogo-menu-item:hover .ogo-menu-item-icon,
  //   .ogo-menu-item.ogo-menu-item-selected .ogo-menu-item-icon {
  //     // TODO: color: @primary-color;
  //     color: red;
  //   }
  //   .ogo-menu-vertical,
  //   .ogo-menu-inline {
  //     border: none;
  //   }
  //   .ogo-menu-item-acitve,
  //   .ogo-menu-item-acitve:hover {
  //     // TODO: color: @text-color;
  //     color: red;
  //   }
  //   .ogo-menu-inline .ogo-menu-item-selected::after {
  //     opacity: 0;
  //   }
  //   .ogo-menu-title-content {
  //     margin-left: 6px;
  //   }

  //   .ogo-menu-submenu-title {
  //     padding-top: 6px;
  //     padding-right: 6px;
  //     height: 35px !important;
  //     line-height: 35px !important;
  //   }

  //   .ogo-typography {
  //     color: inherit;
  //   }

  //   .ogo-menu-submenu-placement-rightTop {
  //     .ogo-menu-vertical .ogo-menu-submenu-title {
  //       padding-right: 8px;
  //       display: flex;
  //     }
  //   }
  // }
}

// :global {
//   .ogo-menu-submenu-placement-rightTop {
//     .ogo-menu-vertical .ogo-menu-submenu-title {
//       padding-right: 8px;
//       display: flex;
//     }

//     .ogo-menu-submenu-active .ogo-menu-submenu-title {
//       //TODO:
//       // color: @text-color;
//       // background-color: @custom-menu-active-background;
//       color: red;
//       background-color: red;
//     }
//   }
// }

// .customlabel {
//   display: contents;
//   .label {
//     margin: 0 10px;
//     width: calc(100% - 30px);
//   }

//   .badge {
//     position: absolute;
//     right: 20px;
//   }

//   .moreButton {
//     position: absolute;
//     right: 2px;
//   }
// }

</style>
