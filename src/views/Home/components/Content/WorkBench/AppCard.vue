<script setup lang="ts">
import { IApplication } from '@/ts/core'
import EntityIcon from '@components/Common/GlobalComps/entityIcon/index.vue'
import orgCtrl from '@/ts/controller'
import { useRouter } from 'vue-router'
const router = useRouter()

defineProps<{
  app: IApplication
}>()
/** 切换常用 */
const switchCommon = (app: IApplication, value: boolean) => {
  if(value){
    app.cache.tags = app.cache.tags || [];
    app.cache.tags.push('常用');
    app.cacheUserData();
  }else {
    app.cache.tags = app.cache.tags?.filter((i) => i != '常用');
    app.cacheUserData();
  }
}
</script>

<template>
  <ElDropdown :trigger="['contextmenu']">
    <!-- 应用卡片内容 -->
    <div class="appCard" @click="orgCtrl.currentKey = app.key;router.push('/store');">
      <ElBadge is-dot :hidden="!app.cache.tags?.includes('常用')">
        <EntityIcon :entity="app.metadata" :size="35" />
      </ElBadge>
      <div class="appName">{{ app.name}}</div>
      <div class="teamName">{{app.directory.target.name}}</div>
      <div class="teamName">{{app.directory.target.space.name }}</div>
    </div>  
    <!-- 应用卡片右键菜单 -->
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem v-if="app.cache.tags?.includes('常用')" @click="switchCommon(app, false)">
          取消常用
        </ElDropdownItem>
        <ElDropdownItem v-else @click="switchCommon(app, true)">
          设为常用
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>          
  </ElDropdown>
</template>

<style lang="scss" scoped>
.appCard {
  padding: 12px;
  text-align: center;
  .appName {
    font-size: 14px;
    font-weight: bold;
    padding: 4px 0;
  }
  .teamName {
    color: #686868;
    font-size: 12px;
    padding: 3px 0;
  }
  &:hover {
    border-radius: 10px;
    // TODO:
    // background: @active-background;
    background-color: #e6f1ff;
  }
}
</style>
