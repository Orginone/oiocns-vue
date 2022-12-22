<!--单行文本-->
<template>
  <el-input
    v-model="value"
    @clear="mySubmit"
    :id="'c' + controlId"
    :name="'c' + controlId"
    :size="size"
    :validate-event="validate_event"
    :show-word-limit="show_word_limit"
    :clearable="clearable"
    :resize="resize"
  >
  </el-input>
</template>

<script>
import { defineComponent } from 'vue'
// 引入表单子控件的管理类
import formItemManage from './../js/formItemManage'
// 引入组件需要的属性
import { baseFormProps, textProps } from './../js/formItemMeta'

export default defineComponent({
  name: 'el-form-text',
  props: {
    modelValue: [String, Array, Object, Number],
    ...baseFormProps, // 基础属性
    ...textProps // 单行文本的属性
  },
  emits: ['update:modelValue', 'myChange', 'input', 'change'],
  setup (props, context) {
    // console.log('props-text', props)
    // console.log('props-ctx', context)

    return {
      ...formItemManage(props, context)
    }
  }
})
</script>
