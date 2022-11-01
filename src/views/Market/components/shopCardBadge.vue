<template>
    <el-badge value="hot" class="item">
      <slot name="badge"></slot>
    </el-badge>
</template>

<script lang="ts" setup>
    import { reactive, toRefs } from 'vue'
    import HeadImg from '@/components/headImg.vue'
    import appImg from '@/assets/img/app_icon.png'
    // hoverItem--鼠标移入item的id 用于展示按钮区域
    const state: { hoverItem: string } = reactive({ hoverItem: '' })
    type shopInfoType = {
      key?: string
      info: ProductType
      overId?: string //当前鼠标移入id
      cardContent?: boolean // 卡片内容是否自定义
    }
    const props = defineProps<shopInfoType>()
    const { info } = props
    const emit = defineEmits(['handleMouseOver'])
    const handleWatchMouseOver = (selectId: string) => {
      emit('handleMouseOver', selectId)
    }
  </script>
  
  <style lang="scss" scoped>
    .item {
      margin-top: 10px;
      margin-right: 40px;
    }
  </style>