<!--数字滑块-->
<template>
  <el-slider
    v-model="value"
    :id="'c' + controlId"
    :name="'c' + controlId"
    :size="size"
  >
  </el-slider>
</template>

<script>
import { defineComponent } from 'vue'
// 引入表单子控件的管理类
import formItemManage from './../js/formItemManage'
// 引入组件需要的属性
import { baseFormProps, numberProps } from './../js/formItemMeta'

export default defineComponent({
  name: 'el-from-range',
  props: {
    modelValue: Number,
    ...baseFormProps, // 基础属性
    ...numberProps
  },
  emits: ['update:modelValue', 'myChange', 'input', 'change'],
  setup (props, context) {
    return {
      ...formItemManage(props, context)
    }
  }
})
</script>
