<!-- 多选卡片 -->
<script setup lang='ts'>

const props = defineProps<{
  checkedValue: string[]
  value: string
  onChange: (value: string) => void
}>()

</script>

<template>
  <div class="check-card" :class="{'check-card-checked': checkedValue.includes(value)}" @click="onChange(value)">
    <div class="check-card-avatar"><slot name="avatar"/></div>
    <div>
      <div class="check-card-title"><slot name="title"/></div>
      <div class="check-card-description"><slot name="description" /></div>
    </div>
  </div>
</template>

<style lang='scss'>
.check-card {
  cursor: pointer;
  width: 100%;
  margin: 24px 0 16px 0;
  display: flex;
  padding-inline: 12px;
  padding-block: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  &:hover {
    border-color: #1677ff;
  }
  &-checked {
    position: relative;
    background-color: #bae0ff;
    border-color: #1677ff;
    &::after {
      position: absolute;
      inset-block-start: 2px;
      inset-inline-end: 2px;
      width: 0;
      height: 0;
      border: 6px solid #1677ff;
      border-block-end: 6px solid transparent;
      border-inline-start: 6px solid transparent;
      border-start-end-radius: 2px;
      content: '';
    }
  }
}
.check-card-avatar {
  margin-right: 8px;
}
.check-card-title,.check-card-description {
  overflow: hidden;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
}


</style>