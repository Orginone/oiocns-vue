<template>
  <div>
    <el-button size="small" icon="el-icon-plus" type="primary" @click="friendDialogmodeBool = true" round>选择抄送对象</el-button>
    <!-- <div class="option">
      <el-checkbox label="允许发起人添加抄送对象" v-model="config.shouldAdd"></el-checkbox>
    </div> -->
    <org-items v-model="select"/>
    <!-- <org-picker multiple ref="orgPicker" :selected="select" @ok="selected"/> -->
    <!-- <el-dialog  v-model="friendDialogmodeBool"  custom-class="share-dialog" :title="'选择人员'" width="1000px" draggable :close-on-click-modal="false">
        <chooseOperator  v-show="friendDialogmodeBool && spaceType=='单位'" @closeDialog="friendDialogmodeBool = false"  @submit="checksSearch" :radio="'3'"  :way="[ 
        {
          id: '3',
          label: '内部岗位'
        },{
          id: '6',
          label: '集团岗位'
        }]"></chooseOperator>
        <chooseOperatorPersonal v-show="friendDialogmodeBool && spaceType=='人员'" dialogType="1" @closeDialog="nodeProps.friendDialogmode = 0" :info="selectProductItem" :type="4" @submit="checksSearch"></chooseOperatorPersonal>
    </el-dialog> -->
      <!-- <div v-if="nodeProps.assignedUser && nodeProps.assignedUser.length>0">已选择：<span v-for="(item, index) in nodeProps.assignedUser" :key="index"><el-tag closable @close="handleClose(index)">{{item.name}}</el-tag></span></div>  -->
  </div>
</template>

<script lang="ts">
  import {
    ref,
    toRefs,
    reactive,
    computed,
    onMounted,
    defineComponent,
    getCurrentInstance,
    ComponentInternalInstance
  } from 'vue';
  // import OrgPicker from "@/components/common/OrgPicker";

  // import chooseOperator from '@/views/Market/components/chooseOperator.vue'
  // import chooseOperatorPersonal from '@/views/Market/components/chooseOperatorPersonal.vue'
  import authority from '@/utils/authority'
  export default defineComponent({
    name: 'CcNodeConfig',
    // components: {chooseOperator,chooseOperatorPersonal},
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    setup(props, { emit }) {
      const { appContext  } = getCurrentInstance() as ComponentInternalInstance;
      const proxy = appContext.config.globalProperties;
      //
      // const orgPicker = ref();
      //
      const state = reactive({});
      const selectProductItem = ref<ProductType>()
      const select = computed({
        get() {
          return props.config.assignedUser || []
        },
        set(val) {
          props.config.assignedUser = val
        }
      });
      const nodeProps = computed(() => {
        return proxy.$pinia.state.value.appwfConfig.selectedNode.props
      });
      const spaceType = computed(() => {
          return authority.getSpaceInfo().typeName
      });
      const handleClose = (index:any) => {
        proxy.$pinia.state.value.appwfConfig.selectedNode.props.assignedUser.splice(index,1)
      };
      const selectOrg = () => {
        // orgPicker.value.show()
      };
      const selected = (select: any) => {
        select = Object.assign([], select)
      };
      const removeOrgItem = (index: number) => {
        props.config.assignedUser.splice(index, 1)
      }
      const friendDialogmodeBool = ref(false)
      const checksSearch = (val:any)=>{
        if(!proxy.$pinia.state.value.appwfConfig.selectedNode.props.assignedUser || proxy.$pinia.state.value.appwfConfig.selectedNode.props.assignedUser.length==0){
          proxy.$pinia.state.value.appwfConfig.selectedNode.props.assignedUser = []
        }
        for(let item of JSON.parse(JSON.stringify(val))){
          var ids = proxy.$pinia.state.value.appwfConfig.selectedNode.props.assignedUser.map((item:any)=>item.id)
          if(!ids.includes(item.id)){
            proxy.$pinia.state.value.appwfConfig.selectedNode.props.assignedUser.push(item) 
          }
        }
        closeDialog();
      };
      const closeDialog = ()=>{
        friendDialogmodeBool.value = false
      }
      // 页面加载时
      onMounted(() => {
      });
      return {
        proxy,
        ...toRefs(state),
        nodeProps,
        select,
        friendDialogmodeBool,
        handleClose,
        selectProductItem,
        spaceType,
        checksSearch,
        selectOrg,
        selected,
        removeOrgItem,
      };
    },
  });
</script>


<style lang="scss" scoped>
.option{
  color: #606266;
  margin-top: 20px;
  font-size: small;
}

.desc{
  font-size: small;
  color: #8c8c8c;
}
.org-item{
  margin: 5px;
}
</style>
