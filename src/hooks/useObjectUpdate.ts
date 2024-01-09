import { ref, watch } from 'vue';
import { generateUuid } from '@/ts/base/common';

/**
 * 监听控制器刷新hook
 * @param data 控制器
 * @returns hooks 常量
 */
const useObjectUpdate = (data:any) => {
  const key = ref(generateUuid());

  // 手动刷新
  const forceUpdate = () => {
    key.value = generateUuid();
  };

  watch(() => data, forceUpdate);

  return [key.value, forceUpdate];
};

export default useObjectUpdate;
