<script setup lang="ts">
import { command } from '../../src/ts/base';
// import OpenExecutor from './open';
// import DesignExecutor from './design';
import OperateExecutor from './operate/index.vue';
import { executeCmd } from './action';
// import { useHistory } from 'react-router-dom';
import {useRouter} from 'vue-router'
import { finished } from 'stream';

const router = useRouter()

// TODO:感觉可以抽离成hooks
// 动态组件
const contentComponent = ref(null);
// 动态props
const dynamicProps = ref({})
// 设置组件与参数
const setContent = (component: any,props: object) => {
  contentComponent.value = component;
  dynamicProps.value = props
}
// 重置动态组件
const resetContent = () => {
  contentComponent.value = null;
  dynamicProps.value={}
}

// 订阅变更,设置回调
let id = ''
onMounted(()=>{
  id = command.subscribe((type, cmd, ...args: any[]) => {
    console.log(type, cmd, '12345');
    if (type != 'executor') return;
    if (cmd === 'link') return router.push(args[0]);
    // 执行页面命令(executeCmd返回false则为页面命令)
    if (executeCmd(cmd, args[0]) === false) {
      // TODO:
      switch (cmd) {
        case 'open':
        case 'remark':
          return console.log('来这改');
          // return setContent(
          //   <OpenExecutor cmd={cmd} entity={args[0]} finished={resetContent} />,
          // );
        case 'design':
          return console.log('来这改');
          // return setContent(
          //   <DesignExecutor cmd={cmd} entity={args[0]} finished={resetContent} />,
          // );
        default:
          console.log(cmd,'cmd');
          return setContent(OperateExecutor, {cmd: cmd, args: args, finished: resetContent})
      }
    }
  })
})

// 取消订阅
onBeforeUnmount(()=>{
  command.unsubscribe(id);
})
</script>

<template>
  <component :is="contentComponent" v-bind="dynamicProps"/>
</template>