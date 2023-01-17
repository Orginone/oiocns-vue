<template>
  <div class="cohortLayout">
    <div class="cohortLayout-header" v-if="typePD !== 3">
      <div class="cohortLayout-header-text"
        >{{ '请选择资源：'}}
      </div>
      <div class="cohortLayout-header-tabs">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane v-for="(item, index) in tabs" :key=" item.id" :name="index">
            <template #label>
              <div slot="label" >{{item.name }}</div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="cohortLayout-header" style="margin-top: 10px">
      <div class="cohortLayout-header-text">请选择{{ typePD == 1 ? '分配' : '共享' }}方式：</div>
      <div class="cohortLayout-header-tabs">
        <el-radio-group v-model="radio">
          <el-radio v-for="item in state.way" :key="item.id" :label="item.id">{{
            item.label
          }}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="cohortLayout-content">
      <div class="cohortLayout-content-left" :style="'width:' + (radio == '1' ? '49%' : '33%')">
        <el-input v-model="searchLeftValue" class="w-50 m-2" placeholder="搜索">
          <template #prefix>
            <el-icon class="el-input__icon">
              <search />
            </el-icon>
          </template>
        </el-input>
        <el-tree
          v-if="radio == '1'"
          ref="leftTree"
          node-key="id"
          :data="state.cascaderTree"
          :props="typePD !== 3 ? { class: customNodeClass } : unitProps"
          :check-strictly="true"
          :default-expand-all="true"
          show-checkbox
          @check-change="handleCheckChange"
          :filter-node-method="filterNode"
        />
        <el-tree
          v-else
          ref="leftTree"
          :data="state.cascaderTree"
          :key="radio"
          :highlight-current="true"
          :expand-on-click-node="false"
          :props="typePD !== 3 ? { class: customNodeClass } : unitProps"
          :default-expand-all="true"
          @node-click="handleNodeClick"
          :filter-node-method="filterNode"
        />
      </div>
      <div
        class="cohortLayout-content-center"
        style="width: 33%"
        v-if="radio !== '1'"
        v-infinite-scroll="load"
        infinite-scroll-immediate="false"
      >
        <el-input v-model="searchValue" class="w-50 m-2" placeholder="搜索">
          <template #prefix>
            <el-icon class="el-input__icon">
              <search />
            </el-icon>
          </template>
        </el-input>
        <el-tree
          v-if="radio == '2' || radio == '3' || (radio == '4' && centerTreeShow)"
          ref="centerTree"
          node-key="id"
          :check-strictly="true"
          :data="state.centerTree"
          :props="authorityProps"
          :default-expand-all="true"
          show-checkbox
          @check-change="centerAuthorClick"
        />
      </div>
      <div class="cohortLayout-content-right" :style="'width:' + (radio == '1' ? '49%' : '33%')">
        <Author
          v-if="radio == '1'"
          @delContent="delContent"
          :departData="state.departData"
        ></Author>
        <Author
          v-if="radio == '2'"
          @delContent="delContentAuth"
          :departData="state.authorData"
        ></Author>
        <Author
          v-if="radio == '3'"
          @delContent="delContentAuth"
          :departData="state.identitysData"
        ></Author>
        <Author
          v-if="radio == '4'"
          @delContent="delContentAuth"
          :departData="state.personsData"
        ></Author>
      </div>
    </div>
    <div class="footer" >
      <el-button type="primary" @click="submitAll">确认</el-button>
      <el-button class="footer-btn" @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  // @ts-nocheck
  import { onMounted, ref, reactive, toRefs, watch, nextTick, computed, onUnmounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import Author from './author.vue'
  import { useUserStore } from '@/store/user'
  import { Application } from './app.ts'
  import {userCtrl} from '@/ts/coreIndex'
  import {appCtrl} from '@/ts/coreIndex'

  const typePD: any = computed(() => { //共享 typePD==3  分配 typePD ==1
    if (props.dialogType == '1') {
      return 1
    } else {
      return 3
    }
  })
  const application = new Application(typePD.value)
  interface Tree {
    id: string
    label: string
    data?: any
    children?: Tree[]
  }
  type createInfo = {
    info: {
      id: string
    }
    type?: number
    dialogType: string
  }
  const store = useUserStore()
  const searchValue = ref('')
  const searchLeftValue = ref('')
  const activeName = ref(0)
  const tabs = ref([])
  const radio = ref('1')
  const leftTree = ref(null)
  const centerTree = ref(null)
  const resource = ref<string>('')
  const centerTreeShow = ref<boolean>(false) // 控制中间树形显隐
  const state = reactive({
    loadID: {
      id: '',
      label: ''
    },
    way: [],
    cascaderTree:[],//组织树
    switchId: '',//左侧选中的id
    departData: [], // 集团分配右侧数据
    departHisData: [], // 集团分配历史数据
    centerTree: [], // 分配中间树形
    authorHisData: [], // 角色历史数据
    authorData: [], // 角色右侧数据
    personsHisData: [], // 人员历史数据
    personsData: [], // 人员右侧数据
    identitysData: [], //岗位右侧数据
    identitysHisData: [] // 岗位历史数据
  })
  const authorityProps = {
    label: 'name',
    children: 'nodes',
    disabled: 'disabled'
  }
  const friendNodeClass = (data: any, node: any) => {
    if (data?.disabled) {
      return 'penultimate'
    }
    return null
  }
  const unitProps = {
    label: 'name',
    children: 'children',
    disabled: 'disabled',
    class: friendNodeClass
  }
  const page = reactive({
    currentPage: 1,
    pageSize: 20
  })
  watch(
    () => radio.value,
    async (newValue, oldValue) => {
      
      // if (!cascaderTree.value[0].children || cascaderTree.value[0].children.length == 0) {
      //   await submitAll(state.switchData, true, oldValue)
      // }
      centerTreeShow.value = false
      state.centerTree = []
      state.authorData = []
      state.personsData = []
      state.identitysData = []
      nextTick(() => {
        // if (newValue == '1') {
        //   let arr: any[] = []
        //   state.departData.forEach((el) => {
        //     if (el.type == 'add' || el.type == 'has') {
        //       arr.push(el.id)
        //     }
        //   })
        //   leftTree.value.setCheckedKeys(arr, true)
        // }
        getHistoryData();
      })
    }
  )
  const customNodeClass = (data: Tree, node: Node) => {
    // if (data.authAdmin === false || data?.data?.authAdmin === false) {
    //   return 'penultimate'
    // }
    return 'aa'
  }
  watch(
    () => resource.value,
    async (newValue, oldValue) => {
      
      // await submitAll(state.switchData, true)
      // state.centerTree = []
      // state.authorData = []
      // state.departData = []
      // state.personsData = []
      // state.identitysData = []
      // if (radio.value == '1') {
      //   clearTreeType(cascaderTree.value)
      //   leftTree.value.setCheckedKeys([])
      //   getHistoryData()
      // }
    }
  )
  watch(
    () => searchLeftValue.value,
    (newValue, oldValue) => {
      leftTree.value!.filter(newValue)
    }
  )
  const props = defineProps<createInfo>()

  onMounted(() => {
    state.way = [
      {
        id: '1',
        label: '按组织共享'
      },
      {
        id: '2',
        label: '按职权共享'
      },
      {
        id: '3',
        label: '按身份共享'
      },
      {
        id: '4',
        label: '按人员共享'
      }
    ]
    if (typePD.value == 1) {
      searchResource()
      getCompanyTree()
    } else {
      getOrgTree()
    }
  })

  const emit = defineEmits(['closeDialog'])

  const closeDialog = () => {
    emit('closeDialog')
  }

  // 获取共享时组织树
  const getOrgTree = async () => {
    state.cascaderTree = userCtrl.buildTargetTree(await userCtrl.getTeamTree())
    getHistoryData()
  }

  // 获取分配时左侧的组织树
  const getCompanyTree = async () => {
    let data = userCtrl.buildTargetTree(await userCtrl.getTeamTree(false));
    if(data||data.length){
      data.forEach(element => {
        element.label = element.name
      });
    }
    state.cascaderTree = data
    getHistoryData()
  }

  // 清除树形中的type
  const clearTreeType = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].type) {
        delete data[i].type
        if (data[i].children.length !== 0) {
          clearTreeType(data[i].children)
        }
      } else {
        clearTreeType(data[i].children)
      }
    }
  }

  // 获取历史数据
  const getHistoryData = async (data?: any) => {
    switch (radio.value) {
      case '1':
        setTimeout(async () => {
          let data1 =  await appCtrl.curProduct.queryExtend('组织','0');
          state.departHisData =  data1.result || []

          let arr: any[] = []
          state.departHisData.forEach((el) => {
            arr.push(el.id)
          })
          setTimeout(() => {
            leftTree.value.setCheckedKeys(arr, true)
          }, 300)
        }, 300)
        break
      case '2':
        let data2 =  await appCtrl.curProduct.queryExtend('职权','0');
        state.authorHisData =  data2.result || []
        state.authorData = JSON.parse(JSON.stringify(state.authorHisData))
        let arrAu: any[] = []
        state.authorData.forEach((el) => {
          el.type = 'has'
          arrAu.push(el.id)
        })
        if (state.centerTree.length > 0) {
          centerTree.value.setCheckedKeys(arrAu, true)
        }
        break
      case '3':
        let data3 =  await appCtrl.curProduct.queryExtend('身份','0');
        state.identitysHisData = data3.result || []
        state.identitysData = state.identitysHisData
        let arrId: any[] = []
        state.identitysData.forEach((el) => {
          el.type = 'has'
          arrId.push(el.id)
        })
        if (state.centerTree.length > 0) {
          centerTree.value.setCheckedKeys(arrId, true)
        }
        break
      case '4':
        let data4 = await appCtrl.curProduct.queryExtend('人员','0');        
        state.personsHisData =  data4.result || []
        state.personsData = state.personsHisData
        let arrPe: any[] = []
        state.personsData.forEach((el) => {
          el.type = 'has'
          arrPe.push(el.id)
        })
        if (state.centerTree.length > 0) {
          centerTree.value.setCheckedKeys(arrPe, true)
        }
        break
      default:
        break
    }
  }

  // 树节点过滤
  const filterNode = (value: string, data: any) => {
    if (!value) return true
    return data.label.includes(value)
  }

  // 提交表单
  const submitAll = async () => {
    let data = {
      list: state.departData, // 操作的项的集合
      destType:radio.value, //选中的(共享/分配)的方式类型
      resource: activeName.value,//选中的资源id
      switchId:state.switchId,//左侧选中的项的id
      curResourceId: tabs?.value[(activeName-1)||0]?.id || 0, //当前选中的资源id，只在分配时用到
    }

    if(radio.value == 2){
      data.list = state.authorData
    }else if (radio.value == 3){
      data.list = state.identitysData
    }else if(radio.value == 4){
      data.list = state.personsData
    }
    await application.submitAll(data)
    closeDialog()
  }

  // 中间树形滚动加载事件
  const load = () => {
    if (radio.value == '3') {
      page.currentPage++
      handleNodeClick(state.loadID, true)
    }
  }

  // 中间树形点击事件
  const centerAuthorClick = (data: any, checked: boolean, indeterminate: any) => {
    if (checked) {
      if (radio.value == '2') {
        handleBoxClick(state.authorHisData, state.authorData, data)
      } else if (radio.value == '3') {
        handleBoxClick(state.identitysHisData, state.identitysData, data)
      } else {
        handleBoxClick(state.personsHisData, state.personsData, data)
      }
    } else {
      if (radio.value == '2') {
        handleBoxCancelClick(state.authorHisData, state.authorData, data)
      } else if (radio.value == '3') {
        handleBoxCancelClick(state.identitysHisData, state.identitysData, data)
      } else {
        handleBoxCancelClick(state.personsHisData, state.personsData, data)
      }
    }
  }

  //处理中间树删除状态
  const handleBoxCancelClick = (hisData: any, dataList: any, data: any) => {
    let result = hisData.some((item: any) => {
      return item.id == data.id
    })
    dataList.forEach((el: any, index: number) => {
      if (el.id == data.id) {
        if (result) {
          data.type = 'del'
          el.type = 'del'
        } else {
          dataList.splice(index, 1)
        }
      }
    })
  }

  //处理中间树增加状态
  const handleBoxClick = (hisData: any, dataList: any, data: any) => {
    let result = hisData.some((item: any) => {
      return item.id == data.id
    })
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].id == data.id) {
        if (data.type == 'add') {
          return
        } else if (data.type == 'has') {
          return
        }
      }
    }
    if (result) {
      data.type = 'has'
      dataList.forEach((el: any) => {
        if (el.id == data.id) {
          el.type = 'has'
        }
      })
    } else {
      data.type = 'add'
      dataList.push(data)
    }
  }

  // 组织左侧树点击事件
  const handleCheckChange = (data: any, checked: boolean, indeterminate: any) => {
    if (checked) {
      if (radio.value == '1') {
        let result = state.departHisData.some((item: any) => {
          return item.id == data.id
        })
        for (let i = 0; i < state.departData.length; i++) {
          if (state.departData[i].id == data.id) {
            if (data.type == 'add') {
              return
            } else if (data.type == 'has') {
              return
            }
          }
        }
        if (result) {
          if (data.type == 'del') {
            data.type = 'has'
            state.departData.forEach((el) => {
              if (el.id == data.id) {
                el.type = 'has'
              }
            })
            return
          } else {
            data.type = 'has'
            state.departData.push(data)
          }
        } else {
          data.type = 'add'
          state.departData.push(data)
        }
      }
    } else {
      if (radio.value == '1') {
        let result = state.departHisData.some((item: any) => {
          return item.id == data.id
        })
        state.departData.forEach((el, index) => {
          if (el.id == data.id) {
            if (result) {
              el.type = 'del'
              data.type = 'del'
            } else {
              state.departData.splice(index, 1)
            }
          }
        })
      }
    }
  }

  // 暂留
  const handleTreeData = (node: any, belongId: string) => {
    node.disabled = !(node.belongId && node.belongId == belongId);
    if (node.children) {
      node.nodes = node.children.map((child: any) => {
        return handleTreeData(child, belongId);
      });
    }
    //判断是否有操作权限
    return { ...node._authority, node };
  };

  // 除组织外的左侧树点击事件
  const handleNodeClick = async (node: any, load: boolean, search?: string) => {
    if (node) {
      centerTreeShow.value = true
      const item: ITarget = node.item;
      state.switchId = node.id
      switch (radio.value) {
        case '2':
          state.loadID = node
          const centerData =await node.item.loadAuthorityTree();
          let data = handleTreeData(centerData)
          state.centerTree = [data]
          getHistoryData(node)
          break
        case '3':
          state.loadID = node
          const res = await node.item.getIdentitys()
          if (load == true) {
            state.centerTree.concat(res)
          } else {
            state.centerTree = res
          }
          getHistoryData(node)
          break
        case '4':
          state.loadID = node
          const result = await node.item.loadMembers({ limit: 10000,offset: 0, filter: '', })
          if (result) {
            if (load == true) {
              state.centerTree.concat(result.result)
            } else {
              state.centerTree = result.result
            }
            getHistoryData(node)
          } else {            
            state.centerTree = []
            state.personsData = []
          }
        default:
          break
      }
    }
  }

  // 除组织外右侧值状态变动的显示
  const delContentAuth = (item: any) => {
    if (radio.value == '2') {
      if (item.type == 'del') {
        return
      } else if (item.type == 'add') {
        state.authorData.forEach((el, index) => {
          if (el.id == item.id) {
            state.authorData.splice(index, 1)
            centerTree.value.setChecked(item.id, false)
          }
        })
      } else {
        state.authorData.forEach((el, index) => {
          if (el.id == item.id) {
            el.type = 'del'
            if (state.centerTree.length !== 0) {
              centerTree.value.setChecked(el.id, false)
            }
          }
        })
      }
    } else if (radio.value == '3') {
      if (item.type == 'del') {
        return
      } else if (item.type == 'add') {
        state.identitysData.forEach((el, index) => {
          if (el.id == item.id) {
            state.identitysData.splice(index, 1)
            centerTree.value.setChecked(item.id, false)
          }
        })
      } else {
        state.identitysData.forEach((el, index) => {
          if (el.id == item.id) {
            el.type = 'del'
            if (state.centerTree.length !== 0) {
              centerTree.value.setChecked(el.id, false)
            }
          }
        })
      }
    } else {
      if (item.type == 'del') {
        return
      } else if (item.type == 'add') {
        state.personsData.forEach((el, index) => {
          if (el.id == item.id) {
            state.personsData.splice(index, 1)
            centerTree.value.setChecked(item.id, false)
          }
        })
      } else {
        state.personsData.forEach((el, index) => {
          if (el.id == item.id) {
            el.type = 'del'
            if (state.centerTree.length !== 0) {
              centerTree.value.setChecked(el.id, false)
            }
          }
        })
      }
    }
  }

  // 组织右侧值状态变动的显示
  const delContent = (item: any) => {
    if (item.type == 'del') {
      return
    } else if (item.type == 'add') {
      state.departData.forEach((el, index) => {
        if (el.id == item.id) {
          state.departData.splice(index, 1)
          leftTree.value.setChecked(item.id, false)
        }
      })
    } else {
      state.departData.forEach((el, index) => {
        if (el.id == item.id) {
          el.type = 'del'
          leftTree.value.setChecked(el.id, false)
        }
      })
    }
  }

  // 获取分配时应用的资源信息
  const searchResource = async () => {
    let arr = [];
    appCtrl.curProduct.resource.forEach(element => {
      let obj = {
        id:element.resource.id,
        name:element.resource.name,
      }
      arr.push(obj)
    });
    tabs.value = arr || [];
    resource.value = arr[0]?.id
  }
 
</script>
<style>
  .penultimate > .el-tree-node__content {
    color: var(--el-text-color-disabled);
    cursor: not-allowed;
  }
</style>
<style lang="scss" scoped>
  .footer-btn {
    margin-right: 10px;
  }

  .footer {
    margin-top: 20px;
    display: flex;
    flex-direction: row-reverse;
  }

  .demo-tabs {
    margin-left: 20px;
  }

  .cohortLayout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden !important;

    &-header {
      display: flex;
      align-items: center;
    }

    &-content {
      height: 360px;
      width: 100%;
      display: flex;
      justify-content: space-between;

      &-left {
        border: 1px solid rgb(241, 241, 248);
        height: 100%;
        overflow: auto;
      }

      &-center {
        border: 1px solid rgb(241, 241, 248);
        height: 100%;
        overflow: auto;
      }

      &-right {
        border: 1px solid rgb(241, 241, 248);
        height: 100%;
        overflow: auto;
      }
    }
  }

  :deep(.el-tabs__header) {
    margin: unset;
  }

  :deep(.el-tabs__nav-wrap::after) {
    background-color: unset;
  }

  .cohortLayout-header-tabs {
    flex: 1;
  }

  .demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
</style>
