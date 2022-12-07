

import API from '@/services'
import type { FormInstance,FormRules } from 'element-plus'

// public 是默认可见性，所以，'可以直接省略'
// protected: 表示'受保护的',仅对其声明所在类和子类中 (非实例对象) 可见
// private: 表示'私有的,只在当前类中可见'，对实例对象以及子类也是不可见的
// readonly： 表示'只读',用来防止在构造函数之外对属性进行赋值
// static 静态数据
type stateType = {
    searchJoinApplyList:Array<Object>;
    searchJoinApplyHead:Array<Object>;
    searchPublishApplyList:Array<Object>;
    searchPublishApplyHead:Array<Object>;
    searchJoinApplyManagerList:Array<Object>;
    searchJoinApplyManagerHead:Array<Object>;
    searchManagerPublishApplyList:Array<Object>;
    searchManagerPublishApplyHead:Array<Object>;
}
class thingServices {
    
  /**
   * @description: 页码
   */  
   public pageStore = {
    currentPage: 1,
    pageSize: 20,
    total: 0
  }
  public state:stateType = {
    searchJoinApplyList: [],
    searchJoinApplyHead: [],
    searchPublishApplyList:[],
    searchPublishApplyHead:[],
    searchJoinApplyManagerList:[],
    searchJoinApplyManagerHead:[],
    searchManagerPublishApplyList:[],
    searchManagerPublishApplyHead:[],
  }
 
