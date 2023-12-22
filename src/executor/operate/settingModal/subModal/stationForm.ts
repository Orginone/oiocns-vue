import { IStation, ICompany } from '@/ts/core';
import { TargetModel } from '@/ts/base/model';

interface IProps {
  current: ICompany | IStation;
  finished: (success: boolean) => void;
}
/*
  编辑
*/
const IdentityForm = (current:ICompany | IStation) => {
  const columns =  [
    {
      title: '图标',
      dataIndex: 'icon',
      colProps: { span: 24 },
    },
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '分类名称为必填项' }],
      },
    },
    {
      title: '代码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '分类代码为必填项' }],
      },
    },
    {
      title: '简称',
      dataIndex: 'teamName',
    },
    {
      title: '标识',
      dataIndex: 'teamCode',
    },
    {
      title: '岗位简介',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '岗位简介为必填项' }],
      },
    },
  ];
  return columns 
};

export default IdentityForm;
