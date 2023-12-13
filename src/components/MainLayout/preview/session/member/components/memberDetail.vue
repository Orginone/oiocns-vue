<script setup lang='ts'>
import { IDEntity } from '@/ts/core'
const props = defineProps<{
  member: IDEntity
  x: number
  y: number
}>()
const Ref = ref(null)
watchEffect(()=>{
  if(!Ref.value) return
  Ref.value.style.top = props.y + 'px'
  Ref.value.style.left = props.x + 'px'
})
onMounted(()=>{
  console.log(props.member);
})


</script>
<template>
  <teleport to='body'>
    <div class="member-detail" ref="Ref" v-if="member" v-click-outside="console.log(1111)">
      <div class="member-detail-main">
        <div class="member-info">
          <div class="avatar"><EntityIcon :entityId="member.metadata.id" :size="78" /></div>
          <div class="name">{{member.name}}</div>
          <div class="remark">{{member.remark}}</div>          
        </div>

        <div class="functions-container">
          <div class="function-btn">
            <div class="function-btn-icon">icon</div>
            沟通
          </div>
          <div class="function-btn">
            <div class="function-btn-icon">icon</div>
            沟通
          </div>
          <div class="function-btn">
            <div class="function-btn-icon">icon</div>
            沟通
          </div>
        </div>
        <!-- TODO: -->
        <div class="belong"><div class="typeName">单位</div><div class="name">杭州电子科技大学</div></div>
      </div>
      <div class="add-friend-btn">+ 添加好友</div>
    </div>
  </teleport>
</template>

<style lang='scss' scoped>
.member-detail {
  position: absolute;
  z-index: 1000;
  display: flex;
  width: 320px;
  height: 440px;
  padding: 60px 24px 24px 24px;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  border-radius: 12px;
  background: #FFF;
  background: url('/public/img/anxinwu/banner/workbench.png') no-repeat;
  /* Shadow/md */
  box-shadow: 0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.10);
  .member-detail-bg {
    display: flex;
    width: 320px;
    justify-content: center;
    align-items: center;
    position: absolute;
    .banner {
      width: 626.389px;
      height: 277.96px;
      flex-shrink: 0;

    }
  }
  .member-detail-main {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    flex: 1 0 0;
    align-self: stretch;
    .member-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      .name {
        color: var(--color-text-icon-text-color-1, #15181D);

        /* 16/CN-Medium */
        font-family: PingFang SC;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px; /* 150% */
      }
      .remark {
        color: var(--color-text-icon-text-color-2, #424A57);

        /* 14/EN-Regular */
        font-family: Nunito Sans;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
      }      
    }
    .functions-container {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      align-self: stretch;
      .function-btn {
        cursor: pointer;
        display: flex;
        padding: 4px 0px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 4px;
        flex: 1 0 0;
        border-radius: 8px;
        background: var(--color-surface, #F7F8FA);
        color: var(--color-text-icon-text-color-2, #424A57);

        /* 12/CN-Regular */
        font-family: PingFang SC;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 166.667% */
      }
    }
    .belong {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      align-self: stretch;
      .typeName {
        color: var(--color-text-icon-text-color-2, #424A57);

        /* 14/EN-Regular */
        font-family: Nunito Sans;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
      }
      .name {
        color: var(--color-text-icon-text-color-1, #15181D);

        /* 14/EN-Regular */
        font-family: Nunito Sans;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
      }
    }
  }
  .add-friend-btn {
    cursor: pointer;
    display: flex;
    padding: 8px 24px;
    justify-content: center;
    align-items: center;
    gap: 12px;
    align-self: stretch;
    border-radius: 3px;
    background: var(--color-brand-normal, #366EF4);
    color: var(--color-text-icon-text-color-white, #FFF);
    text-align: center;
    /* Body/Large */
    font-family: PingFang SC;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
  }
}
</style>