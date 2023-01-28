//审批节点默认属性
type Approvalprops= {
  [key:string]: any
}
export const APPROVAL_PROPS:Approvalprops = {
  assignedType: "USER",
  mode: "AND",
  num: 1,
  // sign: false,
  // nobody: {
  //   handler: "TO_PASS",
  //   assignedUser:[]
  // },
  // timeLimit:{
  //   timeout:{
  //     unit: "H",
  //     value: 0
  //   },
  //   handler:{
  //     type: "REFUSE",
  //     notify:{
  //       once: true,
  //       hour: 1
  //     }
  //   }
  // },
  assignedUser:[],
  // formPerms:[],
  // selfSelect: {
  //   multiple: false
  // },
  // leaderTop: {
  //   endCondition: "TOP",
  //   endLevel: 1,
  // },
  // leader:{
  //   level: 1
  // },
  // role:[],
  refuse: {
    type: 'TO_END', //驳回规则 TO_END  TO_NODE  TO_BEFORE
    target: '' //驳回到指定ID的节点
  },
  // formUser: ''
}

//根节点默认属性
export const ROOT_PROPS:Approvalprops = {
  assignedUser: [],
  // formPerms:[]
}

//条件节点默认属性
export const CONDITION_PROPS:Approvalprops = {
  groupsType:"OR", //条件组逻辑关系 OR、AND
  groups:[
    {
      groupType:"AND", //条件组内条件关系 OR、AND
      cids:[], //条件ID集合
      conditions:[] //组内子条件
    }
  ],
  expression: "" //自定义表达式，灵活构建逻辑关系
}

//条件节点 条件数组
export const CONDITION_CONDITIONS:Approvalprops = {
  pos:1,
  paramKey:"",
  paramLabel:"",
  key:"",
  label:"",
  type:"NUMERIC",
  val: null,
  valLabel:""
}

export const getConditionKeys: (type:string) => any[] = (type:string) => { 
  var keys:any[] = [];
  switch(type){
    case "NUMERIC":
      keys = [       
        {code: 'EQ', name:'='},
         {code: 'GT', name:'>'},
         {code: 'GTE', name:'≥'},
         {code: 'LT', name:'<'},
         {code: 'LTE', name:'≤'},
         {code: 'NEQ', name:'≠'}]
      break;
    case "STRING":
    case "DICT":
      keys = [       
        {code: 'EQ', name:'='},
        {code: 'NEQ', name:'≠'}]
      break;  
  }
  return keys 
}

export const getResource:(resource:any,toInt:boolean)=> any = (resource:any,toInt:boolean) =>{
  var str = JSON.stringify(resource)
  if(str.indexOf('NUMERIC')<=-1){
    return resource
  }
  var res = JSON.parse(JSON.stringify(resource))
  for(let key in res){
    if(key=='type' && res['type']=='NUMERIC' && res['val']){
      if(typeof(res['val'])=='string' && toInt){
        let errorStr = res['val'].replace('"','').replace('"','').replace('" ','')
        res['val'] = parseInt(errorStr)
      }
      if(typeof(res['val'])=='number' && !toInt){
        res['val'] = res['val']+''
      }
    }
    if(key=='conditions' && res['conditions'] && res['conditions'].length>0){
      for(let i=0; i<res['conditions'].length; i++){
          res['conditions'][i] = getResource(res['conditions'][i],toInt)
      }
    }
    if(key=='assignedUser' && res['assignedUser'] && res['assignedUser'].length>0){
      for(let i=0; i<res['assignedUser'].length; i++){
          res['assignedUser'][i] = getResource(res['assignedUser'][i],toInt)
      }
    }
    if(key=='branches' && res['branches'] && res['branches'].length>0){
      for(let i=0; i<res['branches'].length; i++){
          res['branches'][i] = getResource(res['branches'][i],toInt)
      }
    }
    if(key=='children' && res['children']){
      res['children'] = getResource(res['children'],toInt)
    }
  }
  return res
}

var formFields:any[] = []

export const setFormFields: (fields:any[]) => void = (fields:any[]) => { 
  formFields = fields
}
export const getFormFields: () => any[] = () => { 
  return formFields
}

export var scale = 100

export const setScale: (val:number) => void = (val:number) => { 
  scale = val
}
export const getScale: () => any = () => { 
  return scale
}


//抄送节点默认属性
export const CC_PROPS:Approvalprops = {
  // shouldAdd: false,
  assignedUser: [],
  // formPerms:[]
}

//触发器节点默认属性
export const TRIGGER_PROPS:Approvalprops = {
  type: 'WEBHOOK',
  http:{
    method: 'GET', //请求方法 支持GET/POST
    url: '', //URL地址，可以直接带参数
    headers: [ //http header
      {
        name: '',
        isField: true,
        value: '' //支持表达式 ${xxx} xxx为表单字段名称
      }
    ],
    contentType: 'FORM', //请求参数类型
    params:[ //请求参数
      {
        name: '',
        isField: true, //是表单字段还是自定义
        value: '' //支持表达式 ${xxx} xxx为表单字段名称
      }
    ],
    retry: 1,
    handlerByScript: false,
    success: 'function handlerOk(res) {\n  return true;\n}',
    fail: 'function handlerFail(res) {\n  return true;\n}'
  },
  email:{
    subject: '',
    to: [],
    content: ''
  }
}

//延时节点默认属性
export const DELAY_PROPS = {
  type: "FIXED", //延时类型 FIXED:到达当前节点后延时固定时长 、AUTO:延时到 dateTime设置的时间
  time: 0, //延时时间
  unit: "M", //时间单位 D天 H小时 M分钟
  dateTime: "" //如果当天没有超过设置的此时间点，就延时到这个指定的时间，到了就直接跳过不延时
}

export default {
  APPROVAL_PROPS, CC_PROPS, DELAY_PROPS, CONDITION_PROPS, CONDITION_CONDITIONS, ROOT_PROPS, TRIGGER_PROPS, getConditionKeys, setFormFields, getFormFields, getResource, setScale, getScale, scale
}
