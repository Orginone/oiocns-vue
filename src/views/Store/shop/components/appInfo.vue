<template>
    <el-dialog append-to-body v-model="infoDialog" title="应用详情" width="40%" >
      <el-descriptions class="margin-top" label-align="right" :column="2" border>
        <el-descriptions-item :span="2">
          <template #label>
            <div > 应用名称 </div>
          </template>
          {{ infoDetail.caption }}
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template #label>
            <div > 售卖价格 </div>
          </template>
          {{ infoDetail.price??'-' }} 元
        </el-descriptions-item>
        <el-descriptions-item :span="1">
          <template #label>
            <div > 售卖权属 </div>
          </template>
          {{ infoDetail.sellAuth??'-' }}
        </el-descriptions-item>
        <el-descriptions-item :span="1">
          <template #label>
            <div > 使用期限 </div>
          </template>
          {{ infoDetail.days??'-' }} 天
        </el-descriptions-item>
        <el-descriptions-item :span="1">
          <template #label>
            <div > 应用类型 </div>
          </template>
          {{infoDetail.product.typeName}}
        </el-descriptions-item>
        <el-descriptions-item :span="1">
          <template #label>
            <div > 归属 </div>
          </template>
          {{ chat.getName(infoDetail.product.belongId) }}
        </el-descriptions-item>
        <el-descriptions-item :span="1">
          <template #label>
            <div > 发起人 </div>
          </template>
          {{ chat.getName(infoDetail.createUser) }}
        </el-descriptions-item>
        <el-descriptions-item :span="1">
          <template #label>
            <div > 创建时间 </div>
          </template>
          {{ moment(infoDetail.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template #label>
            <div > 应用描述 </div>
          </template>
          {{ infoDetail.information || infoDetail.product.remark }}
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
      infoDialog:{
        type:Boolean
      },
      infoDetail: {
        type: Object
      }
    })
  
    const emit = defineEmits(['closeDialog'])
  
    const closeDialog = () => {
      emit('closeDialog', 'info')
    }
  </script>
  
  <style lang="scss" scoped>
  </style>
  