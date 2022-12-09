import { ref, reactive, Ref , toRef} from 'vue';
import { toRefs, computedAsync, resolveRef } from '@vueuse/core'
import { MaybeRef } from '@vueuse/shared';


/**
 * 异步字段，主要用于根据id查name
 * @param objRef 原对象的Ref
 * @param key 原字段
 * @param voKey 新字段
 * @param asyncGetter 异步获取方法，根据原来的值返回新的值
 */
export function useAsyncComputed<T extends {}, P extends keyof T, P1 extends string, V = string>(
    objRef: Ref<T>, 
    key: P, 
    voKey: P1,
    asyncGetter: (v: T[P]) => Promise<V>
) {
    const resultRef: Ref<T & { P1: V }> = objRef as any;

    const fieldRef: Ref<T[P]> = toRef(objRef.value, key);
    const voRef = computedAsync(
        () => {
            return asyncGetter(fieldRef.value);
        },
        fieldRef.value as any as V//使用原来的值进行初始化
    );
    (resultRef.value as any)[voKey] = voRef;
    return resultRef.value;
}