  public friendHead :Array<Object> = [
     {
        prop: 'flowInstance.flowRelation.productId',
        label: '事项',
        name: 'productId',
        type: 'slot',
     },
     {
        type: 'slot',
        prop: 'remark',
        label: '说明',
        name: 'remark'
      },
      {
        prop: 'target.name',
        label: '发起人',
        name: 'target.name',
        type: 'slot',
      },
      {
        prop: 'createTime',
        label: '过期时间',
        name: 'createTime'
      },
      {
        type: 'slot',
        prop: 'option',
        label: '操作',
        name: 'option'
      }
  ]
  public companyHead :Array<Object> = [
    {
      prop: 'flowInstance.flowRelation.productId',
      label: '事项',
      name: 'productId',
      type: 'slot',
   },
   {
      type: 'slot',
      prop: 'content',
      label: '说明',
      name: 'content'
    },
    {
      prop: 'target.name',
      label: '发起人',
      name: 'target.name',
      type: 'slot',
    },
    {
      prop: 'createTime',
      label: '发起时间',
      name: 'createTime'
    },
    {
      type: 'slot',
      prop: 'option',
      label: '操作',
      name: 'option'
    }
  ]
  public shopHead :Array<Object> =[
    {
      prop: 'flowInstance.flowRelation.productId',
      label: '事项',
      name: 'productId',
      type: 'slot',
   },
   {
      type: 'slot',
      prop: 'content',
      label: '说明',
      name: 'content'
    },
    {
      prop: 'target.name',
      label: '发起人',
      name: 'target.name',
      type: 'slot',
    },
    {
      prop: 'createTime',
      label: '过期时间',
      name: 'createTime'
    },
    {
      type: 'slot',
      prop: 'option',
      label: '操作',
      name: 'option'
    }
  ]
  public orderHead :Array<Object> = [
      {
        prop: 'target.name',
        label: '订单号',
        name: 'target.name',
        type: 'slot',
      },
      {
        type: 'slot',
        prop: 'content',
        label: '订单说明',
        name: 'content'
      },
      {
        type: 'slot',
        prop: 'status',
        label: '发起人',
        name: 'status'
      },
      {
        prop: 'createTime',
        label: '过期时间',
        name: 'createTime'
      },
      {
        type: 'slot',
        prop: 'option',
        label: '操作',
        name: 'option'
      }
  ]
     /**
   * @description: 列表数据
   */  
   public applyList:Array<Object> = [] //申请列表
   public approvalList:Array<Object> = [] //审批列表
   public queryInstanceList:Array<Object> = [] //查询我发起的待办
   public recordList:Array<Object> = [] //应用代表列表
   public taskList:Array<Object> = [] //查询应用类型列表
   public shopApplyList:Array<Object> = [] //商店审核列表
   public copyList:Array<Object> = [] //抄送列表
   public whiteList:Array<string> = [] //调用记录
  /**
   * @description: 查询我的申请
   * @return {data,msg} 返回数据 成功状态
   */
  public async getAllApply (){
    if(this.whiteList.includes('getAllApply')){
        return true;
    }
    const { data , success} = await API.person.getAllApply({
        data: {
            offset: (this.pageStore.currentPage - 1) * this.pageStore.pageSize,
            limit: this.pageStore.pageSize
        }
    })
    if (success) {
        this.whiteList.push('getAllApply')
        const { result = [], total = 0 } = data
        this.applyList = result
    }
  }
  /**
   * @description: 查询我的审批
   * @params id:string
   * @return {data,msg} 返回数据 成功状态
   */
   public async getAllApproval (id:string){
    if(this.whiteList.includes('getAllApproval')){
        return true;
    }
    const { data , success} = await API.person.getAllApproval({
        data: {
            id:id,
            offset: (this.pageStore.currentPage - 1) * this.pageStore.pageSize,
            limit: this.pageStore.pageSize
        }
    })
    if (success) {
        this.whiteList.push('getAllApproval')
        const { result = [], total = 0 } = data
        this.approvalList = result
    }
  }
  /**
   * @description: 查询应用的待办
   * @return result 返回数据
   */
   public async queryInstance (){
    if(this.whiteList.includes('queryInstance')){
        return true;
    }
    const { data , success} = await API.wflow.queryInstance({
        data: {}
    })
    if (success) {
        this.whiteList.push('queryInstance')
        const { result = [], total = 0 } = data
        this.queryInstanceList = result
        console.log('result',result)

    }
  }
  /**
   * @description: 查询我发起的应用待办
   * @return result 返回数据
   */
  public async queryRecord (){
    if(this.whiteList.includes('queryRecord')){
    console.log('c')
      return true;
    }
    const { data , success} = await API.wflow.queryRecord({
      data: {
        offset: 0,
        limit: 1000,
        filter: "string"
      }
    })
    if (success) {
      this.whiteList.push('queryRecord')
      const { result = [], total = 0 } = data
      this.recordList = result
    }
  }
  /**
   * @description: 查询应用待办
   * @return {data,msg} 返回数据 成功状态
   */
   public async queryTask (){
    if(this.whiteList.includes('queryTask')){
        return true;
    }
    const { data , success} = await API.wflow.queryTask({
        data: {
            offset: 0,
            limit: 1000,
            typeName: "approve"
        }
    })
    if (success) {
        this.whiteList.push('queryTask')
        const { result = [], total = 0 } = data
        let tankListArr:Array<Object> =[];
        let copyArr:Array<Object> = []
        result.forEach((element:any) => {
          if(element.flowNode.nodeType =='审批'){
            tankListArr.push(element)
          }else{
            copyArr.push(element)
          }
        });
      
        this.taskList = tankListArr
        this.copyList = copyArr
        console.log(this.taskList,'111',this.copyList )
    }
  }
  /**
   * @description: 添加好友
   * @params id:string 用户的id
   * @return {data,msg} 返回数据 成功状态
   */
   public async joinSuccess (id:string){
    const { data , success} = await API.person.joinSuccess({
        data: {
            id:id
        }
    })
    if (success) {
        return data
    }
  }
  /**
   * @description: 拒绝添加好友
   * @params id:string 用户的id
   * @return {data,msg} 返回数据 成功状态
   */
   public async joinRefuse (id:string){
    const { data , success} = await API.person.joinRefuse({
        data: {
            id:id
        }
    })
    if (success) {
        return data
    }
  }
  /**
   * @description: 取消好友申请
   * @params id:string 用户的id
   * @return {data,msg} 返回数据 成功状态
   */
   public async cancelJoin (id:string){
    const { data , success} = await API.person.cancelJoin({
        data: {
            id:id
        }
    })
    if (success) {
        return data
    }
  }
  /**
   * @description: 查询加入市场申请
   * @return {data,msg} 返回数据 成功状态
   */
   public async searchJoinApply (){
    if(this.whiteList.includes('searchJoinApply')){
        return true;
    }
    const { data , success} = await API.appstore.searchJoinApply({
        data: {
            offset: (this.pageStore.currentPage - 1) * this.pageStore.pageSize,
            limit: this.pageStore.pageSize,
            filter: ''
        }
    })
    if (success) {
        this.whiteList.push('searchJoinApply')
        const { result = [], total = 0 } = data
        this.state.searchJoinApplyList = []
        this.state.searchJoinApplyList = result?.map((item: { market: { name: any; code: any } }) => {
          return {
            ...item,
            marketCode: item.market.code,
            marketName: item.market.name
          }
        })
        this.state.searchJoinApplyHead = [
          {
            prop: 'marketName',
            label: '市场名称'
          },

          {
            prop: 'marketCode',
            label: '市场编码'
          },
          {
            prop: 'createTime',
            label: '创建时间'
          },
          {
            type: 'slot',
            label: '操作',
            fixed: 'right',
            align: 'center',
            width: '400',
            name: 'operate'
          }
        ]
    }
   }
  /**
   * @description: 查询产品上架申请
   * @return {data,msg} 返回数据 成功状态
   */
   public async searchPublishApply (){
    if(this.whiteList.includes('searchPublishApply')){
        return true;
    }
    const { data , success} = await API.appstore.searchPublishApply({
        data: {
            offset: (this.pageStore.currentPage - 1) * this.pageStore.pageSize,
            limit: this.pageStore.pageSize,
            filter: ''
        }
    })
    if (success) {
        const { result = [], total = 0 } = data
        this.state.searchPublishApplyList = []
        this.state.searchPublishApplyList = result?.map(
          (item: {
            marketId: any
            product: { name: any; code: any; source: any; authority: any; typeName: any }
          }) => {
            return {
              ...item,
              marketName:item.marketId,
              productCode: item.product.code,
              productName: item.product.name,
              productSource: item.product.source,
              productAuthority: item.product.authority,
              productTypeName: item.product.typeName
            }
          }
        )
        this.state.searchPublishApplyHead = [
          {
            prop: 'marketName',
            label: '市场名称'
          },
          {
            prop: 'productCode',
            label: '应用编号'
          },
          {
            prop: 'productName',
            label: '应用名称'
          },
          {
            prop: 'productSource',
            label: '应用来源'
          },
          {
            prop: 'productAuthority',
            label: '应用权限'
          },
          {
            prop: 'productTypeName',
            label: '应用类型'
          },
          {
            prop: 'price',
            label: '价格'
          },
          {
            prop: 'days',
            label: '使用期限'
          },
          {
            prop: 'createTime',
            label: '创建时间',
            width: '200'
          }
        ]
        this.whiteList.push('searchJoinApply')
    }
   }

