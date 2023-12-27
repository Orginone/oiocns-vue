import {
  IApplication,
  IDirectory,
  IEntity,
  IFile,
  IMemeber,
  ISession,
  IStorage,
  ISysFileInfo,
  ITarget,
  IWork,
} from '@/ts/core'

import orgCtrl from '@/ts/controller'
import { command, model, schema } from '@/ts/base'
import { uploadBusiness, uploadStandard } from '../tools/uploadTemplate'
import { shareOpenLink } from '@/utils/tools'
import message from '@/utils/message'
import entityQrCodeView from './components/entityQrCode.vue'
import uploadFileView from './components/uploadFile.vue'
import { ElMessageBox } from 'element-plus'
import { h } from 'vue'

/** 执行非页面命令 */ 
export const executeCmd = (cmd: string, entity: any) => {
  switch (cmd) {
    case 'qrcode': // 二维码
      return entityQrCode(entity);
    case 'reload': // 刷新目录
      return directoryRefresh(entity, true);
    case 'refresh': 
      return directoryRefresh(entity, false);
    case 'openChat': // 打开会话
      return openChat(entity);
    case 'download': // 下载
      if ('shareInfo' in entity) {
        const link = (entity as ISysFileInfo).shareInfo().shareLink;
        window.open(shareOpenLink(link, true), '_black');
      }
      return;
    case 'copy':
    case 'move': // TODO:
      return setCopyFiles(cmd, entity);
    case 'parse': // TODO:
      return copyBoard(entity);
    case 'delete': // TODO:
      return deleteEntity(entity, false);
    case 'hardDelete': // TODO:
      return deleteEntity(entity, true);
    case 'restore': // TODO:
      return restoreEntity(entity);
    case 'remove': // TODO:
      return removeMember(entity);
    case 'newFile': // 上传文件
      return uploadFile(entity);
    case 'workForm': // 进入办事
      return openWork(entity);
    case 'standard': // TODO:
      return uploadStandard(entity);
    case 'business': // 上传业务导入模板
      return uploadBusiness(entity);
    case 'online':
    case 'outline': // TODO:
      return onlineChanged(cmd, entity);
    case 'activate': // TODO:
      return activateStorage(entity);
    case 'hslSplit': // TODO:视频切片
      return videoHslSplit(entity);
    case 'removeSession': // 移除会话
      return removeSession(entity);
    case 'topingToggle': // 置顶/取消置顶会话
      return sessionTopingToggle(entity);
    case 'readedToggle': // 已读/未读会话
      return sessionReadedToggle(entity);
    case 'commonToggle': // 移除常用
      return fileCommonToggle(entity);    
    case 'applyFriend': // 申请好友
      return applyFriend(entity);
  }
  return false;
}
/** 弹出二维码 */
const entityQrCode = (entity: IEntity<schema.XEntity>)=>{
  ElMessageBox({
    message:h(entityQrCodeView,{entity}),
    // showConfirmButton: false,
    // showCancelButton: true,
    confirmButtonText: '关闭',
    autofocus: true,
  })
}
/** 刷新目录 */
const directoryRefresh = (dir: IDirectory | IApplication,reload:boolean) => {
  dir.loadContent(reload).then(() => {
    orgCtrl.changCallback()
  })
}
/** 上传文件 */
const uploadFile = (dir: IDirectory) => {
  ElMessageBox({
    message:h(uploadFileView,{dir}),
    title: '文件上传',
    confirmButtonText: '关闭',
    customStyle: {
      maxWidth: 'fit-content'
    }
  })
}

/** 激活存储 */
const activateStorage = (store: IStorage) => {
  if ('activateStorage' in store) {
    store.activateStorage();
  }
}
/** TODO:视频切片 */
const videoHslSplit = (file: ISysFileInfo) => {
  console.log('来这改');
  // const modal = ElMessageBox.confirm({
  //   title: '切片前确认',
  //   content: `视频截屏需要较长的时间,默认等待时间为2s,
  //             如果提示超时并非失败,请等待片刻后尝试刷新。`,
  //   okText: '确认切片',
  //   cancelText: '取消',
  //   onOk: async () => {
  //     await file.hslSplit();
  //     modal.destroy();
  //   },
  //   onCancel: () => {
  //     modal.destroy();
  //   },
  // })
}
/** 移除会话 */
const removeSession = (entity: ISession) => {
  entity.chatdata.recently = false;
  entity.chatdata.lastMessage = undefined;
  entity.cacheChatData();
  orgCtrl.changCallback();
  command.emitter('preview', 'chat', undefined);
};

/** 会话置顶变更 */
const sessionTopingToggle = (entity: ISession) => {
  entity.chatdata.isToping = !entity.chatdata.isToping;
  entity.cacheChatData();
  orgCtrl.changCallback();
};

/** 会话已读/未读变更 */
const sessionReadedToggle = (entity: ISession) => {
  if (entity.chatdata.noReadCount > 0) {
    entity.chatdata.noReadCount = 0;
  } else {
    entity.chatdata.noReadCount = 1;
  }
  entity.cacheChatData();
  orgCtrl.changCallback();
};

