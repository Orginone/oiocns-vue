<template>
  <div class="container">
    <el-card class="wrap">
      <div>
        <div class="title">全部身份</div>
      </div>
      <div class="search-wrap">
        <el-input class="search" @input="serachData()" v-model="searchText" placeholder="搜索内容">
          <template #suffix>
            <el-icon class="el-input__icon">
              <search />
            </el-icon>
          </template>
        </el-input>
        <li class="con tree-btns">
          <el-icon color="#154ad8" :size="20" @click="createIdntityDialog = true">
            <CirclePlus />
          </el-icon>
        </li>
      </div>
      <div>
        <el-menu default-active="0" class="el-menu-vertical-demo">
          <el-menu-item class="menu-item" :index="index.toString()" v-for="(item, index) in identityList"
            @click="checkItem(item)">
            <div class="menu-nav">{{item?.target?.name}}</div>
          </el-menu-item>
        </el-menu>
      </div>
    </el-card>

    <el-dialog v-model="createIdntityDialog" title="新增" width="40%" center append-to-body @close="dialogHide">
      <div>
        <el-form-item label="身份名称" style="width: 100%">
          <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="身份编号" style="width: 100%">
          <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="所属角色" style="width: 100%">
          <el-tree-select
            v-model="formData.authId"
            :data="cascaderTree"
            check-strictly
            :props="cascaderProps"
            @node-click="handleSelectTree($event)"
            :render-after-expand="false"
            style="width: 100%"
            :default-expand-all="true"
          />
        </el-form-item>
        <el-form-item label="身份简介" style="width: 100%">
          <el-input v-model="formData.remark" :autosize="{ minRows: 5 }" placeholder="请输入" type="textarea" clearable />
        </el-form-item>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogHide">取消</el-button>
          <el-button type="primary" @click="createIdentity">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive,computed } from 'vue'
import { ElMessage } from 'element-plus'
import { setCenterStore } from '@/store/setting'
const store: any = setCenterStore()
const current = computed(()=> store.currentSelectItme?.intans)

const emit = defineEmits(['itemClick'])

let newDept = ref()

const handleSelectTree = (_?: any, info?: {intans: any}) => {
  newDept.value = info?.intans
}

// 当前组织ID
const createIdntityDialog = ref<boolean>(false)
let formData = reactive<any>({})
const belongId = ref<any>('')
const module = ref<any>('company')
const persons = ref<any>('getPersons')
// 岗位列表
let identityList: any = ref()

const searchText = ref<string>('');
const serachData = async () => {
  const data = await current.value.getIdentitys(searchText.value)
  if (data) {
    identityList.value = data
    // emit('itemClick',identityList.value[0])
  }
}
// 刷新
const refresh = () => {
  loadIdentities()
};
defineExpose({ refresh });

const checkItem = (val: any) => {
  val.module = module.value
  val.persons = persons.value
  val.belongId = belongId.value
  emit('itemClick', val)
}
// 加载岗位
const loadIdentities = async () => {
  const data = await current.value.getIdentitys()
  identityList.value = []
  identityList.value = JSON.parse(JSON.stringify(data))
  store.identityList = data
  if (data) {
    emit('itemClick',identityList.value[0])
  }
}
const createIdentity = async () => {
  let obj =  {
    name: formData.name,
    code: formData.code,
    remark: formData.remark,
    authId: formData.authId
  }
  const data =  await current.value.createIdentity(obj)
  if(data){
    ElMessage({
      message: '创建成功!',
      type: 'success'
    })
    dialogHide()
    loadIdentities()
  }
}

let authorityTree = ref<any[]>([])
let cascaderTree = ref<any[]>([])

const cascaderProps = {
  value: 'id',
  label: 'name',
  children: 'children',
}

// 加载角色树
const loadAuthorityTree = async () => {
  const data = await current.value.selectAuthorityTree()
  if(data){
    authorityTree.value = []
    authorityTree.value.push(data)
    cascaderTree.value = authorityTree.value
  }
}

const dialogHide = () => {
  formData.value = {}
  createIdntityDialog.value = false
}

onMounted(() => {
  loadIdentities()
  loadAuthorityTree()
})


</script>
<style scoped>
.el-menu {
  border: 0 !important
}
</style>
<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;

}

.wrap {
  width: 100%;
  border: 0;
  // box-sizing: border-box;
  // padding: 10px;
  // background: #fff;
}

.title {
  margin-bottom: 10px;
  color: rgba(0, 0, 0, 0.45);
}

.search-wrap {
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search {
  width: calc(100% - 30px);
  font-size: 12px;

  .el-input__inner {
    font-size: 12px;
  }
}

.tree-btns {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.text {
  font-size: 14px;
  cursor: pointer;
}

.menu-item {
  height: 36px;

  .menu-nav {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
