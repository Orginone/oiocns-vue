<template>
  <div class="cloud">
    <NavList ref="navRef" @clickFileFromTree="clickFile"></NavList>
    <div class="cloudMainBox" @click="onContent">
      <div class="cloudBar" v-if="state.currentLay">
        <el-space size="default">
          <el-icon title="后退" class="operateBtn" :class="{disabled: !state.currentLay.parent}" @click="goBackOneStep"><Back /></el-icon>
          <el-icon title="刷新" class="operateBtn" @click="refreshCurrent"><Refresh /></el-icon>
          <el-upload class="upload-demo"
                     multiple
                     ref="uploadRef"
                     :show-file-list="false"
                     :limit="3"
                     :http-request="customUpload"
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
              {{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="cloudFiles" v-if="state.currentLay">
        <template v-if="state.currentLay.children.length > 0">
          <!-- 列表模式 -->
          <div class="content" v-if="showType == 1">
            <el-table
                ref="diyTable"
                header-cell-class-name="headerCell"
                row-class-name="rowCommon"
                :data="state.currentLay.children"
                row-key="key"
                :tree-props="{children: 'none'}"
                @row-click="(row, column, event) => { clickFile(row) }"
            >
              <el-table-column prop="Name" label="名称" width="800">
                <template #default="scope">
                  <div class="fileName">
                    <file-icon :file-item="scope.row" :size="25"></file-icon>
                    <span>{{scope.row.name}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="target.size" label="大小">
                <template #default="scope">
                  <span>{{ scope.row.target.isDirectory ? '--' : formatFileSize(scope.row.target.size) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="target.dateCreated" label="创建时间">
                <template #default="scope">
                  <span>{{ formatDateString(scope.row.target.dateCreated) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="target.dateModified" label="更新时间">
                <template #default="scope">
                  <span>{{ formatDateString(scope.row.target.dateModified) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template #default="scope">
                  <div class="operateBtn">
                    <el-dropdown size="small" @visible-change="(show) => { if(show) {state.operateItem = scope.row}}">
                      <el-icon @click.stop="() => {return false}"><MoreFilled /></el-icon>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item @click="openEditFileDialog">重命名</el-dropdown-item>
                          <el-dropdown-item @click="openCopyFileDialog">复制到</el-dropdown-item>
                          <el-dropdown-item @click="openMoveFileDialog">移动到</el-dropdown-item>
                          <el-dropdown-item @click="deleteFile">删除文件</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 平铺模式 -->
          <div class="content" v-if="showType == 2">
            <div
                class="content-box"
                v-for="(item, index) in state.currentLay.children"
                :key="item.key"
                :class="{checked: state.operateItem && state.operateItem.key === item.key}"
                @click.stop="clickFile(item)"
                @contextmenu.prevent.stop="fileRightClick($event, item, index)"
            >
              <file-icon :file-item="item" :size="80"></file-icon>
              <div class="elUpload-text" :title="item.name">{{ doZipFileName(item.name) }}</div>
            </div>
          </div>
        </template>
        <el-empty v-else description="没有文件" :image-size="100"/>
      </div>
      <!-- 底部操作区域 -->
      <div class="diy-table-footer">
        <div class="footer-left" >
          <i :class="{'switch-active': showType == 1}" class="type-list iconfonts icons-table-icon2" @click="checkSwitchType(1)"></i>
          <i :class="{'switch-active': showType == 2}" class="type-card iconfonts icons-suolvetuqiehuan"  @click="checkSwitchType(2)"></i>
        </div>
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
    <!-- 文件复制对话框 -->
    <el-dialog v-model="copyFileDialog" :title="`${state.operateItem && state.operateItem.name} 复制到`" :width="600">
      <NavList :onlySelect="true" @selectTreeNode="selectTargetItem"></NavList>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="copyFileDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmCopyFile">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 文件移动对话框 -->
    <el-dialog v-model="moveFileDialog" :title="`${state.operateItem && state.operateItem.name} 移动到`" :width="600">
      <NavList :onlySelect="true" @selectTreeNode="selectTargetItem"></NavList>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="moveFileDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmMoveFile">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 文件操作菜单 -->
    <el-card v-show="showFileMenu" class="fileMenu" :style="{ left: menuLeft + 'px', top: menuTop + 'px' }">
      <div class="text fileMenu-item" @click="openEditFileDialog">重命名</div>
      <div class="text fileMenu-item" @click="openCopyFileDialog">复制到</div>
      <div class="text fileMenu-item" @click="openMoveFileDialog">移动到</div>
      <div class="text fileMenu-item" @click="deleteFile">删除文件</div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
  import NavList from './components/navList.vue'
  import Cloud, {FileObject} from '@/ts/cloud'
  import { onMounted, reactive, ref, nextTick, computed } from 'vue'
  import FileIcon from './components/fileIcon.vue'
  import {ElMessageBox, ElMessage, UploadProps, UploadRequestOptions} from "element-plus";
  import {useUserStore} from "@store/user";
  import {formatBytes, formatDate, zipFileName} from '@/utils'
  import { MenuItemType } from '@/typings/globelType';
  const store = useUserStore()

  const navRef = ref(null)
  const state = reactive({
    currentLay: null,
    breadcrumb: [],
    fileName: '',
    operateItem: null,
    targetItem: null
  })
  const createFileDialog = ref<boolean>(false)
  const editFileDialog = ref<boolean>(false)
  const copyFileDialog = ref<boolean>(false)
  const moveFileDialog = ref<boolean>(false)
  const showFileMenu = ref<boolean>(false)
  const menuLeft = ref<number>(0)
  const menuTop = ref<number>(0)
  const showType = ref<number>(2)

  // @ts-ignore
  state.breadcrumb = computed<FileObject[]>(() => {
    const breadcrumb: FileObject[] = []
    pushBreadcrumb(breadcrumb, state.currentLay)
    return breadcrumb
  })

  //切换显示方式
  const checkSwitchType = (type: number) => {
    showType.value = type
    Cloud.ListMode = type
  }

  //面包屑递归
  const pushBreadcrumb = (breadcrumb: FileObject[], item: FileObject) => {
    breadcrumb.unshift(item)
    if(item.parent) {
      pushBreadcrumb(breadcrumb, item.parent as FileObject)
    }
  }

    /** 查找菜单 */
  const findMenuItemByKey: any = (items: MenuItemType[], key: string) => {
    for (const item of items) {
      if (item.key === key) {
        return item;
      } else if (Array.isArray(item.children)) {
        const find = findMenuItemByKey(item.children, key);
        if (find) {
          return find;
        }
      }
    }
    return undefined;
  };

  // 刷新当前目录
  const refreshCurrent = async () => {
    // state.currentLay = null
    const item = findMenuItemByKey(state.breadcrumb, Cloud.DocModel.currentKey);
    if (item) {
      state.currentLay = item
    } else {
      state.currentLay = state.breadcrumb[0];
    }
    state.currentLay.loadChildren(true)
    // ElMessage.success('刷新成功')
    // await Cloud.DocModel.current.loadChildren(true)
  }

  // 打开文件
  const clickFile = async (item: FileObject) => {
    // await Cloud.DocModel.open(item.key)
    Cloud.DocModel.currentKey = item.key
    state.currentLay = item
    navRef.value.checkedNode(item)
  }

  // 选中一个文件夹
  const selectTargetItem = (item: FileObject) => {
    state.targetItem = item
  }

  // 返回上一层
  const goBackOneStep = async () => {
    await clickFile(state.currentLay.parent)
  }

  // 返回到某一层
  const goBack = async (item: FileObject, index: number) => {
    await clickFile(item)
  }

  // 自定义文件上传
  const customUpload = async (options: UploadRequestOptions) => {
    const file = options.file as File
    await state.currentLay.upload(file.name, file, async (res: any) => {
      if(res > 0) {
        ElMessage.success('上传成功')
        await refreshCurrent()
      }
    })
  }

  // 打开创建文件夹对话框
  const openCreateFileDialog = () => {
    state.fileName = ''
    createFileDialog.value = true
  }

  // 打开文件重命名对话框
  const openEditFileDialog = () => {
    editFileDialog.value = true
    state.fileName = state.operateItem.name
  }

  // 打开文件复制对话框
  const openCopyFileDialog = () => {
    copyFileDialog.value = true
  }

  // 打开文件移动对话框
  const openMoveFileDialog = () => {
    moveFileDialog.value = true
  }

  // 确认创建文件夹
  const confirmCreateFile = async () => {
    if(!state.fileName.trim()) {
      ElMessage.warning('请填写名称')
      return false
    }
    createFileDialog.value = false
    const addLay = await state.currentLay.create(state.fileName) 
    ElMessage.success('创建成功')
    // 追加节点
    navRef.value.appendNode(addLay, state.currentLay)
    await refreshCurrent()
  }

  // 确认重命名
  const confirmEditFile = async () => {
    if(!state.fileName.trim()) {
      ElMessage.warning('请填写名称')
      return false
    }
    editFileDialog.value = false
    await state.operateItem.rename(state.fileName)
    ElMessage.success('修改成功')
    onContent()
  }

  // 删除文件
  const deleteFile = async () => {
    ElMessageBox.confirm(
        `确定要删除 "${state.operateItem.name}" 吗？`,
        '温馨提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
    ).then(async () => {
      // 同时删除节点
      if(state.operateItem.target.isDirectory) {
        navRef.value.removeNode(state.operateItem)
      }
      await state.operateItem.delete()
      ElMessage.success('删除成功')
      await refreshCurrent()
      onContent()
    }).catch(() => {})
  }

  // 确认复制文件
  const confirmCopyFile = async () => {
    copyFileDialog.value = false
    await state.operateItem.copy(state.targetItem)
    await clickFile(state.targetItem)
    ElMessage.success('复制成功')
    onContent()
    state.operateItem = null
    await refreshCurrent()
  }

  // 确认移动文件
  const confirmMoveFile = async () => {
    moveFileDialog.value = false
    await state.operateItem.move(state.targetItem)
    await clickFile(state.targetItem)
    ElMessage.success('移动成功')
    onContent()
    state.operateItem = null
    await refreshCurrent()
  }

  // 右键展开文件操作栏
  const fileRightClick = (event: any, item: FileObject, index: number) => {
    state.operateItem = item
    showFileMenu.value = false
    menuLeft.value = event.pageX
    menuTop.value = event.pageY - 40
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

  // 日期展示工具函数
  const formatDateString = (date: string) => {
    return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
  }

  // 文件大小展示工具函数
  const formatFileSize = (size: number) => {
    return formatBytes(size, 2)
  }

  onMounted(async () => {
    await clickFile(Cloud.DocModel.current)
    showType.value = Cloud.ListMode
  })
</script>
<style lang="scss">
  .el-card__body {
    padding: 0;
    width: 100%;
  }
  .el-table__inner-wrapper:before {
    content: none;
  }
  .headerCell {
    background: var(--el-color-primary-light-9)!important;
    color: var(--el-text-color-primary)!important;
    height: 36px!important;
    padding: 2px 0!important;
  }
  .rowCommon {
    height: 44px!important;
    cursor: pointer;
  }
</style>
<style lang="scss" scoped>
  .cloud {
    display: flex;
    width: 100%;
    height: 100%;
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
      height: 56px;
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
      background-color: #fff;
      position: relative;

      .diy-table-footer {
        position: absolute;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        bottom: 0;
        height: 56px;
        margin-bottom: 20px;
        .switch-active{
          background: #154ad8;
          color: #fff;
          border-radius: 15px;
        }
        .footer-left{
          .type-list,.type-card{
            font-size: 16px;
            color: #c0c4cc;
            padding: 3px 15px;
            cursor: pointer;
          }
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
        .fileName {
          display: flex;
          flex-direction: row;
          align-items: center;
          span {
            margin-left: 8px;
          }
        }
        .operateBtn {
          display: flex;
          align-items: center;
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
