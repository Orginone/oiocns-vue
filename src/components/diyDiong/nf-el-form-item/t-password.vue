<!--单行文本-->
<template>
  <el-input
    v-model="value"
    :id="'c' + controlId"
    :name="'c' + controlId"
    :size="size"
    :validate-event="validate_event"
    :show-password="show_password"
  >
  </el-input>
</template>

<script>
import { defineComponent } from 'vue'
// 引入表单子控件的管理类
import formItemManage from './../js/formItemManage'
// 引入组件需要的属性
import { baseFormProps, passwordProps } from './../js/formItemMeta'

export default defineComponent({
  name: 'el-form-password',
  props: {
    modelValue: String,
    ...baseFormProps, // 基础属性
    ...passwordProps // 单行文本的属性
  },
  emits: ['update:modelValue', 'myChange', 'input', 'change'],
  setup (props, context) {
    return {
      ...formItemManage(props, context)
    }
  }
})
</script>
