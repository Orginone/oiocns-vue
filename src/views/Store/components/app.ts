import authority from '@/utils/authority'
import API from '@/services'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import {appCtrl} from '@/ts/coreIndex'

const store = useUserStore()
type TreeData = {
  children: any[]
  data: any
  disabled: boolean
  hasNodes: boolean
  id: string
  label: string
  type: string
}
type PageStore = {
  [x: string]: any
  currentPage: number
  tableData?: any[]
  pageSize: number
  total?: number
}
/*
 *应用相关业务
 */
class appStore {
  /**
   * @desc 获取应用中心中我的应用
   * @param pageStore 分页参数
   * @param searchText 查询条件
   */
  public  getProductList(pageStore: PageStore, searchText: string,callback:any) {
     API.product['searchOwnProduct']({
      data: {
        offset: pageStore.currentPage,
        limit: pageStore.pageSize,
        filter: searchText
      }
    }).then((res:any)=>{
      callback(res.data)
    })
  }
  /**
   * @desc 删除应用
   * @param id 所选应用id
   * @return 返回是否成功
   */
  public async deleteApp(id: string) {
    const { success } = await API.product.delete({
      data: { id: id }
    })
    return success
  }
  /**
   * @desc 获取购物车数量
   * @return 返回购物车数量
   */
  public async getShopcarNum() {
    const { total = 0, success } = await API.market.searchStaging({
      data: {
        offset: 0,
        limit: 20,
        filter: ''
      }
    })
    if (!success) {
      return 0
    }
    return total
  }
  /**
   * @desc  删除资源信息
   * @param selectId 资源id
   */
  public async deleteResource(selectId: string) {
    const { success } = await API.product.deleteResource({ data: { id: selectId } })
    return success
  }

  /**
   * @desc  处理资源移动
   * @param resources 资源信息
   */
  public handleSortMenu(resources: any, type: ProductMenuEventType, aimId: string) {
    const data = resources
    // 根据当前所选标志 获取目标数据信息
    const obj = data.find((item: any) => item.customId === aimId)

    const idArr = data.map((item: AppResourcesType) => item.customId)
    const index = idArr.indexOf(aimId)
    const endIndex = data.length - 1
    const willChageIndex = type === 'Up' ? index - 1 : index + 1
    // 若最后一个选择向下排序/第一个向上,则终止
    if ((type === 'Down' && willChageIndex > endIndex) || (type === 'Up' && index === 0)) {
      return
    }
    // 若最后一个选择向下排序,则终止
    if (index > -1) {
      const willChangeObj = data[willChageIndex]
      data[index] = willChangeObj
      data[willChageIndex] = obj
    }
  }

  /**
   * @desc  注册应用
   * @param params 填写的应用信息
   * @return 返回接口调用结果
   */
  public async onRegister(params: any) {
    console.log(params)

    const { success } = await API.product.register({
      data: params
    })
    return success
  }

  /**
   * @desc 获取应用信息
   * @param appId 应用id
   */
  public async queryInfo(appId: string) {
    const { data, success } = await API.product.queryInfo({
      data: {
        id: appId
      }
    })
    if (!success) {
      return {}
    }
    return data
  }

  /**
   *@desc 获取应用资源
   * @param appid 应用id
   * @return 返回应用资源
   */
  public getResource(appid: string,callback:any) {
     API.product.searchResource({
      data: {
        id: appid,
        offset: 0,
        limit: 1000,
        filter: ''
      }
    }).then((res)=>{
      callback(res.data)
    })
    
  }

  /**
   * @desc 修改应用信息
   * @param params 应用信息
   */
  public async updateProduct(params: any) {
    const { success } = await API.product.update({
      data: params
    })
    if (success) {
      ElMessage({
        type: 'success',
        message: '修改成功'
      })
    }
  }
  /**
   *@desc 应用上架
   *@param  formLabelAlign 表单填写数据
   */
  public async publishProduct(formLabelAlign: any) {
    const { success } = await API.product.publish({
      data: formLabelAlign
    })
    if (success) {
      // getPageList()
      ElMessage({
        type: 'success',
        message: '已提交上架申请'
      })
    }
  }

