import orgCtrl, { Controller } from '@/ts/controller';
import { MenuItemType } from '@/typings/globelType';
import { findMenuItemByKey } from '@/utils/tools';
import { generateUuid } from '@/ts/base/common';
import { Ref } from 'vue';
/**
 * 监听控制器刷新hook
 * @param ctrl 控制器
 * @returns hooks 常量
 */

const useMenuUpdate = (
  loadMenu: () => MenuItemType,
  controller?: Controller,
): [
  Ref<string>,
  Ref<MenuItemType | undefined>,
  Ref<MenuItemType | undefined>,
  (item: MenuItemType) => void,
] => {
  const key = ref<string>('');
  const rootMenu = ref<MenuItemType>();
  const selectMenu = ref<MenuItemType>();
  const ctrl = controller || orgCtrl;

  /** 刷新菜单 */
  const refreshMenu = () => {
    key.value = generateUuid();
    const newMenus = loadMenu();
    var item = findMenuItemByKey(newMenus, ctrl.currentKey);
    item === undefined ? item = newMenus: ''
    ctrl.currentKey = item.key as string;
    selectMenu.value = item
    rootMenu.value = newMenus
  };

  /** 选中菜单 */
  const onSelectMenu = (item: MenuItemType | string) => {
    if (typeof item === 'string') {
      ctrl.currentKey = item;
    } else {
      ctrl.currentKey = item.key as string;
    }
    refreshMenu();
  };

  onMounted(() => {
    const id = ctrl.subscribe((k) => {
      key.value = k;
      refreshMenu();
    });
    return () => {
      ctrl.unsubscribe(id);
    };
  })


  return [key, rootMenu, selectMenu, onSelectMenu];
}

export default useMenuUpdate;
