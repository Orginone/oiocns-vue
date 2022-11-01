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
        <el-tab-pane label="按集团共享" name="first"></el-tab-pane>
        <!-- <el-tab-pane label="按角色共享" name="second"></el-tab-pane> -->
      </el-tabs>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import type { TabsPaneContext } from 'element-plus'
  type PropType = {
    info: ProductType
  }
  const props = defineProps<PropType>()
  const { info } = props
  console.log('展示数据', props.info)

  const activeName = ref('first')

  onMounted(() => {
    // getAuthorityData()
  })

  // const getAuthorityData = () => {
  //   $services.company.getAuthorityTree({ data: { id: belongId.value } }).then((res: any) => {})
  // }

  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }
</script>

<style lang="scss" scoped>
  .shareComp-wrap {
  }
</style>
