import {
  IApplication,
  IDEntity,
  IDirectory,
  IEntity,
  IFile,
  IMemeber,
  ISession,
  IStorage,
  ISysFileInfo,
  ITarget,
  TargetType,
} from '@/ts/core'

import orgCtrl from '@/ts/controller'
import { command, model, schema } from '@/ts/base'
import { uploadTemplate } from '../tools/uploadTemplate'
// import TypeIcon from '@/components/Common/GlobalComps/typeIcon'
// import EntityIcon from '@/components/Common/GlobalComps/entityIcon'
import { shareOpenLink } from '@/utils/tools'
// import { log } from 'console';
import entityQrCodeView from './components/entityQrCode.vue'
import uploadFileView from './components/uploadFile.vue'
import { ElMessageBox } from 'element-plus'
import { h } from 'vue'


/** 执行非页面命令 */ 
export const executeCmd = (cmd: string, entity: any) => {
  switch (cmd) {
    case 'qrcode': // 二维码
      return entityQrCode(entity)
    case 'reload': // 刷新目录
      return directoryRefresh(entity, true)
    case 'refresh': 
      return directoryRefresh(entity, false)
    case 'openChat': // TODO:
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
      return uploadFile(entity)
    case 'open':
      // TODO:
      return openDirectory(entity);
    case 'standard':
      // TODO:
      return uploadTemplate(entity);
    case 'online':
    case 'outline':
      // TODO:
      return onlineChanged(cmd, entity);
    case 'activate':
      // TODO:
      return activateStorage(entity);
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
};

/** 进入目录 */
const openDirectory = (entity: IEntity<schema.XEntity> | IFile | ITarget) => {
  if ('identitys' in entity && entity.typeName != TargetType.Station) {
    if (entity.typeName === TargetType.Storage) {
      return false;
    }
    entity = entity.directory;
  }
  if ('isContainer' in entity && entity.isContainer) {
    orgCtrl.currentKey = entity.key;
    orgCtrl.changCallback();
    return;
  }
  return false;
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
  ElMessage.info(`${file.name}已放入剪切板`);
}

/** 剪贴板操作 */
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
  
  // const modal = Modal.confirm({
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
const openChat = (entity: IDirectory | IMemeber | ISession | ITarget) => {
  if ('taskList' in entity) {
    orgCtrl.currentKey = entity.target.session.chatdata.fullId;
  } else if ('fullId' in entity) {
    orgCtrl.currentKey = entity.fullId;
  } else if ('session' in entity) {
    orgCtrl.currentKey = entity.session.chatdata.fullId;
  } else {
    orgCtrl.currentKey = entity.chatdata.fullId;
  }
  command.emitter('executor', 'link', '/chat');
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
const deleteEntity = (entity: IFile, hardDelete: boolean) => {
  console.log('here');
  // Modal.confirm({
  //   okText: '确认',
  //   cancelText: '取消',
  //   title: '删除询问框',
  //   content: (
  //     <div style={{ fontSize: 16 }}>
  //       确认要{hardDelete ? '彻底' : ''}删除{entity.typeName}[{entity.name}]吗?
  //     </div>
  //   ),
  //   onOk: async () => {
  //     const success = await (hardDelete ? entity.hardDelete() : entity.delete());
  //     if (success) {
  //       orgCtrl.changCallback();
  //     }
  //   },
  // });
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