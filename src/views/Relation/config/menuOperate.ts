import orgCtrl from '@/ts/controller';
import { IDepartment, IDirectory, IGroup, ITarget } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import OrgIcons from '@/components/Common/GlobalComps/orgIcons.vue'
import { MenuItemType } from 'typings/globelType';
import { loadFileMenus } from '@/executor/fileOperate';

/** 创建团队菜单 */
const createMenu = (
  target: ITarget | IDirectory,
  children: MenuItemType[],
): MenuItemType => {
  // if ('memberDirectory' in target) {
  //   children.unshift(createMenu(target.memberDirectory, []));
  // }
  return {
    key: target.key,
    item: target,
    label: target.name,
    itemType: target.typeName,
    menus: loadFileMenus(target),
    tag: [target.typeName],
    icon: {},
    children: children,
  };
};

/** 编译部门树 */
const buildDepartmentTree = (departments: IDepartment[]): MenuItemType[] => {
  return departments.map((item) => createMenu(item, buildDepartmentTree(item.children)));
};
/** 编译组织集群树 */
const buildGroupTree = (groups: IGroup[]): MenuItemType[] => {
  return groups.map((item) => createMenu(item, buildGroupTree(item.children)));
};

/** 获取个人菜单 */
const getUserMenu = () => {
  return createMenu(orgCtrl.user, [
    ...orgCtrl.user.cohorts.map((i) => createMenu(i, [])),
  ]);
};

/** 获取组织菜单 */
const getTeamMenu = () => {
  const children: MenuItemType[] = [];
  for (const company of orgCtrl.user.companys) {
    children.push(
      createMenu(company, [
        ...buildDepartmentTree(company.departments),
        ...buildGroupTree(company.groups),
        ...company.cohorts.map((i) => createMenu(i, [])),
      ]),
    );
  }
  return children;
};

/** 加载设置模块菜单 */
export const loadBrowserMenu = () => {
  return {
    key: 'disk',
    label: '关系',
    itemType: 'Tab',
    item: 'disk',
    icon: {name:OrgIcons,args:{setting:true,selected:true}},
    children: [getUserMenu(), ...getTeamMenu()],
  };
};
