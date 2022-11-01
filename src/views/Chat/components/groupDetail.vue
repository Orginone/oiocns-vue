<template>
  <div class="group-detail-wrap">
    <el-row align="middle" style="padding-bottom: 12px">
      <el-col :span="4">
        <HeadImg :name="chat.curChat.value?.name" :label="''" />
      </el-col>
      <el-col :span="20">
        <h4 class="title">{{ chat.curChat.value?.name }}</h4>
        <div class="base-info-desc">{{ chat.curChat.value?.remark }}</div>
      </el-col>
    </el-row>
    <ul class="user-list">
      <li class="li-search con" v-if="chat.curChat.value?.typeName !== '人员'">
        <p class="li-search-con">组成员<span class="li-search-con-num">{{ chat.curChat.value?.personNum }}</span>人</p>
        <el-input class="li-search-inp" placeholder="搜索" v-model="searchValue" prefix-icon="Search" />
      </li>
      <ul class="img-list con">
        <li class="img-list-con img-list-add" @click="openDialogAdd" v-if="chat.curChat.value?.typeName === '群组'">+
        </li>
        <li class="img-list-con img-list-del" @click="openDialogDel" v-if="chat.curChat.value?.typeName === '群组'">
          <el-icon>
            <SemiSelect />
          </el-icon>
        </li>
        <li class="img-list-con" v-for="item in showPersons" :key="item.id" :title="item.name">
          <HeadImg :name="item.name" :label="''" />
          <span class="img-list-con-name">{{ item.name }}</span>
        </li>
        <span v-show="chat.curChat.value?.personNum > 10" class="img-list-more-btn"
          @click="chat.getPersons(false)">查看更多</span>
      </ul>
      <li class="con setting-con border-b" v-if="chat.curChat.value?.typeName === '群组'">
        <span class="con-label">我在本群昵称</span>
        <span class="con-value">测试昵称</span>
      </li>
      <li class="con setting-con border-b" v-if="chat.curChat.value?.typeName === '群组'">
        <span class="con-label">{{ `${chat.curChat.value?.typeName}备注` }}</span>
        <span class="con-value">{{ chat.curChat.value?.remark }}</span>
      </li>
      <li class="con check-con">
        <el-checkbox v-model="state.isIgnoreMsg"
          :label="chat.curChat.value?.typeName !== '人员' ? '设置群消息免打扰' : '设置免打扰'" />
      </li>
      <li class="con check-con">
        <el-checkbox v-model="state.isStick" :label="chat.curChat.value?.typeName !== '人员' ? '置顶该群' : '置顶会话'" />
      </li>
    </ul>
    <div class="footer" v-if="chat.curChat.value.spaceId === chat.userId.value">
      <template v-if="chat.curChat.value?.typeName === '群组'">
        <el-button type="danger" plain>退出该群</el-button>
        <el-button type="danger">解散该群</el-button>
      </template>
      <template v-if="chat.curChat.value?.typeName === '人员'">
        <el-button type="danger" plain>删除好友</el-button>
      </template>
      <template v-if="true">
        <el-button type="danger" v-on:click="chat.clearMsg()" plain>清空聊天记录</el-button>
      </template>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="邀请好友" width="30%">
    <div class="invitateBox">
      <template v-if="state.friendsData.length > 0">
        <div class="invitateBox-box" v-for="(item, index) in state.friendsData" :key="item.id"
          @click="onClickBox(item, index)">
          <div class="invitateBox-flex">
            <HeadImg :name="item.name" :label="''" />
            <div class="invitateBox-name">{{ item.name }}</div>
          </div>
          <div class="invitateBox-btn" :style="state.ids.includes(item.id) ? 'background:#466DFF' : ''">
            <div class="invitateBox-btn-in" v-if="state.ids.includes(item.id)"></div>
          </div>
        </div>
      </template>
      <template v-else>
        <el-empty description="暂无可拉取好友" />
      </template>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitInvite">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogVisibleDel" title="移出群聊" width="30%">
    <div class="invitateBox">
      <div class="invitateBox-box" v-for="(item, index) in chat.qunPersons.value" :key="item.id"
        @click="onClickBoxDel(item, index)">
        <div class="invitateBox-flex">
          <HeadImg :name="item.name" :label="''" />
          <div class="invitateBox-name">{{ item.name }}</div>
        </div>
        <div class="invitateBox-btn" :style="state.delids.includes(item.id) ? 'background:#466DFF' : ''">
          <div class="invitateBox-btn-in" v-if="state.delids.includes(item.id)"></div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisibleDel = false">取消</el-button>
        <el-button type="primary" @click="submitInviteDel">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import $services from '@/services'
import { ElMessage } from 'element-plus'
import HeadImg from '@/components/headImg.vue'
import { reactive, ref, computed } from 'vue'
import { chat } from '@/module/chat/orgchat'
import { TargetType } from '@/module/enums'
// 会话列表搜索关键字
const searchValue = ref<string>('')

const dialogVisible = ref(false) // 控制拉入群聊dialog
const dialogVisibleDel = ref(false) // 控制移出群聊dialog
const state = reactive({
  userList: [], //群成员
  total: 0, //总数
  isEditNickName: false, //是否编辑昵称
  isQunName: false, //是否编辑群名称
  isIgnoreMsg: false, //是否免打扰信息
  isStick: false, //是否置顶
  friendsData: [], // 我的好友
  ids: [], // 所选择到的好友id列表
  delfriendsData: [], // 群聊人员
  delids: [] // 所选择到的好友id列表 移出
})

