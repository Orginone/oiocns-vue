<!--勾选框-->
<template>
  <el-checkbox
    v-model="value"
    @change="mySubmit"
    :id="'c' + controlId"
    :name="'c' + controlId"
    :size="size"
  >
    {{title}}
  </el-checkbox>
</template>

<script>
import { defineComponent } from 'vue'
// 引入表单子控件的管理类
import formItemManage from './../js/formItemManage'
// 引入组件需要的属性
import { baseFormProps } from './../js/formItemMeta'

export default defineComponent({
  name: 'el-from-checkbox',
  props: {
    title: String,
    modelValue: Boolean,
    ...baseFormProps // 基础属性
  },
  emits: ['update:modelValue', 'myChange', 'input', 'change'],
  setup (props, context) {
    return {
      ...formItemManage(props, context)
    }
  }
})
</script>
