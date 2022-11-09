import { ref, onMounted, watch, reactive, watchEffect } from "vue";

interface PageOption {
  offset: number;
  limit: number;
}
/**
 * 请求列表
 * @param http 请求函数
 * @param otherParams 其他需要带的参数
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
  refresh: () => Promise<any>;
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

  // 获取列表
  const getList = () => {
    // 参数
    const data = {
      ...pageOption,
      ...otherParams,
      filter: filter.value,
    };
    http({ data }).then((res: ResultType) => {
      console.log(res);
      if (res.success) {
        dataSource.data = [{ title: "模拟请求到的数据" }];
      }
    });
  };

  // 刷新
  const refresh = async () => {
    return await getList();
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
