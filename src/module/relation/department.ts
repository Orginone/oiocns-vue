import API from '@/services'
import { ElMessage, ElMessageBox } from 'element-plus';

// public 是默认可见性，所以，'可以直接省略'
// protected: 表示'受保护的',仅对其声明所在类和子类中 (非实例对象) 可见
// private: 表示'私有的,只在当前类中可见'，对实例对象以及子类也是不可见的
// readonly： 表示'只读',用来防止在构造函数之外对属性进行赋值
// static 静态数据

class DepartmentServices {
  /**
   * @description: 页码
   */
  public pageStore = {
    currentPage: 1,
    pageSize: 20,
    total: 0
  }

  /**
   * @description: 更新单位or部门or工作组
   * @params {typeName:string}
   * @return data 更新后的结果
   */
  // 

  public async upDateDempartment(params: paramsDataType) {
    let url = null;
    if (params.typeName == '单位') {
      url = 'update'
    } else if (params.typeName == '部门') {
      url = 'updateDepartment'
    } else if (params.typeName == '工作组') {
      url = 'updateJob'
    }
    const { data, success } = await API.company[url]({
      data: params
    })
    if (success) {
      return data;
    }
  }

  /**
   * @description: 获取人员列表
   * @param params.typeName 获取人员的类型
   * @param params.id id
   * @return backData.result 人员列表
   * @return backData.total  总数
   */

  public async getUser(params: paramsDataType) {
    let url = '';
    if (params.typeName == '单位') {
      url = 'getPersons'
    } else if (params.typeName == '部门') {
      url = 'getDepartmentPersons'
    } else if (params.typeName == '工作组') {
      url = 'getJobPersons'
    }
    const { data, success } = await API.company[url]({
      data: {
        id: params.id,
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

  /**
   * @description: 拉人进单位
   * @param id:单位id
   * @param Arr:选中的人 
   * @return data:操作结果
   */

  public async pullPerson(id: paramsDataType, Arr: Array<paramsDataType>) {
    const { data, success } = await API.company.pullPerson({
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
   * @description: 移除人员
   * @param row.typeName 移除的组的类型
   * @param row.name 移除的人名
   * @param id 移除的人的id
   * @return msg 返回操作结果
   */
  public async removePerson(row: paramsDataType, id: string) {
    let url: string;
    let title: string;
    if (row.typeName == '单位') {
      url = 'removeFromCompany'
      title = `操作离职，将删除 ${row.name} 在单位的信息，确定操作吗？`
    } else if (row.typeName == '部门') {
      url = 'removeFromDepartment'
      title = `确定把 ${row.name} 从当前部门移除吗？`
    } else if (row.typeName == '工作组') {
      url = 'removeFromJob'
      title = `确定把 ${row.name} 从当前部门移除吗？`
    }
    const data = await ElMessageBox.confirm(
      title,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).catch((action: any) => {
      console.log(action)
    })
    if (data == 'confirm') {
      const msg = await API.company[url]({
        data: {
          id: id,
          targetIds: [row.id]
        }
      })
      if (data) {
        return msg
      }
    }
  }
  /**
   * @description: 分配部门
   * @param id :部门id
   * @param targetIds :分配的人的id[]
   * @return data 操作结果
   */
  public async assignDepartment(id: string, targetIds: string[]) {
    const { data, success } = await API.company.assignDepartment({
      data: {
        id: id,
        targetIds: targetIds
      }
    })
    if (success) {
      return data
    }
  }
  /**
   * @description: 分配工作组
   * @param id:工作组id
   * @param targetIds :分配的人的id[]
   * @return data:操作结果
   */
  public async assignJob(id: string, targetIds: string[]) {
    const { data, success } = await API.company.assignJob({
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
export default DepartmentServices
