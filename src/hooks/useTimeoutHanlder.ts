/** 超时响应句柄,防止频繁提交 */
const useTimeoutHanlder = (): [
  (hanlder: Function, timeout: number) => void,
  () => void,
] => {
  // 句柄
  const timeoutHanlder = ref<ReturnType<typeof setTimeout>>();
  // 提交句柄
  const submitHanlder = (hanlder: Function, timeout: number) => {
    if (timeout === 0) {
      hanlder();
    } else {
      clearHanlder();
      timeoutHanlder.value = setTimeout(() => {
        clearHanlder();
        hanlder();
      }, timeout);
    }
  };
  // 清理句柄
  const clearHanlder = () => {
    if (timeoutHanlder.value) {
      clearTimeout(timeoutHanlder.value);
      timeoutHanlder.value = undefined;
    }
  };
  return [submitHanlder, clearHanlder];
};

export default useTimeoutHanlder;
