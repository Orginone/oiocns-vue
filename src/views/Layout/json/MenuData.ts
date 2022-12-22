import { TreeNodeBase } from "@/utils/tree";

export interface HeaderData {
    icon?: string;
    title: string;
    backFlag?: boolean;
}

export interface MenuDataItem extends TreeNodeBase {
    name: string;
    $kind: "header" | "menu";
    parentId?: string;
    url?: string;
    isPenultimate?: boolean;
    structure?: boolean;
    num?:number;
    children?: MenuDataItem[];
    [key: string]: any;
}

export type MenuData = [HeaderData, ...MenuDataItem[]];

import storeJosn from './store.json';
import settingJosn from './setting.json';
import serviceJosn from './service.json';
import userJosn from './user.json';
import _ from "lodash";
import { RouteLocationNormalizedLoaded } from "vue-router";


const allJson: Record<string ,MenuData> = {
  storeJosn,
  settingJosn,
  serviceJosn,
  userJosn
 } as any;



function setMenuItem(menu: MenuDataItem[], parentId = "") {
    for (const m of menu) {
        m.parentId = parentId;
        m.$kind = "menu";
        
        setMenuItem(m.children || [], m.id);
    }
}


export function createAllMenuTree() {
    const allMenu: MenuDataItem[] = [];
    for (const [key, json] of Object.entries(allJson)) {
        const [header, ...menu] = json;

        const children = _.cloneDeep(menu);
        setMenuItem(children, key);
        
        const topMenu: MenuDataItem = {
            id: key,
            $kind: "header",
            name: header.title,
            title: header.title,
            icon: header.icon,
            backFlag: header.backFlag,
            children
        };
        allMenu.push(topMenu);
    }
    return allMenu;
}


export function findMenu(route: RouteLocationNormalizedLoaded, allMenuItems: MenuDataItem[]) {
  const id = route.meta.id;
  if (!id) {
    console.warn(`路由 ${route.fullPath} 没有id！`);
    return null;
  }
  const matched = allMenuItems.find(m => m.id == id);
  if (!matched) {
    console.warn(`路由 ${route.fullPath} 没有对应的菜单！`);
    return null;
  }

  let current = matched;
  do {
    if (!current.parentId) {
      break;
    }
    const parent = allMenuItems.find(m => m.id == current.parentId);
    if (!parent) {
      console.warn(`找不到菜单 ${current.name} 的父级！`);
      return null;
    }
    current = parent;
  } while (current);

  if (current.$kind != "header") {
    console.warn(`找到的顶级菜单 ${current.name} 是子菜单项！`);
    return null;
  }
  return {
    matched,
    top: current
  };
}

export function findParent(route: RouteLocationNormalizedLoaded, allMenuItems: MenuDataItem[]) {
  const id = route.meta.id;
  if (!id) {
    console.warn(`路由 ${route.fullPath} 没有id！`);
    return null;
  }
  const matched = allMenuItems.find(m => m.id == id);
  if (!matched) {
    console.warn(`路由 ${route.fullPath} 没有对应的菜单！`);
    return null;
  }

  if (!matched.parentId) {
    console.warn(`路由 ${route.fullPath} 是顶级菜单！`);
    return null;
  }

  const parent = allMenuItems.find(m => m.id == matched.parentId);
  if (!parent) {
    console.warn(`找不到菜单 ${matched.name} 的父级！`);
    return null;
  }

  return {
    matched,
    parent
  };
}