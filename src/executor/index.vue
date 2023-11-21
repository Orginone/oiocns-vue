<script setup lang="ts">
import { command } from '../../src/ts/base'
// import DesignExecutor from './design'
import OperateExecutor from './operate/index.vue'
import { executeCmd } from './action/index'
import {useRouter} from 'vue-router'
import {contentComponent,dynamicProps,setContent,resetContent} from './config'

const router = useRouter()



// 订阅变更,设置回调
let id = ''
onMounted(()=>{
  // 重置动态组件
  id = command.subscribe((type, cmd, ...args: any[]) => {
    if (type != 'executor')  return
    if (cmd === 'link') return router.push(args[0]);
    // 执行页面命令(executeCmd返回false则为页面命令)
    if (executeCmd(cmd, args[0]) === false) {
      // TODO:
      switch (cmd) {
        case 'open':
        case 'remark':
          return setContent(OperateExecutor, {cmd: cmd, args: args, finished: resetContent})
        case 'design':
          return console.log('来这改');
          // return setContent(
          //   <DesignExecutor cmd={cmd} entity={args[0]} finished={resetContent} />,
          // );
        default:
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