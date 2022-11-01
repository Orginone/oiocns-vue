<template>
  <div class="info">
    <div class="header">
      <div class="title">岗位信息</div>
      <div class="box-btns">
        <el-button small link type="primary" v-if="allowEdit()" @click="handleUpdate">编辑</el-button>
        <el-button small link type="primary" v-if="allowEdit()" @click="handleDelete">删除</el-button>
        <el-button small link type="primary" v-if="allowEdit()" @click="goback">返回</el-button>
      </div>
    </div>
    <div class="tab-list">
      <el-descriptions :column="2" border>
        <el-descriptions-item width="150px" :label="'名称'" label-align="center" align="center"
          label-class-name="my-label" class-name="my-content">{{selectItem?.name}}</el-descriptions-item>
        <el-descriptions-item width="150px" :label="'编码'" label-align="center" align="center"
          label-class-name="my-label" class-name="my-content">{{selectItem?.code}}</el-descriptions-item>
        <el-descriptions-item width="150px" :label="'创建人'" label-align="center" align="center"
          label-class-name="my-label" class-name="my-content">{{chat.getName(selectItem?.createUser)}}</el-descriptions-item>
        <el-descriptions-item width="150px" :label="'创建时间'" label-align="center" align="center"
          label-class-name="my-label" class-name="my-content">{{selectItem?.createTime}}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2" label-align="center" align="center">
          <div class="text-remark">
            {{selectItem?.remark}}
          </div>
        </el-descriptions-item>
      </el-descriptions>

    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="修改岗位信息" width="40%" center append-to-body @close="dialogHide">
    <div>
      <el-form-item label="岗位名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="岗位编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="所属角色" style="width: 100%">
        <el-cascader :props="cascaderProps" :options="cascaderTree" v-model="formData.authId" style="width: 100%"
          placeholder="请选择" />
      </el-form-item>
      <el-form-item label="岗位简介" style="width: 100%">
        <el-input v-model="formData.remark" :autosize="{ minRows: 5 }" placeholder="请输入" type="textarea" clearable />
      </el-form-item>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="updateIdentity">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import $services from '@/services'
import { ref, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router';
import {chat} from '@/module/chat/orgchat';
import authority from '@/utils/authority'
import identityServices from '@/module/relation/identity'

const IdentityServices = new identityServices()
const emit = defineEmits(['refresh'])

let selectItem = ref<any>({})
let dialogVisible = ref<boolean>(false)
let formData: any = ref({
  name: ''
})
const belongId = ref<any>()
// 获取单位树点击的信息
const selectItemChange = (data: any) => {
  selectItem.value = data;
};
defineExpose({ selectItemChange });

watch(selectItem, () => {
});

const allowEdit = () => {
  if(selectItem.value && selectItem.value.id){
    return authority.IsRelationAdmin([
      selectItem.value.belongId,
      authority.getSpaceId()
    ])
  }
  return false
}
// 删除岗位信息
const handleDelete = () => {
  if (!selectItem.value.id) {
    ElMessage.warning('请左侧选择岗位')
    return
  }
  ElMessageBox.confirm(
    `确定删除 ${selectItem.value.name} 岗位吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    const data = await IdentityServices.deleteIdentity(selectItem.value.id)
    if (data) {
      selectItem.value = {}
      ElMessage({
        message: '操作成功',
        type: 'success'
      })
      emit('refresh')
    }
  })
    .catch(() => {
      console.log('取消移除!')
    })
}

// 修改信息
const handleUpdate = () => {
  if (!selectItem.value.id) {
    ElMessage.warning('请左侧选择岗位')
    return
  }
  formData.value = selectItem.value
  dialogVisible.value = true
}
const dialogHide = () => {
  dialogVisible.value = false
  formData.value = {}
}
// 保存 todo
const updateIdentity = () => {
  ElMessage.error('待提供接口...')
  return;
  const data = { ...formData.value };
  let url = null;
  if (data.typeName == '集团') {
    url = 'updateGroup'
  } else if (data.typeName == '子集团') {
    url = 'updateSubGroup'
  }
  $services.company[url]({
    data
  }).then((res: ResultType) => {
    if (res.code == 200 && res.success) {
      dialogVisible.value = false
      ElMessage.success('信息修改成功!')
      selectItem.value.data = data
    }
  })
}

let authorityTree = ref<any[]>([])
let cascaderTree = ref<any[]>([])

const cascaderProps = {
  checkStrictly: true,
  value: 'id',
  label: 'name',
  children: 'nodes',
  emitPath: false,
}

// 加载角色树
const loadAuthorityTree = async () => {
  const data = await IdentityServices.getAuthorityTree(belongId.value)
  if(data){
    authorityTree.value = []
    authorityTree.value.push(data)
    cascaderTree.value = authorityTree.value
  }
}


onMounted(() => {
  belongId.value = router.currentRoute.value.query?.belongId
  loadAuthorityTree();
})

// 返回
const goback = () => {
  router.go(-1)
}
</script>

<style lang="scss" scoped>
.info {
  height: 100%;
  width: 100%;
  background-color: var(--el-bg-color-overlay);
}

.header {
  display: flex;
  padding: 10px 20px;
  padding-top: 6px;
  box-sizing: border-box;

  .title {
    text-align: left;
    font-size: 16px;
    width: 30%;
    font-weight: bold;
  }

  .box-btns {
    text-align: right;
    padding-right: 14px;
    padding-bottom: 10px;
    width: 70%;
  }
}

.tab-list {
  padding: 0px 20px 20px;
  padding-top: 2px;
  box-sizing: border-box;
}

.next-dept {
  tr {
    border: 1px solid #eff2f7;
    color: #666;
    height: 45px;
    text-align: center;
  }

  .left {
    background: #f5f6fc;
    width: 10.4%;
    min-width: 110px;
  }

  .column {
    width: 39.6%;
    text-align: left;
    padding: 0 20px;
    box-sizing: border-box;
    background: #fff;
  }

  .remark {
    display: block;
    max-height: 60px;
    display: -webkit-box;
    -webkit-line-clamp: 10;
    -webkit-box-orient: vertical;
    width: 100%;
    overflow-y: auto;
  }
}
</style>
