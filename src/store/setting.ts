import { defineStore } from 'pinia'
import $services from '@/services'
import { ElMessage } from 'element-plus'

type SettingStoreType = {
    unitInfo: any,
    departmentInfo: any
    currentSelectItme: object
    identityInfo: any
    groupInfo: any
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
            identityInfo: [], // 岗位信息
            groupInfo: [] // 集团树信息
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
          async GetGroupInfo() {
            // 获取集团节点信息
            await $services.company.companyGetGroups({data: {offset: 0,limit: 1000}}).then((res: any) => {
                if (res.success) {
                    if (res.data.result && res.data.result.length > 0) {
                        const groups = res.data.result
                        // state.options = groups.map(g => {
                        //   return { value: g.id, label: g.name }
                        // })
                        // selectedValue.value = groups[0].name
                        // loadOrgTree(groups[0].id)
                      } else {
                        this.groupInfo = []
                      }
                } else {
                  ElMessage({
                    message: res.msg,
                    type: 'warning'
                  })
                }
              })
            return this.departmentInfo
          },
          async GetIdentities() {
            // 加载岗位
            await $services.cohort.getIdentitys({data: {id: this.unitInfo?.id,offset: 0,limit: 1000} }).then((res: any) => {
                if (res.success) {
                    if (res.data?.result?.length) {
                        this.identityInfo = res.data?.result?.map((element: any) => {
                            return Object.assign({},element, {label: element.name,structure: true, query: true, btns: [{
                              id: '2009',
                              name: '更改岗位名称',
                            },
                            {
                              id: '2010',
                              name: '删除岗位',
                            }]})
                        });
                        this.currentSelectItme = this.identityInfo[0]
                    } else {
                        this.identityInfo = []
                        this.currentSelectItme = []
                    }
                } else {
                  ElMessage({
                    message: res.msg,
                    type: 'warning'
                  })
                }
              })
            return this.identityInfo
          },
          filter(nodes: any[]) {
            nodes = nodes.map(node => {
                const btns = node.data?.typeName === '工作组' ?  [
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