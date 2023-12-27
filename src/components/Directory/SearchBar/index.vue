<!-- 标签条 -->
<script setup lang="ts">
import { schema } from '@/ts/base'
import { IEntity } from '@/ts/core'
import { Back,Right } from '@element-plus/icons-vue'

const props = defineProps<{
  select: string
  initTags: string[]
  excludeTags: string[]
  extraTags: boolean
  showBack?: boolean
  menus: any
  selectFiles: IEntity<schema.XEntity>[];
  badgeCount?: (tag: string) => number;
  entitys: IEntity<schema.XEntity>[]
  onChanged: (tag: string) => void
  onBack: () => void
  onValueChanged: (value: string) => void;
}>()

const items = props.menus.items || []
const outside = items.filter((item: any) => item.model === 'outside')
const inside = items.filter((item: any) => item.model != 'outside')

/** 分组标签集 */
const groupTags = computed(() => {
  const tags = props.initTags.map((tag) => {
    return { tag, count: 0 };
  })
  if (props.selectFiles.length > 0) {
    tags.push({ tag: '已选中', count: props.selectFiles.length })
  }
  if (props.extraTags) {
    props.entitys.forEach((entity) => {
      entity.groupTags.forEach((tag) => {
        if (!props.excludeTags.includes(tag)) {
          const index = tags.findIndex((i) => i.tag === tag);
          if (index > -1) {
            tags[index].count += 1;
          } else {
            tags.push({ tag, count: 1 });
          }
        }
      });
    });
  }
  return tags.sort((a, b) => {
    const aqz = a.tag === '已删除' ? 10 : 0;
    const bqz = b.tag === '已删除' ? 10 : 0;
    return aqz - bqz;
  });
})
const searchText = ref<string>('')
</script>

<template>
  <div class="tags">
    <div class="tags-bar">
      <ElInput placeholder="请输入" v-model="searchText" @input="props.onValueChanged(searchText);"></ElInput>
    </div>
    <div class="tags-actions">
      <!-- 刷新、上传、上传列表 -->
      <template v-if="outside.length > 0">
        <div
          v-for="item in outside" :key="item.key"
          :title="item.label"
          style="font-size: 18px;cursor: pointer;"
          @click="menus.onClick?.apply(this, [item])"
        >
          <component :is="item.icon.name" v-bind="item.icon.args"/>
        </div>
      </template>
      <!-- 更多操作 -->
      <ElDropdown
        v-if="inside.length > 0"
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
              <!-- 含子项 -->
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tags {
  width: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
}
.tags-bar {
  width: 0;
  flex: 1;
  height: 35px;
  gap: 8px;
  display: flex;
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #efefef;
  padding-bottom:10px;

  &_btn {
    cursor: pointer;
  }
  .tags_body {
    overflow: auto;
    padding: 0 8px;
    width: 100%;
    &::-webkit-scrollbar {
      height: 4px;
      background-color: transparent;
    }
  }
  .tags_item {
    cursor: pointer;
    white-space: nowrap;
    padding: 4px 12px;
    font-size: 12px;
    height: 26px;
    display: flex;
    align-items: center;
    .item_count {
      color: #2b00ff;
      font-style: italic;
      transform: scale(0.9);
    }
    &:hover {
      border-radius: 30px;
      // TODO:
      // background-color:@active-background;
      background-color: #e6f1ff;
    }
    &_active {
      cursor: not-allowed;
      white-space: nowrap;
      border-radius: 30px;
      padding: 4px 16px;
      font-size: 12px;
      height: 26px;
      display: flex;
      align-items: center;
      .item_count {
        font-style: italic;
        transform: scale(0.9);
      }
      // TODO:
      color: white;
      background-color:#3838b9;
    }
  }
}
.tags-actions {
  display: flex;
  gap: 17px;
}

:deep(.el-badge__content.is-fixed){
  top: 8px;
  width: 16px;
  height: 16px;
}
</style>
