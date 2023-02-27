<template>
  <div class="main">
    <div class="left">
      <div class="header">
        <span>分类字典</span>
        <el-icon class="add" @click="attrFormAdd('新增','')"><Plus /></el-icon>
      </div>
      <div class="search-wrap">
        <el-input class="search" v-model="filterText" placeholder="搜索" :prefix-icon="Search" />
        <el-tree
          ref="treeRef"
          :props="defaultProps"
          :expand-on-click-node="false"
          :highlight-current="true"
          class="filter-tree"
          :data="state.dictData"
          default-expand-all
          @node-click="getCurrentDict"
          :filter-node-method="filterNode"
        >
          <template #default="{ data }">
            <div class="folder-node">
              <div class="node-label">
                <span>{{data.name}}</span>
              </div>
              <el-dropdown>
                <span class="el-dropdown-link"> ··· </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="attrFormAdd('编辑',data)">编辑</el-dropdown-item>
                    <el-dropdown-item @click.stop="delDict(data)" style="color: #f67c80">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-tree>
      </div>
    </div>
    <div class="right">
      <DiyTable
        :style="{ width: '100%' }"
        ref="diyTable"
        :hasTabs="true"
        :hasTitle="false"
        :hasTableHead="true"
        :tableData="state.tableData"
        :options="options"
        @handleUpdate="handleUpdate"
        :tableHead="tableHead"
        :total="pageStore.total"
      >
        <template #buttons>
          <el-button class="btn-check" type="primary" text link @click="addFormAdd('新增','')">新增字典项</el-button>
        </template>
        <template #operate="scope">
          <el-dropdown>
            <span class="el-dropdown-link"> ··· </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="addFormAdd('编辑',scope.row)">编辑</el-dropdown-item>
                <el-dropdown-item style="color: #f67c80" @click="delItem(scope.row)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </DiyTable>
    </div>

    <!-- 分类字典提交表单 -->
    <el-dialog v-model="attrFormDialog" :title="`${isEditAttr ? '编辑' : '新增'}`" width="640px">
      <el-form :model="state.attrForm" :rules="rules" label-position="top" label-width="auto" ref="attrFormRef">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="字典名称" prop="name">
              <el-input v-model="state.attrForm.name" clearable placeholder="请输入"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典代码" prop="code">
              <el-input v-model="state.attrForm.code" clearable placeholder="请输入"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="选择制定组织" prop="belongId">
              <el-tree-select v-model="state.attrForm.belongId" clearable :data="state.belongTreeData" highlight-current default-expand-all check-strictly :props="{ label: 'name', value: 'id', children: 'subTeam'}" placeholder="请选择" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="state.attrForm.remark" :min="4" placeholder="请输入" type="textarea"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="attrFormDialog = false">取消</el-button>
          <el-button type="primary" @click="submitAttrForm(attrFormRef)">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新增字典项提交表单 -->
    <el-dialog v-model="addFormDialog" :title="`${isEditAdd ? '编辑' : '新增'}`" width="640px">
      <el-form :model="state.addForm" :rules="addRules" label-position="top" label-width="auto" ref="addFormRef">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="state.addForm.name" clearable placeholder="请输入"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="值" prop="value">
              <el-input v-model="state.addForm.value" clearable placeholder="请输入"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="选择制定组织" prop="belongId">
              <el-tree-select v-model="state.addForm.belongId" clearable :data="state.belongTreeData" highlight-current default-expand-all check-strictly :props="{ label: 'name', value: 'id', children: 'subTeam'}" placeholder="请选择" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="state.addForm.remark" :min="4" placeholder="请输入" type="textarea"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addFormDialog = false">取消</el-button>
          <el-button type="primary" @click="submitAddForm(addFormRef)">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  // @ts-nocheck
  import DiyTable from "@/components/diyTable/index.vue";
  import {reactive, ref,onMounted, watch} from "vue";
  import {FormRules,FormInstance,ElMessage,ElTree } from "element-plus";
  import { Search } from '@element-plus/icons-vue'
  import {userCtrl,dictionaryCtrl, Dict, INullSpeciesItem} from '@/ts/coreIndex'
  import { PageRequest } from '@/ts/base/model';

  interface Tree {
    id: number
    label: string
    children?: Tree[]
  }

  const filterText = ref('')
  const treeRef = ref<InstanceType<typeof ElTree>>()
  const attrFormDialog = ref(false)
  const isEditAttr =  ref(false)
  const attrFormRef = ref<FormInstance>()
  const addFormDialog = ref(false)
  const isEditAdd =  ref(false)
  const addFormRef = ref<FormInstance>()

  watch(filterText, (val) => {
    treeRef.value!.filter(val)
  })

  const filterNode = (value: string, data: Tree) => {
    if (!value) return true
    return data.name.includes(value)
  }

  const defaultProps = {
    children: 'children',
    label: 'name'
  }

  const props = defineProps({
    info: {
      type: Object
    },
    recursionOrg:{
      type: Boolean
    },
    recursionSpecies:{
      type: Boolean
    }
  })

  const state = reactive({
    tableData:[],
    attrForm: {},
    addForm:{},
    belongTreeData: [],
    dictData:[],
    attrEditData:{},
    currentDict:null
  })

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

  const tableHead = ref([
    {
      prop: 'name',
      label: '名称',
    },
    {
      prop: 'value',
      label: '值',
    },
    {
      prop: 'belongId',
      label: '创建人',
    },
    {
      prop: 'createTime',
      label: '创建时间',
    },
    {
      type: 'slot',
      label: '操作',
      fixed: 'right',
      align: 'center',
      width: '150',
      name: 'operate'
    }
  ])

  //添加分类字典规则
  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '特性名称为必填项', trigger: 'blur' },
    ],
    code: [
      { required: true, message: '特性代码为必填项', trigger: 'blur' },
    ],
    belongId: [
      { required: true, message: '制定组织为必填项', trigger: 'change' },
    ]
  })

  //添加字典项规则
  const addRules = reactive<FormRules>({
    name: [
      { required: true, message: '字典项名称为必填项', trigger: 'blur' },
    ],
    value: [
      { required: true, message: '字典项值为必填项', trigger: 'blur' },
    ],
    belongId: [
      { required: true, message: '制定组织为必填项', trigger: 'change' },
    ]
  })

  const pageStore = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0,
  });

  //打开分类字典弹窗
  const attrFormAdd = async (type:string,item:any) => {
    state.attrForm = {}
    if(type == '编辑'){
      isEditAttr.value = true
      // item.value = item.code
      state.attrForm = Object.assign(item ? item : {}, state.attrForm)
    }else{
      isEditAttr.value = false
    }
    state.belongTreeData = await userCtrl.getTeamTree()
    attrFormDialog.value = true
  }

  //打开字典项弹窗
  const addFormAdd = async(type:string,item:any) =>{
    state.addForm = {}
    if(type == '编辑'){
      isEditAdd.value = true
      state.addForm = Object.assign(item ? item : {}, state.addForm);
    }else{
      isEditAdd.value = false
    }
    state.belongTreeData = await userCtrl.getTeamTree()
    addFormDialog.value = true
  }

  //提交分类字典
  const submitAttrForm = async (formEl: FormInstance | undefined) => {
    formEl.validate(async (valid) => {
      if (valid) {
        if(!isEditAttr.value){
          state.attrForm.speciesId = props.info.id
          const success = await props.info.createDict(state.attrForm)
          if(success) {
            ElMessage.success({ message: '新增成功!'})
            attrFormDialog.value = false
            await loadDictsList()
          }
        }else{
          const success = await props.info.updateDict(state.attrForm)
          if(success) {
            ElMessage.success({ message: '编辑成功!'})
            attrFormDialog.value = false
            await loadDictsList()
          }
        }
      } else {
        return false
      }
    })
  }

  //提交字典项
  const submitAddForm = async (formEl: FormInstance | undefined) => {
    formEl.validate(async (valid) => {
      if (valid) {
        if(state.currentDict){
          if(!isEditAdd.value){
            const success = await state.currentDict.createItem(state.addForm)
              if(success) {
                ElMessage.success({ message: '新增成功!'})
                addFormDialog.value = false
                await getDataList()
              }
          }else{
            const success = await state.currentDict.updateItem(state.addForm)
              if(success) {
                ElMessage.success({ message: '编辑成功!'})
                addFormDialog.value = false
                await getDataList()
              }
          }
        }else{
          ElMessage.error({ message: '请先选择 左侧分类字典!'})
        }
      } else {
        return false
      }
    })
  }
  
  //获取字典分类列表
  const loadDictsList = async() => {
    const current:INullSpeciesItem = props.info
    console.log(current)
    let res: IDict[] = await current.loadDictsEntity(
        userCtrl.space.id,
        props.recursionOrg,
        props.recursionSpecies,
        {
          offset: 0,
          limit: 10000,
          filter: '',
        },
    );
    state.dictData = res
    state.selectKey =res[0]?.id
    getCurrentDict(res[0])
  }

  //选择分类字典
  const getCurrentDict = async (item: any) => {
    state.currentDict = new Dict(item)
    getDataList()
  }

  //获取字典项数据
  const getDataList = async() =>{
    const page: PageRequest = {offset: 0, limit: 20, filter: ''}
    let res = await state.currentDict.loadItems(userCtrl.space.id, page);
    state.tableData = res.result
    pageStore.total = res.total
  }

  //分页
  const handleUpdate = (page: any) => {
    pageStore.currentPage = page.current;
    pageStore.pageSize = page.pageSize;
    getDataList();
  };

  //删除分类字典
  const delDict = async() =>{
    let success = await state.currentDict.delete(state.currentDict.id)
    if(success) {
      ElMessage.success({ message: '删除成功!'})
      await loadDictsList()
    }
  } 

  //删除字典项
  const delItem = async(item) =>{
    const newItem = new Dict(item)
    let success = await state.currentDict.deleteItem(newItem.id)
    if(success) {
      ElMessage.success({ message: '删除成功!'})
      await getDataList()
    }
  } 

  onMounted(() => {
    loadDictsList()
  })

