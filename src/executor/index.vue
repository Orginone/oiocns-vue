<script setup lang="ts">
import { command } from '../../src/ts/base'
import OpenExecutor from './open/index.vue'
// import DesignExecutor from './design'
import OperateExecutor from './operate/index.vue'
import { executeCmd } from './action/index'
import {useRouter} from 'vue-router'
import { useDyncamicComponent } from './dynamicComponentHooks'

const router = useRouter()
const { //preview
  component:previewComponent,
  propsObj:previewProps,
  setComponent:setPreview,
  resetComponent:resetPreview 
} = useDyncamicComponent()
const { //content
  component:contentComponent,
  propsObj:contentProps,
  setComponent:setContent,
  resetComponent:resetContent 
} = useDyncamicComponent()

const resetCtx = (ctx: boolean = true) => {
  if (ctx) {
    resetContent()
  } else {
    resetPreview()
  }
}


// 订阅变更,设置回调
let id = ''
onMounted(()=>{
  // 重置动态组件
  id = command.subscribe((type, cmd, ...args: any[]) => {
    if (type != 'executor')  return
    if (cmd === 'link') return router.push(args[0])
    // 执行页面命令(executeCmd返回false则为页面命令)
    if (executeCmd(cmd, args[0])===false) {
      console.log('cmd',cmd);
      switch (cmd) {
        case 'open':
        case 'remark':
          console.log(':args[0]',args[0]);
          if(args.length > 1 && args[1] === 'preview'){
            return setPreview(OpenExecutor,{cmd:cmd,entity:args[0],finished:()=>resetCtx(false)})
          }else{
            return setContent(OpenExecutor, {cmd:cmd,entity:args[0],finished:()=>resetCtx()})
          }
        case 'design':
          // TODO: 设计器
          return console.log('设计器来这改');
          // return setContent(
          //   <DesignExecutor cmd={cmd} entity={args[0]} finished={resetContent} />,
          // );
        default:
          return setContent(OperateExecutor, {key: cmd,cmd: cmd, args: args, finished: resetContent})
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
  <component :is="previewComponent" v-bind="previewProps"/>
  <component :is="contentComponent" v-bind="contentProps"/>
</template>