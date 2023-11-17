<!-- 截图 -->
<script setup lang='ts'>
import html2canvas from 'html2canvas'
import orgCtrl from '@/ts/controller'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import VuePictureCropper, { cropper } from 'vue-picture-cropper'

const props = defineProps<{ 
  open?: boolean
  onClose?: Function 
}>()

const img= ref<string>('')

watch(()=>props.open,() => {
  if (props.open) {
    init(50);
  } else {
    img.value = ''
  }
}, {immediate: true})

/** 将当前网页可视区域转为图片 */
const init = (times: number = 200) => {
  setTimeout(async () => {
    // 获取当前网页 可视区域
    const Dom: HTMLElement = document.documentElement;
    //等待canvas绘制 鼠标变为加载中样式。。。
    Dom.style.cursor = 'wait'
    const canvas = await html2canvas(Dom);
    // 恢复鼠标样式
    Dom.style.cursor = 'pointer'
    // canvas==>图片地址 用于剪切
    const imgUrl = canvas.toDataURL();
    // 获取截图base64
    img.value = imgUrl
  }, times)
}

/**
 * @description: 按钮事件处理
 * @param {string} targetKey
 * @param {Function} onKeyDown
 * @return {*}
 */
const useKeyPress = (targetKey: string, onKeyDown: Function) => {
  const handler = markRaw((event: any) => {
      // 触发特定按钮事件
      if (event?.key === targetKey) {
        onKeyDown(event);
      }
      // 退出截图
      if (event?.key === 'Escape') {
        img.value = ''
        props?.onClose()
      }
  })
  // 增加按钮监听
  watch(handler,() => {
    document.addEventListener('keydown', handler)
    onBeforeUnmount(() => {
      document.removeEventListener('keydown', handler)
    })
  },{immediate: true})
}

/** @description: 提交截图信息 */
const handleSubmit = () => {
  cropper.getCroppedCanvas().toBlob(async (blob: any) => {
    // 创建文件对象
    let file: any = new window.File(
      [blob],
      '截图' + dayjs(new Date()).unix() + '.jpeg',
      {
        type: 'image/jpeg',
      },
    )
    if (file) {
      // 添加要上传的文件
      const result = await orgCtrl.user.directory.createFile(file)
      // 把选中裁切好的的图片传出去
      if (result) {
        props?.onClose(result);
      }
    }
    // 关闭弹窗
    img.value = ''
    ElMessage.success(
      '截屏已存入仓库/文件/沟通/截图/' + dayjs(new Date()).format('YYYY-MM-DD'),
    );
  });
}

// 设置截图热键
useKeyPress('a', (event: any) => {
  if (event.ctrlKey && event.altKey) {
    if (!img.value) {
      init()
    }
  }
})
</script>

<template>
  <div class="hooks-cropper-modal" v-if="img">
    <div class="modal-panel">
      <div class="cropper-container-container">
        <div
          class="cropper-container"
          @dblclick="handleSubmit"
          title="双击完成截图"
        >
          <VuePictureCropper
            :boxStyle="{
              width: '100%',
              height: '100%',
              backgroundColor: '#f8f8f8',
            }"
            :img="img"
            :options="{
              viewMode: 1, // 裁切框活动范围
              dragMode: 'crop', // 拖拽图片模式： 图片不可移动，生成新的裁剪框
              autoCrop: false, // 禁用自动裁剪
              scalable: false, // 是否可以缩放图片（改变长宽）
              zoomable: false, // 是否可以缩放图片（改变焦距）
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.hooks-cropper-modal {
  height: 100%;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 2;
  border: 1px solid rgb(48, 79, 253);
  // .modal-panel,.cropper-container-container,.cropper-container,.cropper{
  //   height: 100%;
  // }
  .button-row {
    position: absolute;
    bottom: 0;
    z-index: 3;
  }
}

</style>