/** 申请加为好友 */
const applyFriend = (entity: ISession) => {
  orgCtrl.user.applyJoin([entity.metadata as schema.XTarget]).then(() => {
    orgCtrl.changCallback();
  });
};
/** 进入办事 */
const openWork = (entity: IWork) => {
  orgCtrl.currentKey = entity.key;
  orgCtrl.changCallback();
}
/** 拷贝/剪切文件 */
const setCopyFiles = (cmd: string, file: IFile) => {
  const key = cmd + '_' + file.id;
  for (const k of orgCtrl.user.copyFiles.keys()) {
    if (k.endsWith(file.id)) {
      orgCtrl.user.copyFiles.delete(k);
    }
  }
  orgCtrl.user.copyFiles.set(key, file);
  message.info(`${file.name}已放入剪切板`);
}

/** TODO:剪贴板操作 */
const copyBoard = (dir: IDirectory) => {
  const datasource: any[] = [];

  for (const item of orgCtrl.user.copyFiles.entries()) {
    if (
      (item[1].typeName === '人员' && dir.typeName === '成员目录') ||
      (item[1].typeName !== '人员' && dir.typeName === '目录')
    ) {
      datasource.push({
        key: item[0],
        cmd: item[0].split('_')[0],
        file: item[1],
      });
    }
  }
  console.log('here');
  
  // TODO:const modal = Modal.confirm({
  //   icon: <></>,
  //   width: 500,
  //   cancelText: '取消',
  //   okText: '全部',
  //   onOk: async () => {
  //     for (const item of datasource) {
  //       if (item.cmd === 'copy') {
  //         await item.file.copy(dir);
  //       } else {
  //         await item.file.move(dir);
  //       }
  //       orgCtrl.user.copyFiles.delete(item.key);
  //     }
  //     orgCtrl.changCallback();
  //     modal.destroy();
  //   },
  //   // content: (
  //   //   <List
  //   //     itemLayout="horizontal"
  //   //     dataSource={datasource}
  //   //     renderItem={({ key, cmd, file }) => {
  //   //       return (
  //   //         <List.Item
  //   //           style={{ cursor: 'pointer', padding: 6 }}
  //   //           actions={[
  //   //             <div key={file.name} style={{ width: 60 }}>
  //   //               {cmd === 'copy' ? '复制' : '移动'}
  //   //             </div>,
  //   //           ]}
  //   //           onClick={async () => {
  //   //             modal.destroy();
  //   //             if (cmd === 'copy') {
  //   //               await file.copy(dir);
  //   //             } else {
  //   //               await file.move(dir);
  //   //             }
  //   //             orgCtrl.user.copyFiles.delete(key);
  //   //             orgCtrl.changCallback();
  //   //           }}>
  //   //           <List.Item.Meta
  //   //             avatar={<TypeIcon iconType={file.typeName} size={50} />}
  //   //             title={<strong>{file.name}</strong>}
  //   //             description={<EntityIcon entityId={file.directory.belongId} showName />}
  //   //           />
  //   //         </List.Item>
  //   //       );
  //   //     }}
  //   //   />
  //   // ),
  // });
}


/** 打开会话 */
const openChat = (entity: IMemeber | ITarget) => {
  if (entity.session) {
    entity.session.chatdata.recently = true;
    entity.session.chatdata.lastMsgTime = new Date().getTime();
    entity.session.cacheChatData()
  }
  command.emitter('executor', 'link', '/chat')
  setTimeout(() => {
    command.emitter('session', 'open', entity.session)
  }, 200)
}
/** 恢复实体 */
const restoreEntity = (entity: IFile) => {
  entity.restore().then((success: boolean) => {
    if (success) {
      orgCtrl.changCallback();
    }
  });
}
/** 删除实体 */
const deleteEntity = async(entity: IFile, hardDelete: boolean) => {
  ElMessageBox.confirm(
    '删除询问框',
    '',
    {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      message: h('div',{style:'font-size: 16px'},`确认要${hardDelete ? '彻底' : ''}删除${entity.typeName}[${entity.name}]吗?`)
    }
  ).then(async()=>{
    const success = await (hardDelete ? entity.hardDelete() : entity.delete())
    if (success) {
      orgCtrl.changCallback()
    }
  })
}

/** 移除成员 */
const removeMember = (member: IMemeber) => {
  ElMessageBox.alert(
    `确认要移除成员[${member.name}]吗?`,
    '',
    {
      confirmButtonText: '确认',
      showCancelButton: true,
      cancelButtonText: '取消',
      callback:  () => {
        member.directory.target
        .removeMembers([member.metadata])
        .then((success: boolean) => {
          if (success) {
            orgCtrl.changCallback();
          }
        });
      }
    }
  )
}

/** 上下线提醒 */
const onlineChanged = (cmd: string, info: model.OnlineInfo) => {
  console.log('来这改');
  
  // if (info.userId != '0') {
  //   orgCtrl.user.findEntityAsync(info.userId).then((target) => {
  //     if (target) {
  //       if (cmd === 'online') {
  //         message.success({
  //           duration: 1,
  //           content: (
  //             <div style={{ display: 'contents' }}>
  //               {target.name} [{target.code}] 从{info.remoteAddr}上线啦
  //             </div>
  //           ),
  //         });
  //       } else {
  //         message.error({
  //           duration: 1,
  //           content: (
  //             <div style={{ display: 'contents' }}>
  //               {target.name} [{target.code}] 从{info.remoteAddr}下线啦
  //             </div>
  //           ),
  //         });
  //       }
  //     }
  //   });
  // }
}

/** 常用标签变更 */
const fileCommonToggle = (entity: any) => {
  entity.toggleCommon().then((success: boolean) => {
    if (success) {
      message.info('设置成功')
    }
  });
}