import { TreeNodeBase } from "@/utils/tree";

export interface HeaderData {
    icon?: string;
    title: string;
    backFlag?: boolean;
}

export interface MenuDataItem extends TreeNodeBase {
    name: string;
    $kind?: string;
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



export function createAllMenuTree() {
    const allMenu: MenuDataItem[] = [];
    for (const [key, json] of Object.entries(allJson)) {
        const [header, ...menu] = json;

        const children = _.cloneDeep(menu);
        
        const topMenu: MenuDataItem = {
            id: key,
            $kind: "topmenu",
            name: header.title,
            icon: header.icon,
            backFlag: header.backFlag,
            children
        };
        allMenu.push(topMenu);
    }
    return allMenu;
}
