<template>
  <div class="info">
    <div class="header">
      <div class="title">集团信息</div>
      <div class="box-btns">
        <el-button small link type="primary" v-if="allowEdit()" @click="handleUpdate">编辑</el-button>
        <el-button small link type="primary" v-if="allowEdit()" @click="handleDelete">删除</el-button>
        <el-button small link type="primary" v-if="allowEdit()" @click="toAuth">角色管理</el-button>
        <el-button small link type="primary" v-if="allowEdit()" @click="toIdentity">岗位管理</el-button>
      </div>
    </div>
    <div class="tab-list">
      <el-descriptions :column="2" border>
        <el-descriptions-item width="150px" :label="'集团名称'" label-align="center" align="center"
          label-class-name="my-label" class-name="my-content">{{selectItem?.data?.team.name}}</el-descriptions-item>
        <el-descriptions-item width="150px" :label="'集团编码'" label-align="center" align="center"
          label-class-name="my-label" class-name="my-content">{{selectItem?.data?.code}}</el-descriptions-item>
        <el-descriptions-item :label="'我的岗位'" label-align="center" align="center" width="150px"
          label-class-name="my-label" class-name="my-content">{{authority.GetTargetIdentitys(selectItem?.data?.id)}}</el-descriptions-item>
        <el-descriptions-item :label="'团队编码'" label-align="center" align="center" width="150px"
          label-class-name="my-label" class-name="my-content">{{selectItem?.data?.team.code}}</el-descriptions-item>
        <el-descriptions-item :label="'创建人'" label-align="center" align="center" width="150px"
          label-class-name="my-label" class-name="my-content">{{chat.getName(selectItem?.data?.createUser)}}</el-descriptions-item>
        <el-descriptions-item :label="'创建时间'" label-align="center" align="center" width="150px"
          label-class-name="my-label" class-name="my-content">{{selectItem?.data?.createTime}}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2" label-align="center" align="center">
          <div class="text-remark">
            {{selectItem?.data?.team.remark}}
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" :title="'请编辑集团信息'" width="50%">
    <el-form-item :label="'集团名称'">
      <el-input v-model="formData.teamName" :placeholder="'请输入集团名称'" clearable />
    </el-form-item>
    <el-form-item :label="'集团编号'">
      <el-input v-model="formData.code" :placeholder="'请输入集团简介'" clearable />
    </el-form-item>

    <el-form-item :label="'集团简介'">
      <el-input v-model="formData.teamRemark" :placeholder="'请输入集团简介'" :autosize="{ minRows: 5 }" type="textarea"
        clearable />
    </el-form-item>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="update">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import $services from '@/services'
import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router';
import {chat} from '@/module/chat/orgchat';
import authority from '@/utils/authority'
import GroupServices from '@/module/relation/group'
const groupServices = new GroupServices()
const emit = defineEmits(['refresh'])

let selectItem = ref<any>({})
let dialogVisible = ref<boolean>(false)
let formData: any = ref({})

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
      selectItem.value.id,
      selectItem.value.data.belongId
    ])
  }
  return false
}
// 删除集团信息
const handleDelete = async () => {
  if (!selectItem.value.id) {
    ElMessage.warning('请左侧选择集团')
    return
  }
  let selectObj = {
    name:selectItem.value.data.name,
    id:selectItem.value.id,
    typeName:selectItem.value.data.typeName
  }
  const data =  await groupServices.deleteGroup(selectObj)
  if(data){
    ElMessage({
      message: '操作成功',
      type: 'success'
    })
    emit('refresh')
  }
}

// 修改信息
const handleUpdate = () => {
  if (!selectItem.value.id) {
    ElMessage.warning('请左侧选择部门或者工作组！')
    return
  }
  formData.value = selectItem.value.data
  dialogVisible.value = true
}

// 保存
const update = async () => {
  const data = { ...formData.value, ...selectItem.value.data };
  const val =  await groupServices.upDateGroup(data)
  dialogVisible.value = false
  ElMessage.success('信息修改成功!')
  selectItem.value.data = val
}

// 跳转至角色管理页面
const toAuth = () => {
  if(selectItem.value?.id?.length > 0){
    router.push({
      path: '/relation/authority',
      query: {
        title: '集团',
        belongId: selectItem.value.id,
        name: selectItem.value.label,
        code: selectItem.value.data.code,
        teamRemark: selectItem.value.data.teamRemark
      }
    })
  }
}
// 跳转至岗位管理页面
const toIdentity = () => {
  if(selectItem.value?.id?.length > 0){
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

.text-remark {
  max-height: 60px;
  overflow-y: auto;
}
</style>
