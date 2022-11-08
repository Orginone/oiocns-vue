<!--数字-->
<template>
  <el-input-number
    style="width:110px"
    v-model="value"
    :id="'c' + controlId"
    :name="'c' + controlId"
    :size="size"
    :controls-position="controls_position"
  >
  </el-input-number>
</template>

<script>
import { defineComponent } from 'vue'
// 引入表单子控件的管理类
import formItemManage from './../js/formItemManage'
// 引入组件需要的属性
import { baseFormProps, numberProps } from './../js/formItemMeta'

export default defineComponent({
  name: 'el-from-number',
  props: {
    modelValue: [Number, Boolean, Object],
    ...baseFormProps,
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
