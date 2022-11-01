

import API from '@/services'
import { ElMessage, ElMessageBox } from 'element-plus';

// public 是默认可见性，所以，'可以直接省略'
// protected: 表示'受保护的',仅对其声明所在类和子类中 (非实例对象) 可见
// private: 表示'私有的,只在当前类中可见'，对实例对象以及子类也是不可见的
// readonly： 表示'只读',用来防止在构造函数之外对属性进行赋值
// static 静态数据

class FriendServices {
  /**
   * @description: 页码
   */  
  public pageStore = {
    currentPage: 1,
    pageSize: 20,
    total: 0
  }

  /**
   * @description: 添加好友
   * @param arr [id]
   * @return data 成功信息
   */
  // 

  public async applyJoin (Arr:Array<paramsDataType>){
    const { data , success} = await API.person.applyJoin({
      data: {
        id: Arr.join(',')
      }
    })
    if (success) {
        return data
    }
  }
  
  /**
   * @description: 获取好友列表
   * @return backData.friendList 好友列表 backData.total 总数
   */
  // 

  public async getFriends (){
    const res = await API.person.getFriends({
      data: {
        offset: (this.pageStore.currentPage - 1) * this.pageStore.pageSize,
        limit: this.pageStore.pageSize
      }
    })
    if(res){
      const { result = [] } = res.data
      const friendList = result?.map((item: { team: { remark: any; code: any; name: any } }) => {
        return {
          ...item,
          remark: item.team.remark,
          teamCode: item.team.code,
          trueName: item.team.name
        }
      })
      let backData = {
        friendList,
        total:res.data.length
      }
      return backData;
    }
  }
  
  /**
   * @description: 移除好友
   * @param id  好友id
   * @return data 成功信息
   */  

  public remove = async (id:string) => {
    let { data , success } = await API.person.remove({
        data: {
            id: id,
            targetIds: [id]
        }
    })
    if (success) {
        return data
    }
  }
}
export default FriendServices
