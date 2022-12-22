<template>
  <el-dialog
    v-model="props.addDialog"
    append-to-body
    :before-close="closeDialog"
    :title="title"
    width="60%"
  >
    <el-input v-model="value" @input="remoteMethod" placeholder="请输入" />
    <!-- <div class="content">
      <div class="list">
        <el-checkbox-group v-model="checkList">
        <div class="list-item">
          <div class="row">
            <div class="left">
              <div class="img"></div>
              <span>杭商城</span>
            </div>
            <div class="right">
              <el-checkbox />
            </div>
          </div>
          <div class="row">
            此处为模板介绍
          </div>
        </div>
        </el-checkbox-group>
      </div>
    </div> -->
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
      <el-button  @click="closeDialog(false)">取消</el-button>
      <el-button type="primary" @click="checksSearch">确定</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
  import diytab from '@components/diyTable/index.vue'
  import { ref, reactive, onMounted, nextTick } from 'vue'
  import userCtrl from '@/ts/controller/setting/userCtrl';

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
    addDialog: {
      type:Boolean
    },
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
   
    remoteMethod()
  })
  const remoteMethod = () => {
    space.value = ''
    tableHead.value = tableHead5.value
    url.value = ''
    title.value = '搜索商店'
    userCtrl.space.getMarketByCode(value.value).then((a:any) => {
      console.log('a',a)
      list.value = a?.result ||[]
    });
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

  const closeDialog = (type:boolean)=>{
    emit('closeDialog', type)
  }
  const tableHead = ref([])

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
  .list{
    flex-wrap: wrap;
    margin-top: 20px;
    .list-item{
      display: flex;
      width: 200px;
      margin-top: 5px;
      margin-right: 10px;
      padding: 10px 18px;
      border: 1px solid #E9ECF3;
      border-radius: 3px;
      flex-direction: column;
      .row{
        display: flex;
        span{
          color: #333;
        }
        .left{
          display: flex;
        }
      }
    }
    .list-item:nth-child(2n){
      margin-right: 0;
    }
  }
  .tooltip-text{
    width: 400px;
    max-height: 300px;
    overflow-y: auto;
  }
</style>
