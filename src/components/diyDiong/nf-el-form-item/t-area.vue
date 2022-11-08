<!--文本域-->
<template>
  <el-input
    type="textarea"
    v-model="value"
    :id="'c' + controlId"
    :name="'c' + controlId"
    :size="size"
    :rows="rows"
    :autosize="{ minRows: 3, maxRows: rows + 3 }"
    :validate-event="validate_event"
    :show-word-limit="show_word_limit"
  >
  </el-input>
</template>

<script>
import { defineComponent } from 'vue'
// 引入表单子控件的管理类
import formItemManage from './../js/formItemManage'
// 引入组件需要的属性
import { baseFormProps, areaProps } from './../js/formItemMeta'

export default defineComponent({
  name: 'el-from-area',
  props: {
    modelValue: String,
    ...baseFormProps, // 基础属性
    ...areaProps // 多行文本的属性
  },
  emits: ['update:modelValue', 'myChange', 'clear'],
  setup (props, context) {
    // console.log('对行文本框的属性：', props)
    return {
      ...formItemManage(props, context)
    }
  }
})
</script>
