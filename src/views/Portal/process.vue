<template>
    <div class="mainx">
      <div class="content">
        <div class="head">
          <div class="head-nav">
            <el-menu
              :default-active="showType"
              class="el-menu-demo"
              width="400"
              mode="horizontal"
              @select="handleSelect">
              <el-menu-item index="1">待办详情</el-menu-item>
              <el-menu-item index="2">流程进度</el-menu-item>
            </el-menu>
          </div>
          <div class="edit" v-if="btnType ==1">
            <el-button type="primary" size="small" @click="showComment(101)">同意</el-button>
            <!-- <el-button size="small" @click="showComment(101)">驳回</el-button> -->
            <el-button type="danger" size="small" @click="showComment(201)">终止流程</el-button>
          </div>
        </div>
       
        <div class="diy-content" v-if="showType == '1'">
          <div class="dit-iframe" v-if="contentType =='Iframe'">
            <iframe :src="contentValue" frameborder="0" width="100%" height="100%"></iframe>
          </div>
          <div class="dit-iframe" v-if="contentType =='MarkDown'">
            <v-md-editor :model-value="contentValue" mode="preview"></v-md-editor>
          </div>
          <div class="dit-iframe" v-if="contentType =='Text'">
            
            <div class="htmlDetail" v-html="contentValue"></div>
          </div>
        </div>
        <div class="diy-content" v-else>
          <FormProcessDesign ref="ProcessDesignRef" />
        </div>
        
      </div>
      <el-dialog
        v-model="dialogVisible"
        title="节点审批"
        width="30%"
        align-center
      >
        <div class="row">
          <div class="row-text" style="margin-bottom:10px">审批信息</div>
          <el-input
            v-model="flowText"
            :rows="3"
            type="textarea"
            placeholder="请输入审批信息"
          />
        </div>
        <span class="dialog-footer" style="display:flex;margin-top:20px;flex-direction: row-reverse;">
          <el-button @click="dialogVisible = false" style="margin-left: 10px;">取消</el-button>
          <el-button type="primary" @click="subApproval">确认</el-button>
        </span>
      </el-dialog>
    </div>
</template>
  
  <script setup lang="ts">
  import FormProcessDesign from '@/components/wflow/layout/FormProcessDesign.vue'
  import { ref, onMounted, reactive, getCurrentInstance, ComponentInternalInstance } from 'vue'
  import $services from '@/services'
  import router from '@/router';
  import { ElMessage } from 'element-plus'
  import { useAppwfConfig } from '@/store/wflow'
  import thingServices from '@/module/flow/thing'
