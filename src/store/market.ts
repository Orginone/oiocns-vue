import { defineStore } from 'pinia'
import $services from '@/services'
import { ElMessage } from 'element-plus'

const MAXLIMIT = 9999999999999
type MarketInfoType = {
  market: object
  name:string
  [key: string]: any
}

export const useMarketStore = defineStore({
  id: "useMarketData",
  state: (): MarketInfoType => {
      return {
        market:{},
        name:'',
        marketMap:new Map()
      }
  },
  getters: {
    getMarketName: (state) => {
      console.log(state.marketMap)
      return (id: string): string => state.marketMap.get(id)
    }
  },
  actions: {
    async SearchAllMarket() {
      // 获取市场信息
      await $services.appstore
        .searchAll({
          data: {
            offset: 0,
            limit: MAXLIMIT,
            filter: ""
          }
        })
        .then(async (res: ResultType) => {

          if (res.success) {
            const {result = [],total = 0} = res.data
            result.forEach((item: { id: any; name: any })=>{
              this.marketMap.set(item.id,item.name)

            })
            console.log(this.marketMap)

          } else {
            ElMessage({
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
}
})
