import { ISession } from '@/ts/core';
import { XTarget } from '@/ts/base/schema';
import { command } from '@/ts/base';

export const loadChatOperation = (item: ISession | undefined): {title: string, onClick: () => void}[] => {
  const operates: any[] = []
  if (item) {
    if (item.chatdata.noReadCount < 1) {
      // 标记为未读
      operates.push({
        title:"标记为未读",
        onClick: async () => {
          item.chatdata.noReadCount += 1;
          item.cacheChatData(true);
          command.emitterFlag('session');
        }
      })
    }
    if (item.chatdata.isToping) {
      // 取消置顶
      operates.push({
          title:"取消置顶",
          onClick: async () => {
            item.chatdata.isToping = false;
            item.cacheChatData(true);
            command.emitterFlag('session');
          }
        })
    } else {
      // 置顶会话
      operates.push({
          title:"置顶会话",
          onClick: async () => {
            item.chatdata.isToping = true;
            item.cacheChatData(true);
            command.emitterFlag('session');
          }
        })
    }
    // 加好友
    if (!item.isFriend) {
      operates.push({
        title:"加好友",
        onClick:async () => {
          if (await item.target.user.pullMembers([item.metadata as XTarget])) {
            command.emitterFlag('session');
          }
        }
      })
    }
  }
  return operates
}
