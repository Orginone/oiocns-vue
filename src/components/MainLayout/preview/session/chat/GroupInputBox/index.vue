<!-- 聊天输入区域 -->
<script setup lang="ts">
import {Smile, VideoCamera,Mic,Folder}  from '@/icons/im'
import { ElMessage } from 'element-plus'
// import { CloseCircleFilled } from '@ant-design/icons'
import { CircleClose } from '@element-plus/icons-vue'
// import React, { useEffect, useState } from 'react'
import { IMessage, ISession, ISysFileInfo, MessageType } from '@/ts/core'
import { parseAvatar } from '@/ts/base'
// import Cutting from '../../cutting';
// import './index.less'
import OpenFileDialog from '@/components/OpenFileDialog/index.vue'
import { parseCiteMsg } from '@/views/Chats/components/parseMsg'
import Emoji from '../components/emoji/index.vue'
import PullDown from '../components/pullDown/index.vue'
import { ClickOutside as vClickOutside } from 'element-plus'


const props = defineProps<{
  chat: ISession;
  writeContent: any;
  citeText: IMessage | undefined;
  closeCite: any;
  /** 回车传递引用消息 */
  enterCiteMsg: any;
}>()

watch(()=>props.writeContent,(val)=>{
  editArea.value.innerHTML=val
})


// 输入区域ref对象
const editArea = ref(null)

const open = ref<boolean>(false) // 选择文件对话框
const openEmoji = ref(false) // 是否打开表情选择器
const IsCut=ref<boolean>(false); // 是否截屏
const citeShow=ref<boolean>(false); // @展示

/** 艾特人员列表 */
const peopleList = computed(()=>{
  return props.chat.members
    .filter((i) => i.id != props.chat.userId)
    .map((i) => {
      return {
        id: i.id,
        name: i.name,
        share: {
          name: i.name,
          typeName: i.typeName,
          avatar: parseAvatar(i.icon),
        },
      };
    })
})



  /** 艾特触发人员选择 */
  const onSelect = (item: any) => {
    citeShow.value=false
    const innerHtml = editArea.value
    if (innerHtml) {
      const node = document.createElement('at');
      node.id = item.id
      node.innerText = `${item.name}`;
      innerHtml.append(node);
      node.focus();
    }
  };

  /** 点击空白处取消 @ 弹窗 */
  window.addEventListener('click', () => {
    citeShow.value = false
  });

  /**
   * @description: 提交聊天内容
   * @return {*}
   */
  const submit = async () => {
    const innerHtml = editArea.value
    if (innerHtml != null) {
      const mentions: string[] = [];
      const text: any =
        innerHtml.childNodes.length > 0
          ? reCreatChatContent(innerHtml.childNodes ?? [], mentions)
          : [innerHtml.innerHTML];
      let massage = text.join('').trim();
      if (massage.length > 0) {
        innerHtml.innerHTML = '发送中,请稍后...';
        props.chat.sendMessage(MessageType.Text, massage, mentions, props.citeText);
      }
      innerHtml.innerHTML = '';
      props.closeCite('');
    }
  };

  /**
   * @description: 解析聊天内容
   * @param {NodeList} elementChild
   * @param mentions
   * @return {*}
   */
  const reCreatChatContent = (
    elementChild: NodeList | any[],
    mentions: string[],
  ): Array<string> => {
    // 判断聊天格式
    const arrElement = Array.from(elementChild);
    if (arrElement.length > 0) {
      return arrElement.map((n) => {
        if (n.nodeName == 'AT') {
          mentions.push(n.id);
        }
        if (n.nodeName == 'IMG') {
          return `$IMG[${n.src}]`;
        }
        return `${n.textContent}`;
      });
    }
    return [];
  };

  // 聊天框初始化内容
  onMounted(() => {
    if (props.writeContent !== null && editArea.value) {
      editArea.value.innerHTML = props.writeContent;
    }
  })

  /**
   * @description: 输入框 键盘指令
   * @param {any} e
   * @return {*}
   */
  const keyDown = (e: any) => {
    let doc = editArea.value
    if (!doc) return;
    if (e.ctrlKey && e.keyCode == 13) {// 换行：ctrl+enter
      const value = doc.innerHTML;
      props.enterCiteMsg(props.citeText);
      if (!value?.includes('<div><br></div>')) {
        doc.innerHTML += '<div><br></div>';
        // 设置光标位置
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(editArea.value);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else if (e.keyCode == 13) {// 发送：enter
      e.preventDefault(); // 阻止浏览器默认换行操作
      props.enterCiteMsg(props.citeText);
      const value = doc.innerHTML.replaceAll('<div><br></div>', '');
      if (value) {
        submit();
      } else {
        return ElMessage.warning('不能发送空值');
      }
    } else if (e.key === '@' && props.chat.members.length > 0) { // 艾特：@
      editArea.value.innerHTML+='@'
      citeShow.value = true
    }
  }

  /** 截屏后放入输入区发出消息 */
  const handleCutImgSelect = async (result: any) => {
    const img = document.createElement('img');
    img.src = result.shareInfo().shareLink;
    img.className = `cutImg`;
    img.style.display = 'block';
    img.style.marginBottom = '10px';
    document.getElementById('innerHtml')?.append(img);
  };

</script>


<template>
  <div class="group-input-box">
    <div class="group-input-box__toolbar">
      <!-- 表情功能 -->   
      <ElPopover
        :visible="openEmoji"
        :trigger="['click','contextmenu']"
        :showArrow="false"
        placement="right" 
        width="fit-content"
        :offset="-175"
        :hideAfter="0"
      >
        <template #reference>
          <div  style="padding-top: 6px;">
            <ElIcon :size="18" color='#9498df' @click="openEmoji=true" @contextmenu="openEmoji=true"><Smile/></ElIcon>
          </div>
        </template>
        <template #default>
          <Emoji 
            v-click-outside="()=>openEmoji=false"
            :onSelect="(emoji) => {
              openEmoji = false;
              editArea?.append(emoji.native);
            }"
          />
        </template>
      </ElPopover>
      <!-- 语音功能 -->
      <ElIcon :size="18" color="#9498df" @click="ElMessage.warning('功能暂未开放')" ><Mic /></ElIcon>
      <!-- 文件 -->
      <ElIcon :size="18" color="#9498df" @click="open=true"><Folder /></ElIcon>
      <!-- 录像机 -->
      <ElIcon :size="18" color="#9498df" @click="ElMessage.warning('功能暂未开放')"><VideoCamera /></ElIcon>
    </div>
    <!-- 输入区 -->
    <div class="group-input-box__input-area">
      <!-- 艾特人员下拉列表 -->
      <PullDown
        v-if="citeShow"
        :people="peopleList"
        :onSelect="onSelect"
        :edit-ref="editArea"
      />
      <!-- 输入框 -->
      <div
        ref="editArea"
        :autoFocus="true"
        class='textarea'
        :contentEditable="true"
        :spellCheck="false"
        placeholder="请输入内容"
        @keydown="keyDown"
      >
      </div>
      <!-- 引用消息 -->
      <div v-if="citeText" class="cite-text">
        <div class="cite-text__content"><parseCiteMsg :item="citeText" /></div>
        <ElIcon class="cite-text__close-icon" @click="closeCite('')"><CircleClose/></ElIcon>
      </div>
    </div>
    <!-- 操作 -->
    <div class="group-input-box__action-bar">
      <ElButton
        type="primary"
        :style="{ color: '#fff', border: 'none' }"
        @click="submit()"
      >
        发送
      </ElButton>
    </div>
  </div>
  <!-- TODO:截图功能 -->
  <!-- <Cutting
    open={IsCut}
    onClose={(file: any) => {
      file && handleCutImgSelect(file);
      setIsCut(false);
    }}
  /> -->
  <!-- 选择文件对话框-->
    <OpenFileDialog
      v-if="open"
      rootKey='disk'
      :accepts="['文件']"
      allowInherited
      :onCancel="()=>open=false"
      :onOk="async (files) => {
        if (files.length > 0) {
          const file = files[0] as ISysFileInfo;
          let msgType = MessageType.File;
          if (file.groupTags.includes('图片')) {
            msgType = MessageType.Image;
          } else if (file.groupTags.includes('视频')) {
            msgType = MessageType.Video;
          }
          await props.chat.sendMessage(msgType, JSON.stringify(file.shareInfo()), []);
        }
        open=false
      }"
    />
