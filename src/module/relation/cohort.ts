

import API from '@/services'
import type { FormInstance,FormRules } from 'element-plus'

// public 是默认可见性，所以，'可以直接省略'
// protected: 表示'受保护的',仅对其声明所在类和子类中 (非实例对象) 可见
// private: 表示'私有的,只在当前类中可见'，对实例对象以及子类也是不可见的
// readonly： 表示'只读',用来防止在构造函数之外对属性进行赋值
// static 静态数据

class CohortServices {
    
  /**
   * @description: 页码
   */  

  public pageStore = {
    currentPage: 1,
    pageSize: 20,
    total: 0
  }

  /**
   * @description: 更新群组
   * @param obj 选中的群组信息
   * @param params 更新的selectItem
   * @return msg 成功状态
   */
  // 

  public async update (obj:cohortType){
    const { data , success} = await API.cohort.update({
      data: obj
    })
    if (success) {
        return data
    }
  }

  /**
   * @description: 添加群组
   * @param arr [id]
   * @return data 成功信息
   */
  // 

  public async applyJoin (Arr:Array<paramsDataType>){
    const { data , success} = await API.cohort.applyJoin({
      data: {
        id: Arr.join(',')
      }
    })
    if (success) {
        return data
    }
  }

  /**
   * @description: 创建群组
   * @param data object
   * @return data 成功信息
   */
  // 

  public async create (formData:any){
    const { data , success} = await API.cohort.create({ data: formData })
    if (success) {
        console.log(data)
        return data
    }
  }
}
export default CohortServices
