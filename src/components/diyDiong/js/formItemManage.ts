import { customRef } from 'vue'

/**
 * 自定义的ref，实现属性和内部变量的数据转换
 * @param { reactive } props 组件的属性
 * @param { object } context 组件的上下文
 * @param { number } delay 延迟刷新的时间，单位：毫秒，默认：0
 * @param { string } name 要对应的属性名称，默认：modelValue
 * @returns 自定义的ref
 */
export const debounceRef = (props:any, context:any, delay = 500, name = 'modelValue') => {
  let _value = props[name]
  /*
  if (typeof props[name] === 'string') {
    _value = props[name]
  } else if (Object.prototype.toString.call(props[name]) === '[object Array]') {
    _value = []
    _value.push(...props[name])
  }
  */
  // 计时器
  let timeout:any;
  // 是否输入状态。输入时取 value；输入完毕取 modelValue 属性
  let isInput = false
  return customRef((track, trigger) => {
    return {
      get () {
        track()
        if (isInput) {
          // console.log(isInput)
          return _value
        } else {
          // console.log(isInput)
          return props[name]
          /*
            if (typeof props[name] === 'string') {
              _value = props[name]
            } else if (Object.prototype.toString.call(props[name]) === '[object Array]') {
              _value = []
              _value.push(...props[name])
            }
            return _value
          */
        }
      },
      set (newValue) {
        isInput = true
        _value = newValue // 绑定值
        trigger() // 组件内部刷新模板
        clearTimeout(timeout) // 清掉上一次的计时
        timeout = setTimeout(() => {
          // 修改 modelValue 属性
          context.emit(`update:${name}`, newValue) // 提交给父组件
          // 用于区分是哪个组件触发的事件。
          context.emit('my-change', newValue, props.controlId, props.colName)
          isInput = false
        }, delay)
      }
    }
  })
}

/**
 * 表单子控件的管理类
 * @param {*} props 组件的属性，获取modelValue和meta属性
 * @param {*} context 上下文获取emit，提交数据
 * @returns {*} value：绑定到组件的值
 * @returns {*} mySubmit：向父组件提交的事件
 */
const formItemManage = (props:any, context:any) => {
  // 用于绑定控件的值。
  const value = debounceRef(props, context)

  // 向父组件提交事件
  const mySubmit = (val:any) => {
    // 修改 modelValue 属性
    context.emit('update:modelValue', val)
    // 提交 myChange 表单组件需要用，可以得到组件ID和字段名称，
    // 用于区分是哪个组件触发的事件。
    context.emit('my-change', val, props.controlId, props.colName)
    // 文本类需要的事件
    context.emit('input', val)
    // 选择类需要的事件
    context.emit('change', val)
  }

  const myBlur = (val:any) => {
    // 数据验证需要的事件
    context.emit('blur', val)
  }

  return {
    /**
    * 用于绑定控件的值。
    ** 添加状态可以获取默认值。
    ** 修改状态可以设置 modelValue 值
    ** 监听 modelValue 属性，给value 赋值
    */
    value,
    /**
    * 向父组件提交事件
    ** 可以直接绑定到组件的事件，
    ** 也可以套个娃。
    */
    mySubmit,
    myBlur
  }
}

export default formItemManage
