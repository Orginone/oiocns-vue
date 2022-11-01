interface paramsDataType{
    typeName?:string,
    id?:string,
    name?:string,
    
    data?:{
        typeName:string
    }
}
interface cohortType{
    belongId:string,
    code:string,
    id:string,
    name:string,
    teamAuthId?:string,
    teamCode?:string,
    teamName?:string,
    teamRemark?:string,
    thingId?:string
}
interface pageStoreType {
    offset: number
    limit: number
    filter?: string
}