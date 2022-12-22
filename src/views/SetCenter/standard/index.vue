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
              <el-button class="btn-check" type="primary" link @click="openAttrFormDialog">新增特性</el-button>
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
      <el-dialog v-model="attrFormDialog" :title="`${isEditAttr ? '编辑' : '新增'}特性`" width="600">
        <el-form :model="state.attrForm" label-width="120px" ref="attrFormRef">
          <el-form-item label="特性名称">
            <el-input v-model="state.attrForm.name" placeholder="请输入"/>
          </el-form-item>
          <el-form-item label="特性代码">
            <el-input v-model="state.attrForm.code" placeholder="请输入"/>
          </el-form-item>
          <el-form-item label="选择制定组织">
            <el-tree-select v-model="state.attrForm.belongId" :data="state.belongTreeData" highlight-current default-expand-all check-strictly :props="{ label: 'name', value: 'id', children: 'subTeam'}" placeholder="请选择" />
          </el-form-item>
          <el-form-item label="选择管理职权">
            <el-tree-select v-model="state.attrForm.authId" :data="state.authTreeData" highlight-current default-expand-all check-strictly :props="{ label: 'name', value: 'id'}" placeholder="请选择" />
          </el-form-item>
          <el-form-item label="向下级组织公开">
            <el-select v-model="state.attrForm.public" placeholder="请选择">
              <el-option label="公开" :value="true" />
              <el-option label="不公开" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="特性类型">
            <el-select v-model="state.attrForm.valueType" placeholder="请选择">
              <el-option label="数值型" value="数值型" />
              <el-option label="描述型" value="描述型" />
              <el-option label="选择型" value="选择型" />
            </el-select>
          </el-form-item>
          <el-form-item label="特性定义">
            <el-input v-model="state.attrForm.remark" placeholder="请输入" type="textarea"/>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="attrFormDialog = false">取消</el-button>
            <el-button type="primary" @click="submitAttrForm">确定</el-button>
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
  import { USERCTRL } from "@/ts/coreIndex";
  import { PageRequest } from '@/ts/base/model';
  import {ElMessage} from "element-plus";
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
    attrForm: {},
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
      label: '特性编码',
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

  const loadSpeciesAttrs = async (species) => {
    const page: PageRequest = {offset: 0, limit: 20, filter: ''}
    const res = await species.loadAttrs(USERCTRL.space.id, page)
    console.log(res)
    if (res && res.result) {
      for (const item of res.result) {
        const team = await USERCTRL.findTeamInfoById(item.belongId);
        if (team) {
          item.belongId = team.name;
        }
      }
    }
    state.tableData = res.result
  }

  const openAttrFormDialog = async () => {
    isEditAttr.value = false
    attrFormDialog.value = true
    state.belongTreeData = await USERCTRL.getTeamTree()
    const authData = await USERCTRL.company.selectAuthorityTree(false)
    state.authTreeData = authData ? [authData] : [];
  }

  const submitAttrForm = async () => {
    if(isEditAttr) {
      ElMessage.warning({ message: '暂不支持编辑'})
      attrFormDialog.value = false
      return false
    }
    const success = await currentData.value.createAttr(state.attrForm)
    if(success) {
      ElMessage.success({ message: '新增成功'})
      attrFormDialog.value = false
      await loadSpeciesAttrs(currentData.value)
    }
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

  const editAttr = async (attr) => {
    isEditAttr.value = true
    state.belongTreeData = await USERCTRL.getTeamTree()
    const authData = await USERCTRL.company.selectAuthorityTree(false)
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
          color: #154ad8;
        }

        .btn-check:hover {
          background: #154ad8;
          color: #fff;
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

          .is-active {
            background: #fff;
          }

          .is-active::after {
            content: "";
            position: absolute;
            left: 0;
            margin-left: calc(50% - 9px);
            bottom: 25%;
            width: 18px;
            border-radius: 5px;
            height: 2px;
            background: #154ad8;
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