</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  .left{
    width: 15vw;
    height: 100%;
    .header{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: var(--el-font-size-base);
      color: var(--el-tree-text-color);
      .add{
        cursor: pointer;
      }
    }
    .search-wrap{
      width: 100%;
      margin-top: 10px;
    }
    .search {
      font-size: 12px;
      .el-input__inner {
        font-size: 12px;
      }
    }
    .data-list{
      width: 100%;
      font-size: 14px;
      padding: 8px;
    }
    .folder-node {
      width: calc(15vw - 70px);
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-right: 10px;
      justify-content: space-between;
      .node-label {
        display: flex;
        align-items: center;
        span {
          margin-left: 5px;
        }
      }
      .el-dropdown-link{
        padding: 2px 10px;
        cursor: pointer;
        border-radius: 10px;
      }
      .el-dropdown-link:hover{
        background:#1642cb;
        color: #fff;
      }
    }
  }
  .right{
    padding-left: 10px;
    width: 100%;
  }
}
// 去掉el-input自带边框
:deep .search .el-input__wrapper {
  margin: 5px;
  padding-left: 14px !important;
  box-sizing: border-box;
  border: none !important;
  box-shadow: none !important;
  padding: 0px; //前边边距去掉
  border-radius: 15px;
  background: #f2f4f9;
}
</style>