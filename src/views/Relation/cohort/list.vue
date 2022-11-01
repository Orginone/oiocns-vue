<template>
  <div class="container">
    <div class="tab-list">
      <el-table border :data="state.cohorts" stripe class="table">
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="name" label="群组名称" width="240" />
        <el-table-column prop="code" label="群组编号" width="200" />
        <el-table-column prop="persons" label="群组成员" width="250">
          <template #default="scope">
            <div v-for="(person, index) in scope.row.persons" class="avatar-container" :title="person.name">
              <el-avatar class="avatar" :size="24">
                <template #default>
                  <div class="exceedCount">{{person.name.substring(0, 1)}}</div>
                </template>
              </el-avatar>
            </div>
            <el-tag size="small">{{scope.row.personCount}}人</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="team.remark" label="群组简介" min-width="200" />
        <el-table-column prop="belongId" label="归属" min-width="200">
          <template #default="scope">
            <div>{{chat.getName(scope.row.belongId)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="identitys" label="我的群身份" min-width="200">
          <template #default="scope">
            <div>{{authority.GetTargetIdentitys(scope.row.id)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="创建人" min-width="100">
          <template #default="scope">
            <div>{{chat.getName(scope.row.createUser)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="200" />
        <el-table-column prop="name" label="操作" width="240" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="toChat(scope.row)">进入会话</el-button>
            <el-button link type="primary" @click="invite(scope.row)">邀请成员</el-button>
            <el-dropdown>
              <el-button link type="primary" class="dropdown-btn">更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="props.type == '管理的'" @click="edit(scope.row)">
                    <el-icon>
                      <Edit />
                    </el-icon>修改群组
                  </el-dropdown-item>
                  <el-dropdown-item v-if="props.type == '管理的'" @click="toAuth(scope.row)">
                    <el-icon>
                      <Edit />
                    </el-icon>角色管理
                  </el-dropdown-item>
                  <el-dropdown-item v-if="props.type == '管理的'" @click="toIndentity(scope.row)">
                    <el-icon>
                      <Avatar />
                    </el-icon>身份管理
                  </el-dropdown-item>
                  <el-dropdown-item v-if="props.type == '管理的' && workspaceData.type !=2" @click="moveAuth(scope.row)">
                    <el-icon>
                      <Switch />
                    </el-icon>转移权限
                  </el-dropdown-item>
                  <el-dropdown-item v-if="props.type == '加入的'" @click="exit(scope.row)">
                    <el-icon>
                      <Remove />
                    </el-icon>退出群聊
                  </el-dropdown-item>
                  <el-dropdown-item v-if="props.type == '管理的'" @click="deleteCohort(scope.row)">
                    <el-icon>
                      <Delete />
                    </el-icon>解散群组
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <!-- 邀请成员加入群 -->
  <SearchUser v-if="searchDialog" :serachType="1" @closeDialog="searchDialog = false" @checksSearch='checksSearch' />

  <el-dialog v-model="editCohortDialog" title="创建群组" width="35%">
    <el-form-item label="群组名称">
      <el-input v-model="formData.name" placeholder="请输入群组名称" clearable />
    </el-form-item>
    <el-form-item label="群组编号">
      <el-input v-model="formData.code" placeholder="请输入群组编号" clearable />
    </el-form-item>
    <el-form-item label="群组简介">
      <el-input v-model="formData.remark" placeholder="请输入群组简介" type="textarea" clearable :rows="4" />
    </el-form-item>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editCohortDialog = false">取消</el-button>
        <el-button type="primary" @click="update">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <SearchGroupPerson v-if="searchGroupDialog" :serachType="2" :id="checkId" @closeDialog="searchGroupDialog = false"
    @checksGroupSearch="checksGroupSearch" />
</template>

<script lang="ts" setup>
import $services from '@/services'
import { ref, onMounted, reactive, watch } from 'vue'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router';
import SearchUser from '@/components/searchs/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { chat } from '@/module/chat/orgchat'
import authority from '@/utils/authority'
import CohortServices from '@/module/relation/cohort'
const cohortServices = new CohortServices()
const { queryInfo, workspaceData } = useUserStore()
const router = useRouter()

let searchDialog = ref<boolean>(false)

const searchGroupDialog = ref<boolean>(false)

const props = defineProps({
  type: {
    type: String
  }
})
// 当前操作的群组
let curCohort = ref<any>({})
const state = reactive({
  cohorts: [],
})

let formData = ref<any>({})

const editCohortDialog = ref(false)

// 获取我加入的群列表
const getCohorts = async () => {
  const res = await $services.cohort.getJoinedCohorts({ data: { offset: 0, limit: 100 } })
  const { data, success } = res
  if (success && data && data.result) {
    if (props.type == '管理的') {
      state.cohorts = data.result.filter((d: any) => {
        return authority.IsRelationAdmin([d.id, d.belongId])
      })
    } else if (props.type == '加入的') {
      state.cohorts = data.result.filter((d: any) => {
        return !authority.IsRelationAdmin([d.id, d.belongId])
      })
    }
    for (const c of state.cohorts) {
      // 获取群组成员
      $services.cohort.getPersons({ data: { id: c.id, offset: 0, limit: 10 } }).then((res: any) => {
        if (res.success) {
          c.personCount = res.data.total
          c.persons = res.data.result;
        } else {
          c.personCount = 0
          c.persons = []
        }
      })

    }
  }
}

// 进入会话
const toChat = (cohort: any) => {
  router.push({ name: 'chat', params: { defaultOpenID: cohort.id, spaceId: cohort.belongId } })
}

// 修改群组信息
const edit = (cohort: any) => {
  editCohortDialog.value = true
  curCohort.value = cohort
  formData.value = { name: cohort.name, code: cohort.code, remark: cohort.team?.remark }
}

const update = async () => {
  const obj = {
    id: curCohort.value.id,
    name: formData.value.name,
    code: formData.value.code,
    teamName: formData.value.name,
    teamCode: formData.value.code,
    teamRemark: formData.value.remark,
    thingId: curCohort.value.thingId,
    belongId: curCohort.value.belongId,
  }
  const data = await cohortServices.update(obj)
  if (data) {
    ElMessage({
      message: '修改成功',
      type: 'success'
    })
    editCohortDialog.value = false
    getCohorts()
  }
}
//权限转移
const checksGroupSearch = (val: any) => {
  
  if (val.value.length > 0) {
    updateBelong(val.value[0].id)
  } else {
    searchGroupDialog.value = false
  }
}
const updateBelong = async (belongId?: string) => {
  const data = await cohortServices.update({
    id: curCohort.value.id,
    name: curCohort.value.name,
    code: curCohort.value.code,
    belongId: belongId,
    thingId: curCohort.value.thingId,
    teamName: curCohort.value.team.name,
    teamCode: curCohort.value.team.code,
    teamRemark: curCohort.value.team.remark,
  })
  if (data) {
    ElMessage({
      message: '转让成功',
      type: 'success'
    })
    searchGroupDialog.value = false;
    getCohorts()
  }
}

// 选择人员后的回调
const checksSearch = (res: any) => {
  if (res.value.length > 0) {
    const targetIds = res.value.map((v: any) => v.id);
    $services.cohort.pullPerson({
      data: { id: curCohort.value.id, targetIds }
    }).then((res: any) => {
      if (res.success) {
        ElMessage.success('邀请人员成功！')
        getCohorts()
      } else {
        ElMessage.error('邀请人员失败！')
      }
    })
    searchDialog.value = false;
  } else {
    searchDialog.value = false;
  }
}

// 邀请成员
const invite = (cohort: any) => {
  curCohort.value = cohort
  searchDialog.value = true
}

// 角色(角色)管理
const toAuth = (cohort: any) => {
  router.push({
    path: '/relation/authority',
    query: {
      title: '群组',
      belongId: cohort.id,
      name: cohort.name,
      code: cohort.code,
      teamRemark: cohort.team?.remark
    }
  })
}

// 岗位管理
const toIndentity = (cohort: any) => {
  router.push({
    path: '/relation/identity',
    query: {
      title: '群组',
      belongId: cohort.id,
      name: cohort.name,
      module: 'cohort',
      persons: 'getPersons',
    }
  })
}

const checkId = ref<string>('');

// 转移权限
const moveAuth = (cohort: any) => {
  curCohort.value = cohort
  searchGroupDialog.value = true;
  checkId.value = cohort.id
}

// 退出群聊
const exit = (cohort: any) => {
  ElMessageBox.confirm(
    `确定退出 ${cohort.name} 群组吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    $services.cohort.exit({
      data: {
        id: cohort.id,
      }
    }).then((res: ResultType) => {
      if (res.success) {
        ElMessage({
          message: '退出成功',
          type: 'success'
        })
        getCohorts()
      }
    })
  })
}

// 删除群聊
const deleteCohort = (cohort: any) => {
  ElMessageBox.confirm(
    `确定解散 ${cohort.name} 群组吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    $services.cohort.delete({
      data: {
        id: cohort.id,
      }
    }).then((res: ResultType) => {
      if (res.success) {
        ElMessage({
          message: '解散成功',
          type: 'success'
        })
        getCohorts()
      } else {
        ElMessage.error(res.msg)
      }
    })
  })
}

onMounted(() => {
  getCohorts()
})

watch(props, () => {
  getCohorts()
});

</script>
<style lang="scss" scoped>
.container {
  // background-color: var(--el-bg-color);
  // padding: 5px;
  width: 100%;
  height: 100%;

  .tab-list {
    height: calc(100vh - 230px);
  }

  .table {
    width: 100%;
    height: 100%;
  }
}

.avatar-container {
  display: inline-block;

  .avatar {
    margin-left: -8px;
    cursor: pointer;

    .exceedCount {
      padding-top: 0px;
    }
  }
}

.dropdown-btn {
  margin-left: 12px;
  margin-top: 2px;
}
</style>
