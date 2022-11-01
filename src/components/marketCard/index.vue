<template>
  <el-card>
    <div class="market-top-card">
      <!-- 左侧 -->
      <div class="left">
        <span v-if="isSee" style="color: #3e5ed8; font-size: 17px">{{ activeRouterName }} </span>
        <el-page-header v-else @back="$router.go(-1)" class="pageHeader">
          <template #icon>
            <span style="padding-top: 3px">
              <el-icon><ArrowLeft /></el-icon>
            </span>
          </template>
          <template #title> <span style="margin-top: 5px">返回</span></template>

          <template #content>
            <div class="flex items-center">
              <div style="padding-top: 10px">
                <slot name="routeContent"></slot>
              </div>
              <slot name="marketNameSlot" ></slot>
            <span style="color: var(--el-color-primary); font-size: 17px;">{{ activeRouterName }} </span>
            </div>

          </template>
        </el-page-header>
      </div>
      <div class="right">
        <!-- 右侧 -->
        <slot name="right"> </slot>
      </div>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
  import { ref, watch, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { ArrowLeft } from '@element-plus/icons-vue'
  import { marketPathList } from '@/router/index'
  import { Props } from '@yzfe/svgicon'
  const router = useRouter()

  const props = withDefaults(defineProps<{ isSee?: boolean }>(), {
    isSee: false
  })
  const activeRouter = ref<string>('')
  const activeRouterName = ref<string>('')
  watch(
    () => router.currentRoute.value.path,
    (newValue, oldValue) => {
      activeRouter.value = newValue
      marketPathList.forEach((el: { path: string; name: string }) => {
        if (el.path === newValue) {
          activeRouterName.value = el.name
        }
      })
    },
    { immediate: true }
  )
</script>
<style lang="scss" scoped>
  :deep(.el-card__body) {
    padding: 0;
  }
  .market-top-card {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 20px;

    .left {
      height: 60px;
      line-height: 60px;
      display: flex;
      justify-content: flex-start;

      .pageHeader {
        display: flex;

        height: 100%;
        line-height: 60px;
      }
    }
    .right {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
