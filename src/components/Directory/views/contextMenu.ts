import ContextMenu from '@imengyu/vue3-context-menu'
import {h} from 'vue'
import { IDEntity } from '@/ts/core'

/** 右键菜单 */
export const onContextMenu = (e : MouseEvent,item: IDEntity, getMenu: Function)=> {
  e.preventDefault()
  const cxtMenu = getMenu(item)
  // TODO:
  console.log(cxtMenu);
  // 处理cxtMenu的数据
  const getLegalMenu = (origin:any)=>{
    if(!origin) return []
    return origin.map((i:any)=>{
      return {
        label: i.label,
        icon: h(i.icon?.name, i.icon?.args),
        onClick: ()=>cxtMenu.onClick(i),
        children: getLegalMenu(i.children)
      }
    })
  }
  // @imengyu/vue3-context-menu可以接受的menu数据
  const items = getLegalMenu(cxtMenu.items)
  // 菜单项为空则不生成菜单
  if(items.length == 0) return
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: items,
    zIndex: 10000
  })
}