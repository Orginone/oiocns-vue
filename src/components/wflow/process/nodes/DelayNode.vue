<template>
  <node :title="config.name" :show-error="showError" :content="content" :error-info="errorInfo"
    @selected="$emit('selected')" @delNode="$emit('delNode')" @insertNode="type => $emit('insertNode', type)"
    placeholder="请设置延时时间" header-bgc="#f25643" header-icon="el-icon-time" />
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
    name: 'DelayNode',
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
        if (props.config.props.type === 'FIXED') {
          return `等待 ${props.config.props.time} ${getName(props.config.props.unit)}`
        } else if (props.config.props.type === 'AUTO') {
          return `至当天 ${props.config.props.dateTime}`
        } else {
          return null
        }
      });
      // 校验数据配置的合法性
      const validate = (err: any) => {
        state.showError = false
        try {
          if (props.config.props.type === "AUTO") {
            if ((props.config.props.dateTime || "") === "") {
              state.showError = true
              state.errorInfo = "请选择时间点"
            }
          } else {
            if (props.config.props.time <= 0) {
              state.showError = true
              state.errorInfo = "请设置延时时长"
            }
          }
        } catch (e) {
          state.showError = true
          state.errorInfo = "配置出现问题"
        }
        if (state.showError) {
          err.push(`${props.config.name} 未设置延时规则`)
        }
        return !state.showError
      };
      const getName = (unit: any) => {
        switch (unit) {
          case 'D':
            return '天';
          case 'H':
            return '小时';
          case 'M':
            return '分钟';
          default:
            return '未知';
        }
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
        getName,
      };
    },
  });
</script>

<style scoped>

</style>