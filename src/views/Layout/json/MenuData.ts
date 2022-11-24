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

    children?: MenuDataItem[];
    [key: string]: any;
}

export type MenuData = [HeaderData, ...MenuDataItem[]];

import storeJosn from './store.json';
import settingJosn from './setting.json';
import detailJosn from './detail.json';
import userJosn from './user.json';
import _ from "lodash";
import { RouteLocationNormalizedLoaded } from "vue-router";


const allJson: Record<string ,MenuData> = {
  storeJosn,
  settingJosn,
  detailJosn,
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
            icon: header.icon,
            backFlag: header.backFlag,
            children
        };
        allMenu.push(topMenu);
    }
    return allMenu;
}
