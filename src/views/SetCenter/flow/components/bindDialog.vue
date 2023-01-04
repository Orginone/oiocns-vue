<template>
  <div class="dialog-box">
    <el-form
      :model="state.formData"
      ref="formRef"
      label-width="90px"
      :liline="true"
    >
      <el-row :gutter="20" v-for="(item, index) in state.formData.config" :key="index">
        <el-col :span="10">
          <el-form-item label="应用名称" :prop="'config.' + index + '.productId'" :rules="rules.productId">
            <el-select v-model="state.formData.config[index].productId" clearable placeholder="请选择要绑定的应用">
              <el-option
                v-for="item in appList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="业务名称" :prop="'config.' + index + '.functionCode'" :rules="rules.functionCode">
            <el-input type="text" v-model="state.formData.config[index].functionCode" clearable autocomplete="off" maxlength="50">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="删除这个流程字段"
            placement="top"
          >
            <el-icon class="del-icon" size="16" @click.prevent="removeConfig(item)"><CircleClose /></el-icon>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-button class="add-btn" @click="addConfig" plain><el-icon size="14"><Plus /></el-icon>&nbsp;新增应用绑定</el-button>
    </el-form>
  </div>
  <div class="footer">
    <el-button type="primary" @click="submitForm">确认</el-button>
    <el-button class="footer-btn" plain @click="closeDialog">取消</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref,toRefs,reactive,onMounted } from 'vue'
import { FormRules } from 'element-plus'
import {userCtrl,appCtrl} from '@/ts/coreIndex'
import {ElMessage} from "element-plus";

const props = defineProps({
  bindAppMes: {
    type: Object
  }
})

const state = reactive({
  formData: {
    config: [{
      productId: '',
      functionCode: ''
    }]
  },
  appList:[],
  oldFormData:[],
})

onMounted(() => {
  initData()
})

const initData = async () => {
  const tableData = appCtrl.products;
  const currentData = tableData.map((item) => {
    return {
      value: item.prod.id,
      label: item.prod.name,
    };
  });
  state.appList = currentData
  const currentValue = await userCtrl.space.queryFlowRelation(false);
  if (currentValue && currentValue.length > 0) {
    const filterId = currentValue.filter((item) => {
      return item.defineId === props.bindAppMes?.id;
    });
    state.oldFormData = filterId
    state.formData.config = filterId
  }
};
//表单
const formRef = ref(null);

// 注册验证规则
const rules = reactive<FormRules>({
  productId: [{ required: true, message: '请选择要绑定的应用！', trigger: 'change' }],
  functionCode: [{ required: true, message: '请输入业务名称', trigger: 'blur'}]
})

const addConfig = () => { // 新增
  state.formData.config.push({
      productId: '',
      functionCode: ''
  })
}

const removeConfig = (item) => { // 删除
  const index = state.formData.config.indexOf(item)
  if (index !== -1) {
      state.formData.config.splice(index, 1)
  }
}

const submitForm = () => { // 点击确定按钮
    onAddSubmit()
}

// 提交注册
const onAddSubmit = async () => {
  if (!formRef) return
  formRef.value.validate(async (valid: any, fields: any) => {
    if (valid) {
      const config = state.formData.config;
      let newArr:any = []
      config.forEach((item:any)=>{
        if(!item.id){
          newArr.push(
            userCtrl.space.bindingFlowRelation({
              defineId: props.bindAppMes?.id,
              productId: item.productId,
              functionCode: item.functionCode,
              spaceId: userCtrl.space.id,
            }),
          );
        }else{
          /** 找到旧值 */
          const findData = state.oldFormData.find(
            (innItem: { id: string }) => innItem.id === item.id,
          );
          /** 新旧值对比 */
          if (
            findData &&
            (findData.defineId !== item.defineId ||
              findData.functionCode !== item.functionCode)
          ) {
            newArr.push(
              userCtrl.space.bindingFlowRelation({
                defineId: props.bindAppMes?.id,
                productId: findData.productId,
                functionCode: findData.functionCode,
                spaceId: userCtrl.space.id,
              }),
            );
          }
        }
        if (newArr && newArr.length > 0) {
          Promise.all(newArr)
            .then((result) => {
              if (result) {
                refresh()
                /** 在这里要通知兄弟组件刷新 */
                ElMessage({
                  type: 'success',
                  message: '绑定成功！'
                })
                initData();
                closeDialog()
              }else{
                ElMessage({
                  type: 'error',
                  message: '绑定失败！'
                })
              }
            })
            .catch((error) => {
      
            });
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 数据解构
const {
  formData,
  appList
} = {
  ...toRefs(state)
};

const emit = defineEmits(['closeDialog','refresh'])

const closeDialog = () => {
  emit('closeDialog')
}

const refresh = () => {
  emit('refresh')
}
</script>

<style lang="scss" scoped>
.dialog-box{
  width: 100%;
  padding: 20px;
  max-height: 664px;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  .del-icon{
    margin-top: 8px;
    color: #000;
  }
  .add-btn{
    width: 100%;
    position: relative;
    display: inline-block;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    background: transparent;
    border: 1px dashed #ebeef5;
    box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
    cursor: pointer;
    height: 32px;
    padding: 4px 15px;
    font-size: 14px;
    border-radius: 4px;
  }
}
.footer {
  margin-top: 20px;
  display: flex;
  flex-direction: row-reverse;
  .footer-btn {
    margin-right: 10px;
  }
}
</style>