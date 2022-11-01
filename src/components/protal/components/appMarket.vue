<template>
  <div class="invitateLayout">
    <img class="invitateLayout-img" src="@/assets/img/rw.png" alt="" />
    <div class="invitateLayout-box">
      <div class="invitateLayout-box__topText">探索更多功能</div>
      <div class="invitateLayout-box__btmText">去应⽤市场探索更多功能吧！</div>
    </div>
    <el-icon :size="20" color="#909399"><ArrowRight /></el-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.el-icon {
  cursor: pointer;
  position: absolute;
  right: 10%;
}
.invitateLayout {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--el-bg-color-overlay);
  display: flex;
  align-items: center;
  min-height: 120px;
  &-img {
    width: 100px;
    height: 100px;
    margin-left: 15%;
  }
  &-box {
    margin-left: 40px;
    &__topText {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 30px;
      
    }
    &__btmText {
      color: rgb(108, 108, 108);
      // font-size: 16px;
    }
  }
}
</style>