interface itemResult {
  code: string
  createTime: string
  createUser: string
  id: string
  name: string
  status: number
  thingId: string
  typeName: string
  updateTime: string
  updateUser: string
  version: string
}

// 选择人员事件
const onClickBox = (item: itemResult, index: number) => {
  if (state.ids.indexOf(item.id) !== -1) {
    state.ids.splice(state.ids.indexOf(item.id), 1)
  } else {
    state.ids.push(item.id)
  }
}
// 选择人员事件
const onClickBoxDel = (item: itemResult, index: number) => {
  if (state.delids.indexOf(item.id) !== -1) {
    state.delids.splice(state.delids.indexOf(item.id), 1)
  } else {
    state.delids.push(item.id)
  }
}
// 搜索人员
const showPersons = computed((): itemResult[] => {
  return chat.qunPersons.value.filter((item) => {
    if (searchValue.value && searchValue.value.length > 0) {
      return item.name.includes(searchValue.value)
    }
    return true
  })
})
// 确认邀请人员入群
const submitInvite = () => {
  $services.cohort
    .pullPerson({
      data: {
        id: chat.curChat.value?.id,
        targetIds: state.ids
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        ElMessage({
          message: '邀请成功',
          type: 'success'
        })
        dialogVisible.value = false
        chat.getPersons(true)
      } else {
        ElMessage({
          message: '您不是群管理员',
          type: 'warning'
        })
      }
    })
}
// 确认人员移出群聊
const submitInviteDel = () => {
  $services.cohort
    .removePerson({
      data: {
        id: chat.curChat.value?.id,
        targetIds: state.delids
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        ElMessage({
          message: '移出成功',
          type: 'success'
        })
        dialogVisibleDel.value = false
        chat.getPersons(true)
      } else {
        ElMessage({
          message: '您不是群管理员',
          type: 'warning'
        })
      }
    })
}

const openDialogAdd = () => {
  dialogVisible.value = true
  chat.chats.value.forEach((item) => {
    if (item.id === chat.userId.value) {
      state.friendsData = item.chats.filter((c) => {
        if (c.typeName === '人员') {
          let exist = false
          chat.qunPersons.value.forEach((p) => {
            if (c.id === p.id) {
              exist = true
            }
          })
          return !exist
        }
        return false
      })
    }
  })
}
const openDialogDel = () => {
  dialogVisibleDel.value = true
}
</script>

<style lang="scss" scoped>
.img-list-add {
  cursor: pointer;
  width: 50px;
  height: 50px;
  background: var(--el-bg-color-overlay);
  border-radius: 2px;
  color: rgba(0, 0, 0, 0.45);
  border: 1px dashed var(--el-border-color);
  font-size: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  // margin-right: 16px;
  margin-bottom: 20px !important;
}

.img-list-del {
  cursor: pointer;
  width: 50px;
  height: 50px;
  // background: #ffffff;
  border-radius: 2px;
  border: 1px dashed var(--el-color-danger);
  font-size: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--el-color-danger);
  // margin-right: 16px;
  margin-bottom: 20px !important;
}

.invitateBox {
  width: 100%;
  height: 500px;
  overflow: auto;

  &-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      width: 60px;
      height: 60px;
      background-size: 100% 100%;
      border-radius: 50%;
    }
  }

  &-name {
    margin-left: 20px;
  }

  &-box {
    height: 60px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    justify-content: space-between;
    cursor: pointer;
  }

  &-btn {
    width: 16px;
    height: 16px;
    background: #f3f4f9;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    &-in {
      width: 6px;
      height: 6px;
      background: var(--el-bg-color-overlay);
      border-radius: 50%;
    }
  }
}

.group-detail-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 340px;
  border-left: 1px solid var(--el-border-color);
  padding: 15px;
  background-color: var(--el-bg-color-overlay);

  .title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
    margin-top: 0;
  }

  // 群基本信息
  .base {
    align-items: center;
    padding-bottom: 15px;

    &-img {
      width: 60px;
      height: 60px;
      margin-right: 15px;
      border-radius: 50%;
    }

    &-info {
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      height: 100%;

      &-top {
        align-items: center;

        &-name {
          font-size: 16px;
          font-weight: 600;
          margin-right: 10px;
        }
      }

      &-desc {
        font-size: 13px;
        color: var(--el-color-info-dark-2);
      }
    }
  }

  .con {
    padding: 10px 0 0 0;
  }

  // 群成员
  .user-list {
    .li-search {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &-con {
        font-size: 15px;
        font-weight: 500;
        // color: #333;

        &-num {
          margin-left: 10px;
        }
      }

      &-inp {
        width: 120px;
      }
    }
  }

  .img-list {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    max-height: 50vh;
    overflow-y: auto;

    &-con {
      display: flex;
      flex-direction: column;
      align-self: center;
      margin-right: 10px;
      // margin-bottom: 10px;
      cursor: pointer;
      border-radius: 2px;

      &-img {
        width: 50px;
        height: 50px;
      }

      &-name {
        font-size: 10px;
        line-height: 20px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 50px;
      }
    }

    &-more-btn {
      width: 100%;
      text-align: center;
      color: var(--el-color-primary);
      cursor: pointer;
    }
  }

  .setting-con {
    display: flex;
    justify-content: space-between;

    .con-label {
      font-weight: bold;
      width: 100px;
      min-width: 100px;
      // color: #333;
    }
  }

  .check-con {
    .el-checkbox {
      height: 26px;
    }
  }

  // 底部按钮
  .footer {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
  }

  .border-b {
    border-bottom: 1px solid var(--el-border-color); // #d6d6d6;
    padding-bottom: 10px;
  }
}
</style>
