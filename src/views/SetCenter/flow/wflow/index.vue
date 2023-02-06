<template>
  <div class="wflow-box">
    <div class="header-box">
      <div class="main-box">
        <div class="back-box">
          <el-button size="default" @click="exit"><el-icon><Back /></el-icon>退出</el-button>
        </div>
        <div class="steps-box">
          <div class="steps-box-items" v-for="(item,index) in stepsArr" :key="index">
            <div class="circle" :style="active==index?'border-color:#154AD8;color:#fff;background:#154AD8':''">{{index+1}}</div>
            <span :style="active==index?'color:#154AD8':''">{{item.title}}</span>
            <div class="line" :style="active==index?'background:#154AD8':''" v-if="index<1"></div>
          </div>
        </div>
        <!-- <div></div> -->
        <div class="publish" v-if="active == 1">
          <el-button size="small" type="primary" @click="publish">
            <el-icon>
              <Promotion />
            </el-icon>发布
          </el-button>
          <span class="scale">
            <el-button size="small" @click="changeScale(state.scale -10)" :disabled="scale <= 40">
              <el-icon>
                <Minus />
              </el-icon>
            </el-button>
            <span>{{ state.scale }}%</span>
            <el-button size="small" @click="changeScale(state.scale +10)" :disabled="scale >= 150">
              <el-icon>
                <Plus />
              </el-icon>
            </el-button>
          </span>
        </div>
      </div>
    </div>
    <div class="form-box" v-if="active == 0">
      <el-form
        :model="workFlowForm"
        ref="formRef"
        label-width="90px"
        :liline="true"
      >
        <el-col :span="22">
          <el-form-item label="流程名称" prop="name" :rules="rules.name">
            <el-input v-model="workFlowForm.name" placeholder="输入流程名称" />
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input v-model="workFlowForm.fields" type="textarea" placeholder="输入备注信息"  />
          </el-form-item>
          <el-form-item label="流程字段">
            <el-row :gutter="22" v-for="(item, index) in workFlowForm.labels" :key="index">
              <el-col :span="8">
                <el-form-item label="字段名称" :prop="'labels.' + index + '.label'" :rules="rules.label">
                  <el-input type="text" placeholder="请输入" v-model="workFlowForm.labels[index].label" clearable autocomplete="off" maxlength="50">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="字段编号" :prop="'labels.' + index + '.value'" :rules="rules.label">
                  <el-input type="text" placeholder="请输入" v-model="workFlowForm.labels[index].value" clearable autocomplete="off" maxlength="50">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="字段类型" :prop="'labels.' + index + '.type'" :rules="rules.type">
                  <el-select v-model="workFlowForm.labels[index].type" clearable  placeholder="请选择类型">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1">
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
            <el-button class="add-btn" @click="addConfig" plain><el-icon size="14"><Plus /></el-icon>&nbsp;新增字段</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button class="footer-btn" plain @click="reset">重置</el-button>
        </el-col>
      </el-form>
    </div>
    <div class="wflow-component-box" v-else>
      <!-- <Wflow></Wflow> -->
      <!-- <div class="layout-body"> -->
				<FormProcessDesign v-show="state.activeSelect === 'processDesign'" :scale="state.scale"/>
			<!-- </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref,reactive,toRefs,computed, getCurrentInstance ,ComponentInternalInstance, onMounted } from 'vue'
import Wflow from "@/components/wflow/ProcessDesign.vue";
import { ElMessage, ElMessageBox, FormRules } from "element-plus";
import {userCtrl,processCtrl} from '@/ts/coreIndex'
import { useRouter } from "vue-router";
import FormProcessDesign from '@/components/wflow/layout/FormProcessDesign.vue'
import DefaultProps from "@/components/wflow/process/DefaultNodeProps"

const active = ref(0)
const stepsArr = reactive([{title:'基本信息'},{title:'流程设计'}])
//表单
const formRef = ref(null);

const {
  appContext
} = getCurrentInstance() as ComponentInternalInstance;

const { proxy } = getCurrentInstance()

const state = reactive({
  activeSelect: 'processDesign',
  workFlowForm: {
    name:'',
    fields:'',
    labels: [{
      label: '',
      value: '',
      type:''
    }]
  },
  scale:100
})

const props = defineProps({
  contionData: {
    type: Object
  }
})

