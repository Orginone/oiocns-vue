
/*
    用户附属信息
    workspace 配置信息
*/
import { defineStore } from 'pinia'
import {anystore} from '@/hubs/anystore'

type UsingSpace = {
    id: string;
    schemaName: string;
    nickname: string;
    createTime: string;
    temps: tempsType[];
}
type tempsType = {
    contain_link: string
    contain_name: string
    h: number
    i: number
    moved: boolean
    type: string
    w: number
    x: number
    y: number
}
// 用户组件数据配置
type UserSpace = {
    id: string;
    height: number;
    width: number;
    url: string;
    name: string;
}
type WorkSpaceType = {
    id?: string;
    name?: string, // 工作空间配置名称 
    content: UsingSpace[], // 组件内容
    user: {
        name: string,
        content: UserSpace[]
    }
}

export const useAnyData = defineStore({
    id: "userAnyData",
    state: (): { workspace: WorkSpaceType, activeSchema: UsingSpace, isDefaultLayout: boolean, usingSchema: UsingSpace } => {
        return {
            workspace: null,
            activeSchema: null,
            isDefaultLayout: true,
            usingSchema: null,
        }
    },
    getters: {
        homeComplist: (state) => state.workspace?.content || [], // 首页配置组件
        userComplist: (state) => state.workspace?.user?.content || [], // 用户组件
    },
    actions: {
        // 设置首页为指定布局
        setUsingSchema(params: UsingSpace) {
            this.usingSchema = params
        },
        // 设置首页是否为默认布局
        setDefaultLayout(params: boolean) {
            this.isDefaultLayout = params
        },
        // 设置当前选中的方案
        setActiveSchema(params: UsingSpace) {
            this.activeSchema = params
        },
        // 更新用户组件配置
        updateUserSpace(params: { workspaceId: string, content: UserSpace[] }) {
            console.log('更新用户组件', params.content)
            anystore.set(`${params.workspaceId}.user.content`,
                {
                    operation: 'replaceAll',
                    data: params.content
                }, "user")
            this.workspace.user = this.workspace.user || {}
            this.workspace.user.content = params.content
        },
        // 更新工作空间配置
        updateHomeSpace(params: { workspaceId: string, content: UsingSpace[] }) {
            console.log('更新工作空间配置', params.content, this.workspace);
            anystore.set(`${params.workspaceId}.content`,
                {
                    operation: 'replaceAll',
                    data: params.content || []
                }, "user")
            // this.workspace.content = params.content
        },
        // 设置个人空间全部数据
        setWorkspace(data: WorkSpaceType) {
            this.workspace = data || {}
        }
    }
})

