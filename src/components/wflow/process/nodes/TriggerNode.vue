<template>
  <node :title="config.name" :show-error="showError" :content="content" :error-info="errorInfo"
    @selected="$emit('selected')" @delNode="$emit('delNode')" @insertNode="type => $emit('insertNode', type)"
    placeholder="请设置触发器" header-bgc="#47bc82" header-icon="el-icon-set-up" />
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
    name: 'TriggerNode',
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
        return "props.config";
      });
      // 校验数据配置的合法性
      const validate = (err: any) => {
        state.showError = false
        if (props.config.props.type === 'WEBHOOK') {
          if (proxy.$isNotEmpty(props.config.props.http.url)) {
            state.showError = false
          } else {
            state.showError = true
            state.errorInfo = '请设置WEBHOOK的URL地址'
          }
        } else if (props.config.props.type === 'EMAIL') {
          if (!proxy.$isNotEmpty(props.config.props.email.subject) || props.config.props.email.to.length === 0 ||
            !proxy.$isNotEmpty(props.config.props.email.content)) {
            state.showError = true
            state.errorInfo = '请设置邮件发送配置'
          } else {
            state.showError = false
          }
        }
        if (state.showError) {
          err.push(`${props.config.name} 触发动作未设置完善`)
        }
        return !state.showError
      }
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