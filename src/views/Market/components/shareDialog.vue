<template>
  <div class="shareComp-wrap">
    <el-card class="app-info">
      <el-descriptions title="当前应用">
        <el-descriptions-item label="应用名称">{{ info.name }}</el-descriptions-item>
        <el-descriptions-item label="应用类型">
          <el-tag size="small">{{ info.typeName }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="当前权限">{{ info.authority }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ info.updateTime }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card class="share-box">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="按集团共享" name="first">
          <TheTreeBox
            type="group"
            :isLazy="true"
            @getLeftData="getGroupTree"
            @getLoadNode="getLoadNode"
            @handleLeftClick="handleLeftClick"
          ></TheTreeBox>
        </el-tab-pane>
        <!-- <el-tab-pane label="按角色共享" name="second"></el-tab-pane> -->
      </el-tabs>
    </el-card>
    <div class="footer">
      <el-button type="primary" @click="submit">确认</el-button
      ><el-button style="margin-right: 10px" @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import API from '@/services'
  import { ref, onMounted, reactive } from 'vue'
  import TheTreeBox from './treeBox.vue'
  import { useUserStore } from '@/store/user'
  import { ElMessage } from 'element-plus'
  import type { TabsPaneContext } from 'element-plus'
  const store = useUserStore()
  type PropType = {
    info: ProductType
  }
  const treeOptions = {
    label: 'label',
    children: 'children'
  }
  interface Tree {
    name: string
  }
  const handleCheckChange = (data: Tree, checked: boolean, indeterminate: boolean) => {
    console.log(data, checked, indeterminate)
  }
  const emit = defineEmits(['closeDialog'])
  const props = defineProps<PropType>()
  const tree = ref(null)
  const { info } = props
  const activeName = ref('first')
  onMounted(() => {
    // getAuthorityData()
  })

  // 获取根集团列表树
  const getGroupTree = (callback: any) => {
    API.company
      .companyGetGroups({
        data: {
          offset: 0,
          limit: 1000
        }
      })
      .then((res: ResultType) => {
        if (res.data.result && res.data.result.length > 0) {
          callback(res.data.result)
        } else {
          callback([])
        }
      })
  }
  // 懒加载获取下级节点
  const getLoadNode = (id: string, callback: any) => {
    API.company
      .getSubgroups({
        data: { id: id, offset: 0, limit: 1000 }
      })
      .then((res: ResultType) => {
        if (res.success) {
          callback(res.data.result ? res.data.result : [])
        }
      })
  }
  // 点击左侧树形方法
  const handleLeftClick = (data: any, callback: any) => {
    if (data.level == 0) {
      API.company
        .getGroupCompanies({
          data: {
            id: data.id,
            offset: 0,
            limit: 10000,
            filter: ''
          }
        })
        .then((res: ResultType) => {
          if (res.success) {
            callback(res.data.result ? res.data.result : [])
          }
        })
    } else {
      API.company
        .getSubgroupCompanies({
          data: {
            id: data.id,
            offset: 0,
            limit: 10000,
            filter: ''
          }
        })
        .then((res: ResultType) => {
          if (res.success) {
            callback(res.data.result ? res.data.result : [])
          }
        })
    }
  }
  const submit = () => {
    console.log()

    // API.company
    //   .getGroupTree({
    //     data: {
    //       productId: props.info.id,
    //       teamId: tree.value.getCheckedKeys(),
    //       targetId: store.workspaceData.id
    //     }
    //   })
    //   .then((res: any) => {
    //     if (res.success) {
    //       ElMessage({
    //         type: 'success',
    //         message: '共享成功'
    //       })
    //       closeDialog()
    //     }
    //   })
  }
  const closeDialog = () => {
    emit('closeDialog')
  }
  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }
</script>

<style lang="scss" scoped>
  :deep(.el-tabs) {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  :deep(.el-tabs__content) {
    flex: 1;
  }
  :deep(.el-tab-pane) {
    height: 100%;
  }
  .footer {
    display: flex;
    margin-top: 10px;
    flex-direction: row-reverse;
  }
  .share-box > :deep(.el-card__body) {
    overflow: auto;
    height: 400px;
  }
  .shareComp-wrap {
    height: 600px;
  }
</style>
