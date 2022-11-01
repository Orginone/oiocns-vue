<template>
  <!-- 新增或编辑工作台 -->
  <div class="base-layout" ref="base">
    <div class="layout-con" id="workSpace">
      <canvas class="canvasBg" id="canvasBg" />
      <grid-layout ref="gridlayout" :layout="layout" :col-num="12" :row-height="27.5"
        :is-draggable="gridLayoutSet.draggable" :is-resizable="gridLayoutSet.resizable" :vertical-compact="true"
        :margin="[4, 4]" :use-css-transforms="true" :use-style-cursor="false" @layout-updated="layoutUpdatedEvent"
        @breakpoint-changed="breakpointChangedEvent">
        <grid-item v-for="item in layout" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" :key="item.i"
          :static="menuListShow ? true : false" :use-style-cursor="false" @resize="resizeEvent" @move="moveEvent"
          @resized="resizedEvent(...arguments, item)" @moved="movedEvent">
          <div style="height: 100%; overflow: hidden">
            <el-icon class="del-icon" @click="deleteporl(item)" v-if="!menuListShow">
              <Delete />
            </el-icon>
            <TheSandBox v-if="item.type == 'iframe'" :cover="true" :containLink="item.contain_link" :type="item.type">
            </TheSandBox>
            <TheComponentList v-else :cover="true" :containLink="item.contain_link" :type="item.type">
            </TheComponentList>
          </div>
        </grid-item>
      </grid-layout>
    </div>
