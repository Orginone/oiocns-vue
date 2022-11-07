<template>
  <el-select
    v-model="value"
    multiple
    filterable
    allow-create
    default-first-option
    placeholder="请选择文章标签">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import { defineComponent } from 'vue'
// 引入表单子控件的管理类
import formItemManage from './../js/formItemManage'
// 引入组件需要的属性
import { baseFormProps } from './../js/formItemMeta'

export default defineComponent({
  name: 'el-from-selwrite',
  props: {
    modelValue: [String, Number, Array],
    ...baseFormProps // 基础属性
  },
  emits: ['update:modelValue', 'myChange', 'change'],
  setup (props, context) {
    const { value, mySubmit } = formItemManage(props, context)

    const options = {
      options: [{
        value: 'HTML',
        label: 'HTML'
      }, {
        value: 'CSS',
        label: 'CSS'
      }, {
        value: 'JavaScript',
        label: 'JavaScript'
      }],
      value: []
    }

    return {
      value,
      mySubmit,
      options
    }
  }
})
</script>
