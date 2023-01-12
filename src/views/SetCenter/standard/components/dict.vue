<template>
  <div class="main">
    <div class="left">
      <div class="header">
        <span>分类字典</span>
        <el-icon class="add" @click="attrFormDialog = true"><Plus /></el-icon>
      </div>
      <div class="search-wrap">
        <el-input class="search" v-model="filterText" placeholder="搜索" :prefix-icon="Search" />
      </div>
      <div class="data-list">

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
      >
        <template #buttons>
          <el-button class="btn-check" type="primary" text link @click="addFormDialog=true">新增字典项</el-button>
        </template>
        <template #operate="scope">
          <el-dropdown>
            <span class="el-dropdown-link"> ··· </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>编辑</el-dropdown-item>
                <el-dropdown-item style="color: #f67c80">删除</el-dropdown-item>
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
              <el-input v-model="state.attrForm.name" placeholder="请输入"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典代码" prop="code">
              <el-input v-model="state.attrForm.code" placeholder="请输入"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="选择制定组织" prop="belongId">
              <el-tree-select v-model="state.attrForm.belongId" :data="state.belongTreeData" highlight-current default-expand-all check-strictly :props="{ label: 'name', value: 'id', children: 'subTeam'}" placeholder="请选择" />
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
      <el-form :model="state.addForm" :rules="rules" label-position="top" label-width="auto" ref="addrFormRef">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="state.addForm.name" placeholder="请输入"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="值" prop="code">
              <el-input v-model="state.addForm.code" placeholder="请输入"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="选择制定组织" prop="belongId">
              <el-tree-select v-model="state.addForm.belongId" :data="state.belongTreeData" highlight-current default-expand-all check-strictly :props="{ label: 'name', value: 'id', children: 'subTeam'}" placeholder="请选择" />
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
          <el-button type="primary" @click="submitAddForm(addForm)">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  // @ts-nocheck
  import DiyTable from "@/components/diyTable/index.vue";
  import {computed, nextTick, reactive, ref, watch} from "vue";

  import {ElMessage,FormRules,FormInstance} from "element-plus";
  import { Search } from '@element-plus/icons-vue'

  const filterText = ref('')
  const attrFormDialog = ref(false)
  const isEditAttr =  ref(false)
  const attrFormRef = ref<FormInstance>()
  const addFormDialog = ref(false)
  const isEditAdd =  ref(false)
  const addFormRef = ref<FormInstance>()

  const state = reactive({
    tableData:[],
    attrForm: {},
    addForm:{}
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
      prop: 'code',
      label: '名称',
    },
    {
      prop: 'name',
      label: '值',
    },
    {
      prop: 'valueType',
      label: '创建人',
    },
    {
      prop: 'speciesId',
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

  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '特性名称为必填项', trigger: 'blur' },
    ],
    code: [
      { required: true, message: '特性代码为必填项', trigger: 'blur' },
    ],
    belongId: [
      { required: true, message: '制定组织为必填项', trigger: 'blur' },
    ],
    authId: [
      { required: true, message: '管理职权为必填项', trigger: 'blur' },
    ],
    public: [
      { required: true, message: '向下级组织公开为必填项', trigger: 'blur' },
    ],
    valueType: [
      { required: true, message: '特性类型为必填项', trigger: 'blur' },
    ],
    remark: [
      { required: true, message: '特性定义为必填项', trigger: 'blur' },
    ],
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
      margin-top: 10px;
    }
    .search {
      font-size: 12px;
      .el-input__inner {
        font-size: 12px;
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