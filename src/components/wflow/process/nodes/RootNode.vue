<template>
  <node title="发起人" :is-root="true" :content="content" @selected="$emit('selected')"
    @insertNode="type => $emit('insertNode', type)" placeholder="所有人" header-bgc="#576a95"
    header-icon="el-icon-user-solid" />
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
    name: 'RootNode',
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
      'insertNode'
    ],
    setup(props, {
      emit
    }) {
      const {
        appContext
      } = getCurrentInstance() as ComponentInternalInstance;
      const proxy = appContext.config.globalProperties;
      //
      const state = reactive({});
      //
      const content = computed(() => {
        if (props.config.props &&  props.config.props.assignedUser && props.config.props.assignedUser.length > 0) {
          let texts: [] = [];
          // props.config.props.assignedUser.forEach(org => texts.push(org.name))
          return String(texts).replaceAll(',', '、');
        } else {
          return '所有人';
        }
      });
      // 页面加载时
      onMounted(() => {});
      return {
        proxy,
        ...toRefs(state),
        //
        content,
      };
    },
  });
</script>

<style scoped>

</style>