<!-- @mousedown="move" -->
    <div class="layout-menu box" :style="MenuStyle" style="background: var(--el-bg-color-overlay);" >
      <el-button type="primary" icon="DeleteFilled" @click="clearTemplate">清空</el-button>
      <div class="layout-menu-body__tree" v-show="listShow">
        <TheSearchInput placeholder="输入组件名" :filterText.sync="filterText" @filterText="changeFilterText">
        </TheSearchInput>
        <div class="layout-menu-body__treeList" v-show="!searchShow">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="系统组件" name="1">
              <div class="tree" @drag="drag(item)" @dragend="dragend(item)" draggable="true" unselectable="on"
                @click="addprotal(item)" v-for="item in componentList" :key="item.url">
                <div class="row" style="padding: 5px 0">
                  <div class="el-icon-setting listContain_item" style="margin: 5px 5px 0 5px"></div>
                  <div>
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="应用组件" name="2">
              <el-collapse v-model="activeNames2">
                <el-collapse-item class="collapseItem" :title="key" v-for="(app, key, index) in newAppList"
                  :key="index">
                  <div class="tree" @drag="drag(item)" @dragend="dragend(item)" draggable="true" unselectable="on"
                    @click="addAppProtal(item)" v-for="(item, index) in app" :key="index">
                    <el-popover placement="right" width="400" trigger="hover">
                      <el-image :src="item.previewPic"></el-image>
                      <div class="row" slot="reference" style="padding: 5px 0">
                        <div class="el-icon-setting listContain_item" style="margin: 5px 5px 0 5px"></div>
                        <div>
                          {{ item.name }}
                        </div>
                      </div>
                    </el-popover>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-collapse-item>
            <el-collapse-item title="用户组件" name="3">
              <template #title>
                用户组件<el-icon @click.stop="openUserDialog" class="addIcon">
                  <Plus />
                </el-icon>
              </template>
              <div class="tree" @drag="drag(item)" @dragend="dragend(item)" draggable="true" unselectable="on"
                @click="addUserProtal(item)" v-for="item in ohterData.userComplist" :key="item.url">
                <div class="row" style="padding: 5px 0; display: flex; justify-content: space-between">
                  <div class="el-icon-setting listContain_item" style="margin: 5px 5px 0 5px">{{
                      item.name
                  }}</div>
                  <el-icon style="margin-right: 5px" @click.stop="delUserCompnents(item)">
                    <Delete />
                  </el-icon>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div v-show="searchShow" class="layout-menu-body__treeList">
          <div class="tree" @drag="drag" @dragend="dragend(item)" draggable="true" unselectable="on"
            @click="addprotal(item)" v-for="item in searchList" :key="item.recid">
            <div class="row" slot="reference" style="padding: 5px 0">
              <div class="el-icon-setting listContain_item" style="margin: 2px 5px 0 5px"></div>
              <div>
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="height: 45px;" class="flex-center">
        <el-button type="default" bg style=" font-size: 16px;" size="large" text @click="back">返回</el-button>
        <!-- <div style="width: 1px; height: 100%; border: 1px solid #eeeeee; margin-top: 20px"></div> -->
        <el-button type="primary" plain size="large" bg style=" font-size: 16px;" @click="handleSave">保存
        </el-button>
      </div>
      <div class="layout-menu__btnTopLeft" v-show="menuBtnShow && BtnDirection == 'left'"></div>
      <div class="layout-menu__btnBottomLeft" v-show="menuBtnShow && BtnDirection == 'left'"></div>
      <div class="layout-menu__btnLeft flex-center" style="background: var(--el-bg-color-overlay);" @click="handleMenuBtn"
        v-show="menuBtnShow && BtnDirection == 'left'">
        <div class="el-icon-caret-right" :style="menuShow ? 'transform: rotate(180deg)' : 'transform: rotate(0)'"></div>
      </div>
      <div class="layout-menu__btnTop" v-show="menuBtnShow && BtnDirection == 'right'"></div>
      <div class="layout-menu__btnBottom" v-show="menuBtnShow && BtnDirection == 'right'"></div>
      <div class="layout-menu__btnRight flex-center" style="background: var(--el-bg-color-overlay);" @click="handleMenuBtn"
        v-show="menuBtnShow && BtnDirection == 'right'">
        <el-icon class="el-icon-caret-left" :style="menuShow ? 'transform: rotate(180deg)' : 'transform: rotate(0)'">
          <CaretLeft />
        </el-icon>
      </div>
    </div>
  </div>
  <template v-for="item in dialogShow">
    <TheHomeDialog v-if="item.key === 'home' && item.value" :key="item.key" :dialogShow="item"
      @closeDialog="handleCloseDialog" />
    <!-- 保存当前模板弹出框 -->
    <!-- :allData="allData" -->
    <TheSaveDialog v-if="item.key === 'save' && item.value" :key="item.key" :dialogShow="item"
      @closeDialog="handleCloseDialog"></TheSaveDialog>
    <!-- 新增用户组件弹出框 -->
    <TheUserDialog v-if="item.key === 'user' && item.value" :key="item.key" :dialogShow="item"
      @closeDialog="handleCloseDialog"></TheUserDialog>
    <!-- <TheSaveJobDialog
      v-if="item.key === 'job' && item.value"
      :key="item.key"
      :dialogShow="item"
      @closeDialog="handleCloseDialog"
    ></TheSaveJobDialog> -->
  </template>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue'
