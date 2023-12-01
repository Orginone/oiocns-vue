// import OpenFileDialog, { IFileDialogProps } from '@/components/OpenFileDialog/index.vue'
import { schema } from '@/ts/base'
// import React, { ReactNode, useContext, useState } from 'react';
import { IExistTypeProps } from '../IExistTypeEditor'
import cls from './index.module.less'
import { CircleClose } from '@element-plus/icons-vue'
import { IFile } from '@/ts/core'
import { pick } from 'lodash'
import { VNode } from 'vue'
import File from './File.vue'
import TipDesignText from './TipDesignText.vue'
import TipText from './TipText.vue'
import Delete from './Delete.vue'
export {File,TipDesignText,TipText,Delete}

export interface SEntity extends Pick<schema.XEntity, 'id' | 'name'> {}
export interface SProperty extends SEntity {
  valueType: string;
  unit?: string;
}
// export interface IProps extends Omit<IFileDialogProps, 'rootKey' | 'onCancel'> {
//   children: VNode;
// }
export interface IProps{
  title?: string
  /** 允许选择的文件类型 */
  accepts: string[]
  /** 是否允许多选 */
  multiple?: boolean
  /** 最大选中数量 */
  maxCount?: number
  // rootKey: string
  currentKey?: string
  excludeIds?: string[]
  allowInherited?: boolean
  /** 确认回调 */
  onOk: (files: IFile[]) => void;
  // onCancel: () => void
  children: VNode;
}
export interface TextProps {
  value?: string;
  children?: ReactNode;
  width?: string | number;
  height?: string | number;
}
interface IBase extends IExistTypeProps<any> {
  accepts: string[];
  showName: any;
  onOk: (fs: IFile[]) => void;
}

// TODO:
// export const BaseFile: React.FC<IBase> = (props) => {
//   return (
//     <File onOk={props.onOk} accepts={props.accepts}>
//       <TipDesignText value={props.showName}>
//         <Delete {...props} />
//       </TipDesignText>
//     </File>
//   );
// };

// export const Picture: React.FC<IExistTypeProps<SEntity>> = (props) => {
//   return (
//     <BaseFile
//       {...props}
//       accepts={['图片']}
//       showName={props.value?.name ?? '绑定图片'}
//       onOk={(fs) => props.onChange(pick(fs[0].metadata, 'id', 'name'))}
//     />
//   );
// };

// export const Work: React.FC<IExistTypeProps<SEntity>> = (props) => {
//   return (
//     <BaseFile
//       {...props}
//       accepts={['办事']}
//       showName={props.value?.name ?? '绑定办事'}
//       onOk={(fs) => props.onChange(pick(fs[0].metadata, 'id', 'name'))}
//     />
//   );
// };

// export const Form: React.FC<IExistTypeProps<SEntity>> = (props) => {
//   return (
//     <BaseFile
//       {...props}
//       accepts={['表单']}
//       showName={props.value?.name ?? '绑定表单'}
//       onOk={(fs) => props.onChange(pick(fs[0].metadata, 'id', 'name'))}
//     />
//   );
// };
