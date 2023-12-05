<script setup lang='ts'>
import { XTarget } from '@/ts/base/schema';
import { IDirectory, ITarget, TargetType } from '@/ts/core'
import SearchTarget from '@/components/Common/SearchTarget/index.vue'
// import SelectMember from '@/components/Common/SelectMember'


const props = defineProps<{
  current: ITarget | IDirectory
  finished: () => void
}>()
const target = 'standard' in props.current ? props.current.target : props.current
const isShowDialog = ref(true)
const selectMembers = ref<XTarget[]>(null)
// 确认按钮点击
const onOk= async () => {
  console.log(target);
  
  if (await target.pullMembers(selectMembers.value)) {
    props.finished()
    isShowDialog.value = false
  }
}
</script>
<template>
  <ElDialog
    custom-class="my-dialog"
    destroyOnClose
    title="邀请成员"
    v-model="isShowDialog"
    @close="finished();isShowDialog = false"
    width='670px'
  >
  
    <!-- 搜索 -->
    <SearchTarget
      :searchCallback="(persons: XTarget[]) => selectMembers = persons"
      :searchType="TargetType.Person"
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

<style lang='scss' scoped>
.el-dialog.my-dialog{
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