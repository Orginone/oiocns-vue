type XMixin = {
  // 状态
  status: number;
  // 创建人员ID
  createUser: string;
  // 更新人员ID
  updateUser: string;
  // 修改次数
  version: string;
  // 创建时间
  createTime: string;
  // 更新时间
  updateTime: string;
};

//度量特性
export type XAttribute = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 值类型
  valueType: string;
  // 公开的
  public: boolean;
  // 单位
  unit: string;
  // 选择字典的类型ID
  dictId: string;
  // 备注
  remark: string;
  // 类别ID
  speciesId: string;
  // 工作职权Id
  authId: string;
} & XMixin;

//度量特性查询返回集合
export type XAttributeArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XAttribute[];
};

//职权
export type XAuthority = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 备注
  remark: string;
  // 公开的
  public: boolean;
  // 上级职权ID
  parentId: string;
} & XMixin;

//职权查询返回集合
export type XAuthorityArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XAuthority[];
};

//字典类型
export type XDict = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 备注
  remark: string;
  // 公开的
  public: boolean;
} & XMixin;

//枚举字典项
export type XDictItem = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 值
  value: string;
  // 公开的
  public: boolean;
  // 创建组织/个人
  belongId: string;
  // 字典类型ID
  dictId: string;
} & XMixin;

//应用资源分发
export type XExtend = {
  // 雪花ID
  id: string;
  // 源对象
  sourceId: string;
  // 目标类型
  destType: string;
  // 目标对象Id
  destId: string;
} & XMixin;

//流程定义
export type XFlowDefine = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编码
  code: string;
  // 流程内容Json
  content: string;
  // 备注
  remark: string;
} & XMixin;

//流程定义查询返回集合
export type XFlowDefineArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XFlowDefine[];
};

//流程实例
export type XFlowInstance = {
  // 雪花ID
  id: string;
  // 流程定义Id
  defineId: string;
  // 应用Id
  productId: string;
  // 标题
  title: string;
  // 展示内容类型
  contentType: string;
  // 展示内容
  content: string;
  // 表单数据
  data: string;
  // 回调钩子
  hook: string;
} & XMixin;

//流程实例查询返回集合
export type XFlowInstanceArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XFlowInstance[];
};

//流程节点数据
export type XFlowRecord = {
  // 雪花ID
  id: string;
  // 审批人员
  targetId: string;
  // 节点任务
  taskId: string;
  // 评论
  comment: string;
} & XMixin;

//流程对应表
export type XFlowRelation = {
  // 雪花ID
  id: string;
  // 产品Id
  productId: string;
  // 业务编号
  functionCode: string;
  // 流程定义Id
  defineId: string;
} & XMixin;

//流程任务
export type XFlowTask = {
  // 雪花ID
  id: string;
  // 流程定义节点id
  nodeId: string;
  // 流程实例id
  instanceId: string;
  // 节点分配目标Id
  identityId: string;
  // 审批人员
  personIds: string;
} & XMixin;

//流程任务查询返回集合
export type XFlowTaskArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XFlowTask[];
};

//流程任务
export type XFlowTaskHistory = {
  // 雪花ID
  id: string;
  // 流程定义节点id
  nodeId: string;
  // 流程实例id
  instanceId: string;
  // 节点分配目标Id
  identityId: string;
} & XMixin;

//流程任务查询返回集合
export type XFlowTaskHistoryArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XFlowTaskHistory[];
};

//身份
export type XIdentity = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 备注
  remark: string;
  // 职权Id
  authId: string;
} & XMixin;

//身份查询返回集合
export type XIdentityArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XIdentity[];
};

//即时通讯
export type XImMsg = {
  // 雪花ID
  id: string;
  // 工作空间Id
  spaceId: string;
  // 发起方Id
  fromId: string;
  // 接收方Id
  toId: string;
  // 消息类型
  msgType: string;
  // 消息体
  msgBody: string;
} & XMixin;

//及时通讯表查询返回集合
export type XImMsgArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XImMsg[];
};

//交易市场
export type XMarket = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 备注
  remark: string;
  // 公开的
  public: boolean;
} & XMixin;

//交易市场查询返回集合
export type XMarketArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XMarket[];
};

//组织/个人与市场关系
export type XMarketRelation = {
  // 雪花ID
  id: string;
  // 市场ID
  marketId: string;
  // 组织/个人ID
  targetId: string;
} & XMixin;

//组织/个人与市场关系表查询返回集合
export type XMarketRelationArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XMarketRelation[];
};

//商品信息
export type XMerchandise = {
  // 雪花ID
  id: string;
  // 标题
  caption: string;
  // 产品ID
  productId: string;
  // 出售权属
  sellAuth: string;
  // 有效期
  days: string;
  // 商品出售市场ID
  marketId: string;
  // 描述信息
  information: string;
} & XMixin;

