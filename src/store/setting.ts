import { defineStore } from 'pinia'
// import {userCtrl} from '@/ts/coreIndex';

type SettingStoreType = {
  [key: string]: any
}

// 设置中心数据
export const setCenterStore = defineStore({
  id: 'setting',
  state: (): SettingStoreType => {
    return {
      currItem:[],
    }
  },
  getters: {},
  actions: {
    setCurrItem(obj:any){
      console.log(obj);
      // this.currItem = obj
    }
  },
  persist: {
    //  固化插件
    enabled: false, // 关闭存储，否则会有循环引用转JSON的问题
    strategies: []
  },
})