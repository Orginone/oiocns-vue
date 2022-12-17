import DocController from "@/ts/controller/store/docsCtrl"
import { IFileSystemItem } from "@/ts/core";

/**
 * 云盘
 */
class Cloud {
  public DocModel: any
  public ListMode: number

  /**
   * 私有构造方法，禁止外部实例化
   */
  constructor() {
    this.DocModel = DocController
    this.ListMode = 2
  }

  /**
   * 获取左侧目录树
   * @returns 目录树结构
   */
  public GetLeftTree = async (data: FileObject) => {
    let children
    children = await this.GetExpandTree(data)
    data.dirChildren = children
  }

  /**
   * 获取已经展开的树
   * @param refresh
   * @constructor
   */
  private GetExpandTree = async (data: FileObject) => {
    await data.loadChildren(false)
    let arr = data.children as FileObject[]
    let children: any[] = []
    for (const el of arr) {
      if (el.target.isDirectory) {
        el.isLeaf = !el.target.hasSubDirectories
        children.push(el)
      }
    }
    return children.length > 0 ? children : []
  }
}

/**
 * 文件对象
 */
export interface FileObject extends IFileSystemItem {
  dirChildren: IFileSystemItem[]
  isLeaf: boolean
}

const cloud = new Cloud()
export default cloud
