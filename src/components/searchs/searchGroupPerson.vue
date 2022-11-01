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
        <el-button type="primary" @click="checksGroupSearch">确定</el-button>
      </div>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
    import diytab from '@components/diyTable/index.vue'
    import $services from '@/services'
    import { ref, reactive, onMounted, nextTick } from 'vue'
    import { ElMessage } from 'element-plus'
  
    const dialogVisible = ref<boolean>(true)
    const diyTable = ref(null)
    // 表格展示数据
    const pageStore = reactive({
      currentPage: 1,
      pageSize: 20,
      total: 0
    })
  
    const emit = defineEmits(['checksGroupSearch', 'closeDialog'])
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
    const space = ref<string>()
    const url = ref<string>()
    const title = ref<string>()
    onMounted(() => {
      if (props.selectLimit === 0) {
        options.value.selectLimit = 0
      }
      space.value = 'cohort'
      tableHead.value = tableHead1.value
      url.value = 'getPersons'
      title.value = '搜索群成员'
      remoteMethod()
    })
    const remoteMethod = () => {
        let data
        data = {
          id:props.id,
          filter: value.value,
          offset: (pageStore.currentPage - 1) * pageStore.pageSize,
          limit: pageStore.pageSize
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
                  let obj = {
                    id: el.id,
                    code: el.code,
                    name: el.name,
                    trueName: el.team.name,
                    teamCode: el.team.code,
                    remark: el.team.remark
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
    const checksGroupSearch = () => {
      emit('checksGroupSearch', checkList)
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
  