  /**
   * @desc 获取应用上架列表
   * @param id 应用id
   * @param page 分页参数
   * @return 列表数据以及总数
   */
  public async searchMerchandiseSellList(id: string, page: PageStore) {
    const { data, success } = await API.order.searchMerchandiseSellList({
      data: {
        id: id,
        offset: (page.currentPage - 1) * page.pageSize,
        limit: page.pageSize,
        filter: ''
      }
    })
    if (!success) {
      return
    }
    const { result = [], total = 0 } = data
    let obj = {
      result,
      total
    }
    return obj
  }
  /**
   * @desc 应用下架
   * @param id 应用id
   * @return 接口请求成功
   */
  public async unpublishApp(id: string) {
    const { success } = await API.product.unpublishMerchandise({
      data: {
        id: id
      }
    })
    if (!success) {
      return
    }
    ElMessage({
      message: '下架成功',
      type: 'success'
    })
    return success
  }

  /**
   * @desc 查询上架申请
   * @param id 应用id
   * @param page 分页参数
   * @return 接口请求成功
   */
  public async searchPublishList(id: string, page: PageStore) {
    const { data, success } = await API.product.searchPublishList({
      data: {
        id: id,
        offset: (page.currentPage - 1) * page.pageSize,
        limit: page.pageSize,
        filter: ''
      }
    })
    if (!success) {
      return
    }
    const { result = [], total = 0 } = data
    let obj = {
      result,
      total
    }
    return obj
  }

  /**
   * @desc 加入购物车
   * @param id 应用id
   * @return 接口请求成功
   */
  public async staging(id: string) {
    const { success } = await API.appstore.staging({
      data: {
        id: id
      }
    })
    if (!success) {
      return
    }
    ElMessage({
      message: '添加成功',
      type: 'success'
    })
  }

  /**
   * @desc 获取共享仓库应用列表
   * @param id 应用id
   * @param page 分页参数
   * @param search 查询参数
   * @return 返回列表信息和总值
   */
  public async merchandise(id: string, page: PageStore, search?: string) {
    const { success, data } = await API.appstore.merchandise({
      data: {
        id: id,
        offset:page.currentPage,
        limit: page.pageSize,
        filter: search
      }
    })
    if (!success) {
      return
    }
    const { result = [], total = 0 } = data
    let obj = {
      result,
      total
    }
    return obj
  }

  /**
   * @desc 获取共享仓库信息
   * @return 返回仓库信息
   */
  public async getMarketInfo() {
    const { data, success } = await API.market.getSoftShareInfo({})
    if (!success) {
      return
    }
    return data.result[0]
  }

  /**
   * @desc 获取我的应用
   * @return 返回我的应用列表
   */
  public  searchUsefulProduct(callback:any) {
    API.product.searchUsefulProduct({
      data: {
        offset: 0,
        limit: 10,
        filter: ''
      }
    }).then((res)=>{
      callback(res)
    })
   
  }

  /**
   * @desc /查询组织/个人拥有的资源列表
   * @id  点击的应用id
   * @return 返回资源列表
   */
  public async queryOwnResource(id: number) {
    const { data, success } = await API.product.queryOwnResource({
      data: {
        id: id,
        offset: 0,
        limit: 10,
        filter: ''
      }
    })
    if (!success) {
      return
    }
    return data
  }
}

/*
 *分发分享业务逻辑
 */
export class Application {
  /*
   *分发分享变量定义
   */
  private appInfo: string
  private opertion: number
  private rootTreeId: string
  private parentIdMap: any = {}
  public cascaderTree: any
  public tabs: any

