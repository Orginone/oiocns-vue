<template>
  <el-card
    class="marketCreate"
    shadow="hover"
    
    @click="() => emit('myclick')"
  >
  <div class="createCard">
      <div>

        <el-icon :size="24"></el-icon>
        {{ info }}
      </div>
      <el-icon :size="24"><Plus /></el-icon>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
  import { reactive, toRefs } from 'vue'

  type createInfo = {
    info: string
  }
  const props = defineProps<createInfo>()
  const { info } = props

  const emit = defineEmits(['myclick'])
</script>

<style lang="scss" scoped>
    @media not screen and (min-width: 1300px) {
    /* styles */
    // .marketCreate{
    //   width: calc(33% - 15px) !important;
    // }
}
  .marketCreate {
    width: 100%;
    min-width: 200px;
    height: 160px;
    margin-bottom: 10px;
    margin-right: 10px;
    border: 2px dashed #409eff;
    text-align: center;
    line-height: 120px;
    border-radius: 2px;
    cursor: pointer;
    .createCard {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
