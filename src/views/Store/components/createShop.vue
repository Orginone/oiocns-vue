<template>
  <el-dialog class="create-shop-box" top="3vh" :show-close="false" append-to-body v-model="props.createDialog" title="新建商店" width="550px"  @close="closeDialog(false)">
    <el-form ref="formRef"  label-position="top" class="from-box" :model="form">
      <div class="from-content">
          <div class="from-left">
              <div class="from-title">商店基本信息</div>
              <el-form-item label="商店名称" prop="name" :rules="[
                  { required: true, message: '请输入商店名称' },
                  { min: 3, message: '商店名称至少有3个字', trigger: 'blur' },
                  ]">
                  <el-input v-model.number="form.name" type="text" autocomplete="off" />
              </el-form-item>             
              <el-form-item label="商店编码" prop="code" :rules="[
                  { required: true, message: '请输入商店编码，以便其他查询' },
                  ]">
                  <el-input v-model.number="form.code" type="text" autocomplete="off" />
              </el-form-item>
              <el-form-item label="商店是否公开" prop="public">
                  <el-switch v-model="form.public" active-text="是" inactive-text="否" inline-prompt></el-switch>
              </el-form-item>
          </div>
          <!-- <div class="from-right">
              <div class="head-img">头像</div>
              <div class="head-text">商店封面</div>
          </div> -->
      </div>
      <el-form-item label="商店简介" prop="remark" :rules="[
        { required: true, message: '请输入商店简介' },
      ]">
        <el-input v-model="form.remark" type="textarea" maxlength="120" show-word-limit
          :autosize="{ minRows: 4, maxRows: 6 }" autocomplete="off" />
      </el-form-item>
   
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button link @click="closeDialog(false)" style="color:#1549D8">取消</el-button>
        <el-button type="primary" @click="createShop(formRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>    
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick ,getCurrentInstance} from "vue";
import type { FormInstance } from 'element-plus'
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import {marketCtrl} from '@/ts/coreIndex';

const instance = getCurrentInstance();

const props = defineProps({
  createDialog: {
    type:Boolean
  }
})
const store = useUserStore()
const { workspaceData } = storeToRefs(store)
interface fromType {
  name:string,
  code:string,
  remark:string,
  public:boolean,
}
const formRef = ref<FormInstance>()
const form = reactive<fromType>({
  name:'',
  code:'',
  remark:'',
  public:true,
});
const emit = defineEmits([
  'closeDialog'
])

const closeDialog = (type:boolean)=>{
  emit('closeDialog', type)
}
const createShop = async (formEl: FormInstance | undefined) =>{
  if (!formEl) return
  const isValidate = await formEl.validate((valid, fields) => {
      if (valid) {
      console.log('submit!')
      } else {
      console.log('error submit!', fields)
      return false
      }
  })
  if (!isValidate) return
  
  const market = await marketCtrl.target.createMarket({
      name: form.name,
      code: form.code,
      samrId: store.queryInfo.id,
      remark: form.remark,
      ispublic: form.public
  });
  closeDialog(false)
  instance?.proxy?.$Bus.emit('clickBus',1050)
}

onMounted(() => {
  remoteMethod();
});

const remoteMethod = () => {};

</script>
<style lang="scss">
  .create-shop-box{
      .el-dialog__header{
          background: #fff;
      }
  }
</style>
<style lang="scss" scoped>
  .from-box{
      border: 1px solid #eee;
      padding: 20px 30px;
      border-radius: 4px;
      .from-content{
          display: flex;
          justify-content: space-between;
          .from-title{
            font-size: 14px;
            font-weight: bold;
            position: relative;
            margin-left: 14px;
            margin-bottom: 15px;
          }
          .from-title::after{
            content:'';
            width:3px;
            height:15px;
            background: #1549D8;
            position: absolute;
            left:-14px;
            top: 3px;
          }
          .from-left{
              flex: 1;
          }
          .from-right{
              margin-left: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
              .head-img{
                  width: 122px;
                  height: 122px;
                  border-radius: 50%;
                  text-align: center;
                  line-height: 122px;
                  color: #fff;
                  background: #1549D8;
              }
              .head-text{
                  text-align: center;
                  margin-top: 10px;
              }
          }
      }
  }
</style>
