import authority from '@/utils/authority'
import { useUserStore } from '@/store/user'
import appCtrl from '@/ts/controller/store/appCtrl';

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
   *@desc 提交radio = 1 时的方法
   *@param departData 提交的数据
   *@param resource 所选择的资源信息
   */
  public async submitAll(departData: any, resource?: string,destType:string = '组织',typePD?:number) {
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
    if(typePD ==3){
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

export const appstore = new Application()