import { GridLayout, GridItem } from 'vue-grid-layout'
import TheSearchInput from './components/theSearchInput.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import 'element-plus/es/components/message-box/style/css'
import { testData } from './layout.ts'
import TheComponentList from '@/components/protal/index.vue'
import TheSandBox from '@/components/sandBox/index.vue'
import TheSaveDialog from './components/theSaveDialog.vue'
import TheHomeDialog from './components/theHomeDialog.vue'
import TheUserDialog from './components/theUserDialog.vue'
import $services from '@/services'
import { useUserStore } from '@/store/user'
import { useAnyData } from '@/store/anydata'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  components: {
    TheSandBox,
    GridLayout,
    GridItem,
    TheSearchInput,
    TheComponentList,
    TheSaveDialog,
    TheHomeDialog,
    TheUserDialog
  },
  setup() {
    onMounted(() => {
      state.componentList = testData // 系统组件组件列表
    })
    // 定义变量位置
    const state = reactive({
      menuShow: true,
      menuBtnShow: true,
      menuBtnMove: true,
      BtnDirection: 'right',
      transparentShow: false,
      baseWdith: 0,
      templateList: [],
      dialogShow: [
        {
          key: 'user',
          value: false
        },
        {
          key: 'save',
          value: false
        },
        {
          key: 'home',
          value: false
        },
        {
          key: 'job',
          value: false
        }
      ],
      uniqueGrid: 0,
      filterText: '', // 搜索
      listShow: true, // 控制组件与模板列表的展示
      componentList: [], // 系统组件组件列表
      // userComponentList: [], // 用户组件列表
      appList: [], // 应用列表
      // customList: [], // 自定义模板列表
      // allTemplateList: [],
      // userUse: '', // 用户正在使用的模板
      // currentPage: 1,
      // pageSize: 9999999,
      activeNames: ['1', '2'],
      defaultList: '', // 用户默认设置的模板
      userIdList: [],
      systemShow: false,
      searchShow: false, // 搜索时展示
      searchList: [], // 搜索列表
      // templateData: [], // 用户点击模板的数据
      systemIndex: false, // 系统组件index
      customIndex: false, // 自定义组件index
      menuListShow: false, // 控制自定义模板的显示
      // grid
      layoutI: '',
      screenWidth: document.body.clientWidth,
      screenHig: document.body.clientHeight,
      menuHidden: false,
      isPreview: false,
      gridLayoutSet: {
        draggable: true,
        resizable: true
      },
      layout: [],
      portalid: '694567114580692992',
      canvasBg: {
        hig: 120
      },
      newAppList: [],
      // newAppItem: [],
      activeNames2: [],
      onValue: '',
      tabsData: [],
      // allData: {
      //   name: '首页配置',
      //   content: [],
      //   user: {
      //     name: '用户组件',
      //     content: []
      //   }
      // }
    })
    const store = useUserStore()
    const ohterData = useAnyData() // 用户附属信息
    const router = useRouter()
    const route = useRoute()
    let base = ref(null)

    //computed位置
    const MenuStyle = computed(() => {
      let menu = ''
      if (state.menuShow && state.menuBtnShow) {
        if (state.BtnDirection == 'right') {
          menu =
            'right:0px;transition: all 0.5s ease;box-shadow: -5px 10px 10px rgba(0,0,0,0.03);'
        } else {
          menu =
            'margin-left:0px;transition: all 0.5s ease;box-shadow: 5px 10px 10px rgba(0,0,0,0.03);'
        }
      } else if (state.menuShow && !state.menuBtnShow) {
        //移动时
        menu = 'width:200px;margin-left:0px;'
      } else {
        // 关闭
        if (state.BtnDirection == 'right') {
          menu = 'right:-199px;transition: all 0.5s ease;left:unset;'
        } else {
          menu = 'transition: all 0.5s ease;margin-left:-199px'
        }
      }
      return menu
    })
    const defaultOnClick = () => {
      if (this.systemIndex === false && this.customIndex === false) {
        return false
      } else {
        return true
      }
    }

    // mouted位置
    onMounted(() => {
      getCanvasBg()
      getLayout() // 加载默认的可编辑模块
    })

    // method位置
    // 删除用户组件
    const delUserCompnents = (item) => {
      ElMessageBox.confirm('此操作将永久删除该组件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        
        let params = {

          workspaceId: store.workspaceData.id,
          content: ohterData.userComplist.filter(el => el.id !== item.id)
        }
        const resState = ohterData.updateUserSpace(params)
        if (resState) {
          ElMessage({
            message: '删除成功',
            type: 'success'
          })

        }
        
      })
    }
    // 获取用户组件
    // const getUserComponents = () => {
    //   let params = {
    //     userId: store.queryInfo.id,
    //     workspaceId: store.workspaceData.id
    //   }
    //   $services.diyHome
    //     .diy(`/anydata/object/get/${params.userId}.${params.workspaceId}.user`, {
    //       method: 'GET'
    //     })
    //     .then((res: ResultType) => {
    //       console.log('测试接口', res)
    //       if (res.state) {
    //         state.allData.user.content = [...res.data.content] // 同步用户组件数据
    //         state.userComponentList = res.data.content
    //       }
    //     })
    // }
    // 打开添加用户组件dialog
    const openUserDialog = () => {
      state.dialogShow.map((el) => {
        if (el.key === 'user') {
          el.value = true
          el.sendData = ohterData.userComplist // state.userComponentList
        }
      })
    }
    // 获取首页layout布局
    const getLayout = () => {
      const nowEditLayout = route.query.onValue
      const nowLayout = ohterData?.homeComplist.length > 0 ? ohterData?.homeComplist.find(n => n.name === parseInt(nowEditLayout)) : null
      console.log('首页layout布局', nowLayout)
      state.layout = nowLayout ? [...nowLayout.temps] : []
     
    }
    // 确认按钮
    // const submitHome = () => {
    //   state.dialogShow.map((el) => {
    //     if (el.key === 'home') {
    //       el.value = true
    //       el.sendData = state.layout
    //     }
    //   })
    // }
    // 设置默认首页
    const handleDefault = () => { }
    // 获取模板列表
    // const getTemps = () => {
    //   let params = {
    //     userId: store.queryInfo.id
    //   }
    //   $services.diyHome
    //     .diy(`/anydata/object/get/template-${params.userId}`, {
    //       method: 'GET'
    //     })
    //     .then((res: ResultType) => {
    //       // console.log('测试接口', res)
    //       if (res.state) {
    //         state.templateList = res.data.content
    //       }
    //     })
    // }
    //关闭弹窗
    const handleCloseDialog = (key) => {
      state.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = false
        }
      })
      // if (key === 'user') {
      //   getUserComponents()
      // }
    }

    const layoutUpdatedEvent = (newLayout) => {
      state.layout = newLayout
      // console.log('==5', newLayout)
    }
    const breakpointChangedEvent = (newBreakpoint, newLayout) => {
      // console.log('BREAKPOINT CHANGED breakpoint=', newBreakpoint, ', layout: ', newLayout)
    }
    const moveEvent = (i, newX, newY) => {
      // console.log('MOVE i=' + i + ', X=' + newX + ', Y=' + newY)
    }
    const resizeEvent = (i, newH, newW, newHPx, newWPx) => {
      state.layoutI = i
    }
    const movedEvent = (i, newX, newY) => {
      // console.log('结束移动')
    }
    const resizedEvent = (i, newH, newW, newHPx, newWPx, item) => {
      // console.log('layout', state.layout)
    }
    // canvas方法
    const getCanvasBg = () => {
      //获取canvas元素
      let workSpace = document.getElementById('workSpace')
      let panelWidth = workSpace.clientWidth - 12,
        panelHeight = workSpace.clientHeight - 12
      let canvas = document.getElementById('canvasBg')
      let  isDarkTheme = document.getElementsByClassName('dark')
      console.log(isDarkTheme)
      if (canvas == null) return false
      canvas.width = panelWidth
      canvas.height = panelHeight
      //获取上下文
      let context = canvas.getContext('2d')
      let w = (panelWidth - 50) / 12
      let hig = state.canvasBg.hig
      for (let h = panelHeight, j = 0; h > hig; h -= hig, j++) {
        for (let i = 0; i < 12; i++) {
          drowJux(context, i * (w + 3.8) + 5, j * (hig + 3.8) + 5, w, hig - 1 ,isDarkTheme[0])
        }
      }
    }
    //绘制矩形
    const drowJux = (context, left, top, w, h,isDarkTheme) => {
      //设定图形边框的样式
      context.strokeStyle =isDarkTheme ? '#414243'  :  '#E0E5F3'
      //指定线宽
      context.lineWidth = 1
      context.strokeRect(left, top, w, h)
    }
    //  清空事件
    const clearTemplate = () => {
      state.layout = []
    }
    // 删除事件
    const deleteporl = (o) => {
      for (let i = 0; i < state.layout.length; i++) {
        if (state.layout[i].i == o.i) {
          state.layout.splice(i, 1)
        }
      }
    }
    // 保存模板事件
    const handleSave = () => {
      const saveDialog = state.dialogShow.find(el => el.key === 'save')
      if (saveDialog) {
        saveDialog.value = true
        saveDialog.sendData = state.layout // 所含模块
      }
    }

    // 点击用户组件事件
    const addUserProtal = (data) => {
      let list = JSON.parse(JSON.stringify(data))
      if (state.layout.length !== 0) {
        state.uniqueGrid = state.layout[state.layout.length - 1].i
      }
      state.layout.forEach((el) => {
        if (el.x < 2) {
          el.y += 3
        }
      })
      // 点击侧边栏
      state.uniqueGrid += 1
      var obj = {
        x: 0,
        y: 0,
        w: parseInt(list.width),
        h: 4.5 * list.height,
        i: state.uniqueGrid,
        contain_name: list.name,
        contain_link: list.url,
        type: 'iframe'
      }
      state.layout.push(obj)
    }
    // 点击系统组件
    const addprotal = (data) => {

      let list = JSON.parse(JSON.stringify(data))
      if (state.layout.length !== 0) {
        state.uniqueGrid = state.layout[state.layout.length - 1].i
      }
      state.layout.forEach((el) => {
        if (el.x < 2) {
          el.y += 9
        }
      })
      // 点击侧边栏
      state.uniqueGrid += 1
      var obj = {
        x: 0,
        y: 0,
        w: 4,
        h: 9,
        i: state.uniqueGrid,
        contain_name: list.name,
        contain_link: list.url
      }
      state.layout.push(obj)
    }
    const back = () => {
      // state.menuListShow = true
      // getUserTemps()

      router.push({ path: '/workHome' })
    }
    // 获取用户模板
    // const getUserTemps = () => {
    //   state.layout = []
    //   getTemps()
    // }

    // const customTemplate = () => {
    //   state.menuListShow = false
    // }
    // const handleDeleteCustomList = (data) => {
    //   // 删除自定义模板
    //   ElMessageBox.confirm('此操作将永久删除该模板, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     state.templateList.forEach((el, index) => {
    //       if (el.id == data.id) {
    //         state.templateList.splice(index, 1)
    //       }
    //     })
    //     let params = {
    //       userId: store.queryInfo.id
    //     }
    //     $services.diyHome
    //       .diy(`/anydata/object/set/template-${params.userId}`, {
    //         data: {
    //           operation: 'replaceAll',
    //           data: {
    //             name: '模板配置',
    //             // temps: props.dialogShow.sendData
    //             content: state.templateList
    //           }
    //         }
    //       })
    //       .then((res: ResultType) => {
    //         if (res.state) {
    //           ElMessage({
    //             type: 'success',
    //             message: '更新成功'
    //           })
    //         }
    //       })
    //   })
    // }

    const changeFilterText = (val) => {
      state.filterText = val
      if (state.menuListShow) {
      } else {
        if (state.filterText == '') {
          state.searchShow = false
        } else {
          state.searchShow = true
          state.searchList = state.componentList.filter((el) => {
            return el.name.indexOf(val) !== -1
          })
        }
      }
    }
    const handleMenuBtn = () => {
      state.menuShow = !state.menuShow
    }
    const move = (e) => {
      if (e.target.className == 'layout-menu box') {
        state.transparentShow = true
        // 判断是否为按钮
        state.menuBtnMove = true
        let odiv = e.target //获取目标元素
        //算出鼠标相对元素的位置
        let disX = e.clientX - odiv.offsetLeft
        odiv.style.left = e.clientX - disX + 'px'

        document.onmousemove = (e) => {
          //鼠标按下并移动的事件
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX
          //绑定元素位置到positionX和positionY上面
          // this.positionX = top
          // this.positionY = left
          // //移动当前元素
          odiv.style.left = left + 'px'
        }
        document.onmouseup = (e) => {
          let left = e.clientX - disX
          if (left > state.baseWdith) {
            odiv.style.left = base.clientWidth - 400 + 'px'
            state.BtnDirection = 'right'
          } else {
            odiv.style.left = 0 + 'px'
            state.BtnDirection = 'left'
          }
          state.transparentShow = false
          state.menuBtnMove = false
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    }
    // const addprotalTemplate = (data, index) => {
    //   // 点击系统模板事件
    //   state.systemIndex = index
    //   state.customIndex = false
    //   state.templateData = data
    //   var config = data.temps
    //   state.layout = config
    // }
    // const addprotalCustom = (data, index) => {
    //   // 点击自定义模板事件
    //   state.customIndex = index
    //   state.systemIndex = false
    //   state.templateData = data
    //   var config = JSON.parse(data.config)
    //   state.layout = config
    // }
    return {
      delUserCompnents,
      addUserProtal,
      openUserDialog,
      // submitHome,
      handleDefault,
      handleCloseDialog,
      handleSave,
      layoutUpdatedEvent,
      breakpointChangedEvent,
      resizeEvent,
      moveEvent,
      resizedEvent,
      movedEvent,
      clearTemplate,
      deleteporl,
      addprotal,
      back,
      changeFilterText,
      defaultOnClick,
      // customTemplate,
      handleMenuBtn,
      // addprotalTemplate,
      // addprotalCustom,
      // handleDeleteCustomList,
      move,
      ohterData,
      MenuStyle,
      base,
      ...toRefs(state)
    }
  }
})
</script>

