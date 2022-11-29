import { ref, Ref } from 'vue'
import ObjectLay from '../store/objectlay'

/**
 * 存储桶管理
 */
class Bucket {
  private expand: any[] = []
  private refObj: Ref<boolean>
  public Root: ObjectLay
  public Current: ObjectLay
  private static instance: Bucket
  /**
   * 私有构造方法，禁止外部实例化
   */
  constructor() {
    this.Root = new ObjectLay()
    this.Current = this.Root
    this.refObj = ref<boolean>(true)
  }

  /**
   * 获取单例
   * @returns 单例
   */
  public static async GetInstance() {
    if (this.instance == null) {
      this.instance = new Bucket()
    }
    return this.instance
  }
  /**
   * 获取左侧目录树
   * @returns 目录树结构
   */
  public GetLeftTree = async (data: any) => {
    //设置Current
    this.Current = data
    let children
    if (this.expand.includes(data.Key)) {
      children = this.GetExpandTree(false)
    } else {
      this.expand.push(data.Key)
      children = this.GetExpandTree(true)
    }
    return children
  }
  public GetExpandTree = async (refresh: boolean) => {
    let arr = await this.Current.GetChildren(refresh)
    let children: any[] = []
    arr.forEach((el: any) => {
      if (el.HasSubDirectories) {
        el.children = [{} as ObjectLay]
      }
      if (el.IsDirectory) {
        children.push(el)
      }
    })
    return children.length > 0 ? children : []
  }
  /**
   * 获取顶部导航条
   * @returns 导航条树结构
   */
  public GetTopBar() {}
  /**
   * 获取内容区数据
   * @returns 返回内容区数据
   */
  public GetContent = async () => {
    let children = await this.Current.GetChildren()
  }
}

const bucket = new Bucket()
export default bucket
