<script setup lang="ts">
import {Close} from '@element-plus/icons-vue'
import {AiOutlineFullscreen, AiOutlineFullscreenExit,AiOutlineSave} from '@/icons/ai'

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
  destroyOnClose?: boolean;
}>()
const emits = defineEmits(['fullscreenToggle'])

const isShow = ref(props.open)
watch(() => props.open, (v) => {
  isShow.value = v
})

// 是否全屏（false全屏）
const modalState = ref(!props.fullScreen)
// 设置 CSS 变量--body-height
onMounted(()=>{
  const fullScreenModal = document.querySelector(".fullScreenModal")
  // 当全屏-非全屏切换时，动态设置--body-height
  watch(() => modalState.value, (v) => {
    if(v){
      // 非全屏
      fullScreenModal.style.setProperty("--body-height", (typeof props.bodyHeight)==='string'? props.bodyHeight : props.bodyHeight + "px")
    }else {
      fullScreenModal.style.removeProperty("--body-height")
    }
  },{immediate:true})
})
// 关闭
const onClose=() => {
  props.onCancel && props.onCancel()
  isShow.value = false
}

</script>

<template>
  <div class = "fullScreenModal">
    <ElDialog
      v-model="isShow"
      :close-on-click-modal="false"
      :show-close="false"
      :width="width"
      :fullscreen="!modalState"
      :destroy-on-close="destroyOnClose"
      top="10vh"
    >
      <!-- 自定义头部——header插槽 -->
      <template #header>
        <div class="modalHeader">
          <div class="modalHeaderTitle">
            <ElSpace wrap :size="2">
              {{icon}}
              {{title}}
            </ElSpace>
          </div>
          
          <!-- 右侧按钮 -->
          <ElSpace wrap  :size="10">
            <a 
              class="headerBtn"
              v-if="onSave" 
              title='保存' 
              @click="props.onSave?.apply(this, [])"
            >
              <ElIcon> <AiOutlineSave/></ElIcon>
            </a>
            <a
              class="headerBtn"
              v-if="!props.hideMaxed"
              :title="modalState ? '最大化' : '恢复'"
              @click="modalState=!modalState"
            >
              <ElIcon>
                <AiOutlineFullscreen v-if="modalState"/>
                <AiOutlineFullscreenExit v-else/>
              </ElIcon>
            </a>
            <!-- 关闭 -->
            <a  class="headerBtn" title='关闭' @click="onClose">
              <ElIcon><Close /></ElIcon>
            </a>
          </ElSpace>
        </div>
      </template>
      <!-- 主体——默认插槽 -->
      <div class="modalMain">
        <slot>默认内容</slot>
      </div>
      <!-- 自定义footer——footer插槽 -->
      <template #footer>
        <slot name="footer" />
      </template>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped>
.modalHeader{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .modalHeaderTitle {
    margin: 0;
    color: rgba(0,0,0,.85);
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    word-wrap: break-word;
  }
  .headerBtn{
    font-size: 16px;
    cursor: pointer;
    color:rgb(21, 74, 216);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.modalMain {
  height: 100%;
}
.fullScreenModal {
  border-radius: 4px;
} 
:deep(.el-dialog__header){
  padding: 12px 16px;
  border-radius: 4px 4px 0 0;
  color: rgba(0,0,0,.85);
  background: #fafafa;
  font-family: PingFang SC;
}
:deep(.el-dialog__body){
  padding: 0 !important;
  margin: 0 !important;
  border: 1px solid #ebeef5;
  height: var(--body-height,calc(100% - 102px));
  max-height: none !important;
  overflow-y: auto;
  overflow-x: hidden;
}
:deep(.el-dialog__footer) {
  padding: 12px;
}
</style>
