<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    :before-close="closeDialog"
    :title="title"
    width="60%"
  >
    <el-input v-model="value" @input="remoteMethod" placeholder="请输入" />
    <diytab
      :style="{height:300+'px'}"
      ref="diyTable"
      :hasTableHead="true"
      :tableData="list"
      :checkList="props.checkList"
      :options="options"
      @handleUpdate="handleUpdate"
      @selectionChange="selectionChange"
      :tableHead="tableHead"
    >
      <template #remark="scope">
        <el-tooltip :content="scope.row.remark" placement="bottom" effect="light">
          <template #content>
            <div class="tooltip-text" style="width:300px">{{scope.row.remark}}</div>
          </template>
          <div class="remark-text">
          {{scope.row.remark}}
          </div>
        </el-tooltip>
      </template>
    </diytab>
    <div class="foot">
      <el-button  @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="checksSearch">确定</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
  import diytab from '@components/diyTable/index.vue'
  import $services from '@/services'
  import { ref, reactive, onMounted, nextTick } from 'vue'
  import { ElMessage } from 'element-plus'
  import {chat} from '@/module/chat/orgchat'
  const dialogVisible = ref<boolean>(true)
  const diyTable = ref(null)
  // 表格展示数据
  const pageStore = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0
  })

  const emit = defineEmits(['checksSearch', 'closeDialog'])
  const props = defineProps({
    selectLimit: {},
    id:{
      type: String,
      default: ''
    },
    checkList:{
      type:Array,
      default:[]
    },//选中的值
    serachType:{
      type: Number,
      default: '1'
    },//1 人 2群 3单位 4集团 5分配人员 6分配单位
  })
  interface ListItem {
    code: string
    name: string
    trueName: string
    teamCode: string
    remark: string
  }

  const list = ref<ListItem[]>([])
  const value = ref('')
  const loading = ref(false)
  const space = ref<string>()
  const url = ref<string>()
  const title = ref<string>()
  onMounted(() => {
    if (props.selectLimit === 0) {
      options.value.selectLimit = 0
    }
    if (props.serachType == 1) {
      space.value = 'person'
      tableHead.value = tableHead1.value
      url.value = 'searchPersons'
      title.value = '搜索人员'
    } else if (props.serachType == 2) {
      space.value = 'cohort'
      tableHead.value = tableHead2.value
      url.value = 'searchCohorts'
      title.value = '搜索群组'
    } else if (props.serachType == 3) {
      space.value = 'company'
      tableHead.value = tableHead3.value
      url.value = 'searchCompany'
      title.value = '搜索单位'
    } else if (props.serachType == 4) {
      space.value = 'company'
      tableHead.value = tableHead4.value
      url.value = 'searchGroups'
      title.value = '搜索集团'
    } else if (props.serachType ==5) {
      space.value = 'company'
      tableHead.value = tableHead1.value
      url.value = 'getPersons'
      title.value = '分配人员'
    } else if (props.serachType == 6) {
      space.value = 'company'
      tableHead.value = tableHead3.value
      url.value = 'getGroupCompanies'
      title.value = '分配单位'
    }else if(props.serachType == 7) {
      space.value = 'appstore'
      tableHead.value = tableHead5.value
      url.value = 'searchAll'
      title.value = '搜索商店'
    }
    else {
      space.value = 'person'
      tableHead.value = tableHead1.value
      url.value = 'searchPersons'
      title.value = '搜索人员'
    }
    remoteMethod()
  })
  const remoteMethod = () => {
      let data
      if(props.serachType==5|| props.serachType ==6 || props.serachType ==7){
       data= {
          filter: value.value,
          offset: (pageStore.currentPage - 1) * pageStore.pageSize,
          limit: pageStore.pageSize,
          id:props.id
        }
      }else{
        data = {
          filter: value.value,
          offset: (pageStore.currentPage - 1) * pageStore.pageSize,
          limit: pageStore.pageSize
        }
      }
      $services[space.value][url.value]({
        data: data
      }).then((res: ResultType) => {
        let arr: any = []
        if (res.code == 200) {
          if (res.data.result != undefined) {
            let states = res.data.result
            if (states) {
              states.forEach((el: any) => {
                let obj = {}
                if(props.serachType==7){
                  obj={
                    id: el.id,
                    code: el.code,
                    name: el.name,
                    remark: el.remark,
                    belong:chat.getName(el.belongId),
                    create: chat.getName(el.createUser)
                  }

                }
                else{
                  obj={
                    id: el.id,
                    code: el.code,
                    name: el.name,
                    trueName: el.team.name,
                    teamCode: el.team.code,
                    remark: el.team.remark
                  }
                }

                arr.push(obj)
              })
              pageStore.total = res.data.total
              diyTable.value.state.page.total = pageStore.total
            } else {
            }
          }
          list.value = arr
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
        // diyTable.value.state.loading = false
      })
  }

  const handleUpdate = (page: any) => {
    pageStore.currentPage = page.currentPage
    pageStore.pageSize = page.pageSize
    remoteMethod()
  }
  const checkList = reactive<any>([])
  const selectionChange = (val: any) => {
    checkList.value = val
  }
  const checksSearch = () => {
    emit('checksSearch', checkList)
  }

  const closeDialog = () => {
    emit('closeDialog', false)
  }
  const tableHead = ref([])
  const tableHead1 = ref([
    {
      prop: 'code',
      label: '账号',
      // width: '100'
    },
    {
      prop: 'name',
      label: '昵称',
      // width: '100',
      name: 'name'
    },
    {
      prop: 'trueName',
      label: '姓名',
      // width: '150',
      name: 'trueName'
    },
    {
      prop: 'teamCode',
      label: '手机号',
      // width: '150',
      name: 'teamCode'
    },
    {
      type:'slot',
      width: '200',
      prop: 'remark',
      label: '座右铭',
      name: 'remark'
    }
  ])
  const tableHead2 = ref([
    {
      prop: 'trueName',
      label: '群名称',
      // width: '200',
      name: 'trueName'
    },
    {
      prop: 'teamCode',
      label: '群编号',
      // width: '150',
      name: 'teamCode'
    },
    {
      type:'slot',
      prop: 'remark',
      label: '群简介',
      name: 'remark'
    }
  ])
  const tableHead3 = ref([
    {
      prop: 'name',
      label: '单位名称',
      width: '200',
      name: 'name'
    },
    {
      prop: 'code',
      label: '统一社会信用代码',
      width: '200',
      name: 'code'
    },
    {
      type:'slot',
      prop: 'remark',
      label: '单位简介',
      name: 'remark'
    },
  ])
  const tableHead4 = ref([
    {
      prop: 'name',
      label: '单位名称',
      width: '300',
      name: 'name'
    },
    {
      type:'slot',
      prop: 'remark',
      label: '集团简介',
      name: 'remark'
    },
  ])
  const tableHead5 = ref([
    {
      prop: 'name',
      label: '商店名称',
      name: 'name'
    },

    {
      prop: 'code',
      label: '商店编码',
      name: 'code'
    },

    {
      type:'slot',
      prop: 'remark',
      label: '商店简介',
      name: 'remark'
    },
    {
      prop: 'belong',
      label: '商店归属',

      name: 'belong'
    },
    {
      prop: 'create',
      label: '商店创建',

      name: 'create'
    },
  ])
  const options = ref<any>({
    checkBox: true,
    order: true,
    selectLimit: 1,
    defaultSort: { prop: 'createTime', order: 'descending' },
    treeProps: {
      children: 'children',
      hasChildren: 'hasChildren'
    }
  })
</script>

<style lang="scss" scoped>
  .foot {
    display: flex;
    width: 100%;
    margin-top: 30px;
    justify-content: flex-end;
  }
  .remark-text{
    white-space: nowrap;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tooltip-text{
    width: 400px;
    max-height: 300px;
    overflow-y: auto;
  }
</style>