//商品信息查询返回集合
export type XMerchandiseArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XMerchandise[];
};

//采购订单
export type XOrder = {
  // 雪花ID
  id: string;
  // 存证ID
  nftId: string;
  // 名称
  name: string;
  // 编号
  code: string;
} & XMixin;

//采购订单查询返回集合
export type XOrderArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XOrder[];
};

//订单详情
export type XOrderDetail = {
  // 雪花ID
  id: string;
  // 订单ID
  orderId: string;
  // 商品ID
  merchandiseId: string;
  // 卖方ID
  sellerId: string;
  // 卖方产品来源
  productSource: string;
  // 出售权属
  sellAuth: string;
  // 有效期
  days: string;
  // 标题
  caption: string;
} & XMixin;

//订单详情查询返回集合
export type XOrderDetailArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XOrderDetail[];
};

//支付详情
export type XOrderPay = {
  // 雪花ID
  id: string;
  // 订单ID
  orderDetailId: string;
  // 支付方式
  paymentType: string;
} & XMixin;

//支付详情表查询返回集合
export type XOrderPayArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XOrderPay[];
};

//产品信息
export type XProduct = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 来源
  source: string;
  // 权属
  authority: string;
  // 对哪一类制定的标准
  typeName: string;
  // 归属组织/个人
  belongId: string;
  // 元数据Id
  thingId: string;
  // 订单ID
  orderId: string;
  // 过期时间
  endTime: string;
  // 备注
  remark: string;
} & XMixin;

//产品信息查询返回集合
export type XProductArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XProduct[];
};

//组织/个人关系
export type XRelation = {
  // 雪花ID
  id: string;
  // 对象ID
  targetId: string;
  // 组织ID
  teamId: string;
} & XMixin;

//组织/个人关系表查询返回集合
export type XRelationArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XRelation[];
};

//应用资源
export type XResource = {
  // 雪花ID
  id: string;
  // 编号
  code: string;
  // 名称
  name: string;
  // 产品ID
  productId: string;
  // 访问私钥
  privateKey: string;
  // 入口
  link: string;
  // 流程项
  flows: string;
  // 组件
  components: string;
} & XMixin;

//应用资源查询返回集合
export type XResourceArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XResource[];
};

//规则与度量标准关系
export type XRuleAttr = {
  // 雪花ID
  id: string;
  // 规则ID
  ruleId: string;
  // 度量标准ID
  attrId: string;
} & XMixin;

//标准要求
export type XRuleStd = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 备注
  remark: string;
  // 对哪一类制定的标准
  typeName: string;
  // 组织/个人ID
  targetId: string;
  // 容器ID
  containerId: string;
} & XMixin;

//类别定义
export type XSpecies = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 备注
  remark: string;
  // 公开的
  public: boolean;
  // 父类别ID
  parentId: string;
  // 工作职权Id
  authId: string;
} & XMixin;

//商品暂存
export type XStaging = {
  // 雪花ID
  id: string;
  // 商品ID
  merchandiseId: string;
  // 创建组织/个人
  belongId: string;
  // 订单采购的市场
  marketId: string;
  // 数量
  number: string;
} & XMixin;

//商品暂存查询返回集合
export type XStagingArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XStaging[];
};

//组织/个人
export type XTarget = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 类型
  typeName: string;
  // 归属
  belongId: string;
  // 元数据
  thingId: string;
} & XMixin;

//组织/个人查询返回集合
export type XTargetArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XTarget[];
};

//虚拟组织
export type XTeam = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 实体
  targetId: string;
  // 备注
  remark: string;
} & XMixin;

//虚拟组织查询返回集合
export type XTeamArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XTeam[];
};

//(物/存在)
export type XThing = {
  // 雪花ID
  id: string;
  // 链上ID
  chainId: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 备注
  remark: string;
} & XMixin;

//(物/存在)表查询返回集合
export type XThingArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XThing[];
};

//物的度量特性
export type XThingAttr = {
  // 雪花ID
  id: string;
  // 属性ID
  attrId: string;
  // 元数据ID
  thingId: string;
  // 关系ID
  relationId: string;
  // 描述
  strValue: string;
} & XMixin;

//物的度量特性表查询返回集合
export type XThingAttrArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XThingAttr[];
};

//物的度量特性历史
export type XThingAttrHistroy = {
  // 雪花ID
  id: string;
  // 最新度量ID
  thingAttrId: string;
  // 描述
  strValue: string;
} & XMixin;

//物的度量特性历史查询返回集合
export type XThingAttrHistroyArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XThingAttrHistroy[];
};
