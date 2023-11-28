<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="modalTitle"
      width="670"
      :before-close="handleClose"
    >
      <SearchTarget
        autoSelect
        @searchCallback="searchCallback()"
        :searchType="selectTargetType"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose()">取消</el-button>
          <el-button type="primary" @click="onOk()">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
  
<script lang="ts" setup>
import { XTarget } from '@/ts/base/schema';
import { IBelong, TargetType } from '@/ts/core';
import SearchTarget from '@/components/Common/SearchTarget/index.vue';
import { schema } from '@/ts/base';
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'

// 接收参数
const props = defineProps<{
  cmd: string;
  current: IBelong;
  finished: () => void;
}>()

let selectMembers = ref(<XTarget[]>([]))
let modalTitle = ref('');
let selectTargetType: TargetType = TargetType.Person;
const dialogVisible = ref(true)

const searchCallback = (persons: schema.XTarget[]) => {
  selectMembers.value = persons
}

const handleClose = (done: () => void) => {
  dialogVisible.value = false
  props.finished();
}

const onOk = async () => {
  if (await props.current.applyJoin(selectMembers.value)) {
    props.finished();
  }
}

onMounted(()=>{
  switch (props.cmd) {
    case 'joinFriend':
      modalTitle.value = '申请加好友';
      break;
    case 'joinCohort':
      modalTitle.value = '申请加入群组';
      selectTargetType = TargetType.Cohort;
      break;
    case 'joinStorage':
      modalTitle.value = '申请加入存储资源群';
      selectTargetType = TargetType.Storage;
      break;
    case 'joinCompany':
      modalTitle.value = '申请加入单位';
      selectTargetType = TargetType.Company;
      break;
    case 'joinGroup':
      modalTitle.value = '申请加入集团';
      selectTargetType = TargetType.Group;
      break;
    default:
      return;
  }
})
</script>

<script lang="ts">
export default {
  name: "JoinTarget",
}
</script>

<style scoped>

</style>
