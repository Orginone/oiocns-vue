import { IAuthority } from '@/ts/core';

interface Iprops {
  title: string;
  open: boolean;
  handleCancel: () => void;
  handleOk: (result: boolean) => void;
  current: IAuthority;
}
/*
  权限编辑模态框
*/
const createAuthority = (props: Iprops) => {
  console.log('props',props);
  const columns = [
    {
      title: '图标',
      dataIndex: 'icon',
      colProps: { span: 24 },
      value:'',
    },
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
      },
    },
    {
      title: '编码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
      },
    },
    {
      title: '选择共享组织',
      dataIndex: 'shareId',
      valueType: 'select',
      initialValue: props.current.metadata.shareId,
      formItemProps: { rules: [{ required: true, message: '请选择共享组织' }] },
      fieldProps: {
        options: props.current.space.shareTarget.map((i) => {
          return {
            label: i.name,
            value: i.id,
          };
        }),
      },
    },
    {
      title: '是否公开',
      dataIndex: 'public',
      valueType: 'select',
      fieldProps: {
        options: [
          {
            value: true,
            label: '公开',
          },
          {
            value: false,
            label: '不公开',
          },
        ],
      },
      formItemProps: {
        rules: [{ required: true, message: '是否公开为必填项' }],
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '备注' }],
      },
    },
  ];
  return columns;
};

export default createAuthority;
