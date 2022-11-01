<template>
  <div v-show="visible" class="menuRight" :style="{ left: left + 'px', top: top + 'px' }">
    <div class="menuRight-fixed">固定在菜单上</div>
    <div class="menuRight-cancel">取消固定</div>
  </div>
  <div v-show="visible2" class="fileMenu" :style="{ left: left + 'px', top: top + 'px' }">
    <div class="fileMenu-item" @click="rename">重命名</div>
    <div class="fileMenu-item">复制</div>
    <div class="fileMenu-item">移动</div>
    <div class="fileMenu-item" @click="deleteFile">删除文件</div>
  </div>
  <div class="cloudMainBox">
    <div class="breadcrumb">
      <el-breadcrumb :separator-icon="ArrowRight">
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
    <div class="topBtn">
      <el-upload
        class="upload-demo"
        :action="
          '/orginone/anydata/Bucket/Upload?shareDomain=' +
          '&key=' +
          cloud.getHistoryKey(props.breadcrumb).key
        "
        multiple
        ref="uploadRef"
        :show-file-list="false"
        :headers="state.uploadHeaders"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :limit="3"
      >
        <el-button style="margin: 20px 0px 0 20px" type="primary"
          ><el-icon><UploadFilled /></el-icon>上传</el-button
        >
      </el-upload>
      <el-button @click="createFile" style="margin: 20px 0px 0 20px" type="primary" plain
        ><el-icon><FolderAdd /></el-icon>新建文件夹</el-button
      >
    </div>
    <div class="content" @contextmenu.prevent="rightClick($event)" @click="onContent">
      <div
        class="content-box"
        :style="state.onIndex == index || isFile == index ? 'background:rgb(218,245,255)' : ''"
        v-for="(item, index) in state.fileList"
        :key="item"
        @click.stop="onClick(index)"
        @dblclick.stop="doubleClick(item)"
        @contextmenu.prevent.stop="contentClick($event, item, index)"
      >
        <div v-if="state.onIndex == index || isFile == index" class="elCircle"></div>
        <el-icon v-if="isFile == index" @click.stop="addFile" class="right"
          ><CircleCheckFilled
        /></el-icon>
        <el-icon v-if="isFile == index" @click.stop="cancelFile" class="filled"
          ><CircleCloseFilled
        /></el-icon>
        <el-icon class="elUpload" v-if="item.isDirectory"><Folder /></el-icon>
        <el-icon class="elUpload" v-else><Document /></el-icon>
        <div v-if="(inputShow && state.onIndex == index) || isFile == index" class="elUpload-text">
          <el-input ref="inpRef" v-model="fileName" />
        </div>
        <div v-else-if="state.onIndex !== index" class="elUpload-text">{{ item.name }}</div>
        <div v-else-if="!inputShow && state.onIndex == index" class="elUpload-text">{{
          item.name
        }}</div>
      </div>
      <i class="content-i" v-for="item in 99" :key="item"></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ArrowRight } from '@element-plus/icons-vue'
  import { reactive, ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useUserStore } from '@/store/user'
  import { encodeURIString } from '../conversion'
  import Cloud from '@/module/cloud/operation'
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
  const visible2 = ref<boolean>(false)
  const isFile = ref<number>(null)
  const left = ref<number>(0)
  const top = ref<number>(0)
  const inpRef = ref(null)
  const renameValue = ref<boolean>(false)
  const uploadRef = ref(null)
  type Cloud = {
    cloudData: any
    breadcrumb: any
  }
  const props = defineProps<Cloud>()

  const emit = defineEmits([
    'createFile',
    'gotoBTM',
    'gotoBack',
    'changeCurrentLocation',
    'uploadList'
  ])

  watch(
    () => props.cloudData,
    (val, old) => {
      state.fileList = JSON.parse(JSON.stringify(props.cloudData))
      fileName.value = ''
      isFile.value = null
      if (state.fileList[state.fileList.length - 1]?.key == '') {
        state.fileList.pop()
      }
    }
  )
  const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    emit('uploadList')
  }
  const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
    // uploadRef.value.clearFiles()
    state.params.shareDomain = ''
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
  const addFile = async () => {
    if (fileName.value == '') {
      ElMessage({
        type: 'warning',
        message: '文件名不能为空'
      })
      state.fileList.pop()
      return
    }
    inputShow.value = false
    state.onIndex = null
    let params = {
      shareDomain: '',
      prefix: cloud.getHistoryKey(props.breadcrumb, fileName.value).key
    }
    const res = await API.bucket.bucketCreate({ params: params })
    if (res.success) {
      // 创建时 暂时选择最后一位
      state.fileList[state.fileList.length - 1].key = fileName.value
      emit('createFile')
      fileName.value = ''
    }
  }
  const cancelFile = () => {
    state.fileList.pop()
    isFile.value = null
  }

  const onContent = () => {
    visible2.value = false
    state.onIndex = null
  }

  const rightClick = (event: any) => {
    visible.value = true
    visible2.value = false
    top.value = event.pageY - 40
    left.value = event.pageX
  }

  const contentClick = (event: any, item: any, index: number) => {
    visible2.value = true
    top.value = event.pageY - 40
    left.value = event.pageX
    state.clickMenu = item
    state.onIndex = index
  }

  const onClick = (index: number) => {
    visible.value = false
    visible2.value = false
    inputShow.value = false
    state.onIndex = index
  }

  const doubleClick = (data: any) => {
    emit('changeCurrentLocation', data, 'file')
  }

  const clickother = () => {
    visible.value = false
  }

  const createFile = () => {
    state.fileList.push({
      shareDomain: '',
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
    visible2.value = false
    nextTick(() => {
      inpRef.value[0].focus()
    })
  }

  const deleteFile = async () => {
    let params = {
      shareDomain: '',
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

  onMounted(() => {
    nextTick(() => {
      state.fileList = props.cloudData
      console.log('444444444', state.fileList)
    })

    window.addEventListener('click', clickother)
  })
  onUnmounted(() => {
    window.removeEventListener('click', clickother)
  })
</script>
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
    color: rgb(175, 221, 255);
    right: 30px;
    top: 5px;
    z-index: 99;
  }
  .breadcrumb {
    height: 40px;
    width: 100%;
    background-color: #fff;
    padding-left: 20px;
    padding-top: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 30px;
  }
  .elUpload-text {
    display: flex;
    justify-content: center;
  }
  .cloudMainBox {
    width: 100%;
    height: 100%;
  }
  .fileMenu {
    width: 100px;
    height: 120px;
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
  .topBtn {
    display: flex;
    width: 100%;
    height: 40px;
    background-color: #fff;
  }
  .content {
    display: flex;
    background: #fff;
    width: 100%;
    height: 100vh;
    border-left: 1px solid #eee;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    overflow: auto;
    padding-bottom: 60px;
    &-i {
      width: 150px;
    }
    &-box {
      position: relative;
      cursor: pointer;
      width: 150px;
      height: 150px;
      display: flex;
      flex-direction: column;
      align-items: center;
      &:hover {
        background-color: rgb(242, 250, 255);
      }
    }
  }
</style>
