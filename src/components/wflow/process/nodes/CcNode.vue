<template>
  <node :title="config.name" :show-error="showError" :content="content" :error-info="errorInfo"
    @selected="$emit('selected')" @delNode="$emit('delNode')" @insertNode="type => $emit('insertNode', type)"
    placeholder="请设置抄送对象" header-bgc="#3296fa" header-icon="el-icon-s-promotion" />
</template>

<script lang="ts">
  import {
    ref,
    toRefs,
    reactive,
    computed,
    onMounted,
    defineComponent,
    getCurrentInstance,
    ComponentInternalInstance
  } from 'vue';
  import Node from './Node.vue'

  export default defineComponent({
    name: 'CcNode',
    components: {
      Node
    },
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    emits: [
      'selected',
      'insertNode',
      'delNode'
    ],
    setup(props, {
      emit
    }) {
      const {
        appContext
      } = getCurrentInstance() as ComponentInternalInstance;
      const proxy = appContext.config.globalProperties;
      //
      const state = reactive({
        showError: false,
        errorInfo: '',
      });
      //
      const content = computed(() => {
        if (props.config.props.shouldAdd) {
          return '由发起人指定'
        } else if (props.config.props.assignedUser.length > 0) {
          let texts: any[] = [];
          props.config.props.assignedUser.forEach((org:any) => texts.push(org.name))
          return String(texts).replaceAll(',', '、')
        } else {
          return null
        }
      });
      // 校验数据配置的合法性
      const validate = (err: any) => {
        state.showError = false
        if (props.config.props.shouldAdd) {
          state.showError = false
        } else if (props.config.props.assignedUser.length === 0) {
          state.showError = true
          state.errorInfo = '请选择需要抄送的人员'
        }
        if (state.showError) {
          err.push(`[${props.config.name}] 未设置抄送对象`)
        }
        return !state.showError
      };
      // 页面加载时
      onMounted(() => {});
      return {
        proxy,
        ...toRefs(state),
        //
        content,
        //
        validate,
      };
    },
  });
</script>

<style scoped>

</style>