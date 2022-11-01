import { customRef } from 'vue'
// 输入框 防抖获取输入值
export default function (value: string) {
  let timer: string | number | NodeJS.Timeout = null
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          value = newValue
          trigger()
        }, 1000)
      }
    }
  })
}
