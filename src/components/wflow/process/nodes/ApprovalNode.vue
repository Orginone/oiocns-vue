<template>
  <node :title="config.name" :show-error="showError" :content="content" :error-info="errorInfo"
    @selected="$emit('selected')" @delNode="$emit('delNode')" @insertNode="type => $emit('insertNode', type)"
    placeholder="请设置审批对象" header-bgc="#ff943e" header-icon="el-icon-s-check" />
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
    name: 'ApprovalNode',
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
        } else if (props.config && !!props.config.props && !!props.config.props.assignedUser && props.config
          .props.assignedUser.length > 0) {
          let texts: any[] = [];
          props.config.props.assignedUser.forEach((org: any) => texts.push(org.name))
          return String(texts).replaceAll(',', '、')
        } else {
          return null
        }
      });
      //
      const getFormItemById = (id: String) => {
        return proxy.$pinia.state.value.appwfConfig.design.formItems.find((item: any) => item.id === id)
      };
      // 校验数据配置的合法性
      const validate = (err: any) => {
        
        try {
          switch(props.config.props.assignedType){
            case 'JOB':
            case 'USER':
              return state.showError =validate_ASSIGN_USER(err)
          }
          // return state.showError = ![`validate_${props.config.props.assignedType}`](err)
          return true
        } catch (e) {
          return true;
        }
      };
      const validate_ASSIGN_USER = (err: any) => {
        if (props.config.props.assignedUser.length > 0) {
          return false;
        } else {
          state.errorInfo = '请指定审批对象'
          err.push(`[${props.config.name}] 未指定审批对象`)
          return true
        }
      };
      const validate_SELF_SELECT = (err: any) => {
        return true;
      };
      const validate_LEADER_TOP = (err: any) => {
        return true;
      };
      const validate_LEADER = (err: any) => {
        return true;
      };
      const validate_ROLE = (err: any) => {
        if (props.config.props.role.length <= 0) {
          state.errorInfo = '请指定负责审批的系统角色'
          err.push(`${props.config.name} 未指定审批角色`)
          return false
        }
        return true;
      };
      const validate_SELF = (err: any) => {
        return true;
      };
      const validate_FORM_USER = (err: any) => {
        if (props.config.props.formUser === '') {
          state.errorInfo = '请指定表单中的人员组件'
          err.push(`${props.config.name} 审批对象为表单中人员，但未指定`)
          return false
        }
        return true;
      };
      const validate_REFUSE = (err: any) => {
        return true;
      };
      // 页面加载时
      onMounted(() => {});
      return {
        proxy,
        ...toRefs(state),
        //
        content,
        //
        getFormItemById,
        validate,
        validate_ASSIGN_USER,
        validate_SELF_SELECT,
        validate_LEADER_TOP,
        validate_LEADER,
        validate_ROLE,
        validate_SELF,
        validate_FORM_USER,
        validate_REFUSE,
      };
    },
  });
</script>

<style scoped>

</style>