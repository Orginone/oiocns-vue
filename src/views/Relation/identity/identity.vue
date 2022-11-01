<template>
  <div class="container">
    <el-card class="wrap">
      <div>
        <div class="title">{{router.currentRoute.value.query?.name}}的岗位</div>
      </div>

      <div class="search-wrap">
        <el-input class="search" @input="serachData()" v-model="searchText" placeholder="搜索岗位">
          <template #suffix>
            <el-icon class="el-input__icon">
              <search />
            </el-icon>
          </template>
        </el-input>
        <li class="con tree-btns" v-if="allowAdd()">
          <el-icon color="#154ad8" :size="20" @click="createIdntityDialog = true">
            <CirclePlus />
          </el-icon>
        </li>
      </div>
      <div>
        <el-menu default-active="0" class="el-menu-vertical-demo">
          <el-menu-item class="menu-item" :index="index.toString()" v-for="(item, index) in  identityList.list"
            @click="checkItem(item)">
            <div class="menu-nav">{{item.name}}</div>
          </el-menu-item>
        </el-menu>
      </div>
    </el-card>


    <el-dialog v-model="createIdntityDialog" title="请录入岗位信息" width="40%" center append-to-body @close="dialogHide">
      <div>
        <el-form-item label="岗位名称" style="width: 100%">
          <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="岗位编号" style="width: 100%">
          <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="所属角色" style="width: 100%">
          <el-cascader :props="cascaderProps" :options="cascaderTree" v-model="formData.authId" style="width: 100%"
            placeholder="请选择" />
        </el-form-item>
        <el-form-item label="岗位简介" style="width: 100%">
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
import { useRouter } from 'vue-router'
import { ref, onMounted, reactive } from 'vue'
import $services from '@/services'
import { ElMessage } from 'element-plus'
import authority from '@/utils/authority'
import identityServices from '@/module/relation/identity'

const IdentityServices = new identityServices()
const emit = defineEmits(['itemClick'])

const router = useRouter()
// 当前组织ID
const createIdntityDialog = ref<boolean>(false)
let formData = reactive<any>({})
const belongId = ref<any>('')
const module = ref<any>('company')
const persons = ref<any>('getPersons')
// 岗位列表
const identityList = reactive({ list: [] })

const allowAdd = () => {
  return authority.IsRelationAdmin([
    belongId.value,
    authority.getSpaceId()
  ])
}

const searchText = ref<string>('');
const serachData = async () => {
  const data = await IdentityServices.getIdentitys(belongId.value,searchText.value)
  if (data) {
    identityList.list = data.result
    emit('itemClick',identityList.list[0])
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
  const data = await IdentityServices.getIdentitys(belongId.value,'')
  if (data) {
    identityList.list = data.result
    emit('itemClick',identityList.list[0])
  }
}
const createIdentity = async () => {
  let obj =  {
    belongId: belongId.value,
    name: formData.name,
    code: formData.code,
    remark: formData.remark,
    authId: formData.authId
  }
  const data =  await IdentityServices.createIdentity(obj)
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
  checkStrictly: true,
  value: 'id',
  label: 'name',
  children: 'nodes',
  emitPath: false,
}

// 加载角色树
const loadAuthorityTree = async () => {
  const data = await IdentityServices.getAuthorityTree(belongId.value)
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
  module.value = router.currentRoute.value.query?.module
  persons.value = router.currentRoute.value.query?.persons
  belongId.value = router.currentRoute.value.query?.belongId
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
