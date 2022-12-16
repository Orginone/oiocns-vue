<template>
  <div class="info">
    <div class="header">
      <div class="title">节点信息</div>
      <div class="box-btns">
        <el-button small link type="primary"  @click="handleUpdate">编辑</el-button>
        <el-button small link type="primary"  @click="handleDelete">删除</el-button>
      </div>
    </div>
    <div class="tab-list">
      <el-descriptions :column="2" border>
        <el-descriptions-item width="150px" :label="'集团名称'" label-align="center" align="center"
          label-class-name="my-label" class-name="my-content">{{selectItem?.target?.team?.name}}</el-descriptions-item>
        <el-descriptions-item width="150px" :label="'集团编码'" label-align="center" align="center"
          label-class-name="my-label" class-name="my-content">{{selectItem?.target?.code}}</el-descriptions-item>
        <el-descriptions-item :label="'我的岗位'" label-align="center" align="center" width="150px"
          label-class-name="my-label" class-name="my-content">{{authority.GetTargetIdentitys(selectItem?.target?.id)}}</el-descriptions-item>
        <el-descriptions-item :label="'团队编码'" label-align="center" align="center" width="150px"
          label-class-name="my-label" class-name="my-content">{{selectItem?.target?.team?.code}}</el-descriptions-item>
        <el-descriptions-item :label="'创建人'" label-align="center" align="center" width="150px"
          label-class-name="my-label" class-name="my-content">{{chat.getName(selectItem?.target?.createUser)}}</el-descriptions-item>
        <el-descriptions-item :label="'创建时间'" label-align="center" align="center" width="150px"
          label-class-name="my-label" class-name="my-content">{{selectItem?.target?.createTime}}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2" label-align="center" align="center">
          <div class="text-remark">
            {{selectItem?.target?.team?.remark}}
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>

  <CreateTeamModal 
    :title="activeModal"
    v-model:visible="visible"
    :current="current"
    :typeNames="['集团']"
    @handleOk="handleOk"
  />
</template>
<script lang="ts" setup>
import $services from '@/services'
import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router';
import {chat} from '@/module/chat/orgchat';
import authority from '@/utils/authority'
import GroupServices from '@/module/relation/group'
import CreateTeamModal from '../GlobalComps/createTeam.vue';
const groupServices = new GroupServices()
const emit = defineEmits(['refresh'])

const activeModal = ref('')
const createOrEdit = ref()
const current = ref()
const visible = ref(false)
const handleOk = (newItem) => {
  console.log('newItem: ', newItem);
  if(newItem) {
    ElMessage.success('编辑成功!')
    visible.value = false
    emit('refresh')
  }
}

let selectItem = ref<any>({})
let formData: any = ref({})

// 获取单位树点击的信息
const selectItemChange = (data: any) => {
  selectItem.value = data?.item;
};
defineExpose({ selectItemChange });


watch(selectItem, () => {
});

const allowEdit = () => {
  if(selectItem.value && selectItem.value.id){
    return authority.IsRelationAdmin([
      selectItem.value.id,
      selectItem.value?.belongId
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
  const data =  await selectItem.value.delete()
  if(data){
    ElMessage({
      message: '删除成功',
      type: 'success'
    })
    emit('refresh')
  }
}

// 修改信息
const handleUpdate = () => {
  if (!selectItem.value?.target?.id) {
    ElMessage.warning('请左侧选择集团！')
    return
  }
  activeModal.value = '编辑'
  visible.value = true
  current.value = selectItem.value
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
