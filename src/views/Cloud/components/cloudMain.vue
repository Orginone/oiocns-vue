<template>
<!--  <div v-show="visible" class="menuRight" :style="{ left: left + 'px', top: top + 'px' }">-->
<!--    <div class="menuRight-fixed">固定在菜单上</div>-->
<!--    <div class="menuRight-cancel">取消固定</div>-->
<!--  </div>-->
  <el-card v-show="showFileMenu" class="fileMenu" :style="{ left: left + 'px', top: top + 'px' }">
    <div class="text fileMenu-item" @click="rename">重命名</div>
    <div class="text fileMenu-item">复制</div>
    <div class="text fileMenu-item">移动</div>
    <div class="text fileMenu-item" @click="deleteFile">删除文件</div>
  </el-card>
  <div class="cloudMainBox" @click="onContent">
    <div class="cloudBar">
      <el-space size="default">
        <el-icon title="后退" class="operateBtn" :class="{disabled: props.breadcrumb.length === 1}" @click="goBackOneStep"><Back /></el-icon>
        <el-icon title="刷新" class="operateBtn" @click="refreshDirectory"><Refresh /></el-icon>
        <el-upload class="upload-demo"
            :action="`/orginone/anydata/Bucket/Upload?shareDomain=user&prefix=${cloud.getHistoryKey(props.breadcrumb).key}`"
            multiple
            ref="uploadRef"
            :show-file-list="false"
            :headers="state.uploadHeaders"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :limit="3"
        >
          <el-icon title="上传文件" class="operateBtn"><UploadFilled /></el-icon>
        </el-upload>
        <el-icon title="创建文件夹" class="operateBtn" @click="createFile"><FolderAdd /></el-icon>
      </el-space>
      <el-divider direction="vertical" />
      <div class="breadcrumb">
        <el-breadcrumb>
          <el-breadcrumb-item
              v-for="(item, index) in props.breadcrumb"
              :to="{}"
              :key="index"
              @click="goBack(item, index)"
          >
            {{ item.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="cloudFiles">
      <div class="content" @contextmenu.prevent="rightClick($event)">
        <div
            class="content-box"
            :style="state.onIndex == index || isFile == index ? 'background: #f8f7f9' : ''"
            v-for="(item, index) in state.fileList"
            :key="item"
            @click.stop="onClick(item)"
            @contextmenu.prevent.stop="contentClick($event, item, index)"
        >
          <el-icon v-if="isFile == index" @click.stop="cancelFile" class="filled"><CircleCloseFilled/></el-icon>
          <file-icon :file-item="item"></file-icon>
          <div v-if="(inputShow && state.onIndex == index) || isFile == index" class="elUpload-text">
            <el-input ref="inpRef" v-model="fileName" @blur="addFile"/>
          </div>
          <div v-else-if="state.onIndex !== index" class="elUpload-text">{{ item.name }}</div>
          <div v-else-if="!inputShow && state.onIndex == index" class="elUpload-text">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useUserStore } from '@/store/user'
  import { encodeURIString } from '../conversion'
  import FileIcon from './fileIcon.vue'
  import Cloud from '@/module/cloud/operation'
  import * as _ from 'lodash'
  import type { UploadProps } from 'element-plus'
  import API from '@/services'
  const store = useUserStore()
  const cloud = new Cloud()
  type StateType = {
    clickMenu: any
    storeObj: MenuItemType
    onIndex: number
    fileList: any
    params: any
    uploadHeaders: {
      Authorization: string
    }
  }
  const state: StateType = reactive({
    fileList: [],
    clickMenu: {},
    storeObj: {
      id: '',
      name: '',
      icon: '',
      path: ''
    },
    onIndex: null,
    params: {},
    uploadHeaders: {
      Authorization: store.userToken
    }
  })
  const fileName = ref<string | number>('')
  const inputShow = ref<boolean>(false)
  const visible = ref<boolean>(false)
  const showFileMenu = ref<boolean>(false)
  const isFile = ref<number>(null)
  const left = ref<number>(0)
  const top = ref<number>(0)
  const inpRef = ref(null)
  const renameValue = ref<boolean>(false)
  const uploadRef = ref(null)
  type CloudProps = {
    cloudData: any
    breadcrumb: any
  }
  const props = defineProps<CloudProps>()

  const emit = defineEmits([
    'createFile',
    'gotoBTM',
    'gotoBack',
    'changeCurrentLocation',
    'uploadList',
    'refreshDirectory'
  ])

  watch(
    () => props.cloudData,
    (val, old) => {
      state.fileList = _.cloneDeep(props.cloudData)
      fileName.value = ''
      isFile.value = null
      if (state.fileList[state.fileList.length - 1]?.key == '') {
        state.fileList.pop()
      }
    }
  )
  const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    emit('uploadList')
    if(response.success) {
      ElMessage({type: 'success', message: '文件上传成功'})
    }
  }
  const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
    // uploadRef.value.clearFiles()
    state.params.shareDomain = 'user'
    state.params.key = encodeURIString(rawFile.name)
    return true
  }
  const goBack = (item: any, index: number) => {
    if (index == 0) {
      emit('gotoBTM')
    } else {
      emit('gotoBack', item)
    }
  }
  const goBackOneStep = () => {
    if(props.breadcrumb.length === 1) {
      return false
    }
    emit('gotoBack', props.breadcrumb[props.breadcrumb.length - 2])
  }
  const addFile = async () => {
    if (fileName.value == '') {
      ElMessage({
        type: 'warning',
        message: '文件夹名称不能为空'
      })
      state.fileList.pop()
      return
    }
    inputShow.value = false
    state.onIndex = null
    let params = {
      shareDomain: 'user',
      prefix: cloud.getHistoryKey(props.breadcrumb, fileName.value).key
    }
    const res = await API.bucket.bucketCreate({ params: params })
    if (res.success) {
      emit('createFile')
      fileName.value = ''
    }
  }
  const cancelFile = () => {
    state.fileList.pop()
    isFile.value = null
    state.onIndex = null
    inputShow.value = false
  }

  const onContent = () => {
    showFileMenu.value = false
    state.onIndex = null
  }

  const rightClick = (event: any) => {
    visible.value = true
    showFileMenu.value = false
    top.value = event.pageY - 40
    left.value = event.pageX
  }

  const contentClick = (event: any, item: any, index: number) => {
    showFileMenu.value = false
    top.value = event.pageY - 60
    left.value = event.pageX
    state.clickMenu = item
    state.onIndex = index
    inputShow.value = false
    setTimeout(() => {
      showFileMenu.value = true
    }, 200)
  }

  const onClick = (data: any) => {
    if(!data.isDirectory) {
      return false
    }
    emit('changeCurrentLocation', data, 'file')
  }

  const clickother = () => {
    visible.value = false
  }

  const createFile = () => {
    state.fileList.push({
      shareDomain: 'user',
      key: '',
      isDirectory: true
    })
    state.onIndex = state.fileList.length - 1
    inputShow.value = true
    isFile.value = state.fileList.length - 1
  }

  const rename = async () => {
    inputShow.value = true
    renameValue.value = true
    showFileMenu.value = false
    nextTick(() => {
      inpRef.value[0].focus()
    })
  }

  const deleteFile = async () => {
    let params = {
      shareDomain: 'user',
      key: encodeURIString(state.clickMenu.name)
    }
    const res = await API.bucket.bucketDelete({ params: params })
    if (res.success) {
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    }
  }

  //刷新当前目录
  const refreshDirectory = async () => {
    emit('refreshDirectory')
  }

  onMounted(() => {
    nextTick(() => {
      state.fileList = props.cloudData
    })
    window.addEventListener('click', clickother)
  })
  onUnmounted(() => {
    window.removeEventListener('click', clickother)
  })
