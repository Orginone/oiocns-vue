<!-- 聊天输入区域 -->
<script setup lang="ts">
import { IFile } from '@/ts/core'
import {Smile, VideoCamera,Mic,Folder,Rocket}  from '@/icons/im'
import { ElMessage } from 'element-plus'
import { CircleClose } from '@element-plus/icons-vue'
import { IMessage, ISession, ISysFileInfo, MessageType } from '@/ts/core'
import { parseAvatar } from '@/ts/base'
import Cutting from '../components/cutting/index.vue'
import OpenFileDialog from '@/components/OpenFileDialog/index.vue'
import { parseCiteMsg } from '@/views/Chats/components/parseMsg'
import Emoji from '../components/emoji/index.vue'
import PullDown from '../components/pullDown/index.vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import {Scissor} from '@element-plus/icons-vue'
import { DxTextArea } from 'devextreme-vue'

const props = defineProps<{
  chat: ISession
  writeContent: any
  citeText: IMessage | undefined
  closeCite: any
}>()
const message = ref<string>()
const mentions = ref<{text: string,id:string}[]>([])
const openEmoji = ref(false) // 是否打开表情选择器
// 获取重新编辑内容
watch(()=>props.writeContent,(val)=>message.value=val)
// @下拉列表是否展示
const citeShow=ref<boolean>(false); 
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
/** 艾特人员选择 */
const onSelect = (item: any) => {
  citeShow.value=false
  message.value+=item.name
}
/** 点击空白处取消 @ 弹窗 */
window.addEventListener('click', () => {
  citeShow.value = false
})

/** @description: 提交聊天内容 */
const submit = async () => {
  if (message.value.length > 0) {
    const vaildMentions: string[] = [];
    for (const mention of mentions.value) {
      if (message.value.includes(mention.text) && !vaildMentions.includes(mention.id)) {
        vaildMentions.push(mention.id);
      }
    }
    props.chat.sendMessage(MessageType.Text, message.value, vaildMentions, props.citeText);
    message.value = ''
    props.closeCite()
  }
}
/**  @description: 解析聊天内容 */
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
}
/** 是否开启截屏 */
const isCut = ref(false)

/** 选择文件对话框是否可见 */
const open = ref<boolean>(false) 
/** 确认选择文件回调 */
const handleOk = async (files: IFile[]) => {
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
  open.value=false
}

</script>


<template>
  <div class="group-input-box">
    <!-- 工具条 -->
    <div class="group-input-box__toolbar">
      <!-- 表情功能 -->   
      <ElPopover
        :visible="openEmoji"
        :trigger="['click','contextmenu']"
        :showArrow="false"
        placement="top" 
        width="fit-content"
        :hideAfter="0"
      >
        <template #reference>
          <div  style="padding-top: 6px;">
            <ElIcon 
              title="表情"
              :size="18" 
              color='#3838b9' 
              @click="openEmoji=true" 
              @contextmenu="openEmoji=true"
            >
              <Smile/>
            </ElIcon>
          </div>
        </template>
        <template #default>
          <Emoji 
            v-click-outside="()=>openEmoji=false"
            :onSelect="(emoji) => {
              openEmoji = false
              message = message + emoji.native
            }"
          />
        </template>
      </ElPopover>
      <!-- 语音功能 -->
      <ElIcon title="语音" :size="18" color="#3838b9" @click="ElMessage.warning('功能暂未开放')" ><Mic /></ElIcon>
      <!-- 发送文件 -->
      <ElIcon title="发送文件" :size="18" color="#3838b9" @click="open=true"><Folder /></ElIcon>
      <!-- 视频 -->
      <ElIcon title="视频" :size="18" color="#3838b9" @click="ElMessage.warning('功能暂未开放')"><VideoCamera /></ElIcon>
      <!-- 截屏 -->
      <ElIcon 
        title="截屏(alt+ctrl+a)" 
        :size="18" color="#3838b9" 
        @click="isCut=true"
      >
        <Scissor />
      </ElIcon>
    </div>
    <!-- 输入区 -->
    <div class="group-input-box__input-area">
      <!-- 艾特人员下拉列表 -->
      <PullDown
        v-if="citeShow"
        :people="peopleList"
        :onSelect="onSelect"
      />
      <DxTextArea
        :value="message"
        width='100%'
        :maxHeight="200"
        :showClearButton="true"
        :autoResizeEnabled="true"
        stylingMode="underlined"
        valueChangeEvent="input"
        style="font-size: 16px"
        :placeholder="`发送到${props.chat.name}`"
        :onValueChanged="(e:any) => {
          const value: string = e.value ?? '';
          if (value.endsWith('@')) {
            message = value
            citeShow = true
          } else {
            message = value
          }
        }"
      />
      <div v-if="citeText" class="cite-text">
        <div class="cite-text__content"><parseCiteMsg :item="citeText" /></div>
        <ElIcon class="cite-text__close-icon" @click="closeCite('')"><CircleClose/></ElIcon>
      </div>
    </div>
    <!-- 发送按钮 -->
    <ElIcon title="发送"
      :size="26"
      @click="submit"
      :color="message?.length > 0 ? '#3838b9' : '#909090'"
    >
      <Rocket />
    </ElIcon>
  </div>
  <!-- 截图功能 -->
  <Cutting
    :open="isCut"
    :onClose="(file: any) => isCut = false"
  />
  <!-- 选择文件对话框-->
  <OpenFileDialog
    v-if="open"
    rootKey='disk'
    :accepts="['文件']"
    allowInherited
    :current-key="chat.target.directory.key"
    :onCancel="()=>open=false"
    :onOk="handleOk"
  />
</template>


<style lang="less" scoped>
.group-input-box {
  display: flex;
  gap: 16px;
  justify-content:space-between;
  align-items: end;
  margin: 10px 8px 0;

  .group-input-box__toolbar {
    display: flex;
    gap: 10px;
    align-items: center;
    cursor: pointer;
  }
  .group-input-box__input-area {
    flex: 1;
    // padding: 12px 24px 0 12px;
    // display: flex;
    // flex-direction: column;
    // overflow-y: auto;

    // Todo: 根据Bem原则待修改
    .citeSelect {
      width: 80px;
      height: 0;
      z-index: -1;
    }

    .textarea {
      flex: 1;
      max-height: 200px;
      overflow-y: auto;
      outline: none;
      border: none;
      &::-webkit-scrollbar{
        background-color: transparent;
      }
      // 文本换行
      :deep(>span) {
        white-space: normal !important;
      }
      .emoji {
        width: 20px;
        height: 20px;
        margin: 3px;
      }
      :deep(.cutImg) {
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
