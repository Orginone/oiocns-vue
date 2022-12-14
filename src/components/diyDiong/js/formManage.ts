  // @ts-nocheck

import { reactive, watch, unref } from 'vue'
import createModel from './modelManage'

/**
 * @function 表单控件的管理类
 * @description 创建 v-model，创建局部model，设置行列、排序相关的处理
 * @param { object } props 组件参数
 * @param { object } context 上下文
 * @returns { function } 表单管理类
 * * formModel 表单v-model
 * * 创建v-model
 * * 调整列数
 * * 合并
 */
export default function formManage (props, context) {
    console.log('props',props)
  // 定义 完整的 v-model
  const formModel = reactive({})
  // 定义局部的 model
  const formPartModel = reactive({})
  // 定义精简的 model，去掉空白和默认值相同的
  const formMiniModel = reactive({})

  // 确定一个组件占用几个格子
  const formColSpan = reactive({})
  // 定义排序依据
  const formColSort = reactive([])

  // 获取表单meta（渲染表单控件用）
  const formMeta = props.meta
  // console.log('formMeta', formMeta)
  // 获取表单自己的属性
  const formProps = formMeta.baseMeta
  // 表单子控件的属性
  const formItemProps = formMeta.itemMeta
  // 表单验证meta，备用
  // const formRuleMeta = formMeta.ruleMeta

  // 根据子控件的meta，设置默认的model
  Object.assign(formModel, createModel(formItemProps))

  // 判断是不是修改和查看状态，是的话设置要修改的model值
  // if (formProps.state !== 'add') {
  // 属性里面的model，叠加给内部的model
  // 依据model，设置属性值
  if (typeof props.modelValue !== 'undefined') {
    for (const key in formModel) {
      if (typeof unref(props.modelValue)[key] !== 'undefined') {
        formModel[key] = unref(props.modelValue)[key]
      }
    }
  }
  // Object.assign(formModel, unref(props.modelValue))
  // Object.assign(formPartModel, unref(props.partModel))
  // Object.assign(formMiniModel, unref(props.miniModel))
  // }

  // 监听属性变化，同步内部model
  watch(() => props.modelValue, (v1, v2) => {
    Object.assign(formModel, unref(props.modelValue))
  })
  watch(() => props.partModel, (v1, v2) => {
    if (typeof props.partModel !== 'undefined') {
      Object.assign(formPartModel, unref(props.partModel))
    }
  })
  watch(() => props.miniModel, (v1, v2) => {
    if (typeof props.miniModel !== 'undefined') {
      Object.assign(formMiniModel, unref(props.miniModel))
    }
  })

  // 设置部分model和精简model
  const setPartModel = (controlId, colName) => {
    // 同步到部分model
    if (typeof formPartModel[colName] !== 'undefined') {
      formPartModel[colName] = formModel[colName]
      // 设置精简版
      if (formModel[colName] === formItemProps[controlId].defaultValue ||
        formModel[colName] === 0 ||
        formModel[colName] === '' ||
        formModel[colName] === null) {
        delete formMiniModel[colName]
      } else {
        formMiniModel[colName] = formModel[colName]
      }
    }
  }

  // 提交部分model和精简model
  const submitPratModel = () => {
    // 先删除属性
    // for (const key in props.partModel) {
    // delete props.partModel[key]
    // }
    // for (const key in props.miniModel) {
    // delete props.miniModel[key]
    // }
    // 提交部分model
    if (typeof props.partModel !== 'undefined') {
      Object.assign(props.partModel, formPartModel)
    }
    // 提交精简的model，formMiniModel
    if (typeof props.miniModel !== 'undefined') {
      Object.assign(props.miniModel, formMiniModel)
    }
  }

  // 向父组件提交 model
  const mySubmit = (val, controlId, colName) => {
    // 手动设置
    // 提交完整的
    // context.emit('update:modelValue', formModel)
    console.log(props,formModel)
    if(!props.modelValue){
        props.modelValue = {}
    }
    Object.assign(props.modelValue, formModel)

    setPartModel(controlId, colName)
    submitPratModel()
    // 触发父组件的事件
    context.emit('mychange', val, controlId, colName, formModel, formPartModel)
  }

  // 依据用户选项，创建对应的 model
  const createPartModel = (array) => {
    // 先删除属性
    for (const key in formPartModel) {
      delete formPartModel[key]
    }
    for (const key in formMiniModel) {
      delete formMiniModel[key]
    }
    // 建立新属性
    for (let i = 0; i < array.length; i++) {
      const colName = formItemProps[array[i]].colName
      formPartModel[colName] = formModel[colName]
    }
    for (let i = 0; i < array.length; i++) {
      const colName = formItemProps[array[i]].colName
      const value = formModel[colName]
      const defaultValue = formItemProps[array[i]].defaultValue
      // 值不为空，不和默认值相同，才赋值
      if (value === '') {
      } else if (typeof defaultValue !== 'undefined' && value === defaultValue) {
      } else {
        formMiniModel[colName] = value
      }
    }

    // 提交精简的model，formMiniModel
    // 提交部分model
    submitPratModel()
  }

  // 根据配置里面的colCount，设置 formColSpan
  const setFormColSpan = () => {
    const formColCount = formProps.formColCount // 列数
    const moreColSpan = 24 / formColCount // 一个格子占多少份

    if (formColCount === 1) {
    // 一列的情况
      for (const key in formItemProps) {
        const m = formItemProps[key]
        if (typeof m.colCount === 'undefined') {
          formColSpan[m.controlId] = moreColSpan
        } else {
          if (m.colCount >= 1) {
            // 单列，多占的也只有24格
            formColSpan[m.controlId] = moreColSpan
          } else if (m.colCount < 0) {
            // 挤一挤的情况， 24 除以 占的份数
            formColSpan[m.controlId] = moreColSpan / (0 - m.colCount)
          }
        }
      }
    } else {
      // 多列的情况
      for (const key in formItemProps) {
        const m = formItemProps[key]
        if (typeof m.colCount === 'undefined') {
          formColSpan[m.controlId] = moreColSpan
        } else {
          if (m.colCount < 0 || m.colCount === 1) {
            // 多列，挤一挤的占一份
            formColSpan[m.controlId] = moreColSpan
          } else if (m.colCount > 1) {
            // 多列，占的格子数 * 份数
            formColSpan[m.controlId] = moreColSpan * m.colCount
          }
        }
      }
    }
  }
  // 先运行一次
  setFormColSpan()

  // 设置组件的显示顺序
  const setFormColSort = (array = formProps.colOrder) => {//colOrder有时按照order顺序，否则按照先后顺序显示
    console.log('formItemProps',formItemProps)
    if(array){  
        formColSort.length = 0
        formColSort.push(...array)
    }else{
        for (const key in formItemProps) {
            if (Object.hasOwnProperty.call(formItemProps, key)) {
                console.log('key',key);
                formColSort.push(key)
            }
        }
    }
   
  }
  // 先运行一下
  setFormColSort()

  // 监听组件值的变化，调整组件的显示以及显示顺序
  if (typeof formMeta.formColShow !== 'undefined') {
    for (const key in formMeta.formColShow) {
      const ctl = formMeta.formColShow[key]
      const colName = formItemProps[key].colName
      watch(() => formModel[colName], (v1, v2) => {
        if (typeof ctl[v1] === 'undefined') {
          // 没有设定，显示默认组件
          setFormColSort()
        } else {
          // 按照设定显示组件
          setFormColSort(ctl[v1])
          // 设置部分的 model
          createPartModel(ctl[v1])
        }
      })
    }
  }

  return {
    // 对象
    formModel, // 完整的 v-model
    formPartModel, // 用户选择的组件的 model
    formMiniModel, // 局部的基础上去掉空白和默认值相同的
    formColSpan, // 确定组件占位
    formColSort, // 确定组件排序
    // 函数
    setFormColSpan, // 设置组件占位
    setFormColSort, // 设置组件排序
    mySubmit // 提交
  }
}
