<template>
  <div class="button-box" style="width: 100%">
    <el-popover width="150" trigger="hover" placement="bottom">
      <slot name="opt"></slot>
      <template #reference>
        <div class="diy-button-pos">
          <div class="diy-button-bg">
            <slot name="icon"> <img src="@/assets/img/btn-operation.svg" alt="" /></slot>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
  .diy-button-pos {
    display: flex; 
    justify-content: center;
  }
  .diy-button-bg {
    width: 38px;
    height: 20px;
    background: rgba(235, 238, 245, 1);
    border-radius: 13px;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      font-size: 16px;
      color: #61626b;
    }
  }
</style>
