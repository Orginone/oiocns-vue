import { model, schema } from '../ts/base';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'

/** 人员信息列 */
export const PersonColumns = [
  { title: '序号', valueType: 'index', width: 50 },
  {
    title: '名称',
    dataIndex: 'name',
  },
  { title: '账号', dataIndex: 'code' },
  { title: '手机号', dataIndex: ['team', 'code'] },
  {
    title: '座右铭',
    dataIndex: 'remark',
  },
];

/** 身份信息列 */
export const IdentityColumn = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '角色编号',
    dataIndex: 'code',
  },
  {
    title: '角色名称',
    dataIndex: 'name',
  },
  {
    title: '权限',
    dataIndex: 'name',
  },
  {
    title: '组织',
    dataIndex: 'shareId',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

/** 分类子项信息列 */
export const SpeciesItemColumn = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '编号',
    dataIndex: 'code',
    key: 'code',
    width: 200,
  },
  {
    title: '信息',
    dataIndex: 'info',
    key: 'info',
    width: 200,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 150,
  },
  {
    title: '归属组织',
    dataIndex: 'belongId',
    editable: false,
    key: 'belongId',
    width: 200,
  },
  {
    title: '创建人',
    dataIndex: 'createUser',
    editable: false,
    key: 'createUser',
    width: 150,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 200,
    editable: false,
  },
];

/** 补齐物的列 */
export const FullThingColumns = (fields: model.FieldModel[]) => {
  return FullEntityColumns([
    {
      id: 'chainId',
      code: 'chainId',
      name: '标识',
      valueType: '描述型',
      remark: '链标识',
    },
    ...fields,
  ]);
};

/** 补齐实体的列 */
export const FullEntityColumns = (fields: model.FieldModel[]) => {
  return [
    {
      id: 'id',
      code: 'id',
      name: '唯一标识',
      valueType: '描述型',
      remark: '由系统生成的唯一标记,无实义.',
      options: {
        fixed: true,
        visible: true,
      },
    },
    {
      id: 'name',
      code: 'name',
      name: '名称',
      valueType: '描述型',
      remark: '描述信息',
      options: {
        visible: true,
      },
    },
    {
      id: 'code',
      code: 'code',
      name: '代码',
      valueType: '描述型',
      remark: '标识代码',
    },
    ...fields,
    {
      id: 'belongId',
      code: 'belongId',
      name: '归属',
      valueType: '用户型',
      remark: '归属用户',
    },
    {
      id: 'createUser',
      code: 'createUser',
      name: '创建人',
      valueType: '用户型',
      remark: '创建标识的人',
    },
    {
      id: 'updateUser',
      code: 'updateUser',
      name: '变更人',
      valueType: '用户型',
      remark: '变更数据的人',
    },
    {
      id: 'createTime',
      code: 'createTime',
      name: '创建时间',
      valueType: '时间型',
      remark: '创建标识的时间',
    },
    {
      id: 'updateTime',
      code: 'updateTime',
      name: '修改时间',
      valueType: '时间型',
      remark: '最新修改时间',
    },
  ];
};
