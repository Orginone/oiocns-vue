<template>
  <div class="group-input-wrap" @keyup.enter="submit">
    <div class="icons-box">
      <div ref="faceBtnRef" style="margin-top:4px;">
        <el-popover placement="top" :width="400" trigger="click">
          <template #reference>
            <el-icon :size="20">
              <Orange />
            </el-icon>
          </template>
          <ul class="qqface-wrap">
            <!-- <li v-for="(key, value ) in qqfaceMap" @click="handleFaceChoosed(key, value)" :key="value"
              :class="['qqface', `qqface${value}`, 'small']">
            </li> -->
            <li>
              <img class="emoji" v-for="index in 36" :key="index" :src="`/emo/${index}.png`" alt=""
                @click="handleImgChoosed(`/emo/${index}.png`)" />

            </li>
          </ul>
        </el-popover>
      </div>

      <el-icon :size="20">
        <Microphone />
      </el-icon>
    </div>
    <div class="input-content" @keyup.enter.stop>
      <div id="insterHtml" class="textarea" contenteditable="true" spellcheck="false" ref="inputRef" placeholder="请输入内容"
        @keydown.enter.native="keyDown"></div>
      <div class="send-box">
        <el-button type="success" @click="submit">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { chat } from '@/module/chat/orgchat'

const inputRef = ref(null)
const faceBtnRef = ref(null)

const emit = defineEmits(['submitInfo'])

// 提交聊天内容
const submit = async () => {
  const inputContent = document.getElementById('insterHtml').childNodes
  const text = inputContent.length > 0 ? reCreatChatContent(document.getElementById('insterHtml').childNodes) : [document.getElementById('insterHtml').innerHTML]
  let massage = text.join('').trim()
  if (massage.length > 0) {
    await chat.sendMsg({
      toId: chat.curChat.value.id,
      spaceId: chat.curChat.value.spaceId,
      msgType: 'text',
      msgBody: massage
    })
  }
  document.getElementById('insterHtml').innerHTML = ''
}
// 解析聊天内容
const reCreatChatContent = (elementChild: NodeList | any[]): Array<string> => {
  // console.log(elementChild)
  const arrElement = Array.from(elementChild)
  // const newSpace  = document.createDocumentFragment()
  if (arrElement.length > 0) {

    return arrElement.map(n => {

      if (n.nodeName == "#text") { // 如果是文本 
        const newContent = n.textContent.length > 2048 ? n.textContent.substring(0, 2048) : n.textContent
        return newContent
      }
      return n?.outerHTML
    })
  }

  // return newSpace.innerHTML
}

const reWrite = (str: string) => {
  document.getElementById('insterHtml').innerHTML = str
}

const handleImgChoosed = (url: string) => {
  const img = document.createElement('img')
  img.src = url
  img.className = 'emoji'
  // img.width = 20
  // img.height = 20
  document.getElementById('insterHtml').append(img)
}

onMounted(() => {
  const faceBtnTriggrt = faceBtnRef.value
  if (faceBtnTriggrt) {
    faceBtnTriggrt.addEventListener('mousedown', (event: MouseEvent) => {
      return event.preventDefault()
    })
  }
})
// 输入框 键盘指令
const keyDown = (e: any) => {
  if (e.ctrlKey && e.keyCode == 13) {
    //用户点击了ctrl+enter触发
    const value = document.getElementById('insterHtml').innerHTML
    if (!value.includes('<div><br></div>')) {
      document.getElementById('insterHtml').innerHTML += '<div><br></div>'
    }
    setFocus()
  } else {
    //用户点击了enter触发
    e.preventDefault() // 阻止浏览器默认换行操作
    const value = document
      .getElementById('insterHtml')
      .innerHTML.replaceAll('<div><br></div>', '')
    if (value) {
      submit()
    } else {
      return ElMessage({
        message: '不能发送空值',
        type: 'warning'
      })
    }
  }
}
// 设置光标到最后
const setFocus = () => {
  let selection = window.getSelection()
  let range = document.createRange()
  range.selectNodeContents(inputRef.value)
  range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)
}

defineExpose({
  reWrite
})
</script>

<style lang="scss">
@import './qqface.scss';

.group-input-wrap {
  .textarea {
    textarea {
      height: 100%;
    }

    .el-textarea__inner {
      box-shadow: none !important;
    }
  }
}
</style>
<style lang="scss">
.qqface-wrap {
  .emoji {
    width: 20px;
    height: 20px;
    margin: 5px;
  }
}

.group-input-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: var(--el-bg-color-overlay);

  .icons-box {
    height: 34px;
    display: flex;
    align-items: center;
    padding: 0 12px;

    .el-icon {
      margin-right: 12px;
      cursor: pointer;

      &:hover {
        color: var(--el-color-danger);
      }
    }
  }

  .input-content {
    display: flex;
    height: 100%;
    justify-content: space-between;
    background-color: var(--el-bg-color-overlay);
    padding: 12px;

    .textarea {
      flex: 1;
      height: 120px;
      overflow-y: auto;
      outline: none;
      border: none;
    }

    .textarea:empty::before {
      content: attr(placeholder);
      position: absolute;
      color: #ccc;
      background-color: transparent;
    }

    .send-box {
      display: flex;
      justify-content: flex-end;
      // height: 40px;
      align-items: center;
      margin-left: 30px;
      margin-top: 80px;
    }
  }
}
</style>
