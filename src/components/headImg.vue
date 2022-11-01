<template>
  <div v-if="label" class="user-head-label">
    <el-tag size="small">{{ label }}</el-tag>
  </div>
  <div class="user-head-img-wrap" v-if="url">
    <img :class="['user-img', isSquare ? 'square-box' : 'circle-box']" :src="url" alt="" />
  </div>
  <div :class="['user-head-img-wrap', 'txt-img', isSquare ? 'square-box' : 'circle-box']" v-else>
    <span>{{ props.name.slice(0, limit).toLocaleUpperCase() }}</span>
  </div>
</template>

<script lang="ts" setup>
  import img from '@/assets/img/toux.jpg'
  import { computed } from 'vue'

  type Props = {
    name?: string
    label?: string
    url?: string //图片地址
    limit?: number // 文字展示长度
    class?: string
    isSquare?: boolean //是否方形展示 true--方形  false--圆形
    imgWidth?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    name: '',
    label: '',
    limit: 2,
    isSquare: true,
    imgWidth: 40
  })
  const { name, url, label, limit, isSquare, imgWidth } = props
  const imgWidthStyle = computed(() => {
    return imgWidth + 'px'
  })
</script>

<style lang="scss" scoped>
  .user-head-label {
    position: absolute;
    right: 5px;
    top: 26px;
  }

  .user-head-img-wrap {
    width: v-bind(imgWidthStyle);
    min-width: v-bind(imgWidthStyle);
    height: v-bind(imgWidthStyle);
    margin-right: 10px;

    &.txt-img {
      background-color: var(--el-color-primary);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-weight: bold;
      letter-spacing: 1px;
      color: #fff;
    }

    .user-img {
      width: 100%;
      height: 100%;
      margin-right: 15px;
    }
  }
  .square-box {
    border-radius: 4px;
  }
  .circle-box {
    border-radius: 50%;
  }
</style>
