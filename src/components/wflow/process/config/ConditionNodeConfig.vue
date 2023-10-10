<template>
  <div>
    <!-- <el-form inline label-width="100px"> -->
      <!-- <el-form-item label="调整优先级" prop="level">
        <el-popover placement="right" title="拖拽条件调整优先级顺序" width="250" trigger="click">
        </el-popover>
      </el-form-item>
      <el-form-item label="条件关系" label-width="150px">
        <el-switch v-model="config.groupsType" active-color="#409EFF"
                   inactive-color="#c1c1c1" active-value="AND" inactive-value="OR"
                   active-text="且" inactive-text="或">
        </el-switch>
      </el-form-item> -->
      <!-- <el-form-item label="条件表达式">
        <el-input size="default" v-model="config.expression" placeholder="输入条件关系表达式  &为与，|为或"/>
        <span class="item-desc">使用表达式构建复杂逻辑，例如: (A & B) | C</span>
      </el-form-item> -->
    <!-- </el-form> -->
    <div>
      <el-button type="primary" size="small" style="margin: 0 15px 15px 0" round @click="addConditionGroup" v-if="selectedNode.type == 'CONDITION'">
        添加条件
      </el-button>
      <!-- <span class="item-desc">只有必填选项才能作为审批条件</span> -->
    </div>
    <group-item/>
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
  // import draggable from "vuedraggable";
  import GroupItem from "./ConditionGroupItemConfigNew.vue"
  // import {processCtrl} from '@/ts/coreIndex'
  
  export default defineComponent({
    name: 'ConditionNodeConfig',
    // components: {draggable, GroupItem},
    components: {GroupItem},
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
      const state = reactive({
        sortOption: {
          animation: 300,
          chosenClass: 'choose',
          scroll: true,
          sort: true
        },
        showOrgSelect: false,
      });
      //
      const selectedNode = computed(() => {
        return proxy.$pinia.state.value.appwfConfig.selectedNode
      });
      const select = computed(() => {
        return proxy.config.assignedUser || []
      });
      // 条件节点
      const prioritySortList = computed(() => {
        let node = proxy.$pinia.state.value.appwfConfig.nodeMap.get(proxy.$pinia.state.value.appwfConfig.selectedNode.parentId)
        if (node) {
          return node.branches || []
        }
        return []
      });
      // const nowNodeLeave = computed(() => {
      //   return proxy.prioritySortList.indexOf(selectedNode.value)
      // });
      //
      const addConditionGroup = () => {
        // console.log(processCtrl.currentNode)
        // processCtrl.currentNode?.conditions?.push({
        //   pos: processCtrl.currentNode?.conditions.length + 1,
        //   paramKey: '',
        //   paramLabel: '',
        //   key: '',
        //   label: '',
        //   type: 'NUMERIC',
        //   val: null,
        // });
        // processCtrl.setCurrentNode(processCtrl.currentNode);
        proxy.$pinia.state.value.appwfConfig.selectedNode.conditions.push({
          pos: proxy.$pinia.state.value.appwfConfig.selectedNode.conditions.length + 1,
          paramKey:"",
          paramLabel:"",
          key:"",
          label:"",
          type:"NUMERIC",
          val: null
        });
        // props.config.groups.push({
        //   cids:[],
        //   groupType: "OR",
        //   conditions:[]
        // })
      };
      const selectUser = () => {
        state.showOrgSelect = true
      };
      const selected = (select: any) => {
        state.showOrgSelect = false
        select.forEach((val: any) => select.push(val))
      };
      const removeOrgItem = (index: number) => {
        proxy.config.assignedUser.splice(index, 1)
      };
      // 页面加载时
      onMounted(() => {
      });
      return {
        proxy,
        ...toRefs(state),
        //
        selectedNode,
        select,
        // nowNodeLeave,
        prioritySortList,
        //
        addConditionGroup,
        selectUser,
        selected,
        removeOrgItem,
      };
    },
  });
</script>

<style lang="scss" scoped>
.choose {
  border-radius: 5px;
  margin-top: 2px;
  background: #f4f4f4;
  border: 1px dashed #1890FF !important;
}

.drag-hover {
  color: #1890FF
}

.drag-no-choose {
  cursor: move;
  background: #f8f8f8;
  border-radius: 5px;
  margin: 5px 0;
  height: 25px;
  line-height: 25px;
  padding: 5px 10px;
  border: 1px solid #ffffff;
  div{
    display: inline-block;
    font-size: small !important;
  }

  div:nth-child(2) {
    float: right !important;
  }
}
</style>
