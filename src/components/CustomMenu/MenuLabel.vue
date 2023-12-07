<script setup lang="ts">
import {MenuItemType} from '@/typings/globelType'
import { MoreFilled } from '@element-plus/icons-vue';
import { cleanMenus } from '@/utils/tools'


const props = defineProps<{
  item: any
  selectMenu: MenuItemType
  onSelect: (item: MenuItemType) => void
  collapsed: boolean
  onMenuClick: (item: MenuItemType, menuKey: string) => void
}>()
</script>

<template>
    <span
      @click="console.log('111');item.key!=selectMenu.key ? onSelect?.apply(this, [item]):''"
      class="customlabel"
    >
      <ElText class="label" truncated>
        {{item.title}}
      </ElText>
      <span v-if="item?.count>0" className={style.badge}>
        <ElBadge :value="item.count" size="small" />
      </span>
      <span
        v-if="Array.isArray(item.menus) && item.menus.length > 0"
        @click="(e: any) => e.stopPropagation()" 
        class="moreButton"
      >
        <ElDropdown
          v-if="selectMenu.key === item.key"
          placement="bottom"
          trigger="contextmenu"
        >
          <ElIcon v-if="collapsed" :size="22"><MoreFilled/></ElIcon>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem
                v-for="i in cleanMenus(item.menus)"
                @click="({ key }) => onMenuClick?.apply(this, [i, key])"
              >
              </ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </span>
    </span>
</template>

<style lang="scss" scoped>
.customlabel {
  display: contents;
  .label {
    margin: 0 10px;
    width: calc(100% - 30px);
  }

  .badge {
    position: absolute;
    right: 20px;
  }

  .moreButton {
    position: absolute;
    right: 2px;
  }
}

</style>
