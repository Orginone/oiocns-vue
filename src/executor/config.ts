// 动态组件
export const contentComponent = ref(null);
// 动态props
export const dynamicProps = ref({})
// 设置组件与参数
export const setContent = (component: any,props: object) => {
  contentComponent.value = component;
  dynamicProps.value = props
}
// 重置动态组件
export const resetContent = () => {
  contentComponent.value = null;
  dynamicProps.value={}
}