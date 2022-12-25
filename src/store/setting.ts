import { defineStore } from 'pinia'
import {userCtrl} from '@/ts/coreIndex';

type SettingStoreType = {
  unitInfo: any,
  departmentInfo: any
  currentSelectItme: any
  identityInfo: any
  groupInfo: any
  [key: string]: any
}

// 设置中心数据
export const setCenterStore = defineStore({
  id: 'setting',
  state: (): SettingStoreType => {
    return {
      unitInfo: [], // 单位信息
      departmentInfo: [], // 部门树节点信息
      currentSelectItme: {}, // 当前选中的节点信息
      identityInfo: [], // 岗位信息
      groupInfo: [], // 集团树信息
      identityList: []
    }
  },
  getters: {},
  actions: {
    async GetDepartmentInfo() {
      // 获取部门节点信息
      await this.loadTreeData().then((targets: any[]) => {
        this.departmentInfo = this.filter(targets)
      })
      this.currentSelectItme = this.departmentInfo[0] // 默认选中第一个节点
      return this.departmentInfo
    },
    async GetIdentities() {
      const stations = await userCtrl.company.getStations(false);
      let data: { label: string; key: string; object: any, [key: string]: any }[] = [];
      stations.forEach((a) => {
        data.push({
          label: a.name,
          key: a.id,
          object: a,
          structure: true,
          query: true,
          btns: [{
            id: '2009',
            name: '编辑岗位',
          },
          {
            id: '2010',
            name: '删除岗位',
          }]
        });
      });
      this.identityInfo = [...data]
      this.currentSelectItme = this.identityInfo[0]
      return this.identityInfo
    },
    // 获取所有部门
    async loadTreeData(reload: boolean) {
      const createTeeDom: any = async (n: any) => {
        const { target } = n;
        let result: any = {
          value: target.id,
          label: target.name,
          intans: n,
          children: [],
        };
        const children = await n.loadSubTeam(reload);
        if (children.length > 0) {
          for (const child of children) {
            if (child.target) {
              result.children.push(await createTeeDom(child));
            }
          }
        }
        return result;
      };
      const depts = await userCtrl.company.loadSubTeam(reload);
      const data = [];
      if (depts.length > 0) {
        for (const child of depts) {
          if (child.target) {
            data.push(await createTeeDom(child));
          } 
        }
      }
      return data;
    },
    filter(nodes: any[]) {
      nodes = nodes?.map(node => {
        const btns = [
          {
            name: "新增部门",
            id: "2201"
          }
        ]
        return Object.assign({}, node, { structure: true, query: true, btns })
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