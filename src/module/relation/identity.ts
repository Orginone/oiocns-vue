import API from '@/services'

// public 是默认可见性，所以，'可以直接省略'
// protected: 表示'受保护的',仅对其声明所在类和子类中 (非实例对象) 可见
// private: 表示'私有的,只在当前类中可见'，对实例对象以及子类也是不可见的
// readonly： 表示'只读',用来防止在构造函数之外对属性进行赋值
// static 静态数据

class identityServices {
  /**
   * @description: 页码
   */  
  public pageStore = {
    currentPage: 0,
    pageSize: 20,
    total: 0
  }
  /**
   * @description: 获取职权树
   * @param id : belongId
   * @return data 操作结果
   */
    public async getAuthorityTree(id:string) {
        const { data, success } = await API.company.getAuthorityTree({data: { id:id }})
        if (success) {
            return data
        }
    }
  /**
   * @description: 创建职权
   * @param obj :职权对象
   * @return data 操作结果
   */
    public async createIdentity(obj:any) {
        const { data, success } = await API.cohort.createIdentity({
            data:obj
        })
        if (success) {
            return data
        }
    }
  /**
   * @description: 加载岗位
   * @param id :belongId
   * @param text : filter
   * @return data 操作结果
   */
     public async getIdentitys(id:string,text:string) {
        const { data, success } = await API.cohort.getIdentitys({data: {
            offset: 0,
            limit: 1000,
            id:id,
            filter:text
        }})
        if (success) {
            return data
        }
    }
  /**
   * @description: 删除岗位
   * @param id :selectItem.id
   * @return data 操作结果
   */
     public async deleteIdentity(id:string) {
        const { data, success } = await API.company.deleteIdentity({data: {
            id: id
          }})
        if (success) {
            return data
        }
    }
  /**
   * @description: 角色树
   * @param id :belongId
   * @return data 操作结果
   */
    public async loadAuthorityTree(id:string) {
        const { data, success } = await API.company.loadAuthorityTree({data: {
            id: id
          }})
        if (success) {
            return data
        }
    }
  /**
   * @description: 加载岗位下的用户
   * @param id :belongId
   * @return data 操作结果
   */
     public async getIdentityPerson(id:string) {
        const { data, success } = await API.cohort.getIdentityPerson({
            data: {
                id: id,
                offset: this.pageStore.currentPage,
                limit: this.pageStore.pageSize
            }
        })
        if (success) {
            this.pageStore.total = data.total;
            return data
        }
    }
  /**
   * @description: 给人员岗位
   * @param id :selectItem.id
   * @param id :userIds [id]
   * @return data 操作结果
   */
     public async giveIdentity(id:string,userIds:Array<string>) {
        const { data, success } = await API.company.giveIdentity({
            data: { id:id, targetIds: userIds }
        })
        if (success) {
            this.pageStore.total = data.total;
            return data
        }
    }
  /**
   * @description: 移除岗位下的人员
   * @param id :selectItem.id
   * @param rowid :row.id [id]
   * @return data 操作结果
   */
     public async removeIdentity(id:string,rowid:string) {
        const { data, success } = await API.company.removeIdentity({
            data: {
                id: id,
                targetIds: [rowid]
            }
        })
        if (success) {
            return data
        }
    }
}
export default identityServices
