<template>
  <el-dialog append-to-body v-model="dialogShow.value" title="应用详情" width="40%" >
    <el-descriptions class="margin-top" label-align="right" :column="2" border>
      <el-descriptions-item :span="2">
        <template #label>
          <div > 应用名称 </div>
        </template>
        {{ dialogShow.sendData.caption }}
      </el-descriptions-item>
      <el-descriptions-item :span="2">
        <template #label>
          <div > 售卖价格 </div>
        </template>
        {{ dialogShow.sendData.price??'-' }} 元
      </el-descriptions-item>
      <el-descriptions-item :span="1">
        <template #label>
          <div > 售卖权属 </div>
        </template>
        {{ dialogShow.sendData.sellAuth??'-' }}
      </el-descriptions-item>
      <el-descriptions-item :span="1">
        <template #label>
          <div > 使用期限 </div>
        </template>
        {{ dialogShow.sendData.days??'-' }} 天
      </el-descriptions-item>
      <el-descriptions-item :span="1">
        <template #label>
          <div > 应用类型 </div>
        </template>
        {{dialogShow.sendData.product.typeName}}
      </el-descriptions-item>
      <el-descriptions-item :span="1">
        <template #label>
          <div > 归属 </div>
        </template>
        {{ chat.getName(dialogShow.sendData.product.belongId) }}
      </el-descriptions-item>
      <el-descriptions-item :span="1">
        <template #label>
          <div > 发起人 </div>
        </template>
        {{ chat.getName(dialogShow.sendData.createUser) }}
      </el-descriptions-item>
      <el-descriptions-item :span="1">
        <template #label>
          <div > 创建时间 </div>
        </template>
        {{ moment(dialogShow.sendData.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </el-descriptions-item>
      <el-descriptions-item :span="2">
        <template #label>
          <div > 应用描述 </div>
        </template>
        {{ dialogShow.sendData.information || dialogShow.sendData.product.remark }}
      </el-descriptions-item>
      
      </el-descriptions>

    

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue'
  import $services from '@/services'
  import { ElMessage } from 'element-plus'
  import moment from 'moment'
  import {chat} from '@/module/chat/orgchat'

  const props = defineProps({
    dialogShow: {
      type: Object
    }
  })

  const emit = defineEmits(['closeDialog'])

  const closeDialog = () => {
    emit('closeDialog', 'info')
  }
</script>

<style lang="scss" scoped>
  // :deep(.el-descriptions__content) {
  //   display: -webkit-box;
  //   -webkit-box-orient: vertical; /*设置方向*/
  //   -webkit-line-clamp: 3; /*设置超过为省略号的行数*/
  //   overflow: hidden;
  // }
</style>
