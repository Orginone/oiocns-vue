<template>
  <div>
    <div class="layout-header" v-if="form.formId">
      <span style="padding-left:20px;color:grey"> 业务名：{{form.formName ||  form.business || form.formId}}</span>
      <span style="padding-left:10px;" > 绑定已有流程：        
        <el-select v-model="design"  value-key="id" :name="design.name" class="m-2" placeholder="Select" size="small" @change="bindFlow">
          <el-option
            v-for="(item,index) in flowList"
            :key="item.id"
            :label="item.name"
            :value="item"
          />
        </el-select></span>
    </div>
    <div class="layout-header">
      <el-menu :default-active="defaultActive" active-text-color="#154AD8" class="el-menu-demo" mode="horizontal"
        :ellipsis="false" @select="handleSelect">
        <!-- <el-menu-item index="baseSetting">① 基础信息</el-menu-item> -->
        <!-- <el-menu-item index="formSetting">②③ 审批表单</el-menu-item> -->
        <el-menu-item index="processDesign">流程设计</el-menu-item>
        <!-- <el-menu-item index="proSetting">④ 扩展设置</el-menu-item> -->
      </el-menu>
      <div class="back">
        <el-button size="default" @click="exit">
          <el-icon>
            <Back />
          </el-icon>退出
        </el-button>
        <span>
          <el-input v-model="design.name" size="default" v-show="showInput" style="width: 300px"
          @blur="showInput = false" @keyup.enter.native="showInput = false"></el-input>
      <el-link  v-show="!showInput" @click="showInput = true">
        <el-icon :size="20" color="#409EFC">
            <Stamp />
        </el-icon>流程名：{{design.name}}
      </el-link>
      <!-- <span style="padding-left:10px;color:grey"> 业务名：{{form.formName ||  form.business || form.formId}}</span> -->
      
      <!-- <span style="padding-left:10px;color:grey" v-if="!bindOperateShow" @click="bindOperateShow=true">   <el-button size="small" type="primary" round>
        绑定已有流程
      </el-button></span> -->
    

      <!-- <span style="padding-left:10px;" > 绑定已有流程：        
        <el-select v-model="design"  value-key="id" :name="design.name" class="m-2" placeholder="Select" size="small" @change="bindFlow">
          <el-option
            v-for="(item,index) in flowList"
            :key="item.id"
            :label="item.name"
            :value="item"
          />
        </el-select></span> -->
        </span>
        
      </div>
      <div class="publish">
        <!-- <el-button size="small" @click="preview">
          <el-icon>
            <View />
          </el-icon>
          '预览'
        </el-button> -->
        <el-button size="small" type="primary" @click="publish">
          <el-icon>
            <Promotion />
          </el-icon>发布
        </el-button>
        <span class="scale">
      <el-button size="small" @click=" changeScale(scale -10)" :disabled="scale <= 40">
        <el-icon>
          <Minus />
        </el-icon>
      </el-button>
      <span>{{ scale }}%</span>
      <el-button size="small" @click="changeScale(scale +10)" :disabled="scale >= 150">
        <el-icon>
          <Plus />
        </el-icon>
      </el-button>
    </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    ref,
    defineComponent,
    getCurrentInstance,
    ComponentInternalInstance,
    reactive,
    toRefs,
    computed,
  } from 'vue';
  
import { ElMessage } from 'element-plus'
import $services from '@/services'

  export default defineComponent({
    name: 'LayoutHeader',
    props: {
      editFlag: {
        type: Boolean
      }
    },
    setup(props, {
      emit
    }) {
      const {
        appContext
      } = getCurrentInstance() as ComponentInternalInstance;
      
      
      const proxy = appContext.config.globalProperties;
      const form = computed(() => {
        return proxy.$pinia.state.value.appwfConfig.form
      });
      const design = computed(() => {
        return proxy.$pinia.state.value.appwfConfig.design
      });
      const flowList = computed(()=>{
        return  proxy.$pinia.state.value.appwfConfig.designList
      })

      const state = reactive({
        scale: 100,
        bindFlow:(e:any)=>{
          proxy.$pinia.state.value.appwfConfig.design = e
          if(e.id){
            $services.wflow.createRelation({
              data:{
                defineId: e.id,
                productId: form.value.appId,
                functionCode: form.value.formId,
              }
            })
            .then((res: ResultType) => {
              if(!res){
                ElMessage({
                  message: '接口请求异常',
                  type: 'warning'
                })
              }else if ( res.code == 200) {
                ElMessage({
                  message: '绑定成功',
                  type: 'success'
                })
              } else {
                ElMessage({
                  message: res.msg,
                  type: 'warning'
                })
              }
            })
          }

        },
        bindOperateShow:false,
        defaultActive: 'processDesign',
        showInput: false
      });
      const changeScale = (val:number)=>{
        state.scale = val
        emit('changeScale',val)
      }
      const paramObj = reactive({
        currentVersion: proxy.$pinia.state.value.appwfConfig.design.edition,
      });
      // 切换页签
      const handleSelect = (path: any) => {
        emit('activeChange', path);
      };

      // 退出
      const exit = () => {
        state.showInput = false
        proxy.$confirm('未发布的内容将不会被保存，是否直接退出 ?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          emit('exit', true);
        })
      };
      // 预览
      const preview = () => {
        emit('preview', true);
      };
      // 发布
      const publish = () => {
        emit('publish');
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

      return {
        form,
        design,
        paramObj,
        size,
        blockMargin,
        flowList,
        changeScale,
        handleSelect,
        exit,
        preview,
        publish,
        ...toRefs(state),
      };
    },
  });
</script>

<style lang="scss" scoped>
  .layout-header {
    // min-width: 640px;
    margin-top:10px;
    position: relative;
    background: white;

    .el-menu {
      top: 0;
      z-index: 999;
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .back {
      display: flex;
      position: absolute;
      z-index: 1000;
      top: 10px;
      left: 20px;
      font-size: small;

      span {
        display: flex;
        margin-left: 10px;
        font-size: 14px;
        align-items: center;
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
</style>