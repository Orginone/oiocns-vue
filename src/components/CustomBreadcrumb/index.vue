<!-- 内容布局面包屑 -->
<script setup lang="ts">
import { MenuItemType } from '@/typings/globelType'
import { CaretRight,ArrowDown } from '@element-plus/icons-vue';


const props = defineProps<{
  selectKey: string;
  item: MenuItemType;
  onSelect?: (item: MenuItemType) => void;
}>()


/** 加载面包屑下拉列表 */
const loadItemMenus = (item: MenuItemType) => {
  if (item.children.length > 0) {
    return item.children.map((i) => {
        return {
          key: i.key,
          icon: i.icon,
          label: i.label,
        };
    })
  }
}
/** 加载面包屑数据 */
const loadBreadItems = (items: MenuItemType[], key: string) => {
  const result: MenuItemType[] = [];
  if (Array.isArray(items)) {
    for (const item of items) {
      if (item.key === key) {
        // const {items,onClick} = loadItemMenus(item)
        // item.items=items

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
}
// 面包屑数据
const items=ref<MenuItemType[]>(loadBreadItems([props.item], props.selectKey))
watch(()=>props.selectKey,() => {
  items.value = loadBreadItems([props.item], props.selectKey);
  
})

</script>

<template>
   <ElSpace wrap spacer="|" :size="2">
      <!-- 左侧栏插槽 -->
      <slot name="leftBar"/>
      <!-- 面包屑 -->
      <ElBreadcrumb :separator-icon="CaretRight" class="customBreadcrumb">
        <ElBreadcrumbItem
          v-for="item in items" :key="item.key"
          @click="onSelect?.apply(this, [item as MenuItemType])"
        >
          <ElDropdown trigger="hover">
            <div style="display: flex;align-items: center;">
              <span style="padding-right: 4px;">
                <component :is="item.icon?.name" v-bind="item.icon?.args"/>
              </span>
              <span style="margin-right: 6px;">{{item.label}}</span>
              <!-- 标签 -->
              <template v-if="item.tag">
                <ElTag  v-for="tag in item.tag" :key="tag" type="success">
                  {{tag}}
                </ElTag>
              </template>          
              <ElIcon :size="10" v-if="item.children.length>0"><ArrowDown/></ElIcon>
            </div>
            <!-- 下拉列表 -->
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem 
                  v-for="i in loadItemMenus(item as MenuItemType)" 
                  :key="i.key"
                  @click="onSelect?.apply(this,[i as MenuItemType]);console.log(i)"
                >
                  <component :is="i.icon?.name" v-bind="i.icon?.args"/>
                  <span style="margin-left: 4px;">{{ i.label }}</span>
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </ElBreadcrumbItem>
      </ElBreadcrumb>
    </ElSpace>
</template>

<style lang="scss" scoped>
.customBreadcrumb {
  display: flex;
  cursor: pointer;
}
:deep(.el-breadcrumb__inner){
  cursor: pointer !important;
}
</style>
