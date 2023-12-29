import ContextMenu from '@imengyu/vue3-context-menu'
import {h} from 'vue'
import { OperateMenuType } from 'typings/globelType'


/** 右键菜单 */
export function onContextMenu (e : MouseEvent, menu: {items: OperateMenuType[], onClick: ({key}:{key:string})=>void}) {
  e.preventDefault()
  // 处理menu的数据
  const getLegalMenu = (origin:any)=>{
    if(!origin) return []
    return origin.map((i:any)=>{
      return {
        label: i.label,
        icon: h(i.icon?.name, i.icon?.args),
        onClick: ()=>menu.onClick(i),
        children: getLegalMenu(i.children)
      }
    })
  }
  // @imengyu/vue3-context-menu可以接受的menu数据
  const items = getLegalMenu(menu.items)
  // 菜单项为空则不生成菜单
  if(items.length == 0) return
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: items,
    zIndex: 10000
  })
}

