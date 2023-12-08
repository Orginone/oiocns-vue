<!-- 存储——文件系统 -->
<script setup lang="ts">
import useStorage from '@/hooks/useStorage'
import {Th,List} from '@/icons/fa'

const props = defineProps<{
  descriptions: string
  showFooter?: boolean
  segmented: string
  onSegmentedChange: (seg: string)=>void
}>()

</script>

<template>
<div id="segmentContent">
  <div class="mainContent">
    <slot />
  </div>
  <div class="footer" v-if="showFooter !== false">
    <!-- 项目个数 -->
    <div class="descriptions">
      {{descriptions}}
    </div>
    <!-- 切换展示类型按钮 -->
    <div class="footer-check">
      <ElIcon class="footer-check-btn" 
        :class="{'checked' : segmented === 'list'}" 
        @click="onSegmentedChange('list')"
        :size="24"
      >
        <List/>
      </ElIcon>
      <ElIcon class="footer-check-btn" 
        :class="{'checked' : segmented === 'icon'}"  
        @click="onSegmentedChange('icon')"
        :size="24"
      >
        <Th/>
      </ElIcon>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
// @import '~antd/es/style/themes/variable';
#segmentContent {
  height: 0;
  flex:1;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .mainContent {
    height: 0;
    flex: 1;
    overflow-y: overlay;
    // TODO:
    &::-webkit-scrollbar{
      background-color: transparent;
      width: 4px;
    }
  }
  // TODO:
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .descriptions {
      //styleName: 12/CN-Regular;
      font-family: PingFang SC;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      letter-spacing: 0em;
      text-align: left;
      //  TODO: color/text & icon/text - color-2
      color: #424A57;
    }
    .footer-check {
      display: flex;
      gap: 2px;
      padding: 2px;
      //  TODO: color/surface/次要容器背景
      background-color: #F7F8FA;
      .footer-check-btn {
        border-radius: 4px;
        cursor: pointer;
      }
      .checked {
        color: #0d0dff;
        background-color: white;
      }
    }
  }
}


.file {
  width: 100%;
  margin-top: 20px;
  flex: 1;
  overflow: auto;
  overflow-x: hidden;
}

.content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.fileImage {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.fileName {
  width: 100%;
  text-align: center;
  // TODO:
  // padding-top: @padding-xs;
}
.active {
  // TODO:
  // color: @primary-color;
  color: yellow;
}

</style>