</script>
<style lang="scss">
  .el-card__body {
    padding: 0;
    width: 100%;
  }
</style>
<style lang="scss" scoped>
  :deep(.el-input) {
    width: 80%;
  }
  .right {
    position: absolute;
    color: rgb(175, 221, 255);
    right: 10px;
    top: 5px;
    z-index: 99;
  }
  .filled {
    position: absolute;
    color: var(--el-color-danger);
    right: 10px;
    top: 5px;
    z-index: 99;
    font-size: 18px;
  }
  .cloudBar {
    margin: 0 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #eee;
    height: 40px;
    box-sizing: border-box;
    .operateBtn {
      cursor: pointer;
      font-size: 20px;
      color: var(--el-color-primary);
      &.disabled {
        cursor: no-drop;
        color: var(--el-disabled-text-color)
      }
    }
    .upload-demo {
      display: flex;
      align-items: center;
    }
    .breadcrumb {
      width: auto;
    }
  }

  .elUpload-text {
    display: flex;
    justify-content: center;
    color: var(--el-text-color-regular);
    font-size: var(--el-font-size-base);
  }
  .cloudMainBox {
    width: 100%;
    height: 100%;
    border-left: 1px solid #eee;
    background-color: #fff;
  }
  .fileMenu {
    width: 100px;
    height: 120px;
    position: absolute;
    font-size: 12px;
    z-index: 999;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    cursor: pointer;

    &-item {
      padding: 5px 0;
      width: 100%;
      text-align: center;

      &:hover {
        background-color: #f8f7f9;
      }
    }
  }
  .menuRight {
    width: 100px;
    height: 60px;
    position: absolute;
    background-color: #fff;
    border: 1px solid #000;
    font-size: 12px;
    z-index: 999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &-fixed {
      padding: 5px 0;
      width: 100%;
      text-align: center;

      &:hover {
        background-color: #f8f7f9;
      }
    }

    &-cancel {
      padding: 10px 0;
      width: 100%;
      text-align: center;

      &:hover {
        background-color: #f8f7f9;
      }
    }
  }
  .elCircle {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgb(175, 221, 255);
    left: 10px;
    top: 10px;
  }
  .elUpload {
    font-size: 100px;
    color: rgb(255, 217, 74);
    &-text {
      margin-top: 5px;
    }
  }
  .cloudFiles {
    padding: 20px;
    display: flex;
    flex-direction: column;
    background: #fff;
    .content {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      overflow: auto;
      padding-bottom: 60px;
      &-box {
        position: relative;
        cursor: pointer;
        width: 150px;
        height: 150px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-right: 5px;
        margin-bottom: 5px;
        &:hover {
          background-color: #f8f7f9;
        }
      }
    }
  }

</style>
