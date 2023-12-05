import { Component } from "vue"

export const useDyncamicComponent = () => {
  // 动态组件
  const component = ref<Component>(null);
  // 动态props
  const propsObj = ref<object>({})
  // 设置组件名与参数
  const setComponent = (com: any,props: object) => {
    component.value = com;
    propsObj.value = props
  }
  // 重置动态组件
  const resetComponent = () => {
    component.value = null;
    propsObj.value={}
  }
  return {
    component,
    propsObj,
    setComponent,
    resetComponent
  }
}