<template>
  <node :show="false" @insertNode="type => $emit('insertNode', type)" />
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
    name: 'EmptyNode',
    components: {
      Node
    },
    emits: [
      'insertNode',
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

      // 页面加载时
      onMounted(() => {});
      return {
        proxy,
        ...toRefs(state),
        //
      };
    },
  });
</script>

<style scoped>

</style>