import { App } from 'vue'
import request from './request'
import urls from './RESTFULURL'
import { useUserStore } from '@/store/user'
import { AxiosRequestConfig } from 'axios';


type ApiUrlMap = typeof urls;

export type RequestMethodMap = {
  [C in keyof ApiUrlMap]: {
    [U in keyof ApiUrlMap[C]]: (option: AxiosRequestConfig, ...args: any[]) => Promise<ResultType<any>> 
  };
}

const FUNS: RequestMethodMap = {} as any;
const APPFUNS: RequestMethodMap = {} as any;

const InitRequests = (req: any, urls: Record<string, any>, loadToken: boolean, ignores: string[]) => {
  Object.keys(urls).forEach((key) => {
    let sub = urls[key]
    switch (typeof sub) {
      case 'function':
        if (!ignores.includes(key)) {
          req[key] = (options: any, ...args: any) => {
            return request(sub(...args), LoadToken(options, loadToken))
          }
        }
        break
      case 'string':
        if (!ignores.includes(key)) {
          req[key] = (options: any) => {
            return request(sub, LoadToken(options, loadToken || key === "createAPPtoken"))
          }
        }
        break
      case 'object':
        req[key] = {}
        if(key === "person" && !loadToken){
          ignores = ["login", "logout", "register", "changeWorkspace"]
        }
        InitRequests(req[key], sub, loadToken, ignores)
        break
      default:
        throw new Error('Configuration not supported.')
    }
  })
}

const LoadToken = (options: any, loadToken: boolean) => {
  options = options || {}
  if (loadToken) {
    options.headers = options.headers || {}
    const store = useUserStore()
    if (store.userToken !== '' && !options.headers['Authorization']) {
      options.headers['Authorization'] = store.userToken
    }
  }
  return options
}

InitRequests(FUNS, urls, true, [])

InitRequests(APPFUNS, urls, false, [])

export function setGlobalProperties(app: App<Element>) {
  app.config.globalProperties.$API = FUNS
}
console.warn(FUNS)
export default FUNS
export { APPFUNS }
