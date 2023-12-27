<script setup lang='ts'>

import { MoreFilled } from '@element-plus/icons-vue'
import { onContextMenu } from '@/utils/contextMenu'

const props = defineProps<{
  modelValue: string
  menus: any
}>()

const emit = defineEmits(['update:modelValue'])

const filter = ref(props.modelValue)
watch(filter,()=>{
  emit('update:modelValue',filter.value)
})

const items = props.menus.items || []
const outside = items.filter((item: any) => item.model === 'outside')
const inside = items.filter((item: any) => item.model != 'outside')

</script>
<template>
  <div class="inventory-search-area">
    <div class="search-input-container">
      <div class="icon"><ElIcon :size="20"><Search/></ElIcon></div>
      <input 
        type="text"
        v-model="filter"
        style="height: 30px; font-size: 15px;"
        placeholder="搜索"
        clearable
      /> 
    </div>
    <slot  name="rightBar"/>  
    <!--功能按钮  -->
    <div class="tags-actions">
      <template v-if="outside.length > 0">
        <!-- 长按钮型 -->
        <!-- <div class="tags-actions-btn" v-for="item in outside" :key="item.key"
          @click="menus.onClick?.apply(this, [item])"
        >
          <component :is="item.icon.name" v-bind="item.icon.args" color="inherit"/>
          <span>{{ item.label }}</span>
        </div> -->
        <!-- 图标按钮型 -->
        <div  v-for="item in outside" :key="item.key" 
          style="cursor: pointer;"
          :title="item.label"
          @click="menus.onClick?.apply(this, [item])"
        >
          <component :is="item.icon.name" v-bind="item.icon.args" color="inherit" :size="18"/>
        </div>
      </template>
      <!-- TODO:更多操作 -->
      <!-- <ElDropdown v-if="inside.length > 0"
        placement="bottom"
        :trigger="['click', 'contextmenu']"
      >
        <ElIcon :size="22" style="cursor: pointer;"><MoreFilled /></ElIcon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item 
              v-for="item in inside" 
              :key="item.key"
            >
              <template v-if="item?.children?.length>0">
                <ElPopover trigger="hover" placement="left-start" :show-arrow="false">
                  <template #reference>
                    <div class="menu-item-btn" @click="menus.onClick">
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
              <template v-else>
                <div class="menu-item-btn"  @click="onOperateMenuClick(selectMenu, item.key)">
                  <component v-if="item.icon" :is="item.icon.name" v-bind="item.icon.args"/>
                  <span>{{ item.label }}</span>
                </div>
              </template>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </ElDropdown>       -->
      <div class="more-actions" v-if="inside.length > 0" @click="onContextMenu($event,{items:inside,onClick: menus.onClick})">
        <ElIcon :size="18" style="transform: rotate(90deg);"><MoreFilled/></ElIcon>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.inventory-search-area {
  width: 100%;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  .search-input-container {
    flex:1;
    align-items: center;
    height: 40px;
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 3px 12px;
    // TODO: color/surface/次要容器背景
    background-color: #F7F8FA;
    display: flex;
    gap: 8px;
    .icon {
      width: 20px;
      height: 20px;
    }
    input {
      width: 100%;
      height: 100%;;
      border: none;
      outline: none;
      background-color: transparent;
    }
  }
  .search-input-container:focus-within {
    // TODO:
    // border-color: #409EFF;
  }
  .tags-actions {
    display: flex;
    gap: 12px;
    .tags-actions-btn {
      display: flex;
      align-items: center;
      border-radius: 3px;
      padding: 5px 12px;
      cursor: pointer;
      //  TODO: color/surface/默认页面背景
      background-color: #EEEEF0;
      //styleName: Body/Medium;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0em;
      text-align: center;
      color: #15181D;
      text-wrap: nowrap;
      &:hover {
        //  TODO: color/brand/Normal
        background-color: #366EF4;
        color: #FFFFFF;
      }
    }
  }
  .more-actions {
    cursor: pointer;
  }
}
</style>