<template>
  <el-card class="card">
    <li class="con tree-btns">
      <div class="title">部门管理</div>
      <el-dropdown>
        <el-icon color="#154ad8" :size="20">
          <CirclePlus />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-if="authority.IsSpaceRelationAdmin()" @click="deptDialogVisible = true">
              <el-icon class="el-icon--right">
                <plus />
              </el-icon>
              新增部门
            </el-dropdown-item>
            <el-dropdown-item v-if="authority.IsSpaceRelationAdmin()" @click="jobDialogVisible = true">
              <el-icon class="el-icon--right">
                <plus />
              </el-icon>
              新增工作组
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </li>
    <div>
      <el-input class="search" v-model="filterText" placeholder="搜索部门">

      </el-input>
    </div>
    <div class="tree">
      <el-tree :data="orgTree" :expand-on-click-node="false" ref="treeRef" @node-click="nodeClick" node-key="id"
        :default-expanded-keys="defaultExpandedKeys" :filter-node-method="filterNode">
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <div class="tree-box">
              <img src="@/assets/img/zuzhijiagou.jpg" class="tree-icon" />
              <span>{{ data.label }}</span>
              <el-tag size="small">{{ data.data.typeName }}</el-tag>
            </div>
          </span>
        </template>
      </el-tree>
    </div>
    <div class="weihu-wrap" @click="modifyOrgTree">
      <span class="weihu-wrap-txt">部门维护</span>
    </div>
  </el-card>

  <el-dialog v-model="deptDialogVisible" title="请录入部门信息" width="40%" center append-to-body @close="dialogHide">
    <div>
      <el-form-item label="部门名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="部门编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="部门简介" style="width: 100%">
        <el-input v-model="formData.remark" :autosize="{ minRows: 5 }" placeholder="请输入" type="textarea" clearable />
      </el-form-item>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="createDept">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="jobDialogVisible" title="请录入工作组信息" width="40%" center append-to-body @close="dialogHide">
    <div>
      <el-form-item label="工作组名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="工作组编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="工作组简介" style="width: 100%">
        <el-input v-model="formData.remark" :autosize="{ minRows: 5 }" placeholder="请输入" type="textarea" clearable />
      </el-form-item>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="createJob">确认</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import $services from '@/services'
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import authority from '@/utils/authority'
const selectItem = ref<any>();
// 获取单位树点击的信息
const selectItemChange = (data: any) => {
  selectItem.value = data;
};
defineExpose({ selectItemChange });

const router = useRouter()
const emit = defineEmits(['nodeClick'])
let deptDialogVisible = ref<boolean>(false)
let jobDialogVisible = ref<boolean>(false)

let formData = ref<any>({})
const cascaderProps = {
  checkStrictly: true,
  emitPath: false,
  // expandTrigger: ExpandTrigger.HOVER,
  value: 'id',
}
const authProps = {
  checkStrictly: true,
  emitPath: false,
  value: 'id',
  label: 'name',
  children: 'nodes',
}
// 节点ID和对象映射关系
const parentIdMap: any = {}

let defaultExpandedKeys = ref([])
let filterText = ref('')
const treeRef = ref<any>()
let orgTree = ref<OrgTreeModel[]>([])
let cascaderTree = ref<OrgTreeModel[]>([])

// 加载单位
const loadOrgTree = () => {
  $services.company.getCompanyTree({}).then((res: any) => {
    orgTree.value = []
    orgTree.value.push(res.data)
    cascaderTree.value = filter(JSON.parse(JSON.stringify(orgTree.value)))
    defaultExpandedKeys.value = [res.data.id]
    nodeClick(res.data)
  })
}

// 过滤掉工作组作为表单级联数据
const filter = (nodes: OrgTreeModel[]): OrgTreeModel[] => {
  nodes = nodes.filter(node => node.data?.typeName !== '工作组')
  for (const node of nodes) {
    node.children = filter(node.children)
  }
  return nodes;
}

// 树点击事件
const nodeClick = (val: any, nodeAttribute?: any, event?: any) => {
  emit('nodeClick', val)
  formData.value.parentId = val.id
}
// 树节点搜索
const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.label.includes(value)
}

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

//关闭弹窗清空
const dialogHide = () => {
  formData.value = { parentId: formData.value.parentId }
  deptDialogVisible.value = false
  jobDialogVisible.value = false
}

// 创建部门
const createDept = () => {
  $services.company.createDepartment({
    data: {
      id: formData.value.id,
      code: formData.value.code,
      name: formData.value.name,
      parentId: formData.value.parentId,
      teamName: formData.value.name,
      teamRemark: formData.value.remark
    }
  }).then((res: ResultType) => {
    if (res.success) {
      dialogHide()
      loadOrgTree()
      ElMessage({
        message: res.msg,
        type: 'success'
      })
    } else {
      // ElMessage({
      //   message: res.msg,
      //   type: 'error'
      // })
    }
  })
}
// 创建工作组
const createJob = () => {
  $services.company.createJob({
    data: {
      id: formData.value.id,
      code: formData.value.code,
      name: formData.value.name,
      parentId: formData.value.parentId,
      teamName: formData.value.name,
      teamRemark: formData.value.remark
    }
  }).then((res: ResultType) => {
    if (res.success) {
      dialogHide()
      loadOrgTree()
      ElMessage({
        message: res.msg,
        type: 'success'
      })
    } else {
      ElMessage({
        message: res.msg,
        type: 'error'
      })
    }
  })
}

// 修改组织树维护
const modifyOrgTree = () => {
  router.push({ path: '/relation/org' })
}
//获取部门
onMounted(() => {
  loadOrgTree()
})
</script>

<style lang="scss">
.tree .el-tree-node__content {
  height: 30px;
  font-size: 16px;
}

.tree .el-tag {
  margin-left: 5px;
}

.dialog-workGroup {
  .el-form-item__label {
    width: 82px;
  }
}
</style>
<style lang="scss" scoped>
.card {
  height: 100%;
  position: relative;
  border: 0;
}

.tree-btns {
  display: flex;
  justify-content: space-between;
  // padding: 0 24px;

  .el-button--small {
    padding: 12px 6px;
  }
}

.search {
  font-size: 12px;
  padding: 12px 0;

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

.tree {
  position: relative;
  height: calc(100vh - 200px);
  overflow-y: auto;

  .tree-icon {
    width: 14px;
    height: 14px;
    display: block;
    margin-top: -3px;
    margin-right: 3px;
  }

  .weihu-wrap {
    text-align: center;
    // background-color: #fff;
    border-top: 1px solid var(--el-border-color);
    cursor: pointer;
    position: absolute;
    bottom: 10px;
    width: 100%;
    height: 30px;
    line-height: 30px;
    left: 0;

    &-txt {
      color: var(--el-color-primary);
      font-size: 16px;
    }
  }
}

.tree-box {
  display: flex;
  align-items: center;

  &__text {
    margin-left: 5px;
  }

  &span {
    font-size: 16px;
  }
}

.bottom {
  position: fixed;
  bottom: 0; //这里换成top:0;就悬浮在头部
  width: 100%;
  z-index: 100;
}
</style>

