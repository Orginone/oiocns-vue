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
  public GetLeftTree = async (key: string) => {
    let children
    if (this.expand.includes(key)) {
      children = this.GetExpandTree(key, false)
    } else {
      this.expand.push(key)
      children = this.GetExpandTree(key, true)
    }
    return children
  }
  public GetExpandTree = async (key: string, refresh: boolean) => {
    let arr = await this.Current.GetChildren(refresh, key)
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
    console.log(children)
  }
}

const bucket = new Bucket()
export default bucket
