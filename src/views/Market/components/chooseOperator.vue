<template>
    <div class="cohortLayout">
      <div class="cohortLayout-header" style="margin-top: 10px">
        <div class="cohortLayout-header-text">请选择对象：</div>
        <div class="cohortLayout-header-tabs">
          <el-radio-group v-model="radio" >
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
            :props="{ class: customNodeClass }"
            :check-strictly="true"
            :default-expand-all="true"
            show-checkbox
            @check-change="handleCheckChange"
            :filter-node-method="filterNode"
          />
          <!-- <div v-else-if="radio == '6'">
            <div v-for=" group in groupList" :key="group.id" style="padding-top:5px">
                {{group.name}}
            </div>
          </div> -->
          <div class="menu-tab" v-else-if="radio == '6'">
            <el-menu   class="orgnization-navbar" mode="vertical">
              <el-menu-item v-for=" group in groupList" :key="group.id" @click="handleNodeClick(group,false)" class="navbar-item">{{group.name}}</el-menu-item>
            </el-menu>
          </div>
          <el-tree
            v-else
            ref="leftTree"
            :data="cascaderTree"
            :key="radio"
            :highlight-current="true"
            :expand-on-click-node="false"
            :props="{ class: customNodeClass }"
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
          <!-- <el-tree
            v-if="radio == '2' || radio == '3' || radio == '4'"
            ref="centerTree"
            node-key="id"
            :check-strictly="true"
            :data="state.centerTree"
            :props="authorityProps"
            :default-expand-all="true"
            show-checkbox
            @check-change="centerAuthorClick"
          /> -->
          <el-tree
            v-if="radio == '2' || radio == '3' || radio == '4' || radio == '6'"
            ref="centerTree"
            node-key="id"
            :check-strictly="true"
            :data="state.centerTree"
            :props="authorityProps"
            :default-expand-all="true"
            @node-click="centerSingleClick"
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
          <!-- <Author
            v-if="radio == '3'"
            @delContent="delContentAuth"
            :departData="state.personsData"
          ></Author> -->
          <Author
            v-if="radio == '3'"
            @delContent="delContentAuth"
            :hiddenDelete = "true"
            :departData="state.details"
          ></Author>
          <Author
            v-if="radio == '6'"
            @delContent="delContentAuth"
            :hiddenDelete = "true"
            :departData="state.details"
          ></Author>
          <Author
            v-if="radio == '4'"
            @delContent="delContentAuth"
            :departData="state.identitysData"
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
    import InfiniteScroll from 'element-plus'
    import { onMounted, ref, reactive, toRefs, watch, nextTick, computed, onUnmounted } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import API from '@/services'
    import Author from './components/author.vue'
    import authority from '@/utils/authority'
    import type { TabsPaneContext } from 'element-plus'
    import { AnyAaaaRecord } from 'dns'
    
    interface Tree {
      id: string
      label: string
      data?: any
      children?: Tree[]
    }
    // type createInfo = {
    //   info: {
    //     id: string
    //   }
    // }
    const spaceType = computed(() => {
          return authority.getSpaceInfo().typeName
      });
    const searchValue = ref('')
    const searchLeftValue = ref('')
    const activeName = ref(0)
    // const tabs = ref([])

    const radio = ref(props.radio)
    const leftTree = ref(null)
    const centerTree = ref(null)
    const resource = ref<string>('')
      const props = defineProps<Props>()
    type Props = {
      way: Tab[],
      radio: string
    }
    type Tab = {
      label: string
      id: string | number
    }
    const state = reactive({
      loadID: {
        id: '',
        label: ''
      },
      way: props.way,
      // way: [
      //   {
      //     id: '1',
      //     label: '按部门'
      //   },
      //   {
      //     id: '2',
      //     label: '按角色'
      //   },
      //   {
      //     id: '3',
      //     label: '按岗位'
      //   },
      //   {
      //     id: '4',
      //     label: '按人员'
      //   }
      // ],
      switchData: {}, // 存储左侧树形数据
      departData: [], // 集团右侧数据
      departHisData: [], // 集团历史数据
      centerTree: [], // 角色中间树形
      authorHisData: [], // 角色历史数据
      authorData: [], // 角色右侧数据
      personsHisData: [], // 人员历史数据
      personsData: [], // 人员右侧数据
      identitysData: [], //岗位右侧数据
      identitysHisData: [], // 岗位历史数据
      details:[]
    })
    const authorityProps = {
      label: 'name',
      children: 'nodes',
      disabled: 'disabled'
    }
    const unitProps = {
      label: 'label',
      children: 'children'
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
      (newValue, oldValue) => {
        state.centerTree = []
        state.authorData = []
        state.departData = []
        state.personsData = []
        state.identitysData = []
        nextTick(() => {
          if (newValue == '1') {
          } else if (newValue == '2' && state.authorData.length == 0) {
          } else if (newValue == '3' && state.identitysData.length == 0) {
          } else if (newValue == '4' && state.personsData.length == 0) {
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
      (newValue, oldValue) => {
        state.centerTree = []
        state.authorData = []
        state.departData = []
        state.personsData = []
        state.identitysData = []
        if (radio.value == '1') {
          clearTreeType(cascaderTree.value)
          leftTree.value.setCheckedKeys([])
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
    // const props = defineProps<createInfo>()
    // const props = defineProps<propType>()
  
    onMounted(() => {
        // searchResource()
      if(authority.getSpaceInfo().typeName=='单位'){
          getGroupList()
          getCompanyTree()
      }
    })
  
    onUnmounted(() => {
      sumbitSwitch(state.switchData, true)
    })
  
    const emit = defineEmits(['closeDialog','submit','submitPersonNum'])
  
    const closeDialog = () => {
      emit('closeDialog')
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
  
    // 树节点过滤
    const filterNode = (value: string, data: any) => {
      if (!value) return true
      return data.label.includes(value)
    }
  
    const sumbitSwitch = async (data, bol?: boolean) => {
      // 当radio！=1 时切换左侧树调用提交接口
      if (state.switchData !== data || bol) {
        switch (radio.value) {
          case '2':
            let authorAdd: any[] = []
            let authorDel: any[] = []
            state.authorData.forEach((el) => {
              if (el.type == 'add') {
                authorAdd.push(el.id)
              } else if (el.type == 'del') {
                authorDel.push(el.id)
              }
            })
            let promise1
            let promise2
            if (authorAdd.length > 0) {
              promise1 = API.product.extendCreate({
                data: {
                  teamId: state.switchData.id,
                  sourceId: resource.value,
                  destIds: authorAdd,
                  sourceType: '资源',
                  destType: '角色'
                }
              })
            }
            if (authorDel.length > 0) {
              promise2 = API.product.extendDelete({
                data: {
                  teamId: state.switchData.id,
                  sourceId: resource.value,
                  destIds: authorDel,
                  sourceType: '资源',
                  destType: '角色'
                }
              })
            }
            await Promise.all([promise1, promise2])
            break
          case '3':
          case '6':
            let identityAdd: any[] = []
            let identityDel: any[] = []
            state.identitysData.forEach((el) => {
              if (el.type == 'add') {
                identityAdd.push(el.id)
              } else if (el.type == 'del') {
                identityDel.push(el.id)
              }
            })
            let promise5
            let promise6
            if (identityAdd.length > 0) {
              promise5 = API.product.extendCreate({
                data: {
                  teamId: state.switchData.id,
                  sourceId: resource.value,
                  destIds: identityAdd,
                  sourceType: '资源',
                  destType: '岗位'
                }
              })
            }
            if (identityDel.length > 0) {
              promise6 = API.product.extendDelete({
                data: {
                  teamId: state.switchData.id,
                  sourceId: resource.value,
                  destIds: identityDel,
                  sourceType: '资源',
                  destType: '岗位'
                }
              })
            }
            await Promise.all([promise5, promise6])
            break
          case '4':
            let personAdd: any[] = []
            let personDel: any[] = []
            state.personsData.forEach((el) => {
              if (el.type == 'add') {
                personAdd.push(el.id)
              } else if (el.type == 'del') {
                personDel.push(el.id)
              }
            })
            let promise3
            let promise4
            if (personAdd.length > 0) {
              promise3 = API.product.extendCreate({
                data: {
                  teamId: state.switchData.id,
                  sourceId: resource.value,
                  destIds: personAdd,
                  sourceType: '资源',
                  destType: '人员'
                }
              })
            }
            if (personDel.length > 0) {
              promise4 = API.product.extendDelete({
                data: {
                  teamId: state.switchData.id,
                  sourceId: resource.value,
                  destIds: personDel,
                  sourceType: '资源',
                  destType: '人员'
                }
              })
            }
            await Promise.all([promise3, promise4])
            break
          default:
            break
        }
      }
    }
  
    // 提交表单
    const submitAll = () => {
      var data = null;
      
      switch(radio.value){
        case '1':
          data = state.departData
          break;
        case '2':
          data = state.authorData
          break;  
        case '3':
        case '6':
          data = state.personsData
          break;  
        case '4':
          data = state.identitysData
          break;  
      }
      var record = data.map(item=>{return {id:item.id , name:item.name} }) 
      
      emit('submit',record)
      emit('submitPersonNum',state.details.length)
    }
    // 中间树形滚动加载事件
    const load = () => {
      if (radio.value == '3' || radio.value == '6') {
        page.currentPage++
        handleNodeClick(state.loadID, true)
      }
    }
    // 中间树形点击事件
    const centerSingleClick = (data: any, node: any, tree: any,event:any) => {
      
      if(radio.value=='3' || radio.value == '6'){
        state.personsData = [data]
      }else{
        state.identitysData = [data]
      }
      state.details = []
      if(radio.value=='3' || radio.value == '6'){
        state.details = getDetails(data)
      }
      
    }
    const getDetails = (node: any, load: boolean) => {
      // if (node && authority.IsApplicationAdmin([node.id, node.belongId])) {
            API.cohort.getIdentityPerson({
              data: {
                id: node.id,
                limit: page.pageSize,
                offset: handleCurrent.value,
                filter: ''
              }
            }).then((res: ResultType) => {
              
              state.details = res.data.result
            })
      // }
    }
    // 中间树形点击事件
    const centerAuthorClick = (data: any, checked: boolean, indeterminate: any) => {
      
      console.log('点击中间', data, checked, indeterminate)
      if (checked) {
        if (radio.value == '2') {
          handleBoxClick(state.authorHisData, state.authorData, data)
        } else if (radio.value == '3' || radio.value == '6') {
          handleBoxClick(state.personsHisData, state.personsData, data)
        } else {
          handleBoxClick(state.identitysHisData, state.identitysData, data)
        }
      } else {
        if (radio.value == '2') {
          handleBoxCancelClick(state.authorHisData, state.authorData, data)
        } else if (radio.value == '3' || radio.value == '6') {
          handleBoxCancelClick(state.personsHisData, state.personsData, data)
        } else {
          handleBoxCancelClick(state.identitysHisData, state.identitysData, data)
        }
      }
      console.log(state.identitysData)
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
    const handleNodeClick = (node: any, load: boolean, search?: string) => {
      
      // if (node && node.data && authority.IsApplicationAdmin([node.data.id, node.data.belongId])) {
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
            API.company
              .getAuthorityTree({
                data: {
                  id: node.id,
                  filter: typeof search == 'string' ? search : ''
                }
              })
              .then((res: ResultType) => {
                res.data = handleTreeData(res.data, node.id)
                state.centerTree = [res.data]
              })
            break
          case '3':
            state.loadID = node
            API.company
              .getIdentities({
                data: {
                  id: node.id,
                  limit: page.pageSize,
                  offset: handleCurrent.value,
                  filter: typeof search == 'string' ? search : ''
                }
              })
              .then((res: ResultType) => {
                const { result = [] } = res.data
                result.forEach((item) => {
                  item.disable = !authority.IsApplicationAdmin([item.belongId, node.data.belongId])
                })
                if (load == true) {
                  state.centerTree.concat(res.data.result)
                } else {
                  state.centerTree = res.data.result ? res.data.result : []
                }
              })
            break
          case '6':
              API.cohort.getIdentitys({data: {
                offset: 0,
                limit: 1000,
                id:node.id,
                filter:''
              }}).then((res: ResultType) => {
                if(res.data && res.data.result){
                  state.centerTree = res.data.result
                }
                
              })

              break
          case '4':
            state.loadID = node
            let action = 'getPersons'
            switch (node.data.typeName) {
              case '部门':
                action = 'getDepartmentPersons'
                break
              case '工作组':
                action = 'getJobPersons'
                break
            }
            API.company[action]({
              data: {
                id: node.id,
                limit: page.pageSize,
                offset: handleCurrent.value,
                filter: typeof search == 'string' ? search : ''
              }
            }).then((res: ResultType) => {
              if (load == true) {
                state.centerTree.concat(res.data.result)
              } else {
                state.centerTree = res.data.result ? res.data.result : []
              }
            })
          default:
            break
        }
        sumbitSwitch(node)
        state.switchData = node
      // }
    }
  
    const handleTreeData = (node: any, belongId: string) => {
      node.disabled = !(node.belongId && node.belongId == belongId)
      if (node.nodes) {
        node.nodes = node.nodes.map((children) => {
          return handleTreeData(children, belongId)
        })
      }
      //判断是否有操作权限
      return node
    }
  
    const handleTabClick = (id: string) => {
      resource.value = id
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
      } else if (radio.value == '3' || radio.value == '6') {
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
      } else {
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
    // const searchResource = () => {
    //   API.product
    //     .searchResource({
    //       data: {
    //         id: props.info.id,
    //         offset: 0,
    //         limit: 1000,
    //         filter: ''
    //       }
    //     })
    //     .then((res: ResultType) => {
    //       if (res.success) {
    //         tabs.value = res.data.result
    //         resource.value = res.data.result[0].id
    //       }
    //     })
    // }
  
    // 节点ID和对象映射关系
    const rootTreeId = ref<string>('')
    const parentIdMap: any = {}
    let cascaderTree = ref<OrgTreeModel[]>([])
    let groupList = ref([])
    const getCompanyTree = () => {
      API.company.getCompanyTree({}).then((res: ResultType) => {
        rootTreeId.value = res.data.data.id
        let orgTree = []
        orgTree.push(res.data)
        initIdMap(orgTree)
        cascaderTree.value = isAuthAdmin(filter(orgTree))
      })
    }
    const getGroupList = ()=>{
      API.company
      .companyGetGroups({
        data: {
          offset: 0,
          limit: 1000
        }
      })
      .then((res: ResultType) => {
        if (res.data.result && res.data.result.length > 0) {
          groupList.value = res.data.result
        }
      })
    }
    const isAuthAdmin = (nodes: any) => {
      //判断是否有操作权限
      for (const node of nodes) {
        node.disabled = !authority.IsApplicationAdmin([node.data.id, node.data.belongId])
        if (node.children) {
          isAuthAdmin(node.children)
        }
      }
      return nodes
    }
    // 初始化ID和对象映射关系
    const initIdMap = (nodes: any[]) => {
      for (const node of nodes) {
        parentIdMap[node.id] = node
        if (node.children) {
          initIdMap(node.children)
        }
      }
    }
    // 过滤掉工作组作为表单级联数据
    const filter = (nodes: OrgTreeModel[]): OrgTreeModel[] => {
      nodes = nodes.filter((node) => node.data?.typeName !== '工作组')
      for (const node of nodes) {
        node.children = filter(node.children)
      }
      return nodes
    }
  </script>
  
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

    .menu-tab {
      background-color: var(--el-bg-color-overlay);
      .orgnization-navbar  {
        height: 100%;
        .navbar-item {
          height: 35px;
        }
      }
    }
  </style>
  