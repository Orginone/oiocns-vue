<template>
    <div class="main">
      <div class="content">
        <div class="detail" v-if="currentData.target">
          <el-descriptions
              class="margin-top"
              :title="`${currentData.name}的基本信息`"
              :column="2"
              border
          >
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">共享组织</div>
              </template>
              <span>{{ currentData.belongInfo ? currentData.belongInfo.name : '奥集能平台' }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">分类编码</div>
              </template>
              <span>{{ currentData.target.code }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">开放域</div>
              </template>
              <span>{{ currentData.target.public ? '开放' : '私有' }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">创建时间</div>
              </template>
              <span>{{ currentData.target.createTime }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">分类定义</div>
              </template>
              <span>{{ currentData.target.remark }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="table">
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
            <template #slot-tabs>
              <div class="table-tabs">
                <el-menu
                    :default-active="`1`"
                    class="el-menu-demo"
                    mode="horizontal"
                    :ellipsis="false"
                >
                  <el-menu-item index="1">全部</el-menu-item>
                </el-menu>
              </div>
            </template>
            <template #buttons>
              <el-button class="btn-check" type="primary" text link @click="openAttrFormDialog">新增特性</el-button>
            </template>
            <template #operate="scope">
              <el-dropdown>
                <span class="el-dropdown-link"> ··· </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="editAttr(scope.row)">编辑</el-dropdown-item>
                    <el-dropdown-item @click="deleteAttrItem(scope.row)" style="color: #f67c80">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <template #slot-card>
              <!-- <card></card> -->
            </template>
          </DiyTable>
        </div>
      </div>
      <!-- 特性提交表单 -->
      <el-dialog v-model="attrFormDialog" :title="`${isEditAttr ? '编辑' : '新增'}特性`" width="50%">
        <el-form :model="state.attrForm" :rules="rules" label-position="top" label-width="auto" ref="attrFormRef">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="特性名称" prop="name">
                <el-input v-model="state.attrForm.name" placeholder="请输入"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="特性代码" prop="code">
                <el-input v-model="state.attrForm.code" placeholder="请输入"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="制定组织" prop="belongId">
                <el-tree-select v-model="state.attrForm.belongId" :data="state.belongTreeData" highlight-current default-expand-all check-strictly :props="{ label: 'name', value: 'id', children: 'subTeam'}" placeholder="请选择" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="管理职权" prop="authId">
                <el-tree-select v-model="state.attrForm.authId" :data="state.authTreeData" highlight-current default-expand-all check-strictly :props="{ label: 'name', value: 'id'}" placeholder="请选择" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="向下级组织公开" prop="public">
                <el-select v-model="state.attrForm.public" placeholder="请选择">
                  <el-option label="公开" :value="true" />
                  <el-option label="不公开" :value="false" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="特性类型" prop="valueType">
                <el-select v-model="state.attrForm.valueType" placeholder="请选择">
                  <el-option label="数值型" value="数值型" />
                  <el-option label="描述型" value="描述型" />
                  <el-option label="选择型" value="选择型" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="特性定义" prop="remark">
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
    </div>
</template>
<script lang="ts" setup>
  // @ts-nocheck
  import DiyTable from "@/components/diyTable/index.vue";
  import {computed, nextTick, reactive, ref, watch} from "vue";
  import { setCenterStore } from '@/store/setting'
  import { userCtrl,thingCtrl } from "@/ts/coreIndex";

  import { PageRequest } from '@/ts/base/model';
  import {ElMessage,FormRules,FormInstance} from "element-plus";
  const store: any = setCenterStore()

  const currentData = computed(() => {
    return store.currentSelectItme
  })

  watch(currentData, async (n, o) => {
    await loadSpeciesAttrs(n)
  })

  const attrFormDialog = ref(false)
  const isEditAttr =  ref(false)
  const attrFormRef = ref<FormInstance>()

  const state = reactive({
    tableData: [],
    attrForm: {public:true,valueType:"描述型"},
    belongTreeData: [],
    authTreeData: []
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
      label: '特性编号',
    },
    {
      prop: 'name',
      label: '特性名称',
    },
    {
      prop: 'valueType',
      label: '特性类型',
    },
    {
      prop: 'speciesId',
      label: '特性分类',
    },
    {
      prop: 'belongId',
      label: '共享组织',
    },
    {
      prop: 'remark',
      label: '特性定义',
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



  const loadSpeciesAttrs = async (species) => {
    const page: PageRequest = {offset: 0, limit: 20, filter: ''}
    const res = await species.loadAttrs(userCtrl.space.id, page)
    console.log(res)
    if (res && res.result) {
      for (const item of res.result) {
        const team = await userCtrl.findTeamInfoById(item.belongId);
        if (team) {
          item.belongId = team.name;
        }
        item.speciesId = findSpecesName(thingCtrl.teamSpecies, item.speciesId);
      }
    }
    state.tableData = res.result
  }

  const findSpecesName = (species: INullSpeciesItem, id: string) => {
    if (species) {
      if (species.id == id) {
        return species.name;
      }
      for (const item of species.children) {
        if (findSpecesName(item, id) != id) {
          return item.name;
        }
      }
    }
    return id;
  };

  /** 新增特性 */
  const openAttrFormDialog = async () => {
    isEditAttr.value = false
    attrFormDialog.value = true
    state.belongTreeData = await userCtrl.getTeamTree()
    const authData = await userCtrl.company.loadAuthorityTree(false)
    state.authTreeData = authData ? [authData] : [];
    
    state.attrForm = {public:true,valueType:"描述型"}
  }

  const submitAttrForm = async (formEl: FormInstance | undefined) => {
    if(!currentData || !currentData.value.createAttr) {
      ElMessage.warning({ message: '请选择左侧分类后，再增加特性'})
      attrFormDialog.value = false
      return false
    }
    if (!formEl) return

    formEl.validate(async (valid) => {
      if (valid) {
        const success = await currentData.value.createAttr(state.attrForm)
          if(success) {
            ElMessage.success({ message: '新增成功'})
            attrFormDialog.value = false
            await loadSpeciesAttrs(currentData.value)
          }
      } else {
        return false
      }
    })
  }

  const deleteAttrItem = async (attr) => {
    const success = await currentData.value.deleteAttr(attr.id)
    if(success) {
      ElMessage.success({ message: '删除成功'})
      await loadSpeciesAttrs(currentData.value)
    } else {
      ElMessage.error({ message: '删除失败'})
    }
  }

  /** 编辑特性 */
  const editAttr = async (attr) => {
    isEditAttr.value = true
    state.belongTreeData = await userCtrl.getTeamTree()
    const authData = await userCtrl.company.loadAuthorityTree(false)
    state.authTreeData = authData ? [authData] : [];
    attrFormDialog.value = true
    state.attrForm = attr
  }

  const handleUpdate = (page: any) => {

  }
</script>
<style lang="scss">
  .el-dropdown-link {
    padding: 2px 10px;
    cursor: pointer;
    border-radius: 10px;
  }

  .el-dropdown-link:hover {
    background: #1642cb;
    color: #fff;
  }
</style>
<style lang="scss" scoped>
  .main {
    width: 100%;
    height: 100%;
    display: flex;
    .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      background: #f0f4f8;
      .detail {
        background: #fff;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        max-height: 300px;
        min-height: 130px;
        padding: 12px;
        margin-top:3px;
      }
      .table {
        background: #fff;
        margin-top: 3px;
        height: calc(100vh - 290px);

        .btn-check {
          padding: 8px 16px;
        }

        .btn-check:hover {
          padding: 8px 16px;
        }

        .table-tabs {

          .el-menu--horizontal {
            border: 0;
          }

          .el-menu-item {
            padding: 0;
            margin-right: 16px;
            margin-bottom: 3px;
            border: 0 !important;
          }

          .el-menu--horizontal:hover,
          .el-menu-item:hover {
            background: #fff;
          }
        }
      }
    }
  }
</style>