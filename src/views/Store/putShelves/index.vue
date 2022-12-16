<template>
  <div class="content">
    <detailBox></detailBox>
    <el-form
      ref="formRef"
      :model="formLabelAlign"
      :rules="rules"
      label-position="right"
      label-width="130px"
      class="publishComp-wrap"
      style="max-width: 500px"
    >
      <el-form-item label="上架平台" prop="marketId">
        <el-select
          v-model="formLabelAlign.marketId"
          placeholder="请设置上架平台"
          style="width: 100%"
        >
          <el-option
            :value="item.market.id"
            :label="`${item.market.name}(${item.market.code})`"
            v-for="item in marketList"
            :key="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用名称:" name="name">
        <el-input readonly v-model="(route.query.name as string)" />
      </el-form-item>
      <el-form-item label="应用类型:">
        <el-input readonly v-model="(route.query.typeName as string)" />
      </el-form-item>
      <el-form-item label="应用权限:" prop="sellAuth">
        <el-radio-group v-model.number="formLabelAlign.sellAuth">
          <el-radio label="使用权" />
          <el-radio label="所属权" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="使用费用:" prop="price">
        <el-input v-model.number="formLabelAlign.price" type="number" placeholder="请输入使用费用">
          <template #append>元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="使用周期:" prop="days">
        <el-input v-model.number="formLabelAlign.days" type="number" placeholder="请输入使用周期">
          <template #append>天</template>
        </el-input>
      </el-form-item>
      <!-- <el-form-item label="应用说明" prop="caption">
        <el-input :rows="3" type="textarea" v-model="formLabelAlign.caption" />
      </el-form-item> -->
  
      <el-form-item label="应用信息:" prop="information">
        <el-input :rows="3" type="textarea" v-model="formLabelAlign.information" />
      </el-form-item>
    </el-form>
    <div class="putaway-footer" style="text-align: left">
        <el-button type="primary" @click="onPutawaySubmit()"> 确认</el-button>
    </div>
  </div>
</template>
  <script lang="ts" setup>
    import API from '@/services'
    import { ElMessage, FormInstance, FormRules } from 'element-plus'
    import { onMounted, reactive, ref } from 'vue'
    import detailBox from './../components/detailBox.vue'
    import { useRoute ,useRouter} from 'vue-router'
    import marketCtrl from '@/ts/controller/store/marketCtrl';

    const route = useRoute()
    const router = useRouter()
    const formRef = ref<FormInstance>()
    const formLabelAlign = reactive({ 
      caption: route.query.name,
      price: undefined,
      sellAuth: '使用权',
      marketId: route.query.id,
      information: '',
      days: ''
    })
    const productItem = ref<any>();
    // 获取我的应用列表
    const getProductList = () => {
      marketCtrl.Market.getOwnProducts(false).then((res:any)=>{
        let arr:any = []
        res.forEach((element:any) => {
          if(element.prod.id == route.query.id){
            productItem.value = element
          }
        });
      })
    };
    const marketList = ref([])  
    onMounted(() => {
      // 获取市场列表
      getMarketOptions()
      getProductList();
    })
    // 获取市场列表
    const getMarketOptions = async (queryStr?: string) => {
      marketList.value = marketCtrl.Market.joinedMarkets
      console.log('marketList',marketList.value)
    }

    // 提交上架
    const onPutawaySubmit = async () => {
      console.log('formRef.value',formRef.value)
      // formRef.value.validate(async (valid, fields) => {
      //   if (valid) {
        const res = await productItem.value.publish(formLabelAlign)
        if(res){
          ElMessage({message: "发布成功",type: 'success'})
          router.go(-1)
        }
          resetForm()
        // } else {
        //   console.log('上架error submit!', fields)
        // }
      // })
    }
  
    const emit = defineEmits(['closeDialog'])
    // 重置注册表单
    const resetForm = () => {
      if (!formRef.value) return
      formRef.value.resetFields()
      emit('closeDialog')
    }
    const rules = reactive<FormRules>({
      price: [{ required: false, message: '请输入使用费用', trigger: 'blur' }],
      marketId: [
        {
          required: true,
          message: '请选择需要发布的市场',
          trigger: 'blur'
        }
      ],
      day: [
        {
          required: true,
          message: '请输入使用周期',
          trigger: 'blur'
        }
      ]
    })
  </script>
  
  <style lang="scss" scoped>
    .content{
        background: #fff;
        height: calc(100vh - 100px);
        padding: 20px 0;
        margin-top: 3px;
        overflow-y: auto;
    }
    .putaway-footer{
        padding-left: 40px;
    }
  </style>
  