<style lang="scss" scoped>
.base-layout {
  overflow: auto;
  height: calc(100vh - 60px);
}

.addIcon {
  margin-left: 10px;
  background-color: #0f39d1;
  border-radius: 50%;
  color: #fff;
}

.del-icon {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;

  &:hover {
    color: #0f39d1;
  }
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-icon-star-off {
  margin: 0px 5px 1px 5px !important;
}

:deep(.el-collapse-item__wrap) {
  overflow: unset;
}

.collapseItem {
  padding: 0 10px;

  :deep(.el-collapse-item__header) {
    border: unset;
  }
}

.row-speace {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .el-icon-delete {
    margin-right: 10px;
  }

  .el-icon-delete:hover {
    color: #0f39d1;
  }
}

.row-speace:hover {
  background: rgb(245, 247, 250);
}

.templateManage {
  width: 100%;
  border-bottom: 1px solid #eeeeee;
  height: 40px;
  font-size: 16px;
  line-height: 30px;
  text-align: center;
  padding-right: 20px;
  color: #0f39d1;
  cursor: pointer;
}

:deep(.el-collapse) {
  flex: 1;
  height: 1px;
  display: flex;
  flex-direction: column;
}

.defaultClick {
  background: rgb(236, 241, 252);
}

.transparent {
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba($color: #000000, $alpha: 0);
  left: 0;
  top: 0;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.diy-table-layout {
  padding: 0;
  margin: 0;
}

.layout {
  &-con {
    width: 100%;
    height: 100%;
  }

  &-content {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  &-shrinkage {
    width: 20px;
    height: 60px;
    border: 1px solid #a8a6a6;
    line-height: 60px;
    position: fixed;
    cursor: pointer;
  }

  &-menu {
    position: fixed;
    right: -200px;
    // left: 50%;
    top: 60px;
    // margin-left: 200px;
    width: 200px;
    height: calc(100% - 60px);
    padding: 10px;
    display: flex;
    flex-direction: column;
    z-index: 99;
    // transition: all 0.5s ease;
    // cursor: move;

    &__head {
      cursor: auto;
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      text-align: center;
    }

    &__onClick {
      color: #154ad8;
      border: 1px solid #154ad8;
    }

    &__save {
      height: 80px;
      border: 1px solid #eee;
      text-align: center;
      cursor: pointer;
      line-height: 80px;
    }

    &__row {
      flex: 1;
      height: 1px;
      border: 1px solid #eee;
      display: flex;
      flex-direction: row;
    }

    &__left {
      width: 50%;
      text-align: center;
      line-height: 43px;
      cursor: pointer;
    }

    &__right {
      width: 50%;
      text-align: center;
      line-height: 43px;
      cursor: pointer;
    }

    &__btnTopLeft {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 46%;
      left: 100%;
      transform: translate(0, -50%);
      cursor: pointer;
      background-image: radial-gradient(20px at 20px 0px, rgba(255, 255, 255, 0) 50px, #fff 50px);
    }

    &__btnBottomLeft {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 54%;
      left: 100%;
      transform: translate(0, -45%);
      cursor: pointer;
      background-image: radial-gradient(20px at 20px 20px,
          rgba(255, 255, 255, 0) 50px,
          #fff 50px);
    }

    &__btnLeft {
      box-shadow: 4px 5px 10px rgba(0, 0, 0, 0.04);
      width: 20px;
      height: 80px;
      line-height: 50px;
      // border: 1px solid #9c9c9c;
      border-radius: 0px 20px 20px 0px;
      position: absolute;
      left: 100%;
      top: 50%;
      font-size: 20px;
      transform: translate(0, -50%);
      cursor: pointer;
    }

    &__btnTop {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 45.5%;
      right: 100%;
      transform: translate(0, -50%);
      cursor: pointer;
      background-image: radial-gradient(20px at 0px 0px, rgba(255, 255, 255, 0) 50px, var(--el-bg-color-overlay) 50px);
    }

    &__btnBottom {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 54.5%;
      right: 100%;
      transform: translate(0, -45%);
      cursor: pointer;
      background-image: radial-gradient(20px at 0px 20px, rgba(255, 255, 255, 0) 50px, var(--el-bg-color-overlay) 50px);
    }

    &__btnRight {
      box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.04);
      width: 20px;
      height: 80px;
      line-height: 50px;
      // border: 1px solid #9c9c9c;
      border-radius: 20px 0 0 20px;
      position: absolute;
      right: 100%;
      top: 50%;
      font-size: 20px;
      transform: translate(0, -50%);
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    &-body {
      display: flex;
      flex-direction: column;
      flex: 1;

      &__tree {
        display: flex;
        flex-direction: column;
        height: 1px;
        flex: 1;
        cursor: auto;
      }

      &__treeList {
        cursor: auto;
        margin: 10px 0;
        height: 1px;
        flex: 1;
        overflow: auto;
        display: flex;
        flex-direction: column;
      }

      &__footer {
        border-top: 1px solid rgb(235, 238, 245);
        text-align: center;
        line-height: 53px;
        font-size: 16px;
        color: #154ad8;
        height: 53px;
        cursor: pointer;
      }
    }
  }
}
.dark {
  .layout-menu__btnTopLeft {
    background-image: radial-gradient(20px at 0px 0px, rgba(0, 0, 0, 0) 50px, var(--el-bg-color-overlay) 50px);

  }
  .layout-menu__btnBottom {
    background-image: radial-gradient(20px at 0px 20px, rgba(0, 0, 0, 0) 50px, var(--el-bg-color-overlay) 50px);

  }
} 
.vue-grid-layout {
  position: relative;
  min-height: calc(100vh - 150px);
  z-index: 1;

  .vue-grid-item {
    position: absolute;
    width: 1000px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 4px;
    border: 1px solid #efefef;

    .deleteIem {
      position: absolute;
      top: 1px;
      right: 1px;
      padding: 2px;
      background: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      color: #666;
      font-size: 14px;
      z-index: 99;

      &:hover {
        font-size: 15px;
        color: #f56c6c;
      }
    }
  }
}

.tree {
  cursor: pointer;

  :hover {
    background: rgb(245, 247, 250);
  }
}

.canvasBg {
  background: #f2f4f9;
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.dark .canvasBg {
  background: var(--el-bg-color-page);
}

.el-icon-caret-right {
  transition: all 0.5s ease;
}

.text {
  display: none;
  color: #ffffff;
}

.el-icon-star-off {
  cursor: pointer;
}

.el-icon-star-off {
  cursor: pointer;
}

.el-icon-star-on {
  color: rgb(92, 182, 255);
}
</style>
