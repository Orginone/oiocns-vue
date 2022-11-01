import AnyStore, { BadRequst } from "@/hubs/anystore"
import * as signalR from '@microsoft/signalr'
import { Ref, ref } from "vue"
import api from '@/services'
import router from "@/router"
import notify from '@/utils/notify'
import { TargetType, Quatrains } from "../enums"
import {StringPako} from '@utils/package'

/** 消息类型 */
export enum MessageType {
    Text = "文本",
    Image = "图片",
    Video = "视频",
    Voice = "语音",
    Recall = "撤回",
    Readed = "已读"
}
/** 存储消息数据集名称 */
const hisMsgCollName = "chat-message"
/**
 * 即时消息模块
 */
export default class OrgChat extends Object {
    private lastMsg: any
    private stoped: boolean
    private closed: boolean
    private anyStore: AnyStore
    public curMsgs: Ref<any[]>
    private accessToken: string
    public userId: Ref<string>
    public spaceId: Ref<string>
    public authed: Ref<boolean>
    private isconnecting: boolean
    public qunPersons: Ref<any[]>
    public chats: Ref<ImMsgType[]>
    private openChats: ImMsgChildType[]
    public curChat: Ref<ImMsgChildType>
    private messageCallback: (data: any) => void
    private connection: signalR.HubConnection
    private nameMap: Ref<Record<string, string>>
    private static orgChat: OrgChat = null
    /**
     * 私有构造方法，禁止外部实例化
     */
    private constructor() {
        super()
        this.closed = false
        this.stoped = false
        this.lastMsg = {}
        this.openChats = []
        this.chats = ref([])
        this.userId = ref("")
        this.spaceId = ref("")
        this.curMsgs = ref([])
        this.nameMap = ref({})
        this.curChat = ref(null)
        this.authed = ref(false)
        this.isconnecting = false
        this.qunPersons = ref([])
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("/orginone/orgchat/msghub").build()
        this.connection.serverTimeoutInMilliseconds = 8000
        this.connection.keepAliveIntervalInMilliseconds = 3000
        this.connection.onclose(() => {
            this.authed.value = false
            this.reconnect("disconnected from orgchat, await 5s reconnect.")
        })
        this.connection.on("RecvMsg", (data) => {
            this._recvMsg(data)
        })
        this.connection.on("ChatRefresh", async () => {
            await this.getChats()
        })
        this.anyStore = AnyStore.getInstance()
        this.anyStore.subscribed("orgChat", "user", (data) => {
            this._loadChats(data)
        })
    }
    /** 获取单例 */
    public static getInstance() {
        if (this.orgChat == null) {
            this.orgChat = new OrgChat()
        }
        return this.orgChat
    }
    /**
     * 启动连接
     * @param {string} accessToken 授权token
     */
    public async start(accessToken: string) {
        if (this.accessToken != accessToken) {
            await this.stop()
            let res = await api.person.tokenInfo({})
            if (res.success) {
                this.userId.value = res.data.userId
                this.spaceId.value = res.data.spaceId
            } else {
                router.push("/login")
            }
        }
        this.stoped = false
        this.accessToken = accessToken
        await this.anyStore.start(accessToken)
        if (!this.isconnecting && this.connection.state != signalR.HubConnectionState.Connected) {
            this.isconnecting = true
            this.connection.start().then(() => {
                this.isconnecting = false
                setTimeout(() => {
                    if (!this.authed.value) {
                        this.anyStore.get("orgChat", "user").then((res) => {
                            if (res.success) {
                                this._loadChats(res.data)
                            }
                        })
                    }
                }, 500)
            }).catch(() => {
                this.authed.value = false
                this.isconnecting = false
                this.reconnect("connecting to orgchat failed, await 5s reconnect.")
            })
        }
    }
    /**
     * 停止连接
     */
    public async stop() {
        await this.setCurrent(null)
        this.stoped = true
        this.accessToken = ""
        this.authed.value = false
        await this.connection.stop()
        await this.anyStore.stop()
    }
    /** 短线重连 */
    private async reconnect(err: string) {
        if (!this.closed) {
            this.closed = true
            if (!this.stoped) {
                console.error(err)
                setTimeout(() => {
                    this.closed = false
                    this.start(this.accessToken)
                }, 5000)
            }
        }
    }
    /**
     * 新消息hook
     * @param callback 回调
     */
    public onMessage(callback: (data: any) => void) {
        this.messageCallback = callback
    }
    /**
     * 查询名称代码字典
     * @param {string} id 任意ID
     * @returns {string} id对应的名称
     */
    public getName(id: string) {
        let name = this.nameMap.value[id] || ''
        if (name === '' && this.authed.value) {
            this.connection.invoke("GetName", id).then((res) => {
                if (res.success) {
                    this.nameMap.value[id] = res.data
                    if (this.chats.value.length > 0) {
                        this._cacheChats()
                    }
                }
            })
        }
        return name
    }
    /** 获取未读消息数量 */
    public getNoReadCount() {
        let sum: number = 0
        this.chats.value.forEach((item) => {
            item.chats.forEach((chat) => {
                sum += chat.noRead || 0
            })
        })
        return sum > 999 ? "999+" : (sum > 0 ? sum.toString() : "")
    }
    /**
     * 发送消息
     * @param data 消息数据
     * @returns {ResultType} 发送结果
     */
    public async sendMsg(data: any) {
        if (this.authed.value && data) {
            data.msgBody = StringPako.deflate(data.msgBody)
            return await this.connection.invoke("SendMsg", data)
        }
        return BadRequst
    }
    /**
     * 撤回消息
     * @param msg 要撤回的消息
     * @returns {ResultType} 撤回结果
     */
    public async recallMsg(msg: any) {
        if (this.authed.value && msg) {
            return await this.connection.invoke("RecallMsg", msg)
        }
        return BadRequst
    }
    /**
     * 删除消息
     * @param msg 要删除的消息
     */
    public deleteMsg(msg: any) {
        if (!msg.chatId) {
            msg.chatId = msg.id
        }
        this.anyStore.remove(hisMsgCollName, {
            chatId: msg.chatId
        }, "user").then((res: ResultType) => {
            if (res.data === 1 && this.curMsgs.value.length > 0) {
                this.curMsgs.value = this.curMsgs.value.filter(item => {
                    return item.chatId != msg.chatId
                })
            }
        })
    }
    /**
     * 清空会话历史消息
     */
    public async clearMsg() {
        if (this.curChat.value) {
            this.anyStore.remove(hisMsgCollName, {
                sessionId: this.curChat.value.id
            }, "user").then((res: ResultType) => {
                if (res.data > 0 && this.curMsgs.value.length > 0) {
                    this.curMsgs.value = []
                }
            })
        }
    }
    /**
     * 设置当前会话
     * @param {ImMsgChildType} chat 当前会话
     */
    public async setCurrent(chat: ImMsgChildType) {
        if (this.authed.value) {
            if(this.curChat.value){
                this.openChats = this.openChats.filter((item) => {
                    return item.id !== this.curChat.value.id ||
                        item.spaceId !== this.curChat.value.spaceId
                })
            }
            if(chat && chat.id.length > 0){
                this.curMsgs.value = []
                this.qunPersons.value = []
                chat.noRead = 0
                this.curChat.value = chat
                await this.getHistoryMsg()
                if (chat.typeName !== TargetType.Person) {
                    await this.getPersons(true)
                }
                this.openChats.push(this.curChat.value)
            }
            this._cacheChats()
        }
    }
    /**
     * 置顶会话
     * @param needTopSession 需要置顶的会话
     * @param {boolean} type 置顶会话{true},取消置顶{false} 
     */
    public setToppingSession(needTopSession: any, type: boolean) {
        this._handlerMsg({
            msgType: "toping",
            msgBody: type,
            fromId: this.userId.value,
            toId: needTopSession.id,
            spaceId: needTopSession.spaceId,
        })
    }
    /**
     * 获取群组人员
     * @param reset 是否重置
     * @returns {ResponseType} 查询到的人员结果
     */
    public async getPersons(reset: boolean, filter?: string) {
        if (this.authed.value && this.curChat.value) {
            if (reset) {
                this.qunPersons.value = []
            }
            let res = await this.connection.invoke("GetPersons", {
                cohortId: this.curChat.value.id,
                limit: 20,
                filter: filter,
                offset: this.qunPersons.value.length
            })
            if (res.success) {
                this.curChat.value.personNum = res.data.total
                if (res.data.result) {
                    res.data.result.forEach((item: any) => {
                        if (item.team) {
                            item.name = item.team.name
                            let typeName = item.typeName == TargetType.Person ? '' : `[${item.typeName}]`
                            this.nameMap.value[item.id] = `${item.name}${typeName}`
                        }
                        this.qunPersons.value.push(item)
                    })
                }
            }
            return res
        }
        return BadRequst
    }
    /**
     * 查询历史消息
     * @returns 查询到的历史消息
     */
    public async getHistoryMsg() {
        if (this.authed.value && this.curChat.value) {
            if (this.curChat.value.spaceId === this.userId.value) {
                let match: any = { sessionId: this.curChat.value.id }
                if (this.curChat.value.typeName === TargetType.Person) {
                    match.spaceId = this.userId.value
                }
                let res = await this.anyStore.aggregate(hisMsgCollName, {
                    match: match,
                    sort: {
                        createTime: -1
                    },
                    skip: this.curMsgs.value.length,
                    limit: 30
                }, "user")
                if (res.success && Array.isArray(res.data)) {
                    res.data.forEach((item: any) => {
                        item.id = item.chatId
                        item.msgBody = StringPako.inflate(item.msgBody)
                        this.curMsgs.value.unshift(item)
                    })
                    return res.data.length
                }
            } else {
                let funcName = 'QueryFriendMsg'
                let idName = 'friendId'
                if (this.curChat.value.typeName != TargetType.Person) {
                    funcName = 'QueryCohortMsg'
                    idName = 'cohortId'
                }
                let res = await this.connection.invoke(funcName, {
                    limit: 30,
                    [idName]: this.curChat.value.id,
                    offset: this.curMsgs.value.length,
                    spaceId: this.curChat.value.spaceId
                })
                if (res.success) {
                    if (res.data.result) {
                        res.data.result.forEach((item: any) => {
                            item.msgBody = StringPako.inflate(item.msgBody)
                            this.curMsgs.value.unshift(item)
                        })
                        return res.data.result.length
                    }
                }
            }
        }
    }
    /**
     * 从关系中查询会话
     * @returns {ResultType} 会话结果
     */
    public async getChats() {
        if (this.authed.value) {
            let res = await this.connection.invoke("GetChats")
            if (res.success && res.data.groups && res.data.groups.length > 0) {
                const { groups = [] } = res.data
                groups.forEach((group: ImMsgType) => {
                    group.chats = group.chats.map((chat: ImMsgChildType) => {
                        this.chats.value.forEach((g) => {
                            g.chats.forEach((c) => {
                                let isMatch = (c.id == chat.id)
                                if (chat.typeName == TargetType.Person && isMatch) {
                                    isMatch = (c.spaceId == group.id)
                                }
                                if (isMatch) {
                                    c.name = chat.name
                                    chat = c
                                }
                            })
                        })
                        let typeName = chat.typeName == TargetType.Person ? '' : `[${chat.typeName}]`
                        this.nameMap.value[chat.id] = `${chat.name}${typeName}`
                        chat.spaceId = group.id
                        return chat
                    })
                    // 按照时间排序
                    group.chats.sort((a, b) => {
                        return new Date(b.msgTime).getTime() - new Date(a.msgTime).getTime()
                    })
                })
                this.chats.value = [...groups]
                this._cacheChats()
            }
            return res
        }
        return BadRequst
    }
    private _recvMsg(data: any) {
        data = this._handlerMsg(data)
        if (this.messageCallback) {
            this.messageCallback.call(this.messageCallback, data)
        } else {
            notify.showImMsg(this.getNoReadCount(), this.getName(data.toId), data.showTxt)
        }
    }
    private _handlerMsg(data: any) {
        if (this.chats.value.length < 1) {
            setTimeout(() => {
                this._handlerMsg(data)
            }, 1000)
        }
        if (data.msgType === "recall") {
            data = this._recallMsg(data)
        }
        this.chats.value.forEach((item: ImMsgType) => {
            let newChats: ImMsgChildType[] = []
            item.chats.forEach((chat: ImMsgChildType) => {
                let sessionId = data.toId
                if (data.toId === this.userId.value) {
                    sessionId = data.fromId
                }
                let isMatch = (sessionId == chat.id)
                if (chat.typeName == TargetType.Person && isMatch) {
                    isMatch = (data.spaceId == chat.spaceId)
                }
                if (isMatch) {
                    if (data.msgType === "toping") {
                        chat.isTop = data.msgBody
                    } else {
                        let msgBody = StringPako.inflate(data.msgBody)
                        if (chat.spaceId === this.userId.value) {
                            this._cacheMsg(sessionId, data)
                        }
                        chat.msgBody = data.msgBody
                        chat.msgType = data.msgType
                        chat.msgTime = data.createTime
                        if (chat.msgType != "recall") {
                            chat.showTxt = msgBody?.includes('img') ? "[图片]" : msgBody
                        } else {
                            chat.showTxt = data.showTxt
                        }
                        if (chat.typeName !== TargetType.Person) {
                            chat.showTxt = this.nameMap.value[data.fromId] + ": " + chat.showTxt
                        }
                        data.showTxt = chat.showTxt
                        if (this.curChat.value && this.curChat.value.id === chat.id &&
                            this.curChat.value.spaceId === chat.spaceId) {
                            if (data.msgType !== "recall") {
                                this.curMsgs.value.push({
                                    ...data,
                                    msgBody: msgBody
                                })
                            }
                        } else {
                            if (this.openChats.findIndex(i => i.id === chat.id && i.spaceId === chat.spaceId) < 0) {
                                notify.player();
                                chat.noRead = (chat.noRead || 0) + 1
                            }
                        }
                        this.lastMsg = { data: data, chat: chat }
                    }
                    newChats.unshift(chat)
                } else {
                    newChats.push(chat)
                }
            })
            item.chats = newChats
        })
        this._cacheChats()
        return data
    }
    private _recallMsg(data: any) {
        data.showTxt = "撤回了一条消息"
        this.curMsgs.value.forEach((item: any) => {
            if (item.id === data.id) {
                item.showTxt = data.showTxt
                item.msgBody = data.msgBody
                item.msgType = "recall"
                item.createTime = data.createTime
                if (data.fromId === this.userId.value) {
                    item.allowEdit = true
                } else {
                    delete item.allowEdit
                }
            }
        })
        return data
    }
    private async _loadChats(data: any) {
        if (!data) return
        if (data.chats) {
            this.chats.value = []
            data.chats.forEach((item: ImMsgType) => {
                if (item.id === this.spaceId.value) {
                    this.chats.value.unshift(item)
                } else {
                    this.chats.value.push(item)
                }
            })
        }
        this.nameMap.value = data.nameMap || this.nameMap.value
        this.openChats = data.openChats || this.openChats
        let lastMsg = data.lastMsg
        if (lastMsg && lastMsg.chat && lastMsg.data && this.curChat.value
            && this.curChat.value.id === lastMsg.chat.id
            && this.curChat.value.spaceId === lastMsg.chat.spaceId) {
            let exists = this.curMsgs.value.filter((item: any) => {
                return item.id === lastMsg.data.id
            }).length > 0
            if (!exists) {
                lastMsg.data.msgBody = StringPako.inflate(lastMsg.data.msgBody);
                this.curMsgs.value.push(lastMsg.data)
            }
        }
        if (!this.authed.value && this.connection.state == signalR.HubConnectionState.Connected) {
            this.connection.invoke("TokenAuth", this.accessToken).then(() => {
                this.authed.value = true
            })
        }
    }
    private _cacheChats() {
        this.anyStore.set("orgChat", {
            operation: "replaceAll",
            data: {
                name: "我的消息",
                chats: this.chats.value,
                nameMap: this.nameMap.value,
                openChats: this.openChats,
                lastMsg: this.lastMsg
            }
        }, "user")
    }
    private _cacheMsg(sessionId: string, data: any) {
        if (data.msgType === "recall") {
            this.anyStore.update(hisMsgCollName, {
                match: {
                    chatId: data.id
                },
                update: {
                    _set_: {
                        msgBody: data.msgBody,
                        msgType: data.msgType,
                    }
                },
                options: {}
            }, "user")
        } else {
            this.anyStore.insert(hisMsgCollName, {
                chatId: data.id,
                toId: data.toId,
                spaceId: data.spaceId,
                fromId: data.fromId,
                msgType: data.msgType,
                msgBody: data.msgBody,
                sessionId: sessionId,
                createTime: data.createTime
            }, "user")
        }
    }
}

export const chat = OrgChat.getInstance()