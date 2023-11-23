import { MenuType } from './menuType'
import * as im from '@/icons/im'
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import orgCtrl from '@/ts/controller'
import { MenuItemType } from '@/typings/globelType'
import { ISession } from '@/ts/core'
import OrgIcons from '@/components/Common/GlobalComps/orgIcons.vue'

/** 创建会话菜单 */
const createChatMenu = (chat: ISession, children: MenuItemType[]) => {
  return {
    key: chat.chatdata.fullId,
    item: chat,
    label: chat.chatdata.chatName,
    tag: chat.chatdata.labels,
    itemType: MenuType.Chat,
    menus: [
      {
        key: '标记为未读',
        label: '标记为未读',
        icon: im.Bell,
        model: 'outside',
      },
    ],
    icon: {name:EntityIcon, args:{notAvatar:true, entity:chat.metadata, size:18}},
    children: children,
  };
};
/** 加载通讯录菜单 */
const loadBookMenu = () => {
  const companyItems = [];
  for (const company of orgCtrl.user.companys) {
    const innnerChats = [];
    for (const item of company.departments) {
      innnerChats.push(...item.chats.filter((i) => i.isMyChat));
    }
    companyItems.push({
      key: company.key + '同事',
      label: company.name,
      item: company.chats.filter((i) => i.isMyChat),
      itemType: MenuType.Books,
      icon: {name:EntityIcon,args:{entity:company.metadata,size:18}},
      company,
      children: [
        createChatMenu(
          company.session,
          company.memberChats.map((item) => createChatMenu(item, [])),
        ),
        ...company.cohortChats
          .filter((i) => i.isMyChat)
          .map((item) => createChatMenu(item, [])),
      ],
    });
  }
  return [
    {
      key: orgCtrl.user.key,
      label: orgCtrl.user.session.chatdata.chatName,
      itemType: orgCtrl.user.session.chatdata.chatName,
      item: orgCtrl.user.chats.filter((i) => i.isMyChat),
      children: [
        createChatMenu(
          orgCtrl.user.session,
          orgCtrl.user.memberChats.map((chat) => createChatMenu(chat, [])),
        ),
        ...orgCtrl.user.cohortChats
          .filter((i) => i.isMyChat)
          .map((item) => createChatMenu(item, [])),
      ],
      icon: {name:EntityIcon, args:{entity:orgCtrl.user.metadata, size:18}},
    },
    ...companyItems,
  ];
};
/** 加载会话菜单 */
export const loadChatMenu = () => {
  const chatMenus = {
    key: '沟通',
    label: '沟通',
    itemType: 'Tab',
    children: [],
    icon: {name:OrgIcons,args:{chat:true,selected:true}},
  } as MenuItemType;
  chatMenus.children = loadBookMenu();
  return chatMenus;
};
