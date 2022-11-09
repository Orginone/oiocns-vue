<template>
  <div class="container mainBox" ref="container">
    <div class="tree left box">
      <Tree @nodeClick="nodeClick" ref="unitTree" />
    </div>
    <div class="resize" title="收缩侧边栏"> ⋮ </div>
    <div class="content mid box">
      <!-- <BreadcrumbVue /> -->
      <div class="info" ref="infoWrap">
        <Info ref="info" />
      </div>
      <div class="body" ref="bodyWrap" :style="{ height: tabHeight + 'px' }">
        <Body ref="body" :tabHeight="tabHeight" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  // @ts-nocheck
  import Tree from './components/tree.vue'
  import Info from './components/info.vue'
  import Body from './components/body.vue'
  import { ref, onMounted } from 'vue'
  // import BreadcrumbVue from '@/components/divBreadcrumb/index.vue';

  const info = ref(null)
  const body = ref(null)
  const unitTree = ref(null)

  const dataSource = ref<Tree[]>([
  {
    id: 1,
    label: '浙江省财产年报集团',
    children: [
      {
        id: 5,
        label: '集团子节点',
      },
      {
        id: 6,
        label: '集团子节点',
      },
    ],
  },
  {
    id: 2,
    label: '浙江省资产年报集团',
    children: [
      {
        id: 5,
        label: '集团子节点',
      },
      {
        id: 6,
        label: '集团子节点',
      },
    ],
  },
  {
    id: 3,
    label: '浙江省资产年报集团',
    children: [
      {
        id: 5,
        label: '集团子节点',
      },
      {
        id: 6,
        label: '集团子节点',
      },
    ],
  },
])

  const nodeClick = (selectItem: any) => {
    info.value.selectItemChange(selectItem)
    body.value.selectItemChange(selectItem)
    unitTree.value.selectItemChange(selectItem)
    setTimeout(() => {
      if (container.value && infoWrap.value) {
        tabHeight.value = containerHeight.value - 62 - infoWrap.value.clientHeight
      }
    }, 100)
  }
  const container = ref(null)
  const infoWrap = ref(null)
  const tabHeight = ref<number>(10)
  const containerHeight = ref<number>(300)
  onMounted(() => {
    if (container.value && infoWrap.value) {
      containerHeight.value = container.value.clientHeight
      tabHeight.value = container.value.clientHeight - 65 - infoWrap.value.clientHeight
    }
    dragControllerDiv()
  })
  // 拖拽移动实现
  const dragControllerDiv = () => {
    let resize = document.getElementsByClassName('resize')
    let left = document.getElementsByClassName('left')
    let mid = document.getElementsByClassName('mid')
    let box = document.getElementsByClassName('mainBox')
    for (let i = 0; i < resize.length; i++) {
      // 鼠标按下事件
      resize[i].onmousedown = function (e) {
        //颜色改变提醒
        resize[i].style.background = '#818181'
        let startX = e.clientX
        resize[i].left = resize[i].offsetLeft - left[i].offsetLeft
        // 鼠标拖动事件
        document.onmousemove = function (e) {
          console.log('cccc', infoWrap.value.clientHeight)

          let endX = e.clientX
          let moveLen = resize[i].left + (endX - startX) // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
          console.log(moveLen)
          let maxT = box[i].clientWidth - resize[i].offsetWidth // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
          if (moveLen < 240) moveLen = 240 // 左边区域的最小宽度为240px
          if (moveLen > 450) moveLen = 450
          resize[i].style.left = moveLen // 设置左侧区域的宽度
          for (let j = 0; j < left.length; j++) {
            left[0].style.width = moveLen + 'px'

            console.log('moveLenmoveLen', moveLen)
            unitTree.styleTree = {
              width: moveLen - 45 + 'px'
            }

            // mid[0].style.width = (box[i].clientWidth - moveLen - 10) + 'px';
          }
          tabHeight.value = containerHeight.value - 65 - infoWrap.value.clientHeight
        }
        // 鼠标松开事件
        document.onmouseup = function (evt) {
          //颜色恢复
          resize[i].style.background = '#d6d6d6'
          document.onmousemove = null
          document.onmouseup = null
          resize[i].releaseCapture && resize[i].releaseCapture() //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
        }
        resize[i].setCapture && resize[i].setCapture() //该函数在属于当前线程的指定窗口里设置鼠标捕获
        return false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .resize {
    cursor: col-resize;
    float: left;
    position: relative;
    left: 2px;
    top: 45%;
    background-color: #d6d6d6;
    border-radius: 5px;
    width: 4px;
    height: 50px;
    background-size: cover;
    background-position: center;
    /*z-index: 99999;*/
    font-size: 12px;
    padding-top: 6px;
    padding-left: 1px;
    color: white;
  }
  /*拖拽区鼠标悬停样式*/
  .resize:hover {
    color: #444444;
  }
  :deep(.el-select) {
    width: 100%;
  }
  .container {
    width: 100%;
    // height: calc(100% - 56px);
    padding: 3px;
    box-sizing: border-box;
    display: flex;

    .tree {
      width: 23%;
    }
    .content {
      width: 77%;
      height: 100%;
      flex: 1;
      box-sizing: border-box;
      overflow: hidden;
      .info {
        padding: 0 0 3px 0;
        box-sizing: border-box;
      }
      .body {
        height: 400px;
      }
    }
  }
</style>
