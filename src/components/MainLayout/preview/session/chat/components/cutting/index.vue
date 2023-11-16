<!-- 截图 -->
<script setup lang='ts'>
import Cropper from 'react-cropper' // 引入Cropper
import 'cropperjs/dist/cropper.css' // 引入Cropper对应的css
import html2canvas from 'html2canvas'
import orgCtrl from '@/ts/controller'
import dayjs from 'dayjs'
import { message } from 'antd'

const props = defineProps<{ 
  open?: boolean
  onClose?: Function 
}>()

const cropperRef = useRef<any>(null);
  const [img, setimg] = useState<string>('');

  useEffect(() => {
    if (open) {
      init(50);
    } else {
      setimg('');
    }
  }, [open]);

  const init = (times: number = 200) => {
    setTimeout(async () => {
      // 获取当前网页 可视区域
      const Dom: HTMLElement = document.documentElement;
      //等待canvas绘制 鼠标变为加载中样式。。。
      Dom.style.cursor = 'wait';
      const canvas = await html2canvas(Dom);
      // 恢复鼠标样式
      Dom.style.cursor = 'pointer';
      // canvas==>图片地址 用于剪切
      const imgUrl = canvas.toDataURL();
      // 获取截图base64
      setimg(imgUrl);
    }, times);
  };

  /**
   * @description: 按钮事件处理
   * @param {string} targetKey
   * @param {Function} onKeyDown
   * @return {*}
   */
  const useKeyPress = (targetKey: string, onKeyDown: Function) => {
    const handler = useCallback(
      (event: any) => {
        // 触发特定按钮事件
        if (event.key === targetKey) {
          onKeyDown(event);
        }
        // 退出截图
        if (event.key === 'Escape') {
          setimg('');
          onClose && onClose();
        }
      },
      [targetKey, onKeyDown],
    );
    // 增加按钮监听
    useEffect(() => {
      document.addEventListener('keydown', handler);
      return () => {
        document.removeEventListener('keydown', handler);
      };
    }, [handler]);
  };

  /**
   * @description: 提交截图信息
   * @param {*} useCallback
   * @return {*}
   */
  const handleSubmit = useCallback(() => {
    cropperRef.current.cropper.getCroppedCanvas().toBlob(async (blob: any) => {
      // 创造提交表单数据对象
      // 添加要上传的文件
      let file: any = new window.File(
        [blob],
        '截图' + dayjs(new Date()).unix() + '.jpeg',
        {
          type: 'image/jpeg',
        },
      );
      if (file) {
        const result = await orgCtrl.user.directory.createFile(file.name, file);
        // 把选中裁切好的的图片传出去
        if (result) {
          onClose && onClose(result);
        }
      }
      // 关闭弹窗
      setimg('');
      message.success(
        '截屏已存入仓库/文件/沟通/截图/' + dayjs(new Date()).format('YYYY-MM-DD'),
      );
    });
  }, [cropperRef]);

  useKeyPress('a', (event: any) => {
    // 判断是否按下了 Control 和 Alt 键
    if (event.ctrlKey && event.altKey) {
      // Control 和 Alt 键+A
      if (!img) {
        init();
      }
    }
  });

  if (!img) {
    return <></>;
  }
</script>

<template>
    <div className="hooks-cropper-modal">
      <div className="modal-panel">
        <div className="cropper-container-container">
          <div
            className="cropper-container"
            onDoubleClick={() => {
              handleSubmit();
            }}>
            <Cropper
              title="双击完成截图"
              src={img}
              className="cropper"
              ref={cropperRef}
              autoCrop={false} //当初始化时，可以自动生成图像
              zoomable={false} //缩放-禁止
              movable={true}
              aspectRatio={undefined} // 固定为1:1  可以自己设置比例, 默认情况为自由比例
              background={true}
              rotatable={false} // rotatable true 可旋转图片
              cropBoxResizable={true} //允许对以圈定区域进行调整
              // preview=".cropper-preview" // 预览的窗帘样式类名指定
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