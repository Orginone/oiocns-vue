<template>
  <div class="cloud">
    <NavList ref="navRef" @clickFileFromTree="clickFile"></NavList>
    <div class="cloudMainBox" @click="onContent">
      <div class="cloudBar" v-if="state.currentLay">
        <el-space size="default">
          <el-icon title="后退" class="operateBtn" :class="{disabled: !state.currentLay.HasParent}" @click="goBackOneStep"><Back /></el-icon>
          <el-icon title="刷新" class="operateBtn" @click="refreshCurrent"><Refresh /></el-icon>
          <el-upload class="upload-demo"
                     :action="`/orginone/anydata/Bucket/Upload?shareDomain=user&prefix=${state.currentLay.formatKey()}`"
                     multiple
                     ref="uploadRef"
                     :show-file-list="false"
                     :headers="state.uploadHeaders"
                     :on-success="handleSuccess"
                     :limit="3"
          >
            <el-icon title="上传文件" class="operateBtn"><UploadFilled /></el-icon>
          </el-upload>
          <el-icon title="创建文件夹" class="operateBtn" @click="openCreateFileDialog"><FolderAdd /></el-icon>
        </el-space>
        <el-divider direction="vertical" />
        <div class="breadcrumb" v-if="state.currentLay">
          <el-breadcrumb>
            <el-breadcrumb-item
                v-for="(item, index) in state.breadcrumb"
                :to="{}"
                :key="index"
                @click="goBack(item, index)"
            >
              {{ item.Name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="cloudFiles" v-if="state.currentLay">
        <div class="content" v-if="state.currentLay.children.length > 0">
          <div
              class="content-box"
              v-for="(item, index) in state.currentLay.children"
              :key="item.formatKey()"
              :class="{checked: state.operateItem && state.operateItem.formatKey() === item.formatKey()}"
              @click.stop="clickFile(item)"
              @contextmenu.prevent.stop="fileRightClick($event, item, index)"
          >
            <file-icon :file-item="item"></file-icon>
            <div class="elUpload-text" :title="item.Name">{{ doZipFileName(item.Name) }}</div>
          </div>
        </div>
        <el-empty v-else description="没有文件" :image-size="100"/>
      </div>
    </div>
    <!-- 创建文件夹对话框 -->
    <el-dialog v-model="createFileDialog" title="创建文件夹" :width="600">
      <el-form>
        <el-form-item label="文件夹名称" :label-width="140">
          <el-input v-model="state.fileName" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createFileDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmCreateFile">创建</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 文件重命名对话框 -->
    <el-dialog v-model="editFileDialog" title="文件重命名" :width="600">
      <el-form>
        <el-form-item label="文件名称" :label-width="140">
          <el-input v-model="state.fileName" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editFileDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmEditFile">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 文件操作菜单 -->
    <el-card v-show="showFileMenu" class="fileMenu" :style="{ left: menuLeft + 'px', top: menuTop + 'px' }">
      <div class="text fileMenu-item" @click="openEditFileDialog">重命名</div>
      <!--<div class="text fileMenu-item">复制</div>-->
      <!--<div class="text fileMenu-item">移动</div>-->
      <div class="text fileMenu-item" @click="deleteFile">删除文件</div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
  import NavList from './components/navList.vue'
  import Bucket from '@/module/cloud/bucket'
  import Objectlay from '@/module/cloud/objectlay'
  import { onMounted, reactive, ref, nextTick, computed } from 'vue'
  import FileIcon from './components/fileIcon.vue'
  import {ElMessageBox, ElMessage, UploadProps} from "element-plus";
  import {useUserStore} from "@store/user";
  import { zipFileName } from '@/utils'
  const store = useUserStore()

  const navRef = ref(null)
  const state = reactive({
    currentLay: null,
    uploadHeaders: {
      Authorization: store.userToken
    },
    breadcrumb: [],
    fileName: '',
    operateItem: null
  })
  const createFileDialog = ref<boolean>(false)
  const editFileDialog = ref<boolean>(false)
  const showFileMenu = ref<boolean>(false)
  const menuLeft = ref<number>(0)
  const menuTop = ref<number>(0)

  // @ts-ignore
  state.breadcrumb = computed<any[]>(() => {
    const breadcrumb: any[] = []
    pushBreadcrumb(breadcrumb, state.currentLay)
    return breadcrumb
  })

  //面包屑递归
  const pushBreadcrumb = (breadcrumb: any[], item: any) => {
    breadcrumb.unshift(item)
    if(item.parent) {
      pushBreadcrumb(breadcrumb, item.parent)
    }
  }

  // 刷新当前目录
  const refreshCurrent = async () => {
    state.currentLay = null
    await Bucket.GetContent(true)
    state.currentLay = Bucket.Current
  }

  // 打开文件
  const clickFile = async (item: Objectlay) => {
    if(!item.IsDirectory) { //TODO 文件后续提供预览
      return false
    }
    await Bucket.OpenDirectory(item)
    state.currentLay = Bucket.Current
    navRef.value.checkedNode(item)
  }

  // 返回上一层
  const goBackOneStep = async () => {
    await clickFile(Bucket.Current.GetParent())
  }

  // 返回到某一层
  const goBack = async (item: Objectlay, index: number) => {
    await clickFile(item)
  }
  
  // 文件上传成功
  const handleSuccess: UploadProps['onSuccess'] = async (response, uploadFile) => {
    if(response.success) {
      ElMessage.success('文件上传成功')
      await refreshCurrent()
    }
  }

  // 打开创建文件夹对话框
  const openCreateFileDialog = () => {
    state.fileName = ''
    createFileDialog.value = true
  }

  // 打开文件重命名对话框
  const openEditFileDialog = () => {
    editFileDialog.value = true
    state.fileName = state.operateItem.Name
  }

  // 确认创建文件夹
  const confirmCreateFile = async () => {
    if(!state.fileName.trim()) {
      ElMessage.warning('请填写名称')
      return false
    }
    createFileDialog.value = false
    await Bucket.Current.Create(state.fileName)
    await refreshCurrent()
  }

  // 确认重命名
  const confirmEditFile = async () => {
    if(!state.fileName.trim()) {
      ElMessage.warning('请填写名称')
      return false
    }
    editFileDialog.value = false
    await state.operateItem.Rename(state.fileName)
    await refreshCurrent()
    onContent()
  }

  // 删除文件
  const deleteFile = async () => {
    ElMessageBox.confirm(
        `确定要删除 "${state.operateItem.Name}" 吗？`,
        '温馨提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
    ).then(async () => {
      // 同时删除节点
      if(state.operateItem.IsDirectory) {
        navRef.value.removeNode(state.operateItem)
      }
      await state.operateItem.Delete()
      await refreshCurrent()
      onContent()
    }).catch(() => {})
  }

  // 右键展开文件操作栏
  const fileRightClick = (event: any, item: Objectlay, index: number) => {
    state.operateItem = item
    showFileMenu.value = false
    menuLeft.value = event.pageX - 180
    menuTop.value = event.pageY - 80
    setTimeout(() => {
      showFileMenu.value = true
    }, 200)
  }

  // 点击内容区域
  const onContent = () => {
    showFileMenu.value = false
    state.operateItem = null
  }

  // 文本展示工具函数
  const doZipFileName = (name: string) => {
    return zipFileName(name, 10, 2, 6)
  }

  onMounted(async () => {
    await clickFile(Bucket.Current)
  })
</script>
<style lang="scss">
  .el-card__body {
    padding: 0;
    width: 100%;
  }
</style>
<style lang="scss" scoped>
  .cloud {
    display: flex;
    width: 100%;
    height: 100%;
    padding: 3px 0;
    position: relative;

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
      text-align: center;
      color: var(--el-text-color-regular);
      font-size: var(--el-font-size-base);
      margin-top: 3px;
      width: 100%;
      box-sizing: border-box;
      padding: 0 2px;
    }
    .cloudMainBox {
      width: 100%;
      height: 100%;
      border-left: 1px solid #eee;
      background-color: #fff;
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
    .cloudFiles {
      padding: 20px;
      display: flex;
      flex-direction: column;
      background: #fff;
      position: relative;
      .content {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        overflow: auto;
        padding-bottom: 60px;
        &-box {
          position: relative;
          cursor: pointer;
          width: 100px;
          height: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          margin-bottom: 10px;
          &:hover {
            background-color: #f8f7f9;
          }
          &.checked {
            background-color: #f8f7f9;
          }
        }
      }
    }
    .fileMenu {
      width: 100px;
      min-height: 30px;
      position: absolute;
      font-size: 12px;
      z-index: 999;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      cursor: pointer;
      padding: 5px 0;

      &-item {
        padding: 5px 0;
        width: 100%;
        text-align: center;

        &:hover {
          background-color: #f8f7f9;
        }
      }
    }
  }
</style>
