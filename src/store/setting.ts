import { defineStore } from 'pinia'
import $services from '@/services'
import { ElMessage } from 'element-plus'

type SettingStoreType = {
    unitInfo: any,
    departmentInfo: any
    currentSelectItme: object
    [key: string]: any
}

// 设置中心数据
export const setCenterStore = defineStore({
    id: 'setting',
    state: ():SettingStoreType => {
        return {
            unitInfo: [], // 单位信息
            departmentInfo: [], // 部门树节点信息
            currentSelectItme: {}, // 当前选中的节点信息
        }
    },
    getters: { },
    actions: { 
        async GetDepartmentInfo() {
            // 获取部门节点信息
            await $services.company.getCompanyTree({}).then((res: any) => {
                if (res.success) {
                    const {children = []} = res.data
                    this.departmentInfo = this.filter(children)
                    this.currentSelectItme = children[0] // 默认选中第一个节点
                } else {
                  ElMessage({
                    message: res.msg,
                    type: 'warning'
                  })
                }
              })
            return this.departmentInfo
          },
          filter(nodes: any[]) {
            nodes = nodes.map(node => {
                const btns = node.data.typeName === '工作组' ?  [
                    {
                        name: "新增工作组",
                        id: "106"
                    }
                ] : [
                    {
                        name: "新增部门",
                        id: "105"
                    },
                    {
                        name: "新增工作组",
                        id: "106"
                    }
                ]
                return Object.assign({}, node, {structure: true, query: true, btns})
            })
            for (const node of nodes) {
                node.children = this.filter(node.children)
            }
            return nodes;
          }
    },
    persist: {
        enabled: true
    }
})