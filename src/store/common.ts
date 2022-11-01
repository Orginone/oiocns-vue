import { defineStore } from 'pinia'

export const useCommonStore = defineStore({
  id: 'common', // id必填，且需要唯一
  state: () => {
    return {
      isLoading: false,//加载中...
      appInfo: {},
      iframeLink:'',//记录当前打开的ifream内容链接用于变更外部应用
      iframeID:"",//记录当前打开的ifream 的id
      isChangeStartApp:false,// 记录是否新注册了新的 app 用于处理更新可使用列表
    }
  },
  persist: {
    //  固化插件
    enabled: true, // 开启存储
    strategies: [
      {
        storage: sessionStorage,
        paths: ['iframeLink','iframeID']
      }
    ]
  },
})