  /**
   * @description: 查询加入市场审批
   * @return {data,msg} 返回数据 成功状态
   */
   public async searchJoinApplyManager (){
    if(this.whiteList.includes('searchJoinApplyManager')){
        return true;
    }
    const { data , success} = await API.appstore.searchJoinApplyManager({
        data: {
            offset: (this.pageStore.currentPage - 1) * this.pageStore.pageSize,
            limit: this.pageStore.pageSize,
            filter: ''
        }
    })
    if (success) {
        const { result = [], total = 0 } = data
        this.state.searchJoinApplyManagerList = []
        this.state.searchJoinApplyManagerList = result?.map(
          (item: {
            market: { name: any }
            target: { name: any; code: any; createTime: any }
          }) => {
            return {
              ...item,
              createTime: item.target.createTime,
              targetCode: item.target.code,
              targetName: item.target.name,
              marketName: item.market.name
            }
          }
        )
        this.state.searchJoinApplyManagerHead = [
          {
            prop: 'marketName',
            label: '市场名称'
          },
          {
            prop: 'targetName',
            label: '申请人昵称'
          },
          {
            prop: 'targetCode',
            label: '申请人账号'
          },
          {
            prop: 'createTime',
            label: '创建时间'
          },
          {
            type: 'slot',
            label: '操作',
            fixed: 'right',
            align: 'center',
            width: '400',
            name: 'operate'
          }
        ]
      }
   }
   /**
   * @description: 查询应用上架审批
   * @return {data,msg} 返回数据 成功状态
   */
    public async searchManagerPublishApply (){
        if(this.whiteList.includes('searchJoinApplyManager')){
            return true;
        }
        const { data , success} = await API.appstore.searchManagerPublishApply({
            data: {
                offset: (this.pageStore.currentPage - 1) * this.pageStore.pageSize,
                limit: this.pageStore.pageSize,
                filter: ''
            }
        })
        if (success) {
            const { result = [], total = 0 } = data
            this.state.searchManagerPublishApplyList = []
            this.state.searchManagerPublishApplyList = result?.map(
              (item: {
                marketId: any
                product: { name: any; code: any; source: any; authority: any; typeName: any }
              }) => {
                return {
                  ...item,
                  marketName: item.marketId,
                  productCode: item.product.code,
                  productName: item.product.name,
                  productSource: item.product.source,
                  productAuthority: item.product.authority,
                  productTypeName: item.product.typeName
                }
              }
            )
            this.state.searchManagerPublishApplyHead = [
              {
                prop: 'marketName',
                label: '市场名称'
              },
              {
                prop: 'productCode',
                label: '应用编号'
              },
              {
                prop: 'productName',
                label: '应用名称'
              },
              {
                prop: 'productSource',
                label: '应用来源'
              },
              {
                prop: 'productAuthority',
                label: '应用权限'
              },
              {
                prop: 'productTypeName',
                label: '应用类型'
              },
              {
                prop: 'price',
                label: '价格'
              },
              {
                prop: 'days',
                label: '使用期限'
              },
              {
                prop: 'createTime',
                label: '创建时间',
                width: '200'
              },
              {
                type: 'slot',
                label: '操作',
                fixed: 'right',
                align: 'center',
                width: '400',
                name: 'operate'
              }
            ]
        }
    }
}
export default thingServices
