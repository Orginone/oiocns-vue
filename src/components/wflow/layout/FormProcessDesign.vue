<template>
  <el-main>
    <!-- <div class="scale">
      <el-button size="small" @click="scale -= 10" :disabled="scale <= 40">
        <el-icon>
          <Minus />
        </el-icon>
      </el-button>
      <span>{{ scale }}%</span>
      <el-button size="small" @click="scale += 10" :disabled="scale >= 150">
        <el-icon>
          <Plus />
        </el-icon>
      </el-button>
    </div> -->
    <div class="design" :style="'transform: scale('+ scale / 100 +');'">
      <ProcessTree ref="processTree" @selectedNode="nodeSelected" />
    </div>
    <el-drawer  v-model="showConfig" :modal-append-to-body="false" 
      :size="selectedNode?.type === 'CONDITION' ? '600px':'500px'" direction="rtl" destroy-on-close>
      <template #header="{  titleId, titleClass }">
        <el-input v-model="selectedNode.name" size="default" v-show="showInput" style="width: 300px"
          @blur="showInput = false" @keyup.enter.native="showInput = false"></el-input>
        <el-link :id="titleId" :class="titleClass" v-show="!showInput" @click="showInput = true">
          {{selectedNode.name}}<el-icon class="el-icon--right"><Edit /></el-icon>
        </el-link>
      <!-- <el-link v-show="!showInput" @click="showInput = true" style="font-size: 16px">
          <i class="el-icon-edit" style="margin-right: 10px"></i>
          {{selectedNode.name}}
        </el-link> -->
     </template>
      <!-- <div slot="header"> -->
        <!-- <el-input v-model="selectedNode.name" size="default" v-show="showInput" style="width: 300px"
          @blur="showInput = false"></el-input>
        <el-link v-show="!showInput" @click="showInput = true" style="font-size: default">
          <i class="el-icon-edit" style="margin-right: 10px"></i>
          {{selectedNode.name}}
        </el-link>
      </div> -->
      <div class="node-config-content">
        <NodeConfig />
      </div>
    </el-drawer>

    <el-drawer
      v-model="dialogTableVisible"
      title="详情"
      direction="rtl"
      size="50%"
    >
      <el-table :data="_flowRecords">
        <el-table-column property="target" label="审批人"  />
        <el-table-column property="createTime" label="时间"  />
        <el-table-column property="comment" label="审批意见" />
      </el-table>
    </el-drawer>
  </el-main>
</template>

<script lang="ts">
  // @ts-nocheck

  import {
    ref,
    reactive,
    toRefs,
    defineComponent,
    getCurrentInstance,
    ComponentInternalInstance,
    computed,
  } from 'vue';

  import ProcessTree from '../process/ProcessTree.vue'
  import NodeConfig from '../process/config/NodeConfig.vue'
  export default defineComponent({
    name: 'FormProcessDesign',

    components: {
      ProcessTree,
      NodeConfig
    },
    props: {
      scale: {
        type: Number,
        default: () => 60
      }
    },
    setup(props, {
      emit
    }) {
      const {
        appContext
      } = getCurrentInstance() as ComponentInternalInstance;

      // const ctx = getCurrentInstance();

      const proxy = appContext.config.globalProperties;
      
      const selectedNode = computed(() => {
        return proxy.$pinia.state.value.appwfConfig?.selectedNode;
      });

      const state = reactive({
        selected: {},
        showInput: false,
        showConfig: false,
        dialogTableVisible: false,
        _flowRecords: []
      });

      const processTree = ref<any>();
      const validate = () => {
        return processTree.value.validateProcess()
      };

      const nodeSelected = (node: any) => {
        state._flowRecords = node?._flowRecords
        node?._disabled ? state.dialogTableVisible = true : state.showConfig = true
      }

      const handleClose = () => {
        console.log('handleClose')
      }

      return {
        selectedNode,
        processTree,
        validate,
        nodeSelected,
        handleClose,
        ...toRefs(state),
      };
    },
  });

</script>

<style lang="scss" scoped>
  .design {
    margin-top: 100px;
    display: flex;
    transform-origin: 50% 0px 0px;
  }

  .scale {
    z-index: 999;
    position: absolute;
    top: 120px;
    right: 40px;

    span {
      margin: 0 10px;
      font-size: 15px;
      color: #7a7a7a;
      width: 50px;
    }
  }

  .node-config-content {
    padding: 0 20px 20px;
  }

  .el-drawer__body {
    overflow-y: auto;
  }
</style>