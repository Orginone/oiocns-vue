<!-- Layout -->
<template>
  <el-container class="pages home-wrap">
      <slide></slide>
      <!-- 命令执行器 -->
      <Executor />
      <!-- 内容布局 -->
      <div class="content">
        <Suspense>
          <template #default>
            <router-view v-slot="{ Component }">
              <!-- <transition name="fade-transform"> -->
              <keep-alive v-if="$route.meta.keepAlive">
                <component :is="Component" />
              </keep-alive>
              <component v-else :is="Component" />
              <!-- </transition> -->
            </router-view>
          </template>

          <template #fallback>
            <!-- <LoadingVue /> -->
          </template>
        </Suspense>
        <!-- 头部 -->
        <!-- <headContent></headContent> -->
        <!-- 内容布局 -->
        <!-- <routerContent></routerContent> -->
      </div>
  </el-container>
</template>

<script lang="ts" setup>
  import slide from './components/slide.vue';
  import headContent from './components/headContent.vue';
  import routerContent from './components/routerContent.vue';

  import { getCurrentInstance, onMounted} from 'vue';
  import {
  Document,  Menu as IconMenu,  Location, Setting,} from '@element-plus/icons-vue'
  onMounted(() => {

  })
  const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }


  // 命令执行器
import Executor from '@/executor/index.vue'; 
</script>

<style>
div{
  font-size: 14px;
}
</style>
<style lang="scss" scoped>
  .pages{
    display: flex;
  }

  .item{
    padding: 10px 0;
    img{
      width: 26px;
      height: 26px;
    }
    .item-text{
      font-size: 12px;
      line-height: 18px;
      color: #888;
    }
  }
  .content{
    flex: 1;
    display: flex;
    flex-direction: column;
  }

</style>
