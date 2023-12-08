<!-- 标签条 -->
<script setup lang="ts">
import { schema } from '@/ts/base'
import { IEntity } from '@/ts/core'
import { Back,Right } from '@element-plus/icons-vue'

const props = defineProps<{
  title?: string
  select: string
  showTags?: boolean
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
}>()

const items = props.menus.items || []
const outside = items.filter((item: any) => item.model === 'outside')
const inside = items.filter((item: any) => item.model != 'outside')

/** 分组标签集 */
const groupTags = computed(() => {
  const tags = props.initTags.map((tag) => { // 初始化标签
    return { tag, count: 0 }
  })
  if(props.badgeCount) { // 计算角标
    tags.forEach((tag) => {
      tag.count = props.badgeCount(tag.tag)
    })
  }
  if (props.selectFiles.length > 0) { // 已选中
    tags.push({ tag: '已选中', count: props.selectFiles.length })
  }
  if (props.extraTags) { // 额外标签
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
  })
})

</script>

<template>
  <div class="tags">
    <div class="tags-left">
      <div class="title">{{ title }}</div>
      <ElButton v-if="showBack"
        link
        title="返回"
        :icon="Back"
        @click="onBack"
      />
      <div class="tags_body" v-if="showTags">
        <div class="tags-item" v-for="item in groupTags" :key="item.tag"
          :class="item.tag === props.select ? 'tags-item-active' : ''" 
          @click="onChanged(item.tag)"
        >
          {{item.tag}}
          <span v-if="item.count>0" class="tags-item-count">·{{item.count}}</span>
        </div>
      </div>
    </div>
    <div class="tags-actions">
      <!-- 刷新、上传、上传列表 -->
      <template v-if="outside.length > 0">
        <div class="tags-actions-btn" v-for="item in outside" :key="item.key"
          @click="menus.onClick?.apply(this, [item])"
        >
          <component :is="item.icon.name" v-bind="item.icon.args" color="inherit"/>
          <span>{{ item.label }}</span>
        </div>
      </template>
      <!-- 更多操作 -->
      <ElDropdown v-if="inside.length > 0"
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
  margin-bottom: 8px;
}
.tags-left {
  width: 0;
  flex: 1;
  gap: 8px;
  display: flex;
  align-items: center;
  .title {
    //styleName: 20/CN-Medium;
    font-family: PingFang SC;
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    letter-spacing: 0em;
    text-align: left;
    color: #000000;
  }
  .tags_body {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    overflow: hidden;
  }
  .tags-item {
    cursor: pointer;
    height: 24px;
    border-radius: 4px;
    // TODO: color/surface/默认边框
    border: 0.5px solid #DCDDE1;
    // TODO: color/surface/次要容器背景
    background-color: #F7F8FA ;
    padding: 1px 10px;
    display: flex;
    align-items: center;
    gap: 2px;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    // TODO: color/text & icon/text - color-3
    color: #6F7686;
    &:hover {
      // TODO:
      // background-color:@active-background;
      background-color: #e6f1ff;
    }
    &-active {
      font-weight: 500;
      // TODO: color/text & icon/text - color-white
      color: #FFFFFF;
      border-color: transparent;
      //  TODO: color/brand/Normal
      background-color: #366EF4 !important;
    }
  }
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
    &:hover {
      //  TODO: color/brand/Normal
      background-color: #366EF4;
      color: #FFFFFF;
    }
  }
}

</style>
