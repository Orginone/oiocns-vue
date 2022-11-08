import { ref, watch } from 'vue'

/**
 * 查询控件的子控件的管理函数
 * @param { object } props 组件属性
 * @param { object } context 组件上下文
 * @returns 查询方式和事件
 */
export default function findItemManage (props:any, context:any) {
  // 用户选择的查询方式
  const findChoiceKind = ref(401)

  // 用户的查询关键字
  const findText = ref()

  // 用户的查询关键字，范围查询，开始到截止
  const findRange = ref([])

  // 获取父组件设置的属性
  const arrModelValue = props.modelValue
  findChoiceKind.value = arrModelValue[0]
  findText.value = arrModelValue[1]

  // 监听 modelValue 属性，给 value 赋值
  watch(() => props.modelValue, (v1, v2) => {
    // console.log('controlManage监听属性变化', v1)
    findChoiceKind.value = v1[0]
    findText.value = v1[1]
    findRange.value = v1[1]
  })

  // 向父组件提交事件
  const mySubmit = (val:any) => {
    const query = []
    query.push(findChoiceKind.value) // 查询方式
    query.push(val) // 查询关键字
    console.log(query)
    // 修改 modelValue 属性
    context.emit('update:modelValue', query)
    // 提交 myChange 表单组件需要用，可以得到组件ID和字段名称，
    // 用于区分是哪个组件触发的事件。
    context.emit('myChange', query, props.controlId, props.colName)
    // 文本类需要的事件
    context.emit('input', val)
    // 选择类需要的事件
    context.emit('change', val)
  }

  return {
    findChoiceKind, // 选择的查询方式
    findText, // 一个关键字查询
    findRange, // 范围查询
    mySubmit
  }
}
