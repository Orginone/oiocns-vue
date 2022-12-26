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
        <el-input  placeholder="搜索内容" />
        <el-tree
          v-if="state.identitys"
          ref="treeRef"
          class="filter-tree"
          :data="state.identitys"
          :props="defaultProps"
          default-expand-all
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
import { ref,reactive, onMounted, watch } from 'vue'
import userCtrl from '@/ts/controller/setting/userCtrl'
import { ElTree } from 'element-plus'

interface Tree {
  id: number
  label: string
  children?: Tree[]
}

const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()

const state = reactive({
  data:[],
  resultData:[],
  identitys:[],
  current:{}
})

const defaultProps = {
  label: 'title',
  id:'key'
}

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
        icon: '',
        children: buildTargetTree(item.subTeam),
      });
    }
  }
  return result;
};

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})


const filterNode = (value: string, data: Tree) => {
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
        title: i.name,
        key: i.id,
        data: i.target,
      };
    });
    state.identitys = result
    console.log(state.identitys)
  }
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