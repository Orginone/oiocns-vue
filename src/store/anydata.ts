
/*
    用户附属信息
    workspace 配置信息
*/
import { defineStore } from 'pinia'
import {anystore} from '@/hubs/anystore'

type UsingSpace = {
    id: string;
    title: string;
    name: number;
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
    state: (): { workspace: WorkSpaceType } => {
        return {
            workspace: null,
        }
    },
    getters: {
        homeComplist: (state) => state.workspace?.content || [], // 首页配置组件
        userComplist: (state) => state.workspace?.user?.content || [], // 用户组件
    },
    actions: {
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
            console.log('更新工作空间配置', params.content)
            anystore.set(`${params.workspaceId}.content`,
                {
                    operation: 'replaceAll',
                    data: params.content || []
                }, "user")
            this.workspace.content = params.content
        },
        // 设置个人空间全部数据
        setWorkspace(data: WorkSpaceType) {
            this.workspace = data || {}
        }
    }
})

