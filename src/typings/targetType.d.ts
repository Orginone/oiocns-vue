type TargetModel = {
    id: string,
    name: string,
    code: string,
    typeName: string,
    createTime: string,
    team: TeamModel,
}

type TeamModel = {
    id: string,
    name: string,
    code: string,
    remark: string,
    createTime: string,
}

type OrgTreeModel = {
    id: string,
    label: string,
    children: OrgTreeModel[],
    data: OrgNodeModel
}

type OrgNodeModel = {
    id: string,
    name: string,
    code: string,
    thingId: string,
    BelongId: string,
    typeName: string,
    teamName: string,
    teamCode: string,
    authAdmin: boolean,
    teamRemark: string,
    parentId: string,
    teamAuthId: string
    createTime: string,
}

type AuthorityModel = {
    id: string,
    name: string,
    code: string,
    belongId: string,
    remark: string,
    public: boolean,
    ParentId: string,
}

type IdentityModel = {
    id: string,
    name: string,
    code: string,
    belongId: string,
    remark: string,
    authId: string,
    authority: AuthorityModel
}