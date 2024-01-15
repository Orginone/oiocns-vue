<!-- 聊天输入区域 -->
<script setup lang="ts">
import { IFile } from '@/ts/core'
import {Smile, VideoCamera,Mic,Folder,Rocket}  from '@/icons/im'
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
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
/** 艾特人员列表数据 */
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
window.addEventListener('click', () => citeShow.value = false)
/** 发送消息 */
const sendMessage = async () => {
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
    <!-- 引用消息 -->
    <div class="cite-text" v-if="citeText">
      <ElIcon class="cite-text-close" @click="closeCite('')" :size="20" style="cursor: pointer;"><Close/></ElIcon>
      <div class="cite-text-content"><parseCiteMsg :item="citeText" /></div>
    </div>        
    <!-- 输入区 & 工具条 -->
    <div class="group-input-box-main">
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
          placeholder="Enter键发送, Alt+Enter键换行。"
          :onValueChanged="(e:any) => {
            const value: string = e.value ?? ''
            if( !value.endsWith('\n')) {
              if (value.endsWith('@')) {
                message = value
                citeShow = true
              } else {
                message = value
              }              
            }
          }"
          :onEnterKey="(e: any) => {
            if (e.event.altKey === true) {
              message = message + '\n'
            } else if (message?.length) {
              sendMessage()
            }
          }"
        />

      </div>    
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
                :size="24" 
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
        <ElIcon title="语音" :size="24" color="#3838b9" @click="ElMessage.warning('功能暂未开放')" ><Mic /></ElIcon>
        <!-- 发送文件 -->
        <ElIcon title="发送文件" :size="24" color="#3838b9" @click="open=true"><Folder /></ElIcon>
        <!-- 视频 -->
        <ElIcon title="视频" :size="24" color="#3838b9" @click="ElMessage.warning('功能暂未开放')"><VideoCamera /></ElIcon>
        <!-- 截屏 -->
        <ElIcon 
          title="截屏(alt+ctrl+a)" 
          :size="18" color="#3838b9" 
          @click="isCut=true"
        >
          <Scissor />
        </ElIcon>
        <!-- 分割线 -->
        <div class="line"></div>
        <!-- 发送按钮 -->
        <ElButton title="发送" link @click="sendMessage">
          <ElIcon 
            :size="24"
            :color="message?.length > 0 ? '#3838b9' : '#909090'"
          >
            <Rocket />
          </ElIcon>
        </ElButton>      
      </div>
    </div>
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
  border-radius: 8px;
  // TODO: color/surface/分割线
  border: 1px solid #E7E8EB;
  padding: 9px 16px;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  gap: 4px;
  .cite-text {
    // TODO: color/surface/次要容器背景
    background-color: #F7F8FA;
    padding: 6px 10px;
    display: flex;
    gap: 4px;
  }
  .group-input-box-main {
    display: flex;
    justify-content:space-between;
    align-items: start;    
    .group-input-box__toolbar {
      align-self: end;
      margin-left: 8px;
      display: flex;
      gap: 12px;
      align-items: center;
      cursor: pointer;
      .line {
        height: 20px;
        width: 0;
        border: 1px solid #EAECF0;
      }
    }
    .group-input-box__input-area {
      flex: 1;
    }
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
