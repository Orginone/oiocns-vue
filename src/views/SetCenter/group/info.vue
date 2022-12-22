<template>
  <div class="info">
    <div class="header">
      <div class="title">节点信息</div>
      <div class="box-btns">
        <el-button small link type="primary"  @click="handleAuthority">权限管理</el-button>
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
          label-class-name="my-label" class-name="my-content">{{selectItem?.target?.createUser}}</el-descriptions-item>
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
  <authorityModal
    v-model:visible="authorityVisible"
  />
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import authority from '@/utils/authority'
import authorityModal from '../department/components/authorityModal.vue';
import CreateTeamModal from '../GlobalComps/createTeam.vue';
const emit = defineEmits(['refresh'])

const authorityVisible = ref(false)
// 权限管理
const handleAuthority = ()=> {
  authorityVisible.value = true
}

const activeModal = ref('')
const current = ref()
const visible = ref(false)
const handleOk = (newItem: any) => {
  if(newItem) {
    ElMessage.success('编辑成功!')
    visible.value = false
    emit('refresh')
  }
}

let selectItem = ref<any>({})

// 获取单位树点击的信息
const selectItemChange = (data: any) => {
  console.log('data: ', data);
  selectItem.value = data?.item;
};
defineExpose({ selectItemChange });


watch(selectItem, () => {
});

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
