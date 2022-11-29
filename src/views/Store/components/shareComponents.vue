<template>
  <div class="cohortLayout">
    <div class="cohortLayout-header" v-if="typePD !== 3">
      <div class="cohortLayout-header-text"
        >{{ typePD == 1 ? '请选择资源：' : '请选择集团：' }}
      </div>
      <div class="cohortLayout-header-tabs">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane v-for="(item, index) in tabs" :key="item.id" :name="index">
            <template #label>
              <div slot="label" @click="handleTabClick(item.id)">{{ item.name }}</div>
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
          :data="cascaderTree"
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
          :data="cascaderTree"
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
    <div class="footer" v-if="radio == '1'">
      <el-button type="primary" @click="submitAll">确认</el-button>
      <el-button class="footer-btn" @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  // @ts-nocheck
  import InfiniteScroll from 'element-plus'
  import { onMounted, ref, reactive, toRefs, watch, nextTick, computed, onUnmounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import API from '@/services'
  import Author from './author.vue'
  import authority from '@/utils/authority'
  import { useUserStore } from '@/store/user'
  import { Application } from '@/module/store/app.ts'
  import type { TabsPaneContext } from 'element-plus'
  import { AnyAaaaRecord } from 'dns'
  const typePD: any = computed(() => {
    if (props.dialogType == '1') {
      return 1
    } else {
      if (props.type == 2) {
        return 2
      } else {
        return 3
      }
    }
  })
  console.log('props',props)
  const application = new Application(props.info.id, typePD.value)
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
    switchData: {}, // 存储左侧树形数据
    departData: [], // 集团分配右侧数据
    departHisData: [], // 集团分配历史数据
    centerTree: [], // 角色分配中间树形
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
    if (data.disabled) {
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
  const handleCurrent: any = computed(() => {
    return (page.currentPage - 1) * page.pageSize
  })

  watch(
    () => radio.value,
    async (newValue, oldValue) => {
      
      if (!cascaderTree.value[0].children || cascaderTree.value[0].children.length == 0) {
        await sumbitSwitch(state.switchData, true, oldValue)
      }
      centerTreeShow.value = false
      state.centerTree = []
      state.authorData = []
      state.personsData = []
      state.identitysData = []
      nextTick(() => {
        if (newValue == '1') {
          let arr: any[] = []
          state.departData.forEach((el) => {
            if (el.type == 'add' || el.type == 'has') {
              arr.push(el.id)
            }
          })
          leftTree.value.setCheckedKeys(arr, true)
        }
      })
    }
  )
  const customNodeClass = (data: Tree, node: Node) => {
    if (data.authAdmin === false || data?.data?.authAdmin === false) {
      return 'penultimate'
    }
    return null
  }
  watch(
    () => resource.value,
    async (newValue, oldValue) => {
      
      await sumbitSwitch(state.switchData, true)
      state.centerTree = []
      state.authorData = []
      state.departData = []
      state.personsData = []
      state.identitysData = []
      if (radio.value == '1') {
        clearTreeType(cascaderTree.value)
        leftTree.value.setCheckedKeys([])
        getHistoryData()
      }
    }
  )
  watch(
    () => searchValue.value,
    (newValue, oldValue) => {
      console.log(newValue)
      handleNodeClick(state.loadID, false, newValue)
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
    if (typePD.value == 1) {
      searchResource()
      getCompanyTree()
      state.way = [
        {
          id: '1',
          label: '按部门分配'
        },
        {
          id: '2',
          label: '按角色分配'
        },
        {
          id: '3',
          label: '按岗位分配'
        },
        {
          id: '4',
          label: '按人员分配'
        }
      ]
    } else {
      if (typePD.value == 2) {
        state.way = [
          {
            id: '1',
            label: '按集团共享'
          },
          {
            id: '2',
            label: '按角色共享'
          },
          {
            id: '3',
            label: '按岗位分配'
          },
          {
            id: '4',
            label: '按单位分配'
          }
        ]
        getGroupList()
      } else {
        state.way = [
          {
            id: '1',
            label: '按群组共享'
          },
          {
            id: '2',
            label: '按角色共享'
          },
          {
            id: '3',
            label: '按身份分配'
          },
          {
            id: '4',
            label: '按人员分配'
          }
        ]
        getFriendsList()
      }
    }
  })

  onUnmounted(() => {
    sumbitSwitch(state.switchData, true)
  })

  const emit = defineEmits(['closeDialog'])

  const closeDialog = () => {
    emit('closeDialog')
  }

  // 获取群组信息
  const getFriendsList = async () => {
    cascaderTree.value = await application.getJoinedCohorts()
    getHistoryData()
  }

  // 获取集团数据
  const getGroupList = async () => {
    tabs.value = await application.searchResource()
    if(tabs.value[0]){
      resource.value = tabs.value[0].id
      await getGroupTree()
    }
 
  }

  const getGroupTree = async (val?: boolean) => {
    const res = await application.getGroupTree(resource.value)
    cascaderTree.value.push(res)
    if (!val) {
      await getHistoryData()
    }
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
          state.departHisData = await application.getHistoryData(
            radio.value,
            typePD !== 3 ? resource.value : ''
          )
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
        state.authorHisData = await application.getHistoryData(
          radio.value,
          typePD !== 3 ? resource.value : '',
          data
        )
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
        state.identitysHisData = await application.getHistoryData(
          radio.value,
          typePD !== 3 ? resource.value : '',
          data
        )
        state.identitysData = JSON.parse(JSON.stringify(state.identitysHisData))
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
        state.personsHisData = await application.getHistoryData(
          radio.value,
          typePD !== 3 ? resource.value : '',
          data
        )
        state.personsData = JSON.parse(JSON.stringify(state.personsHisData))
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

  const sumbitSwitch = async (data, bol?: boolean, oldRadio?: number) => {
    // 当radio！=1 时切换左侧树调用提交接口
    if (state.switchData !== data || bol) {
      switch (oldRadio ? oldRadio : radio.value) {
        case '2':
          await application.sumbitSwitch(
            state.authorData,
            state.switchData.id,
            '角色',
            resource.value
          )
          break
        case '3':
          await application.sumbitSwitch(
            state.identitysData,
            state.switchData.id,
            '岗位',
            resource.value
          )
          break
        case '4':
          await application.sumbitSwitch(
            state.personsData,
            state.switchData.id,
            '人员',
            resource.value
          )
          break
        default:
          break
      }
    }
  }

  // 提交表单
  const submitAll = async () => {
    const res = await application.submitAll(state.departData, resource.value)
    ElMessage({
      type: 'success',
      message: typePD.value == 1 ? '分配成功' : '共享成功'
    })
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
    console.log('点击中间', data, checked, indeterminate)
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
  // 左侧树点击事件
  const handleCheckChange = (data: any, checked: boolean, indeterminate: any) => {
    console.log('点击左侧', data, checked, indeterminate)
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
  const handleNodeClick = async (node: any, load: boolean, search?: string) => {
    if (node && node.data && authority.IsApplicationAdmin([node.data.id, node.data.belongId])) {
      centerTreeShow.value = true
      sumbitSwitch(node)
      state.switchData = node
      if (typeof load == 'object' && typeof search == 'object') {
        searchValue.value = ''
      }
      if (typeof load !== 'boolean') {
        page.currentPage = 1
      } else if (typeof search == 'string') {
        page.currentPage = 1
      }
      switch (radio.value) {
        case '2':
          state.loadID = node
          const centerData = await application.getAuthorityTree(node, search)
          state.centerTree = [centerData]
          getHistoryData(node)
          break
        case '3':
          state.loadID = node
          const res = await application.getIdentities(node, page, search)
          if (load == true) {
            state.centerTree.concat(res)
          } else {
            state.centerTree = res
          }
          getHistoryData(node)
          break
        case '4':
          state.loadID = node
          const result = await application.getPerson(node, page, search)
          if (result) {
            if (load == true) {
              state.centerTree.concat(result)
            } else {
              state.centerTree = result
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

  const handleTabClick = (id: string) => {
    resource.value = id
    cascaderTree.value = []
    getGroupTree(true)
  }
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
  const searchResource = async () => {
    tabs.value = await application.searchResource()
    resource.value = tabs.value[0].id
  }
  let cascaderTree = ref<OrgTreeModel[]>([])
  const getCompanyTree = async () => {
    cascaderTree.value = await application.getCompanyTree()
    getHistoryData()
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
