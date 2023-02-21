import api from '@/services'
import router from '@/router'

enum OrgAuths {
    SuperAdmin = "super-admin",
    RelationAdmin = "relation-admin",
    ThingAdmin = "thing-admin",
    MarketAdmin = "market-admin",
    ApplicationAdmin = "application-admin"
}


class Authority {
    private userId: string
    private spaceId: string
    private identitys: IdentityModel[]
    private userInfo: TargetModel
    private spaceInfo: TargetModel
    constructor() {
        this.spaceId = ""
        this.userId = ""
        this.identitys = []
    }
    /**
     * 获取当前用户ID
     * @returns 用户ID
     */
    getUserId() {
        return this.userId
    }
    /**
     * 获取当前工作空间ID
     * @returns 空间ID
     */
    getSpaceId() {
        return this.spaceId
    }
    /**
     * 获取当前工作空间信息
     * @returns 
     */
    getSpaceInfo() {
        return this.spaceInfo || {typeName:"单位"}
    }
    /**
     * 是否为用户个人空间
     */
    isUserSpace(){
        return this.spaceId == this.userId
    }
    /**加载当前登录信息 */
    async Load() {
        let res = await api.person.tokenInfo({})
        if (res.success) {
            this.userId = res.data.userId
            this.spaceId = res.data.spaceId
            
            this.identitys = res.data.identitys
            this.userInfo = res.data.userInfo
            this.spaceInfo = res.data.spaceInfo
        } else {
            router.push("/login")
        }
        return res.data
    }
    /** 是否包含对应权限
     * @param auths 权限数组
     * @param targetIds 组织数组
     */
    private hasTargetsAuth(auths: string[], targetIds: string[]) {
        return this.identitys.filter((item) => {
            if(!item.authority){
                return false
            }
            if (!item.authority.belongId) {
                return targetIds.includes(item.belongId)
                    && auths.includes(item.authority.code)
            }
            return false
        }).length > 0
    }
    /**
     * 获取组织赋予我的身份
     * @param id 组织ID
     * @return {string} 身份数组,用;隔开
     */
    GetTargetIdentitys(id: string) {
        let names = this.identitys.filter((item) => {
            return item.belongId === id
        }).map((item) => {
            if (item.belongId === id) {
                return item.name
            }
        })
        if (names.length > 0){
            return names.join(";")
        }
        return "暂无"
    }
    /** 是否为单位空间 */
    IsCompanySpace(){
        return this.spaceId != this.userId
    }
    /** 是否为组织管理员
     * @param {string[]} ids 组织Id数组，任意匹配即可
     */
    IsSuperAdmin(ids: string[]) {
        return this.hasTargetsAuth([OrgAuths.SuperAdmin], ids)
    }
    /** 是否为组织关系管理员
     * @param {string[]} ids 组织Id数组，任意匹配即可
     */
    IsRelationAdmin(ids: string[]) {
        return this.hasTargetsAuth([OrgAuths.SuperAdmin, OrgAuths.RelationAdmin], ids)
    }
    /** 是否为组织物资管理员
     * @param {string[]} ids 组织Id数组，任意匹配即可
     */
    IsThingAdmin(ids: string[]) {
        return this.hasTargetsAuth([OrgAuths.SuperAdmin, OrgAuths.ThingAdmin], ids)
    }
    /** 是否为组织商店管理员
     * @param {string[]} ids 组织Id数组，任意匹配即可
     */
    IsMarketAdmin(ids: string[]) {
        return this.hasTargetsAuth([OrgAuths.SuperAdmin, OrgAuths.MarketAdmin], ids)
    }
    /** 是否为组织应用管理员
     * @param {string[]} ids 组织Id数组，任意匹配即可
     */
    IsApplicationAdmin(ids: string[]) {
        return this.hasTargetsAuth([OrgAuths.SuperAdmin, OrgAuths.ThingAdmin, OrgAuths.ApplicationAdmin], ids)
    }
    /** 是否为空间管理员 */
    IsSpaceSuperAdmin() {
        return this.IsSuperAdmin([this.spaceId])
    }
    /** 是否为空间关系管理员 */
    IsSpaceRelationAdmin() {
        return this.IsRelationAdmin([this.spaceId])
    }
    /** 是否为空间物资管理员 */
    IsSpaceThingAdmin() {
        return this.IsThingAdmin([this.spaceId])
    }
    /** 是否为空间商店管理员 */
    IsSpaceMarketAdmin() {
        return this.IsMarketAdmin([this.spaceId])
    }
    /** 是否为空间应用管理员 */
    IsSpaceApplicationAdmin() {
        return this.IsApplicationAdmin([this.spaceId])
    }
}
const authority = new Authority()
export default authority