  constructor(appInfo?: string, opertion?: number) {
    this.appInfo = appInfo
    this.opertion = opertion
    console.log('thus',this)
  }
  /**
   * @desc 获取群的树形信息
   * @return 返回群的树形信息
   */
  public async getJoinedCohorts() {
    const { data, success } = await API.cohort.getJoinedCohorts({
      data: { offset: 0, limit: 10000, filter: '' }
    })
    if (!success) {
      return []
    }
    const { result = [], total = 0 } = data
    this.cascaderTree = result
    let obj: any = {
      id: authority.getUserId(),
      name: '我的好友',
      label: '我的好友',
      parentId: '0',
      belongId: authority.getUserId()
    }
    obj.data = obj
    this.cascaderTree.forEach((el: any) => {
      el.label = el.team.name
      el.data = el
      el.disabled = !authority.IsApplicationAdmin([el.id, el.belongId])
    })
    this.cascaderTree.unshift(obj)
    return this.cascaderTree
  }
  /**
   *@desc 获取集团树形
   * @param resource 当前选择的资源id
   * @return 返回集团树形
   */
  public async getGroupTree(resource: string) {
    const res = await API.company.getGroupTree({
      data: { id: resource }
    })
    if (!res.success) {
      return
    }
    res.data = this.isGroupAuthAdmin(res.data)
    return res.data
  }

  private isGroupAuthAdmin(node: any) {
    node.disabled = !authority.IsApplicationAdmin([node.data.id, node.data.belongId])
    if (node.children) {
      for (const children of node.children) {
        this.isGroupAuthAdmin(children)
      }
    }
    //判断是否有操作权限
    return node
  }

  /**
   *@desc 获取tab数据
   * @return 返回资源或集团的数据
   */
  public async searchResource() {
    if (this.opertion == 1) {
      const { data, success } = await API.product.searchResource({
        data: {
          id: this.appInfo,
          offset: 0,
          limit: 1000,
          filter: ''
        }
      })
      if (!success) {
        return
      }
      const { result = [], total = 0 } = data
      this.tabs = result
      this.tabs.forEach((el: any) => {
        el.customId = el.id
      })
      return this.tabs
    } else {
      const { data, success } = await API.company.companyGetGroups({
        data: {
          offset: 0,
          limit: 1000
        }
      })
      if (!success) {
        return []
      }
      const { result = [], total = 0 } = data
      this.tabs = result
      return this.tabs
    }
  }

  /**
   *@desc 获取左侧树形
   */
  public async getCompanyTree() {
    const res = await API.company.getCompanyTree({})
    if (!res.success) {
      return
    }
    this.rootTreeId = res.data.data.id
    let orgTree = []
    orgTree.push(res.data)
    this.initIdMap(orgTree)
    this.cascaderTree = this.isAuthAdmin(this.filter(orgTree))
    return this.cascaderTree
  }
  /*
   * 初始化ID和对象映射关系
   */
  private initIdMap = (nodes: any[]) => {
    for (const node of nodes) {
      this.parentIdMap[node.id] = node
      if (node.children) {
        this.initIdMap(node.children)
      }
    }
  }
  /**
   * 树形权限判断
   * @param nodes 过滤出的树形数据
   */
  private isAuthAdmin = (nodes: any) => {
    //判断是否有操作权限
    for (const node of nodes) {
      node.disabled = !authority.IsApplicationAdmin([node.data.id, node.data.belongId])
      if (node.children) {
        this.isAuthAdmin(node.children)
      }
    }
    return nodes
  }
  /*
   * 过滤掉工作组作为表单级联数据
   */
  private filter = (nodes: OrgTreeModel[]): OrgTreeModel[] => {
    if (this.opertion == 1) {
      nodes = nodes.filter((node) => node.data?.typeName !== '工作组')
    } else {
      nodes = nodes.filter(
        (node) => node.data?.typeName !== '工作组' && node.data?.authAdmin === true
      )
    }
    for (const node of nodes) {
      node.children = this.filter(node.children)
    }
    return nodes
  }