import { chat } from '@/ts/controller/chat';

  const ThingServices  = new thingServices()
    const activeName = ref('first');
    const itemId = ref<any>('');
    const showType = ref<any>('1')
    const btnType = ref<any>('1')
    const itemData = ref<Object>({});
    const dialogVisible = ref<boolean>(false);
    const contentType = ref<string>(); //显示类型
    const contentValue = ref<any>();//显示的值
    const flowText = ref<string>();//审批意见
    const flwoStatus = ref<number>();//审批状态
    
    const state = reactive({
      historyData: [
        {
          name: '流程名称',
          user: '审批对象',
          description: '描述',
          url: ''
        },
        {
          name: '流程名称',
          user: '审批对象',
          description: '描述',
          url: ''
        }
      ]
    })
    const props = defineProps({
      dialogVisible: {
        type: Boolean
      },
      dialogValue: {
        type: Object
      }
    })
    const handleSelect = (key: string, keyPath: string[])=>{
      showType.value = key
    }
    const showComment = (status:number)=>{
      dialogVisible.value = true;
      flwoStatus.value = status
    }
    const subApproval = ()=>{
      $services.wflow.approvalTask({data:{id: itemId.value,status: flwoStatus.value,comment:flowText.value}}).then((res: ResultType) => {
        console.log('res',res)
        ElMessage({
          message: res.msg,
          type: 'success'
        })
        setTimeout(() => {
          router.go(-1)
        }, 1000);
      })
    }

    const { appContext } = getCurrentInstance() as ComponentInternalInstance
    const proxy = appContext.config.globalProperties
    const stores = useAppwfConfig(proxy.$pinia)
    // 获取流程实例
    const getFlowInstance = (instanceId: string)=>{
      $services.wflow.queryInstance({data:{id: instanceId}}).then((res: ResultType) => {
        const flowInstance = res.data?.result[0];
        const flowDefineData = JSON.parse(flowInstance.flowDefine?.content)
        flowToData(flowDefineData.resource, flowInstance?.flowTasks);
        stores.setDesign(flowDefineData);
      })
    }
    // 流程实例数据和已走流程数据封装
    const flowToData = (datas: any, flowTasks: any = []) => {
      // 循环每次的对象
      for (let key in datas) {
        // 如果它里面的children还是对象的话，就再调用一次这个函数
        if (typeof datas.children == "object") {
          // 递归，这里的调用传入的参数都是每一层的children对象！！
          flowToData(datas.children, flowTasks);
        }
        if (datas.branches && datas.branches.length) {
          datas.branches.forEach((item:any) => {
            flowToData(item, flowTasks);
          });
        }
        if (datas.type == 'CC' || datas.type == 'APPROVAL') { 
          const dataItem = flowTasks.find((item: any) => item?.nodeId == datas?.id)
          if(dataItem) {
            if(dataItem.status === 1) {
              if (dataItem?.flowRecords?.length) { // 半通过状态
                datas._disabled = true;
                datas._passed = 1;
                datas._executable = true;
              } else { // 未通过
                datas._disabled = true;
                datas._passed = 1;
                datas._executable = false;
              }
            } else if(dataItem.status === 100) { // 已通过
              datas._disabled = true;
              datas._passed = 2;
              datas._executable = false;
            } else if (dataItem.status === 200) { // 已拒绝
              datas._disabled = true;
              datas._passed = 0;
              datas._executable = false;
            }
            // 人员审批数据赋值
            if(dataItem?.flowRecords?.length) {
              dataItem?.flowRecords.forEach((item:any)=>{
                item.target = chat.getName(item.targetId)
              });
              datas._flowRecords = dataItem?.flowRecords;
            }
          } else {
            datas._disabled = true;
            datas._passed = 0;
            datas._executable = true;
          }
        } else {
            datas._disabled = true;
        }
        break;
      }
    }
    const getDetail = async () =>{
      let tableData:Array<Object> = []
      if(btnType.value =='1'){
        await ThingServices.queryTask()
        tableData = ThingServices.taskList
      }else if(btnType.value  =='2'){
        console.log('22')
        await ThingServices.queryRecord()
        tableData =ThingServices.recordList
      }else if(btnType.value =='3'){
        await ThingServices.queryInstance()
        tableData =ThingServices.queryInstanceList
      }else if(btnType.value  =='4'){
        await ThingServices.queryTask()
        tableData = ThingServices.copyList
      }
      tableData.forEach((element:any,index:number) => {
        if(element.id == itemId.value){
          itemData.value = element
          contentType.value = element?.flowInstance?.contentType||element?.flowTask?.flowInstance.contentType||element?.contentType
          contentValue.value = element?.flowInstance?.content||element?.flowTask?.flowInstance.contentType||element?.content
          console.log('contentValue',contentValue.value)
        }
      });
    }
    onMounted(async () => {
      itemId.value = router.currentRoute.value.query.id;
      btnType.value = router.currentRoute.value.query.type;
      getDetail();
      getFlowInstance(router.currentRoute.value.query.instanceId as string);
    })
  </script>
<style lang="scss">
.mainx{
  .el-menu{
    border-right: 0;
    border-bottom: 0;
  }
  .el-sub-menu__icon-arrow{
    display: none;
  }
  .el-dropdown-link{
    padding: 2px 10px;
    border-radius: 10px;
  }
  .el-dropdown-link:hover{
    background: var(--el-bg-color-overlay);
  }
  .diy-content{
    .el-main{
      height: 100%;
    }
  }
}
</style>
<style lang="scss" scoped>
    .mainx{
        display: flex;
        background: #fff;
        .content {
          width: calc(100%);
          height: calc(100vh - 50px);
          overflow-y: hidden;
          .head{
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .head-nav{
              width: 400px;
            }
            .edit{
              display: flex;
              padding-right: 20px;
            }
          }
          .diy-content{
            height: calc(100% - 60px);
            .dit-iframe{
              height: 100%;
            }
            .htmlDetail{
              padding: 20px;
            }
          }
        }
    }
</style>