</template>


<style lang="scss" scoped>
.group-input-box {
  height: 228px;
  display: flex;
  flex-direction: column;

  &__toolbar {
    height: 34px;
    display: flex;
    gap: 10px;
    align-items: center;
    cursor: pointer;
  }
  &__input-area {
    flex: 1;
    padding: 12px 24px 0 12px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    // Todo: 根据Bem原则待修改
    .citeSelect {
      width: 80px;
      height: 0;
      z-index: -1;
    }

    .textarea {
      flex: 1;
      max-height: 130px;
      overflow-y: auto;
      outline: none;
      border: none;

      .emoji {
        width: 20px;
        height: 20px;
        margin: 3px;
      }

      .cutImg {
        width: 150px !important;
        max-height: 300px;
      }
    }

    .textarea:empty::before {
      content: attr(placeholder);
      position: absolute;
      color: #ccc;
      background-color: transparent;
    }


    .cite-text {
      display: flex;
      &__content {
        background-color: #e5e5e5;
        max-width: 500px;
        word-wrap: break-word;
        word-break: break-all;
        width: fit-content;
        overflow: auto;
        border-radius: 5px;
        padding: 5px;
        font-size: 12px;
        color: #8b8b8b;
        .con_content_txt {
          img {
            width: 100%;
          }
        }
        .con_content_file {
          display: flex;
          text-align: left;
          width: 220px;
          height: 80px;
          background-color: #fffff7;
          padding: 7px 10px;
          margin: 0px 0px;
          margin-top: -20px;
          color: #3e5ed8;
          border-radius: 6px;
          z-index: 1;
          font-size: small;
          word-wrap: break-word;
          word-break: normal;
          position: relative;

          &_info {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            height: 100%;

            &_label {
              width: 140px;
              flex-grow: 1;
              padding-right: 10px;
              display: -webkit-box;
              text-overflow: ellipsis;
              overflow: hidden;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
          }

          &_Icon {
            padding: 5px;
            font-size: 50px;
            background-color: aliceblue;
          }

          // :global {
          //   .ogo-btn-primary {
          //     background-color: #89c6ff85;
          //     border-color: #89c6ff85;
          //     color: #3e5ed8;
          //     box-shadow: none;
          //     text-shadow: none;
          //   }

          //   .ogo-btn-primary:hover {
          //     color: #f4f4ee;
          //   }
          // }
        }
      }

      &__close-icon {
        cursor: pointer;
        color: #d0d0d0;
        height: 14px;
        max-width: 16px;
        margin-left: 4px;
      }
    }
  }

  &__action-bar {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 20px;
  }
}

.emoticons-picker {
  width: 360px;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 10px;
  &__item {
    display: flex;
    align-content: center;
    justify-content: center;
    .emoticon {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
