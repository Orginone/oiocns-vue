<!-- 内容布局面包屑 -->
<script setup lang="ts">
// import { AiOutlineCaretRight } from '@/icons/ai';
// import { Breadcrumb, Divider, Space, Tag } from 'antd';
import { MenuItemType } from '@/typings/globelType'
import { CaretRight } from '@element-plus/icons-vue';


const props = defineProps<{
  selectKey: string;
  item: MenuItemType;
  onSelect?: (item: MenuItemType) => void;
}>()

const items=ref<MenuItemType[]>([])

onMounted(() => {
  items.value = loadBreadItems([props.item], props.selectKey)
})

const loadBreadItems = (items: MenuItemType[], key: string) => {
  const result: MenuItemType[] = [];
  if (Array.isArray(items)) {
    for (const item of items) {
      if (item.key === key) {
        result.push(item);
      } else {
        const nodes = loadBreadItems(item.children, key);
        if (nodes.length > 0) {
          result.push(...nodes);
          result.unshift(item);
        }
      }
    }
  }
  return result;
};

  const loadItemMenus = (item: MenuItemType) => {
    if (item.children && item.children.length > 0) {
      return {
        items: item.children.map((i) => {
          return {
            key: i.key,
            icon: i.icon,
            label: i.label,
          };
        }),
        onClick: (info: { key: string }) => {
          for (const i of item.children) {
            if (i.key === info.key) {
              props.onSelect?.apply(this, [i]);
            }
          }
        },
      };
    }
    return undefined;
  };

</script>

<template>
   <ElSpace wrap spacer="|" :size="2">
      <!-- 左侧栏插槽 -->
      <slot name="leftBar"/>
      <!-- 面包屑 -->
      <ElBreadcrumb :separator-icon="CaretRight" class="customBreadcrumb">
        <!-- TODO:menu={loadItemMenus(item)} -->
        <ElBreadcrumbItem
          v-for="item in items" :key="item.key"
          @click="onSelect?.apply(this, [item])"
        >
          <span :style="{ fontSize: '16px', paddingTop: '6px', paddingRight: '4px' }">
            <ElIcon><component :is="item.icon" /></ElIcon>
          </span>
          {{item.label}}
          <template v-if="item.tag">
            <Tag 
              v-for="tag in item.tag" :key="tag" color="success"
            >
              {{tag}}
            </Tag>
          </template>


        </ElBreadcrumbItem>
      </ElBreadcrumb>
    </ElSpace>
</template>

<style lang="scss" scoped>
.customBreadcrumb {
  cursor: pointer;
  // :global {
  //   .anticon-down {
  //     display: none;
  //   }
  // }
}
</style>
