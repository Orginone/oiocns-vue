<!--多选组-->
<template>
  <el-checkbox-group
    v-model="value"
    @change="mySubmit"
    :id="'c' + controlId"
    :name="'c' + controlId"
    :size="size"
  >
    <el-checkbox
      v-for="item in optionList"
      :key="'check' + controlId + item.value"
      :label="item.value">
        {{item.label}}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script>
import { defineComponent } from 'vue'
// 引入表单子控件的管理类
import formItemManage from './../js/formItemManage'
// 引入组件需要的属性
import { baseFormProps } from './../js/formItemMeta'

export default defineComponent({
  name: 'el-from-checkboxs',
  props: {
    modelValue: [String, Number, Array],
    ...baseFormProps // 基础属性
  },
  emits: ['update:modelValue', 'myChange', 'change', 'input'],
  setup (props, context) {
    return {
      ...formItemManage(props, context)
    }
  }
})
</script>
