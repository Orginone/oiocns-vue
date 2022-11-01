import API from '@/services'
// public 是默认可见性，所以，'可以直接省略'
// protected: 表示'受保护的',仅对其声明所在类和子类中 (非实例对象) 可见
// private: 表示'私有的,只在当前类中可见'，对实例对象以及子类也是不可见的
//  readonly： 表示'只读',用来防止在构造函数之外对属性进行赋值

interface MarketServicesType {
  //----------------------我的应用 ---------
  myAppList: ProductType[]
  //----------------------市场功能 ---------
  //创建市场
  //获取市场列表
  //编辑市场信息
  //删除市场
  //获取共享市场信息
  // 获取市场展示应用--筛选
  // ----------------------应用功能 ---------
  //获取我的应用列表
  //注册应用
  //上架应用
  //下架应用
  //编辑应用信息
  //应用分享
  //应用分发
  //应用详情
  // 应用分发详情
  // 应用分享详情
  // 应用上架详情
  // ----------------------应用购物车功能 ---------
  // 加购应用
  // 取消加购
  // 获取当前购物车数量
  // 购买应用
  // 采购订单
  // 出售订单
  // 取消订单
  // 确认订单
}

class MarketServices {
  //--------------我的应用主页功能区域---------------------------
  //展示列表 我的应用列表
  public myAppList: ProductType[]
  public myAppListTotal: number
  public myAppQueryParams: CommonParamsType
  public shopcarCount: number
  static tableHead: [
    {
      type: 'slot'
      prop: 'name'
      name: 'name'
      label: '应用名称'
    },
    {
      type: 'slot'
      prop: 'tag'
      name: 'tag'
      label: '应用状态'
    },
    {
      prop: 'code'
      label: '应用编码'
    },
    {
      prop: 'source'
      label: '应用来源'
    },
    {
      prop: 'typeName'
      label: '应用类型'
    },
    {
      prop: 'authority'
      label: '持有权限'
    },
    {
      prop: 'createTime'
      label: '创建时间'
      width: '200'
    },
    {
      type: 'slot'
      label: '操作'
      fixed: 'right'
      align: 'center'
      width: '300'
      name: 'operate'
    }
  ]
  // --------------市场功能区域---------------------------
  //展示列表 市场列表
  public marketList: MarketType[]
  //--------------应用功能区域---------------------------
  //展示列表 应用列表
  public productList: ProductType[]

  // constructor() {
  // }
  // -----------------我的应用主页功能----------------------
  // 获取我的应用列表
  public getMyAppList = async (params: CommonParamsType) => {
    const { data, success } = await API.product.searchOwnProduct({
      data: params
    })
    if (success) {
      const { result = [], total = 0 } = data
      this.myAppList = result
      this.myAppListTotal = total
      // 记录搜索条件
      this.myAppQueryParams = params
    }
  }
  // 删除我的应用
  public deleteMyAppItem = async (id: string | number) => {
    const { success } = await API.product.delete({
      data: { id }
    })
    if (success) {
      // 删除后刷新获取展示列表
      this.getMyAppList(this.myAppQueryParams)
    }
  }

  // -------------------购物车-------------------------------
  public getShopCarCount = async () => {
    const { success, data } = await API.market.searchStaging({
      data: {
        id: 0, //市场id （需删除）
        offset: 0,
        limit: 2,
        filter: ''
      }
    })
    if (success) {
      let { result = [], total = 0 } = data
      this.shopcarCount = total
    }
  }
}
const marketServices: MarketServicesType = new MarketServices()
export default marketServices
