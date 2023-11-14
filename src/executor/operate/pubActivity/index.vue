<script setup lang="ts">
import FullScreenModal from '@/components/Common/fullScreenModal.vue';
import SelectMultFiles from '@/components/Activity/SelectMultFiles/index.vue';
import { IActivity, MessageType } from '@/ts/core'
import { model } from '@/ts/base';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IDomEditor } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css'

// 接收参数
const props = defineProps<{
  activity: IActivity;
  finish: () => void;
}>()

const editorRef = ref(null) // 存储 editor 实例
const setEditor = (editor: IDomEditor) => {
  editorRef.value = editor
}
const valueHtml = ref('')
const resource = ref<model.FileItemShare[]>([])

/** 发布动态 */
const publishActivity = () => {
  if (editorRef) {
    const text = editorRef.value.getText();
    const html = editorRef.value.getHtml();
    if (text.length > 0) {
      if (`<p>${text}</p>` === html) {
        props.activity.send(text, MessageType.Text, resource.value, []);
      } else {
        props.activity.send(html, MessageType.Html, resource.value, []);
      }
      props.finish();
    }
  }
};

</script>

<template>
  <FullScreenModal 
    open
    title="发布动态"
    width='60vw'
    bodyHeight='60vh'
    destroyOnClose
    :onCancel="finish"
  >
    <!-- 主体内容 -->
    <ElForm autoComplete="off">
      <ElFormItem>
        <Toolbar
          :editor="editorRef"
          mode="simple"
          :defaultConfig="{
            excludeKeys: [
              'insertVideo',
              'uploadVideo',
              'uploadImage',
              'fullScreen',
              'insertImage',
              'insertImage',
              'deleteImage',
              'editImage',
              'viewImageLink',
              'imageWidth30',
              'imageWidth50',
              'imageWidth100',
            ],
          }"
        />
        <Editor
          v-model="valueHtml"
          mode="simple"
          @onCreated="setEditor"
          :defaultConfig="{ placeholder: '在此输入内容' }"
          style="height: 200px;width:100%;"
        />
      </ElFormItem>
      <!-- 选择图片视频 -->
      <ElFormItem style="background-color: #fafafa;">
        <SelectMultFiles
          :maxCount="9"
          :types="['图片', '视频']"
          :currentKey="activity.session.target.directory.key"
          :onChange="(fileList) => {
            resource = fileList.map((item) => item.shareInfo())
          }"
        />
      </ElFormItem>
    </ElForm>
    <!-- footer -->
    <template #footer>
      <ElButton type="primary" @click="publishActivity">
        发布动态
      </ElButton>
    </template>
  </FullScreenModal>
</template>

<style lang="scss" scoped></style>
