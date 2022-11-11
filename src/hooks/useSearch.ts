import { ref, onMounted, watch, reactive, watchEffect } from "vue";

interface PageOption {
  offset: number;
  limit: number;
}
/**
 * 请求列表
 * @param http 请求函数
 * @param otherParams 其他需要默认带的参数，如果调用 refresh 方法，会被同名字段覆盖 如: 初始化传 {a: 1, b: 2} refresh 传 {a: 3}, 则a会被3覆盖, b不变
 * @param initSearch 是否进入页面自动请求一次
 */
const useSearch = (
  http: Function,
  otherParams: object = {},
  initSearch: boolean = true
): {
  // 数据
  dataSource: any;
  // 刷新
  refresh: (newParam?: object) => Promise<any>;
  // 跳转页数
  changeOffset: Function;
  // 设置每页多少条
  changeLimit: Function;
  // 设置每页多少条
  changeFilter: Function;
} => {
  let dataSource = reactive<any>({ data: [] });
  let pageOption = reactive<PageOption>({
    offset: 1,
    limit: 20,
  });
  let filter = ref<string>("");
  let oldParam = {};

  /**
   * 请求列表
   * @param param 参数
   * @returns Promise
   */
  const getList = (param: object = {}) => {
    oldParam = param;
    // 参数
    const data = {
      ...pageOption,
      ...otherParams,
      filter: filter.value,
      ...oldParam,
    };
    return http({ data }).then((res: ResultType) => {
      console.log(res);
      if (res.success) {
        dataSource.data = [{ title: "模拟请求到的数据" }];
      }
      return res;
    });
  };

  // 刷新
  const refresh = async (param: object = {}) => {
    return await getList(param);
  };

  // 切换页码
  const changeOffset = (number: number) => {
    pageOption.offset = number;
  };

  // 切换每页多少数据
  const changeLimit = (number: number) => {
    pageOption.limit = number;
  };

  // 筛选字段更改
  const changeFilter = (str: string) => {
    filter.value = str;
  };

  watch(
    [() => pageOption.offset, () => pageOption.limit, () => filter.value],
    () => {
      console.log("watch");
      getList();
    }
  );

  onMounted(() => {
    if (initSearch) {
      getList();
    }
  });
  return {
    dataSource,
    refresh,
    changeOffset,
    changeLimit,
    changeFilter,
  };
};

export default useSearch;
