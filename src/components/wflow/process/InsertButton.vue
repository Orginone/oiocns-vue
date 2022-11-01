<template>
  <el-popover placement="bottom-start" title="添加流程节点" width="320px" trigger="click">
    <div class="node-select">
      <div @click="addApprovalNode">
        <!-- <i class="el-icon-s-check" style="color:rgb(255, 148, 62);"></i> -->
        <el-icon :size="30" color="rgb(255, 148, 62)">
          <Stamp />
        </el-icon>
        <span>审批</span>
      </div>
      <div @click="addCcNode">
        <!-- <i class="el-icon-s-promotion" style="color:rgb(50, 150, 250);"></i> -->
        <el-icon :size="30" color="rgb(50, 150, 250)">
          <Promotion />
        </el-icon>
        <span>抄送</span>
      </div>
      <div @click="addConditionsNode">
        <!-- <i class="el-icon-share" style="color:rgb(21, 188, 131);"></i> -->
        <el-icon :size="30" color="rgb(21, 188, 131)">
          <Share />
        </el-icon>
        <span>条件审核</span>
      </div>
      <div @click="addConcurrentsNode">
        <!-- <i class="el-icon-s-operation" style="color:#718dff;"></i> -->
        <el-icon :size="30" color="#718dff">
          <Operation />
        </el-icon>
        <span>同时审核</span>
      </div>
      <!-- <div @click="addDelayNode">
        <el-icon :size="30" color="#f25643">
          <Clock />
        </el-icon>
        <span>延迟等待</span>
      </div>
      <div @click="addTriggerNode">
        <el-icon :size="30" color="#15BC83">
          <Notification />
        </el-icon>
        <span>触发器</span>
      </div> -->
    </div>
    <template #reference>
      <el-button icon="Plus" type="primary" size="small" circle></el-button>
    </template>
  </el-popover>
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

  export default defineComponent({
    name: 'InsertButton',
    components: {},
    emits:[
      'insertNode'
    ],
    setup(props, {
      emit
    }) {
      const {
        appContext
      } = getCurrentInstance() as ComponentInternalInstance;
      const proxy = appContext.config.globalProperties;
      //
      const state = reactive({
        visible: false,
      });
      //
      const selectedNode = computed(() => {
        return proxy.$pinia.state.value.appwfConfig.selectedNode;
      });
      //
      const addApprovalNode = () => {
        emit('insertNode', "APPROVAL");
      };
      //
      const addCcNode = () => {
        emit('insertNode', "CC");
      };
      //
      const addDelayNode = () => {
        emit('insertNode', "DELAY");
      };
      //
      const addConditionsNode = () => {
        emit('insertNode', "CONDITIONS");
      };
      //
      const addConcurrentsNode = () => {
        emit('insertNode', "CONCURRENTS");
      };
      //
      const addTriggerNode = () => {
        emit('insertNode', "TRIGGER");
      };
      // 页面加载时
      onMounted(() => {});
      return {
        proxy,
        ...toRefs(state),
        //
        selectedNode,
        //
        addApprovalNode,
        addCcNode,
        addDelayNode,
        addConditionsNode,
        addConcurrentsNode,
        addTriggerNode,
      };
    },
  });
</script>

<!-- <script>
export default {
  name: "InsertButton",
  components: {},
  data() {
    return {}
  },
  computed:{
    selectedNode(){
      this.$store.state.selectedNode
    }
  },
  methods: {
    addApprovalNode(){
      this.$emit('insertNode', "APPROVAL")
    },
    addCcNode(){
      this.$emit('insertNode', "CC")
    },
    addDelayNode(){
      this.$emit('insertNode', "DELAY")
    },
    addConditionsNode(){
      this.$emit('insertNode', "CONDITIONS")
    },
    addConcurrentsNode(){
      this.$emit('insertNode', "CONCURRENTS")
    },
    addTriggerNode(){
      this.$emit('insertNode', "TRIGGER")
    }
  }
}
</script> -->

<style lang="scss" scoped>
  .node-select {
    div {
      display: inline-block;
      margin: 5px 5px;
      cursor: pointer;
      padding: 10px 15px;
      border: 1px solid #F8F9F9;
      background-color: #F8F9F9;
      border-radius: 10px;
      width: 130px;
      position: relative;

      span {
        position: absolute;
        left: 65px;
        top: 18px;
      }

      &:hover {
        background-color: #fff;
        box-shadow: 0 0 8px 2px #d6d6d6;
      }

      i {
        font-size: 25px;
        padding: 5px;
        border: 1px solid #dedfdf;
        border-radius: 14px;
      }
    }
  }
</style>