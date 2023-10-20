<script setup lang="ts">
import {FullScreen, Minus, Close} from '@element-plus/icons-vue'


const props = defineProps<{
  hideMaxed?: boolean;
  fullScreen?: boolean;
  onSave?: () => void;
  icon?: string;
  bodyHeight?: number | string;

  open: boolean;
  title?: string;
  onCancel?: () => void;
  width?: string | number;
  destoryOnClose: boolean;
}>()


const isShow = ref(props.open)

// 是否全屏（false全屏）
const modalState = ref(!props.fullScreen)

const onClose=() => {
  props.onCancel()
  isShow.value = false
}

const emits = defineEmits(['fullscreenToggle'])
</script>

<template>
  <ElDialog
    v-model="isShow"
    :close-on-click-modal="false"
    :show-close="false"
    :width="width"
    :fullscreen="!modalState"
    :destroy-on-close="destoryOnClose"
  >
    <!-- 自定义头部 -->
    <template #header>
      <div class="modalHeader">
        <ElSpace wrap spacer="|" :size="2">
          {{icon}}
          {{title}}
        </ElSpace>
        <!-- 右侧按钮 -->
        <ElSpace wrap spacer="|" :size="2">
          <a 
            class="headerBtn"
            v-if="onSave" 
            title='保存' 
            @click="props.onSave?.apply(this, [])"
          >
            TODO:保存图标
            <!-- <SaveOutlined /> -->
          </a>
          <a
            class="headerBtn"
            v-if="!props.hideMaxed"
            :title="modalState ? '最大化' : '恢复'"
            @click="modalState=!modalState"
          >
            <ElIcon>
              <FullScreen v-if="modalState"/>
              <Minus v-else/>
            </ElIcon>
          </a>
          <!-- 关闭 -->
          <a  class="headerBtn" title='关闭' @click="onClose">
            <ElIcon><Close /></ElIcon>
          </a>
        </ElSpace>
      </div>
    </template>
    <!-- 主体 -->
    <div class="main" :style="{ height: bodyHeight }">
      <slot>默认内容</slot>
    </div>
    <!-- 自定义footer -->
    <template #footer>
      <slot name="footer" />
    </template>
  </ElDialog>
</template>

<style lang="scss" scoped>
.modalHeader{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .headerBtn{
    font-size: 16px;
    cursor: pointer;
    color:rgb(21, 74, 216);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

</style>
