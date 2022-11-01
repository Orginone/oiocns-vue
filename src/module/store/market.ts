import API from '@/services'
import { ElMessage, ElMessageBox } from 'element-plus'
// public 是默认可见性，所以，'可以直接省略'
// protected: 表示'受保护的',仅对其声明所在类和子类中 (非实例对象) 可见
// private: 表示'私有的,只在当前类中可见'，对实例对象以及子类也是不可见的
// readonly： 表示'只读',用来防止在构造函数之外对属性进行赋值
// static 静态数据

interface MarketServicesType {
  //----------------------我的应用 ---------
  //----------------------市场功能 ---------
  //创建市场
  //获取市场列表
  getMarketList: () => void
  //编辑市场信息
  //删除市场
  deleteMarket: () => void
  // 退出市场
  quitMarket: () => void
  //获取共享市场信息
  // 获取市场展示应用--筛选
}

class MarketServices {
  public marketList: MarketType[] //商店列表
  public marketTotal: number //商店列表 总数
  public QueryParams: CommonParamsType //记录历史请求参数
  public PUBLIC_STORE: ProductType //共享仓库信息

  /**
   * @desc: 获取市场列表
   * @param {number} params.offset 起始位置
   * @param {number} params.limit  数量限制
   * @param {string} params.filter 过滤关键字
   * @return {*}
   */
  public async getMarketList(params: CommonParamsType) {
    const { data, success } = await API.market.searchOwn({
      data: params
    })
    if (success) {
      const { result = [], total = 0 } = data
      this.marketList = result
      this.marketTotal = total
      //记录搜索条件
      this.QueryParams = params
    }
  }

  /**
   * @desc: 创建市场
   * @param {string} params.name 商店名称
   * @param {string} params.code  商店编码
   * @param {string} params.samrId
   * @param {string} params.authId   空间为组织单位时取组织单位 的authId
   * @param {string} params.remark 备注
   * @param {boolean} params.public 是否公开
   * @return {*}
   */
  public async creatMarket(params: {
    name: string
    code: string
    samrId: string
    authId: string
    remark: string
    public: boolean
  }) {
    const { success } = await API.appstore.create({
      data: params
    })
    if (success) {
      await this.getMarketList(this.QueryParams)
    }
  }

  /**
   * @desc: 更新商店信息
   * @param {string} params.id        商店id
   * @param {string} params.name      商店名称
   * @param {string} params.code      商店编码
   * @param {string} params.samrId    空间为组织单位时取组织单位 的authId
   * @param {string} params.remark    备注
   * @param {boolean} params.public   是否公开
   * @return {*}
   */
  public async updateMarket(params: {
    id: string
    name: string
    code: string
    samrId: string
    authId: string
    remark: string
    public: boolean
  }) {
    const { success } = await API.appstore.updateMarket({
      data: params
    })
    if (success) {
      await this.getMarketList(this.QueryParams)
    }
  }
  /**
   * @desc: 删除 管理的市场
   * @param {string} id 市场id
   * @return {*}
   */

  public async deleteMarket(id: string) {
    const { success } = await API.appstore.marketDel({
      data: { id }
    })
    if (success) {
      await this.getMarketList(this.QueryParams)
    }
  }
  /**
   * @desc: 退出市场
   * @param {string} id 市场Id
   * @return {*}
   */
  public async quitMarket(id: string | number) {
    const { success } = await API.appstore.marketQuit({
      data: { id }
    })
    if (success) {
      await this.getMarketList(this.QueryParams)
    }
  }

  /**
   * @desc: 获取共享仓库详情
   * @event:{}
   * @return {*}
   */
  public async getPublicStore() {
    const { success, data } = await API.market.getSoftShareInfo()
    if (success) {
      const { id } = data
      this.PUBLIC_STORE = data
    }
  }
}
const marketServices = new MarketServices()
export default marketServices
