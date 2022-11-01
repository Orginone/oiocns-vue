<template>
    <diytab
      :style="{height:300+'px',width:'100%'}"
      ref="diyTable"
      :hasTabs="true"
      :tableName="'测试表格名称'"
      :hasTitle="true"
      :hasTableHead="true"
      :tableData="tableData"
      :options="options"
      @handleUpdate="handleUpdate"
      @selectionChange="selectionChange"
      :tableHead="tableHead"
    >
      <template #slot-title>
        123123
      </template>
      <template #slot-tabsBtn>
          <el-button type="primary">按钮</el-button>
          <el-button type="primary">事件</el-button>
          <el-button type="primary">操作</el-button>
      </template>
      <template #slot-buttons>
        <el-button type="primary">按钮</el-button>
      </template>
      <template #slot-select>
        <el-input v-model="input" placeholder="Please input" />
      </template>
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
</template>

<script setup lang="ts">
  import diytab from '@components/diyTable/index.vue'
  import { ref, reactive, onMounted, nextTick } from 'vue'
  const dialogVisible = ref<boolean>(true)
  const diyTable = ref(null)
  // 表格展示数据
  const pageStore = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0
  })
  const tableData = ref([{
    paymentType:'线上',
    price:'100',
    status:'200',
    createTime:'2022-11-01 16:01',
  }])
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
  })
  interface ListItem {
    code: string
    name: string
    trueName: string
    teamCode: string
    remark: string
  }

  onMounted(() => {
    remoteMethod()
  })
  const remoteMethod = () => {
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

  const tableHead = ref([{
      prop: 'paymentType',
      label: '付款方式',
    },
    {
      prop: 'price',
      label: '价格',
      name: 'price'
    },
    {
      prop: 'status',
      label: '状态',
      name: 'status'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      name: 'createTime'
    }
  ])
  const options = ref<any>({
    checkBox: false,
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
  .tabs-btn{
    display: flex;
  }
</style>
