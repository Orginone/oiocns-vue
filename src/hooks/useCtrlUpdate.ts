import orgCtrl from '@/ts/controller';
import { Emitter, generateUuid } from '@/ts/base/common';
import { command } from '@/ts/base';
import { Ref } from 'vue';

/**
 * 监听控制器刷新hook
 * @param ctrl 控制器
 * @returns hooks 常量
 */
const useCtrlUpdate = (ctrl: Emitter): [Ref<string>, () => void] => {
  const key = ref(generateUuid())
  // 手动刷新
  const forceUpdate = () => {
    key.value = generateUuid()
  }
  let id = ''
  onMounted(() => {
    id = ctrl.subscribe((k) => {
      key.value=k
    })
  })
  onBeforeMount(() => {
    ctrl.unsubscribe(id)
  })
  return [key, forceUpdate]
}

/**
 * 根据标识监听命令hook
 * @param flag 标识
 * @param callback? 回调
 * @returns hooks 常量
 */
export const useFlagCmdEmitter = (
  flag: string,
  callback?: Function,
): [Ref<boolean>, Ref<string>, () => void] => {
  const key= ref(generateUuid())
  const loaded = ref(orgCtrl.provider.inited)
  // 手动刷新
  const forceUpdate = () => {
    key.value=generateUuid()
  }
  let id = ''
  onMounted(() => {
    id = command.subscribeByFlag(flag, (done: boolean) => {
      forceUpdate()
      if (done === true) {loaded.value = true}
      if (callback) callback()
    })
  })
  onBeforeMount(() => {
    command.unsubscribeByFlag(id);
  })
  return [loaded, key, forceUpdate]
}

export default useCtrlUpdate