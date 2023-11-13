<script setup lang="ts">
import { XTarget } from '@/ts/base/schema'
import { IBelong, TargetType } from '@/ts/core'
import SearchTarget from '@/components/Common/SearchTarget/index.vue';
import { schema } from '@/ts/base';

const props = defineProps<{
  cmd: string;
  current: IBelong;
  finished: () => void;
}>()

const isShowDialog = ref(true)

const selectMembers = ref<XTarget[]>(null) // 选中的要拉的人
let modalTitle = ''
let selectTargetType: TargetType = TargetType.Person
// 设置标题
switch (props.cmd) {
  case 'joinFriend':
    modalTitle = '申请加好友';
    break;
  case 'joinCohort':
    modalTitle = '申请加入群组';
    selectTargetType = TargetType.Cohort;
    break;
  case 'joinStorage':
    modalTitle = '申请加入存储资源群';
    selectTargetType = TargetType.Storage;
    break;
  case 'joinCompany':
    modalTitle = '申请加入单位';
    selectTargetType = TargetType.Company;
    break;
  case 'joinGroup':
    modalTitle = '申请加入集团';
    selectTargetType = TargetType.Group;
    break;
}
// 确认按钮点击
const onOk= async () => {
  if (await props.current.applyJoin(selectMembers.value)) {
    props.finished()
    isShowDialog.value = false
  }
}
</script>

<template>
<ElDialog
  custom-class="my-dialog"
  destroyOnClose
  :title="modalTitle"
  v-model="isShowDialog"
  @close="finished"
  width='670px'
>
 
  <!-- 搜索 -->
  <SearchTarget
    :searchCallback="(persons: schema.XTarget[]) => selectMembers = persons"
    :searchType="selectTargetType"
  />
  <!-- 对话框底部 -->
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="isShowDialog = false" >取消</el-button>
      <el-button type="primary" @click="onOk" :disabled="!selectMembers">确定</el-button>
    </span>
  </template>
</ElDialog>
</template>

<style lang="scss" scoped>
:global(.el-dialog) {
  border-radius: 4px !important;
}
:global(.el-dialog__header) {
  border-radius: 4px  4px 0 0 !important;
}
</style>

<style>
.el-dialog {
  .el-dialog__header {
    .el-dialog__title {
      color: rgba(0,0,0,.85);
      font-weight: 500;
      font-size: 16px;
      line-height: 22px;
      word-wrap: break-word;
      font-family: PingFang SC;
    }
  }
  .el-dialog__body {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    margin: 8px 24px;
    max-height: 684px;
    overflow-y: auto;
    padding: 24px;
    font-size: 14px;
    line-height: 1.5715;
    word-wrap: break-word;
    font-family: PingFang SC;
    box-sizing: border-box;
  }
}
</style>


