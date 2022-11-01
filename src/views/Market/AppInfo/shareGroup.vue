<template>
  <div>
    <div style="width: 100%; display: flex; justify-content: space-between">
      <el-select
        v-model="selectedValue"
        @change="changeGroupIndex"
        value-key="id"
        placeholder="请选择集团"
      >
        <el-option
          v-for="item in state.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
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
          <div class="cell-item"> 集团共享记录 </div>
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
          <div class="cell-item"> 单位共享记录 </div>
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
        @closeDialog="closeDialog"
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
  import { Application } from '@/module/store/app'
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
    // groupId: string
  }
  const props = defineProps<createInfo>()
  const application = new Application(props.info.id, 2)
  onMounted(() => {
    nextTick(() => {
      getGroupList()
      getHistoryData()
    })
  })
  const handleTabsClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab.index)
    if (tab.index == '1') {
      getGroupList()
    }
  }
  const closeDialog = () => {
    shareVisible.value = false
    getHistoryData()
  }
  const editDialog = () => {
    shareVisible.value = true
  }
  // 切换集团
  const changeGroupIndex = (id: string) => {
    getHistoryData()
  }
  // 查询历史记录
  const getHistoryData = async () => {
    let promise1 = application.getAllHistoryData(2, '产品', '组织')
    let promise2 = application.getAllHistoryData(2, '产品', '角色')
    let promise3 = application.getAllHistoryData(2, '产品', '岗位')
    let promise4 = application.getAllHistoryData(2, '产品', '人员')
    Promise.all([promise1, promise2, promise3, promise4]).then((res) => {
      state.groupShare = res[0]
      state.roleShare = res[1]
      state.jobsShare = res[2]
      state.personShare = res[3]
    })
  }
  // 查询集团列表
  const getGroupList = async () => {
    groups = await application.searchResource()
    state.options = groups.map((g) => {
      return { value: g.id, label: g.name }
    })
    selectedValue.value = groups[0].id
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
