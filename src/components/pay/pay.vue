<template>
  <el-dialog v-model="showpay" width="15%" @close="close">
    <el-header
      >¥<h2>{{ order.price }}</h2></el-header
    >
    <h4>
      <el-row >
        <el-col :span="12">订单金额</el-col>
        <el-col :span="12">{{ order.price }}</el-col>
      </el-row>
       <el-row />
      <el-row style="color: red">
        <el-col :span="12">优惠</el-col>
        <el-col :span="12">0</el-col>
      </el-row>
       <el-row />
      <el-row>
        <el-col :span="12">订单信息</el-col>
        <el-col :span="12">{{ order.merchandise.caption }}</el-col>
      </el-row>
       <el-row />
      <el-row>
        <el-col :span="12">付款方式</el-col>
        <el-col :span="12"></el-col>
      </el-row>
      <el-row />
      <el-row />
      <el-row />
       <el-row />
    </h4>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="pay(order.id, order.price, 'alipay')" style="width: 100%"
          >立即付款</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import $services from '@/services'
import { ref, reactive, onMounted, watch, toRefs } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'

const showpay = ref<boolean>(true)
const emit = defineEmits(['close'])
const close = () => {
  showpay.value = false
  emit('close', {})
}
//支付
const pay = async (id: string, price: number, paymentType: string) => {
  await $services.order
    .createPay({
      data: {
        orderId: parseInt(id),
        price: price || 0,
        paymentType: paymentType
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        // getTableList(searchType.value)
        ElMessage({
          message: '支付成功',
          type: 'warning'
        })
      } else {
        ElMessage({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  close()
}
type Props = {
  order: Object
}
const props = withDefaults(defineProps<Props>(), {
  order: Object
})
const { order } = toRefs(props)
</script>

<style lang="scss" scoped>

</style>
