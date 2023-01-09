type MenuItemType = {
  id?: string
  name: string
  icon: string
  path: string
  type?: string
  fixed?: boolean
  key?: string | unknown
  bottom?: boolean | unknown
}

type CommonParamsType = {
  offset: number
  limit: number
  filter?: string
  current?:number
  pageSize?:number
  status?: string|number
}
// 翻页props
type PaginationProps= {
  total: number;
  currentPage: number;
  current: any;
  pageSize: number;
  pageSizes: number[];
  layout: string;
}

interface ResultType<T = any> {
  code: number
  data: T
  msg: string
  success: boolean
}
