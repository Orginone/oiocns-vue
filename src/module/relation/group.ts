import API from '@/services'
import { ElMessage, ElMessageBox } from 'element-plus';

// public 是默认可见性，所以，'可以直接省略'
// protected: 表示'受保护的',仅对其声明所在类和子类中 (非实例对象) 可见
// private: 表示'私有的,只在当前类中可见'，对实例对象以及子类也是不可见的
// readonly： 表示'只读',用来防止在构造函数之外对属性进行赋值
// static 静态数据

class GroupServices {
  /**
   * @description: 页码
   */  
  public pageStore = {
    currentPage: 1,
    pageSize: 20,
    total: 0
  }

  /**
   * @description: 更新集团或子集团
   * @param params.typeName 选中的类型
   * @param params 更新的selectItem
   * @return msg 成功状态
   */
  // 
  public async upDateGroup (params: paramsDataType){
    let url = null;
    if (params.typeName == '集团') {
      url = 'updateGroup'
    } else if (params.typeName == '子集团') {
      url = 'updateSubGroup'
    }
    const { data, success } = await API.company[url]({
      data: params
    })
    if (success) {
      return data;
    }
  }
  /**
   * @description: 删除集团或子集团
   * @params params.typeName 选中的类型
   * @params params.name 集团或子集团名称
   * @params params.id 选中的id
   * @return data 成功信息
   */
  // 
  public async deleteGroup (params: paramsDataType){
    let url: string = null;
    if (params.typeName == '集团') {
      url = 'deleteGroup'
    } else if (params.typeName == '子集团') {
      url = 'deleteSubgroup'
    }
    const data = await ElMessageBox.confirm(
      `确定删除 ${params.name} ${params.typeName}吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).catch((action: any) => {
      console.log(action)
    })
    if(data =='confirm'){
     const {msg, success} = await API.company[url]({
        data: {
          id: params.id,
        }
      })
      if(success){
        return msg
      }
    }
  }
  /**
   * @description: 获取人员列表
   * @param selectItem.data.typeName  获取人员列表的类型
   * @return backData.result list
   * @return backData.total  总数
   */  

  public getCompanies = async (selectItem:paramsDataType) => {
    if (selectItem) {
      let url = ''
      if (selectItem.data.typeName == '集团') {
        url = 'getGroupCompanies'
      } else if (selectItem.data.typeName == '子集团') {
        url = 'getSubgroupCompanies'
      }
      let { data , success } = await API.company[url]({
        data: {
          id: selectItem.id,
          offset: (this.pageStore.currentPage - 1) * this.pageStore.pageSize,
          limit: this.pageStore.pageSize
        }
      })
      if (success) {
        let backData = {
          result: data.result,
          total: data.total,
        }
        return backData
      }
    }
  }

  /**
   * @description: 拉单位进集团
   * @param id 集团id
   * @param Arr 选中的单位数组[id]
   * @return data 返回信息 success 成功状态
   */  

  public pullCompanys = async (id:paramsDataType,Arr:Array<paramsDataType>) =>{
    const {data,success} = await API.company.pullCompanys({
      data: {
        id: id,
        targetIds: Arr
      }
    })
    if (success) {
      return data
    }
  }
  /**
   * @description: 从集团或子集团移除单位
   * @param row.typeName 移除的类型
   * @param row.name 移除单位名称
   * @param id 移除的单位id
   * @return {*}
   */  
  public removeCompany =async (row:paramsDataType,id:string) => {
    let url: string;
    let title: string;
    if (row.typeName == '集团') {
      url = 'removeFromGroup'
      title = `确定把 ${row.name} 从集团移除吗？`
    } else if (row.typeName == '子集团') {
      url = 'removeFromSubgroup'
      title = `确定把 ${row.name} 从子集团移除吗？`
    }
    const data =  await ElMessageBox.confirm(
      title,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ) .catch((action:any) => {
      console.log(action)
    })
    if(data =='confirm'){
      const msg =await API.company[url]({
        data: {
          id: id,
          targetIds: [row.id]
        }
      })
      if(data){
        return msg
      }
    }
  }
  /**
   * @description: 分配到子集团
   * @param id :子集团id
   * @param targetIds :分配的单位的id[]
   * @return data 操作结果
   */
   public async assignSubgroup(id: string, targetIds: string[]) {
    const { data, success } = await API.company.assignSubgroup({
      data: {
        id: id,
        targetIds: targetIds
      }
    })
    if (success) {
      return data
    }
  }
}
export default GroupServices
