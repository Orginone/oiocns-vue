<template>
  <el-card class="card">
    <div>
      <el-select v-model="selectedValue" @change="changeGroupIndex" value-key="id" placeholder="请选择集团">
        <el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div class="search-wrap">
      <el-input class="search" v-model="filterText" placeholder="搜索集团">

      </el-input>
      <li class="con tree-btns">
        <div class="title">集团管理</div>
        <el-icon color="#154ad8" :size="20" v-if="allowEdit()" @click="createGroupDialogShow">
          <CirclePlus />
        </el-icon>
      </li>
    </div>

    <div class="tree">
      <el-tree :data="orgTree" :expand-on-click-node="false" ref="treeRef" @node-click="nodeClick" node-key="id"
        :default-expanded-keys="defaultExpandedKeys" :filter-node-method="filterNode">
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <div class="tree-box">
              <img src="@/assets/img/zuzhijiagou.jpg" class="tree-icon" />
              <span>{{ data.label }}</span>
              <!-- <el-tag size="small">{{ data.data.typeName }}</el-tag> -->
            </div>
          </span>
        </template>
      </el-tree>
    </div>

  </el-card>

  <el-dialog v-model="createGroupDialogVisible" title="请录入子集团信息" width="40%" center append-to-body @close="createGroupDialogHide">
    <div>
      <el-form-item label="节点名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入节点名称" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="节点编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入节点编号" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="上级节点" style="width: 100%">
        <el-cascader :props="cascaderProps" :options="cascaderTree" v-model="formData.parentId" style="width: 100%"
          placeholder="请选择上级节点"/>
      </el-form-item>

      <el-form-item label="节点简介" style="width: 100%">
        <el-input v-model="formData.teamRemark" :autosize="{ minRows: 5 }" placeholder="请输入节点简介" type="textarea" clearable />
      </el-form-item>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="createGroupDialogHide">取消</el-button>
        <el-button type="primary" @click="createGroup">确认</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import $services from '@/services'
import { ElMessage } from 'element-plus';
import authority from '@/utils/authority'

const emit = defineEmits(['nodeClick'])

const state = reactive({
  options: [],
})
let formData = ref<any>({})
const selectItem = ref<any>();
  
const allowEdit = () => {
  if(selectItem.value && selectItem.value.id){
    return authority.IsRelationAdmin([
      selectItem.value.id,
      selectItem.value.belongId
    ])
  }
  return false
}
// 获取集团树点击的信息
const selectItemChange = (data: any) => {
  selectItem.value = data;
};
const cascaderProps = {
  checkStrictly: true,
  // expandTrigger: ExpandTrigger.HOVER,
  value: 'id',
  emitPath: false,
}
// 集团树
let cascaderTree = ref<OrgTreeModel[]>([])
// 当前选中的集团
let selectedValue = ref<string>()

// 当前用户的集团
let groups = reactive([])
let orgTree = ref<OrgTreeModel[]>([])

let defaultExpandedKeys = ref([])

const filterText = ref('')
const treeRef = ref<any>()

// 刷新
const refresh = () => {
  loadOrgTree()
};
defineExpose({ refresh,selectItemChange });

// 查询集团列表
const getGroupList = () => {
  $services.company
    .companyGetGroups({
      data: {
        offset: 0,
        limit: 1000
      }
    })
    .then((res: ResultType) => {
      if (res.data.result && res.data.result.length > 0) {
        groups = res.data.result
        state.options = groups.map(g => {
          return { value: g.id, label: g.name }
        })
        selectedValue.value = groups[0].name
        loadOrgTree(groups[0].id)
      } else {
        groups = []
      }
    })
}

const nodeClick = (val: any, nodeAttribute?: any, event?: any) => {
  emit('nodeClick', val)
  formData.value.parentId = val.id
}

// 树节点搜索
const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.label.includes(value)
}

// 切换集团
const changeGroupIndex = (id: string) => {
  loadOrgTree(id)
}

// 加载集团树
const loadOrgTree = (id?: string)=>{
  const group = groups.find(g => g.id == id || g.name == selectedValue.value)
  $services.company.getGroupTree({
    data: { id: group.id }
  }).then((res: any) => {
    orgTree.value = []
    orgTree.value.push(res.data)
    cascaderTree.value = orgTree.value
    defaultExpandedKeys.value = [res.data.id]
    nodeClick(res.data)
  })
}

let createGroupDialogVisible = ref<boolean>(false)
const createGroupDialogShow = () => {
  createGroupDialogVisible.value = true
}


const createGroupDialogHide = () => {
  createGroupDialogVisible.value = false
}

const createGroup = ()=>{
  $services.company.createSubgroup({
    data: {
      id: formData.value.id,
      code: formData.value.code,
      name: formData.value.name,
      parentId: formData.value.parentId,
      teamName: formData.value.name,
      teamRemark: formData.value.teamRemark,
    }
  }).then((res: ResultType) => {
    if (res.success) {
      ElMessage({
        message: res.msg,
        type: 'success'
      })
      createGroupDialogHide()
      loadOrgTree()
    } else {
      ElMessage({
        message: res.msg,
        type: 'error'
      })
    }
  })
}

//获取部门
onMounted(() => {
  // 查询集团
  getGroupList()
})

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

</script>
<style lang="scss" scoped>
.card {
  height: 100%;
  border: 0;
}
.tree-btns {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
}
.tree{
  position: relative;
  height: calc(100vh - 200px);
  overflow-y: auto;
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

.custom-tree-node {
  overflow: hidden;
  text-overflow: ellipsis;
  word-spacing: nowrap;
  display: flex;
  cursor: pointer;
}

.tree-icon{
  width: 14px;
  height: 14px;
  display: block;
  margin-top: -3px;
  margin-right: 3px;
}

.tree-box {
  display: flex;
  align-items: center;

  &__text {
    margin-left: 5px;
  }
}
</style>

