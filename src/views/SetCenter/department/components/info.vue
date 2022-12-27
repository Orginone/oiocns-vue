<template>
  <div class="info">
    <div class="header">
      <div class="title">{{title}}信息</div>
      <div class="box-btns">
        <el-button small link type="primary" @click="handleUpdate">编辑</el-button>
        <el-button small link type="primary" @click="handleAuthority">权限管理</el-button>
        <!-- <el-button small link type="primary" v-if="authority.IsSpaceRelationAdmin()" @click="handleUpdate">编辑
        </el-button>
        <el-button small link type="primary" v-if="allowEdit()" @click="toAuth">角色管理</el-button>
        <el-button small link type="primary" v-if="allowEdit()" @click="toIdentity">岗位管理</el-button> -->
      </div>
    </div>
    <div class="tab-list">
      <el-descriptions :column="2" border>
        <el-descriptions-item :label="`${title}名称`" label-align="center" align="center" width="150px"
          label-class-name="my-label" class-name="my-content">{{currentData?.name}}</el-descriptions-item>
        <el-descriptions-item :label="`${title}编码`" label-align="center" align="center" width="150px"
          label-class-name="my-label" class-name="my-content">{{currentData?.code || ''}}</el-descriptions-item>
        <el-descriptions-item :label="'创建人'" label-align="center" align="center" width="150px"
          label-class-name="my-label" class-name="my-content">{{currentData?.createUser || ''}}
        </el-descriptions-item>
        <el-descriptions-item :label="'创建时间'" label-align="center" align="center" width="150px"
          label-class-name="my-label" class-name="my-content">{{currentData?.createTime || ''}}</el-descriptions-item>
        <el-descriptions-item label="描述" width="150px" :span="2" label-align="center" align="center">
          <div class="text-remark">
            {{currentData?.team.remark}}
          </div>
        </el-descriptions-item>
      </el-descriptions>

    </div>
  </div>

  <el-dialog v-model="dialogVisible" :title="'请编辑' + title + '信息'" width="30%">
    <el-form-item label="部门名称" style="width: 100%">
      <el-input v-model="formData.teamName" placeholder="请输入" clearable style="width: 100%" />
    </el-form-item>
    <el-form-item label="部门简称" style="width: 100%">
      <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%" />
    </el-form-item>
    <el-form-item label="部门编号" style="width: 100%">
      <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%" />
    </el-form-item>
    <el-form-item label="部门标识" style="width: 100%">
      <el-input v-model="formData.teamCode" placeholder="请输入" clearable style="width: 100%" />
    </el-form-item>
    <el-form-item label="部门简介" style="width: 100%">
      <el-input v-model="formData.teamRemark" :autosize="{ minRows: 5 }" placeholder="请输入" type="textarea" clearable />
    </el-form-item>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="update">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <authorityModal
    v-model:visible="visible"
  />
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import authorityModal from './authorityModal.vue';
import router from '@/router';
import authority from '@/utils/authority'
import { setCenterStore } from '@/store/setting'
const store: any = setCenterStore()
const allowEdit = () => {
  return selectItem.value.id &&
    authority.IsRelationAdmin([
      selectItem.value.id,
      selectItem.value.data.belongId
    ])
}
let selectItem = ref<any>({})
let dialogVisible = ref<boolean>(false)
let formData: any = ref({})

const currentData = computed(() => store.currentSelectItme?.intans?.target)
const current = computed(() => store.currentSelectItme?.intans)
const title = computed(() => currentData.value?.typeName ?? '部门')

// 获取单位
const selectItemChange = (data: any) => {
  selectItem.value = data;
};
defineExpose({ selectItemChange });

// 修改信息
const handleUpdate = () => {
  if (!currentData.value?.id) {
    ElMessage.warning('请左侧选择部门或者工作组！')
    return
  }
  formData.value = {
    name: currentData.value.name,
    teamName: currentData.value.team?.name,
    teamCode: currentData.value.team?.code,
    code: currentData.value?.code,
    teamRemark: currentData.value.team?.remark
  }
  dialogVisible.value = true
}

const visible = ref(false)
// 权限管理
const handleAuthority = ()=> {
  visible.value = true
}

// 保存
const update = async () => {
  const val = await current.value?.update({acatar: '', ...formData.value})
  dialogVisible.value = false
  ElMessage.success('信息修改成功!')
  selectItem.value.data = val
}
// 跳转至角色管理页面
const toAuth = () => {
  router.push({
    path: '/relation/authority',
    query: {
      title: '单位',
      belongId: selectItem.value.id,
      name: selectItem.value.label,
      code: selectItem.value.data.code,
      teamRemark: selectItem.value.data.teamRemark
    }
  })
}
// 跳转至岗位管理页面
const toIdentity = () => {
  router.push({
    path: '/relation/identity',
    query: {
      belongId: selectItem.value.id,
      name: selectItem.value.label,
      module: 'company',
      persons: 'getPersons',
    }
  })
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
  padding: 30px 20px;
  padding-top: 2px;
  box-sizing: border-box;
}

.text-remark {
  max-height: 60px;
  overflow-y: auto;
}
</style>
