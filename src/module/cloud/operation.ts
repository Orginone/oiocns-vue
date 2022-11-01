import API from '@/services'
import { useUserStore } from '@/store/user'
import { encodeURIString } from '@/views/Cloud/conversion'
import { ElMessage } from 'element-plus'
const store = useUserStore()
// 云盘方法
export default class Cloud {
  cloud = new Map()

  public async delMapKey(item: any) {
    await this.bucketObjects(item, true)
  }
  /**
   * @desc 获取云盘信息
   * @return 加密处理过的数据
   */
  public async bucketObjects(item?: any, reLoad?: boolean, level?: number) {
    if (!reLoad && item?.key && this.cloud.has(item.key)) {
      return this.cloud.get(item.key)
    }
    const { data, success } = await API.bucket.bucketObjects({
      params: {
        shareDomain: item?.shareDomain,
        prefix: item?.key
      }
    })

    if (!success) {
      return
    }
    data.forEach((el: any) => {
      if (level) {
        el.level = level
      }
      el.key = decodeURIComponent(el.key)
      el.name = decodeURIComponent(el.name)
      // el.fileList = []
      if (el.hasSubDirectories) {
        el.children = [{}]
      }
    })
    this.cloud.set(item?.key || 'default', data)
    return data
  }

  public getHistoryKey(item: any, name?: string | number) {
    let arr: any[] = []
    item.forEach((el: any) => {
      if (el.key !== '') {
        arr.push(el.key)
      }
    })
    if (name) {
      arr.push(name)
    }
    console.log('获取key', arr.join('/'))

    let obj = {
      key: encodeURIString(arr.join('/')),
      level: item[item.length - 1].level
    }
    return obj
  }
}
