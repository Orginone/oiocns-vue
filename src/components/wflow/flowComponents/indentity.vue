<template>
  <div class="dialog-body">
    <div class="content">
      <div class="leftContent">
        <el-input v-model="filterText" placeholder="搜索内容" />
        <el-tree
          v-if="state.data"
          ref="treeRef"
          class="filter-tree"
          :data="state.data"
          default-expand-all
          @node-click="handleNodeClick"
          :filter-node-method="filterNode"
        />
      </div>
      <div class="rightContent">      
        <el-input v-model="identitysText" placeholder="搜索内容" />
        <el-tree
          v-if="state.identitys"
          ref="identitysRef"
          class="filter-tree"
          :data="state.identitys"
          default-expand-all
          @node-click="onCheck"
          :filter-node-method="identitysNode"
        />
      </div>
    </div>
  </div>
  <div class="footer">
    <el-button type="primary" @click="sure">确认</el-button>
    <el-button class="footer-btn" plain @click="closeDialog">取消</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref,reactive, onMounted, watch, getCurrentInstance, ComponentInternalInstance } from 'vue'
import {userCtrl,processCtrl} from '@/ts/coreIndex'
import { ElTree } from 'element-plus'

const { appContext  } = getCurrentInstance() as ComponentInternalInstance;
const proxy = appContext.config.globalProperties;

interface Tree {
  id: number
  label: string
  children?: Tree[]
}

let filterText = ref('')
const identitysText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()
const identitysRef = ref<InstanceType<typeof ElTree>>()

const state = reactive({
  data:[],
  resultData:[],
  identitys:[],
  current:{},
  currentData:{label: String, id: Number}
})

onMounted(() => {
  loadTeamTree()
})

const loadTeamTree = async () => {
  const targets = await userCtrl.getTeamTree();
  state.data = buildTargetTree(targets)
}

/** 加载组织树 */
const buildTargetTree = (targets:[{id:string,name:string,subTeam:any[]}]) => {
  const result: any[] = [];
  if (targets) {
    for (const item of targets) {
      result.push({
        id:item.id,
        label:item.name,
        item: item,
        isLeaf: item.subTeam.length === 0,
        children: buildTargetTree(item.subTeam),
      });
    }
  }
  return result;
};

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

watch(identitysText, (val) => {
  identitysRef.value!.filter(val)
})

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}

const identitysNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}

const handleNodeClick = async(info:any)=> {
  const item = info.item
  if(item){
    const index = state.resultData.findIndex((i) => {
      return i.id === item.id;
    });
    if (index > -1) {
      state.current = state.resultData[index];
    } else {
      const newItem: ResultType = {
        id: item.id,
        target: item.target,
        identitys: [],
      };
      state.resultData.push(newItem);
      state.current = newItem;
    }
    await item.loadSubTeam();
    loadTeamTree();
    const result = (await item.getIdentitys()).map((i) => {
      return {
        label: i.name,
        id: i.id,
        data: i.target,
      };
    });
    state.identitys = result
  }
}

// 中间树形点击事件
const onCheck = (info:any) => {
  console.log(info,'info')
  state.currentData = info
  let newArr:any = []
  newArr.push({name:info.label,id:info.id})
  proxy.$pinia.state.value.appwfConfig.selectedNode.props.assignedUser = newArr
  // console.log(proxy.$pinia.state.value.appwfConfig.selectedNode.props.assignedUser)
  // const item = getIdentityItem(info.id);
  // if (state.current && item) {
  //   if (info.checked) {
  //     state.identitys.push(item.data);
  //   } else {
  //     state.identitys = state.identitys.filter((i: any) => {
  //       return i.id != item.key;
  //     });
  //   }
  // }
};

const getIdentityItem = (id: string | number) => {
  for (const item of state.identitys) {
    if (item.id === id) {
      return item;
    }
  }
  return undefined;
};

const emit = defineEmits([
  'closeDialog',
])

const closeDialog = () => {
  emit('closeDialog', false)
}

const selectedNode = processCtrl.currentNode;

const sure = () => {
  console.log(state.currentData.label)
  selectedNode.props.assignedUser = [
    { name: state.currentData.label, id: state.currentData.id },
  ];
  processCtrl.setCurrentNode(selectedNode);
  closeDialog();
}

</script>

<style lang="scss" scoped>
.content{
  margin-top: 20px;
  height: 500px;
  display: flex;
  .leftContent{
    width: 50%;
    height: 100%;
    flex: none;
    padding-right: 10px;
  }
  .rightContent{
    height: 100%;
    width: 50%;
    padding: 0 10px 10px 10px;
    border-left: 1px solid #ebeef5;
    display: flex;
    flex-direction: column;
  }
}
:deep .el-input__wrapper{
  border-radius: 16px;
}
.dialog-body{
  border: 1px solid #ebeef5;
  border-radius: 4px;
  max-height: 684px;
  overflow-y: auto;
  padding: 24px;
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