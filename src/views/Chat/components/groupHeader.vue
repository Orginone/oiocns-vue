<template>
  <div class="group-header-wrap">
    <ul class="user flex">
      <HeadImg :name="chat.curChat.value?.name" :label="''" />
      <li class="user-info">
        <div class="user-info-top flex">
          <p class="user-info-top-name"
            >{{ chat.curChat.value?.name
            }}<span v-if="chat.curChat.value?.personNum > 0"
              >({{ chat.curChat.value?.personNum }}人)</span
            ></p
          >
          <el-tag size="small">{{ chat.curChat.value?.label }}</el-tag>
        </div>
      </li>
    </ul>
    <span class="btn-box">
      <el-icon
        class="add-btn btn"
        v-if="chat.curChat.value?.typeName !== '人员'"
        :size="20"
        @click="handleAddFun()"
      >
        <Plus />
      </el-icon>
      <el-icon class="detail-btn btn" :size="20" @click="handleMoreFun()">
        <More />
      </el-icon>
    </span>
  </div>

  <el-dialog customClass="QrDialog" v-model="dialogVisible" title="邀请好友" width="30%">
    <p>方式一：共享二维码，邀请好友</p>
    <div class="QrDiv" :key="chat.curChat.value.id">
      <QrCodeCustom :qrText="chat.curChat.value?.name" />
    </div>
    <p>方式二：共享链接，邀请好友</p>
    <div class="share-link">展示链接...</div>
    <template #footer>
      <span>
        <!-- <el-button @click="dialogVisible = false">取消</el-button> -->
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import HeadImg from '@/components/headImg.vue'
  import { ref } from 'vue'
  import {chat} from '@/module/chat/orgchat'
  import QrCodeCustom from '@/components/qrCode/index.vue'
  const emit = defineEmits(['viewDetail', 'addUserOrCohort'])

  const handleMoreFun = () => {
    emit('viewDetail')
  }
  const dialogVisible = ref(false)
  const handleAddFun = () => {
    // emit('addUserOrCohort')
    // console.log('测试', info.detail);

    dialogVisible.value = true
  }
</script>

<style lang="scss">
  .QrDialog {
    .txt {
      margin: 0 0 10px 15px;
      text-align: center;
    }
    .QrDiv {
      text-align: center;
    }
  }
</style>

<style lang="scss" scoped>
  .group-header-wrap {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 70px;
    min-height: 70px;
    box-shadow: 0 1px 2px 1px #e5e5e5;
    // z-index: 2;
    background-color: var(--el-bg-color);
    .btn-box {
      .btn {
        margin-right: 10px;
      }

      // .add-btn {
      // }
    }
  }

  .user {
    align-items: center;

    &-info {
      &-top {
        align-items: center;

        &-name {
          font-size: 16px;
          font-weight: 600;
          margin-right: 10px;
        }
      }
    }
  }
</style>
