import { defineStore } from 'pinia'
import $services from '@/services'
import { ElMessage } from 'element-plus'
// import {userCtrl} from '@/ts/coreIndex'
// import { type } from 'os'
// import { ICompany,SpaceType } from '@/ts/coreIndex';

type QueryInfoType = {
  id: string
  [key: string]: any
}
type UnitInfoType = {
  id: string
  typeName: string
  thingId: string
  [key: string]: any
}

type UserStoreType = {
  userInfo: any
  queryInfo: QueryInfoType
  userUnitInfo: UnitInfoType
  userToken: string
  [key: string]: any
}

export const useUserStore = defineStore({
  id: 'user', // id必填，且需要唯一
  state: (): UserStoreType => {
    return {
      userInfo: {}, // 用户登录信息
      queryInfo: {} as QueryInfoType, // 用户详细信息
      userCompanys: [], // 获取用户组织列表 分页
      loadCompanys: [],
      copyCompanys: [],
      userToken: '',
      workspaceData: {}, // 当前选中的空间
      userUnitInfo: {} as UnitInfoType //所在单位信息
    }
  },
  persist: {
    //  固化插件
    enabled: true, // 开启存储
    strategies: [
      // 指定存储的位置以及存储的变量都有哪些，该属性可以不写，
      //在不写的情况下，默认存储到 sessionStorage 里面,默认存储 state 里面的所有数据。
      {
        storage: sessionStorage,
        paths: ['userInfo', 'queryInfo', 'userToken', 'workspaceData', 'userUnitInfo']
      }
      // paths 是一个数组，如果写了 就会只存储 包含的 变量，当然也可以写多个。
    ]
  },
  getters: { },
  actions: {
    async setCurSpace(dataId: string){
      userCtrl.setCurSpace(dataId);
      this.copyCompanys.forEach(d=>{
        if(d.id==dataId){
          this.workspaceData = Object.assign({},d);
        }
      })
    },
    async updateUserInfo(data: { username: string; password: string }) {
      // 获取用户登录信息
      const res: ResultType = await userCtrl.login(data.username, data.password)
      if (res.success) {
        this.userInfo = res.data
        this.userToken = res.data.accessToken
        this.workspaceData = {
          id: res.data.workspaceId,
          name: res.data.workspaceName
        }
        // this.userCompanys = [this.workspaceData]
        // await this.getQueryInfo(this.userToken)
        return this.workspaceData
      } else {
        // ElMessage({
        //   message: res.msg,
        //   type: 'warning'
        // })
        return null
      }
    },
    async getQueryInfo(token: string) {
      if (token) {
        this.userToken = token
      }
      //获取用户详细信息
      let res: ResultType = await $services.person.queryInfo()
      if (res.success) {
        this.queryInfo = res.data
      } else {
        ElMessage({
          message: res.msg,
          type: 'warning'
        })
      }
    },
    async getCompanyList(current: number, workspaceId: string, lazyLoad: boolean) {
      await userCtrl.user
      .getJoinedCompanys()
        .then((res: ICompany[]) => {
          if (!res) {
            console.log(workspaceId, this.userInfo)
            this.getWorkspaceData(workspaceId, false)
            return
          }
          const all: SpaceType[] =
            userCtrl.user?.joinedCompany?.map((item) => {
              return item.spaceData;
            }) || [];
          all.unshift(userCtrl.user.spaceData);
          
          this.userCompanys = all.filter((item) => {
            return item.id != userCtrl.space.spaceData.id;
          })

          this.copyCompanys = Object.assign([],all);
          if (workspaceId) {
            this.getWorkspaceData(workspaceId, false)
          } else {
            this.getWorkspaceData(this.userInfo.workspaceId, false)
          }
          // } else {
          //   ElMessage({
          //     message: res.msg,
          //     type: 'warning'
          //   })
          // }
        })
    },

    async createUnit(data: any) {
      // 创建单位时 默认选择创建单位
      await $services.company
        .getJoinedCompany({
          data: {
            offset: 0,
            limit: 100
          }
        })
        .then((res: ResultType) => {
          console.log(res)
          if (res.code == 200) {
            this.copyCompanys = JSON.parse(JSON.stringify(res.data.result))
            this.getWorkspaceData(data.workspaceId, false)
          } else {
            ElMessage({
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },

    async getWorkspaceData(id: string) {
      await this.copyCompanys.forEach((el: any, index: number) => {
        if (id == el.id) {
          this.workspaceData = el
          // sessionStorage.setItem('WORKSPACE', JSON.stringify(obj))
          // if (getLoad) {
            // 防止选择单位时先删除后刷新
            this.loadCompanys = Object.assign([],this.userCompanys);
            // this.userCompanys.splice(index, 1)
          // } else {
            // 点击加载单位 去除当前单位
          //   this.userCompanys.splice(index, 1)
          //   this.loadCompanys = JSON.parse(JSON.stringify(this.userCompanys))
          // }
        }
      })
    },
    resetState() {
      // this.userInfo = null
      // this.queryInfo = null
      this.userCompanys = []
      // this.copyCompanys = null
      this.userToken = ''
      // this.workspaceData = null
    },
  }
})
