<template>
  <div>
    <div style="width: 100%; display: flex; flex-direction: row-reverse">
      <el-button
        v-if="props.form.createUser == store.queryInfo.id"
        small
        link
        type="primary"
        @click="editDialog"
        >编辑</el-button
      >
    </div>

    <el-descriptions style="margin-top: 10px" class="margin-top" :column="1" border>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 群共享记录 </div>
        </template>
        <template v-if="state.groupShare.length > 0">
          <div style="margin-right: 10px" v-for="item in state.groupShare" :key="item.id"
            ><el-tag>{{ item.name }}</el-tag></div
          >
        </template>
        <template v-else>
          <div>-</div>
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 角色共享记录 </div>
        </template>
        <template v-if="state.roleShare.length > 0">
          <div style="margin-right: 10px" v-for="item in state.roleShare" :key="item.id"
            ><el-tag>{{ item.name }}</el-tag></div
          >
        </template>
        <template v-else>
          <div>-</div>
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 岗位共享记录 </div>
        </template>
        <template v-if="state.jobsShare.length > 0">
          <div style="margin-right: 10px" v-for="item in state.jobsShare" :key="item.id"
            ><el-tag>{{ item.name }}</el-tag></div
          >
        </template>
        <template v-else>
          <div>-</div>
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 好友共享记录 </div>
        </template>
        <template v-if="state.personShare.length > 0">
          <div style="margin-right: 10px" v-for="item in state.personShare" :key="item.id"
            ><el-tag>{{ item.name }}</el-tag></div
          >
        </template>
        <template v-else>
          <div>-</div>
        </template>
      </el-descriptions-item>
    </el-descriptions>
    <el-dialog
      v-if="shareVisible"
      v-model="shareVisible"
      custom-class="share-dialog"
      title="应用共享"
      width="1000px"
      draggable
      :close-on-click-modal="false"
    >
      <ShareCohort
        v-if="store.workspaceData.type == 2"
        @closeDialog="shareVisible = false"
        :info="props.info"
      ></ShareCohort>
      <SharePersonBox
        v-else
        @closeDialog="shareVisible = false"
        :info="props.info"
      ></SharePersonBox>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref, nextTick } from 'vue'
  import API from '@/services'
  import type { TabsPaneContext } from 'element-plus'
  import { useUserStore } from '@/store/user'
  import ShareCohort from '../components/shareCohortBox.vue'
  import SharePersonBox from '../components/sharePersonBox.vue'
  const store = useUserStore()
  // 当前选中的集团
  let selectedValue = ref<string>()
  // 当前用户的集团
  let groups = reactive([])
  const shareVisible = ref<boolean>(false)
  const state = reactive({
    options: [],
    groupShare: [],
    roleShare: [],
    jobsShare: [],
    personShare: []
  })
  type createInfo = {
    info: {
      id: string
    }
    form: {
      id: string
      code: string
      name: string
      remark: string
      privateKey: string
      createUser: string
    }
  }
  const props = defineProps<createInfo>()
  onMounted(() => {
    nextTick(() => {
      getHistoryData()
    })
  })
  const editDialog = () => {
    shareVisible.value = true
  }
  // 查询历史记录
  const getHistoryData = () => {
    API.product
      .extendQuery({
        data: {
          sourceId: props.info.id,
          sourceType: '产品',
          destType: '组织'
        }
      })
      .then((res: ResultType) => {
        let { result = [] } = res.data
        result.forEach((el: any) => {
          if (el.id == store.queryInfo.id) {
            el.name = '我的好友'
          }
        })
        state.groupShare = result
      })
    API.product
      .extendQuery({
        data: {
          sourceId: props.info.id,
          sourceType: '产品',
          destType: '角色'
        }
      })
      .then((res: ResultType) => {
        let { result = [] } = res.data
        state.roleShare = result
      })
    API.product
      .extendQuery({
        data: {
          sourceId: props.info.id,
          sourceType: '产品',
          destType: '岗位'
        }
      })
      .then((res: ResultType) => {
        let { result = [] } = res.data
        state.jobsShare = result
      })
    API.product
      .extendQuery({
        data: {
          sourceId: props.info.id,
          sourceType: '产品',
          destType: '人员'
        }
      })
      .then((res: ResultType) => {
        let { result = [] } = res.data
        state.personShare = result
      })
  }
</script>

<style lang="scss" scoped>
  :deep(.el-tag) {
    margin-bottom: 10px;
  }
  :deep(.el-descriptions__content) {
    flex-wrap: wrap;
  }
  :deep(.el-descriptions__label) {
    width: 210px;
  }
  :deep(.is-bordered-content) {
    display: flex;
  }
</style>