  /**
   *@desc 获取历史记录
   *@param radio 当前选中的radio
   *@param resource 当前选中的资源id
   *@param treeData 当前选中的左侧树数据
   *@return 获取历史记录
   */
  public async getHistoryData(radio: string, resource?: string, treeData?: TreeData) {
    let teamId =
      radio == '1'
        ? this.opertion == 1
          ? this.rootTreeId
          : this.opertion == 2
          ? resource
          : store.queryInfo.id
        : treeData.id
    let sourceId = this.opertion == 1 ? resource : this.appInfo
    let sourceType = this.opertion == 1 ? '资源' : '产品'
    let destType = radio == '1' ? '组织' : radio == '2' ? '角色' : radio == '3' ? '岗位' : '人员'
    const { data, success } = await API.product.extendQuery({
      data: {
        teamId: teamId,
        sourceId: sourceId,
        sourceType: sourceType,
        destType: destType
      }
    })
    if (!success) {
      return
    }
    const { result = [], total = 0 } = data
    return result
  }

  /**
   *@desc 获取所有历史记录
   *@param type 区别分发还是共享
   *@param source 传入sourceType值
   *@param dest 传入destType值
   *@param resource 传入resource值
   *@return 获取历史记录
   */
  public async getAllHistoryData(type: number, source: string, dest: string, resource?: string) {
    let sourceId = type == 1 ? resource : this.appInfo
    let sourceType = source
    let destType = dest
    const { data, success } = await API.product.extendQuery({
      data: {
        sourceId: sourceId,
        sourceType: sourceType,
        destType: destType
      }
    })
    if (!success) {
      return
    }
    const { result = [], total = 0 } = data
    return result
  }

  /**
   *@desc 提交radio = 1 时的方法
   *@param departData 提交的数据
   *@param resource 所选择的资源信息
   */
  public async submitAll(departData: any, resource?: string,destType:string = '组织') {
    let departAdd: any[] = []
    let departDel: any[] = []

    departData.forEach((el: any) => {
      if (el.type == 'add') {
        departAdd.push(el.id)
      } else if (el.type == 'del') {
        departDel.push(el.id)
      }
    })
    let teamId = this.opertion == 1 ? this.rootTreeId : this.opertion == 2 ? resource : store.queryInfo.id
    if(!teamId){
      teamId = '0';
    }
    if(destType == '1'){
      destType ='组织'
    }else if(destType == '2'){
      destType ='职权'
    }else if(destType == '3'){
      destType ='身份'
    }else if(destType == '4'){
      destType ='人员'
    }

    console.log('departAdd',departAdd,'departDel',departDel)
    if (departAdd.length > 0) {
      await appCtrl.curProduct?.createExtend(
        teamId,
        departAdd,
        destType
      );
    }
    if (departDel.length > 0) {
      console.log('delete',teamId,
      departDel,
      destType)
       await appCtrl.curProduct?.deleteExtend(
        teamId,
        departDel,
        destType
      );
    }
  }
  /**
   *@desc 提交radio != 1 时的方法
   *@param data 所选中的数据
   *@param switchData 接口所需teamid数据
   *@param destType 区分分发分享的类型
   *@param resource 所选中的资源信息
   */
  public async sumbitSwitch(data: any, switchData: string, destType: string, resource?: string) {
    let addData: any[] = []
    let delData: any[] = []
    data.forEach((el: any) => {
      if (el.type == 'add') {
        addData.push(el.id)
      } else if (el.type == 'del') {
        delData.push(el.id)
      }
    })
    let teamId = this.opertion == 1 ? this.rootTreeId : this.opertion == 2 ? resource : store.queryInfo.id
    if(!teamId){
      teamId = '0';
    }
    if (addData.length > 0) {
      await appCtrl.curProduct?.createExtend(
          teamId,
          addData,
          destType
        )
    }
    if (delData.length > 0) {
      await appCtrl.curProduct?.deleteExtend(
        teamId,
        addData,
        destType
      );
    }
  }

  private handleTreeData(node: any, belongId: string) {
    node.disabled = !(node.belongId && node.belongId == belongId)
    if (node.nodes) {
      node.nodes = node.nodes.map((children: any) => {
        return this.handleTreeData(children, belongId)
      })
    }
    //判断是否有操作权限
    return node
  }
}

export const appstore = new appStore()
