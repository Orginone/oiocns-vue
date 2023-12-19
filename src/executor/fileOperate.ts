import { command } from '@/ts/base'
import { OperateModel } from '@/ts/base/model'
import { IFile } from '@/ts/core'
import { entityOperates,IDEntity } from '@/ts/core/public'
import { OperateMenuType } from 'typings/globelType'
import TypeIcon from '@/components/Common/GlobalComps/typeIcon.vue';

/** 加载文件菜单 */
export const loadFileMenus = (file?: IDEntity | IFile | undefined) => {
  if (!file) return []
  const operates: OperateModel[] = []
  if (file?.groupTags?.includes('已删除')) {
    if (file?.directory.target.hasRelationAuth()) {
      operates.push(entityOperates.Restore, entityOperates.HardDelete);
    }
    operates.push(entityOperates.Remark)
  } else {
    operates.push(...file.operates())
  }
  const parseLabel = (label: string) => {
    if ('filedata' in file) {
      return label.replaceAll('{0}', '文件');
    }
    return label.replaceAll('{0}', file.typeName);
  };
  return operates
    .sort((a, b) => a.sort - b.sort)
    .map((o) => {
      return {
        key: o.cmd,
        label: parseLabel(o.label),
        model: o.model ?? 'inside',
        icon: o.menus ? null : {name:TypeIcon ,args:{ iconType:o.iconType, size:16}},
        beforeLoad: async () => {
          command.emitter('executor', o.cmd, file);
          return true;
        },
        children: o.menus
          ?.sort((a, b) => a.sort - b.sort)
          .map((s) => {
            return {
              key: s.cmd,
              label: parseLabel(s.label),
              icon: {name:TypeIcon, args:{iconType:s.iconType, size:16}},
              beforeLoad: async () => {
                command.emitter('executor', s.cmd, file);
                return true;
              },
            };
          }),
      } as OperateMenuType;
    });
};
