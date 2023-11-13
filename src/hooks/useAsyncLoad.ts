import { Ref } from "vue";


export default function useAsyncLoad<T>(callback: () => Promise<T>): [Ref<boolean>, Ref<T> | undefined] {
  const loaded = ref(false)
  const result=ref<T>()
  onMounted(() => {
    setTimeout(async () => {
      const data = await callback();
      if (data) {
        result.value = data
      }
      loaded.value = true
    }, 20);
  })
  return [loaded, result];
}