const options = [
  {
    value: 'STRING',
    label: '字符串',
  },
  {
    value: 'NUMERIC',
    label: '数字',
  },
  {
    value: 'DICT',
    label: '枚举',
  },
  {
    value: 'DATE',
    label: '日期',
  }
]

// 注册验证规则
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入流程名称！', trigger: 'blur' }],
  label: [{ required: true, message: '请输入字段名称！', trigger: 'blur' }],
  value: [{ required: true, message: '请输入字段编号！', trigger: 'blur' }],
  type: [{ required: true, message: '请选择字段类型！', trigger: 'change'}]
})

// 注册页面实例
const router = useRouter();


onMounted(() => {
  let data = props.contionData?props.contionData:{}
  if(data?.name){
    active.value = 1
    state.workFlowForm = data
  }else{
    active.value = 0
  }
})

//放大缩小
const changeScale=(val:number)=>{
  state.scale = val
}

const emit = defineEmits(['exit','clearData'])

//返回
const exit = () => {
  emit('exit')
};

const addConfig = () => { // 新增
  state.workFlowForm.labels.push({
    label: '',
    value: '',
    type:''
  })
}

const removeConfig = (item:object) => { // 删除
  const index = state.workFlowForm.labels.indexOf(item)
  if (index !== -1) {
    state.workFlowForm.labels.splice(index, 1)
  }
}

//重置
const reset = () =>{
  state.workFlowForm={
    name:'',
    fields:'',
    labels: [{
      label: '',
      value: '',
      type:''
    }]
  }
}

const submitForm = () => { // 点击确定按钮，输出行内数据
  if (!formRef) return
  formRef.value.validate(async (valid: any, fields: any) => {
    if (valid) {
      active.value++
      const config = state.workFlowForm;
      DefaultProps.setFormFields(state.workFlowForm.labels) 
      processCtrl.setCondtionData(config);
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 发布
const publish = async() => {
  processCtrl.currentTreeDesign.name = processCtrl.conditionData.name;
  processCtrl.currentTreeDesign.fields = processCtrl.conditionData.fields;
  processCtrl.currentTreeDesign.remark = JSON.stringify(
    processCtrl.conditionData.labels,
  );
  /**要发布的数据 */
  const currentData = processCtrl.currentTreeDesign;
  if (currentData.belongId) {
    delete currentData.belongId;
  }
  const result = await userCtrl.space.publishDefine(currentData);
  if (result) {
    ElMessage({
      message: result.id ? '编辑成功' : '发布成功',
      type: 'success'
    })
    // 清理数据
    emit('clearData')
  } else {
    return false;
  }
};

const size = ref('')
const blockMargin = computed(() => {
  const marginMap:any = {
    large: '32px',
    default: '28px',
    small: '24px',
  }
  return {
    marginTop: marginMap[size.value] || marginMap.default,
  }
})

const {
  workFlowForm
} = {
  ...toRefs(state)
};


</script>

<style lang="scss" scoped>
.wflow-box{
  width: 100%;
  background-color: var(--el-bg-color-overlay);;
  margin-top: 3px;
  box-sizing: border-box;
  padding: 20px;
  .header-box{
    width: 100%;
    padding: 0 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 64px;
    line-height: 64px;
    background: #fff;
    .main-box{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .steps-box {
        width: 400px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        .steps-box-items{
          display: flex;
          align-items: center;
          color: #909399;
          .circle{
            width: 26px; 
            height: 26px;
            border-radius: 50%;
            background: none; 
            border: 1px solid #909399;
            text-align: center;
            line-height: 26px;
            margin-right: 6px;
          }
          .line{
            width: 64px;
            height: 2px;
            margin: 0 8px;
            background: #909399;
          }
        }
      }
    }
    .publish {
      position: absolute;
      top: 15px;
      right: 20px;
      z-index: 1000;

      .scale {
        z-index: 999;
        padding-left:10px;
        span {
          margin: 0 10px;
          font-size: 15px;
          color: #7a7a7a;
          width: 20px;
        }
      }

      i {
        margin-right: 6px;
      }
    }
  }
  .form-box{
    width: 100%;
    padding: 100px 100px 0 100px;
    :deep(.el-form){
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center; 
    }
    :deep(.el-row){
      margin-bottom: 8px;
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
      margin: 16px 0;
    }
    .del-icon{
      margin-top: 8px;
      color: #000;
    }
  }
}
</style>