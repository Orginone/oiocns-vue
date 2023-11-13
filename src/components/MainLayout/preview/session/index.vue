<script setup lang="ts">
import TeamIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import { ISession, ITarget, TargetType } from '@/ts/core'
import { ellipsisText } from '@/utils'
import ChatBody from './chat/index.vue'
import MemberContent from './member/index.vue'
import { command } from '@/ts/base'
import TargetActivity from '@/components/TargetActivity/index.vue'
import { AddressBook, Qrcode, Bubbles2, Lifebuoy, Folder } from '@/icons/im'
import orgCtrl from '@/ts/controller'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  target: ITarget;
  session: ISession;
  setting?: boolean;
}>()

const bodyType=ref(props.setting ? 'activity' : 'chat');

</script>

<template>
  <div class="groupDetail">
    <!-- 头部 -->
    <div class="header">
      <!-- 头部-左侧群信息 -->
      <div class="left">
        <div class="avatar"><TeamIcon :entity="session.metadata" :size="50" /></div>
        <div class="txt">
          <div class="title">
            <span style="margin-right: 10px;">{{session.chatdata.chatName}}</span>
            <span class="number" v-if="session.members.length > 0">({{session.members.length}})</span>
          </div>
          <div class="description">{{ellipsisText(session.chatdata.chatRemark, 50)}}</div>
        </div>
        
      </div>
      <!-- 头部-右侧action -->
      <div class="header-action">
        <ElIcon title="沟通" v-if="session.isMyChat && target.typeName !== TargetType.Group" :size="26">
          <Bubbles2  @click="bodyType='chat'"/>
        </ElIcon>
        <ElIcon title="动态" :size="26">
          <Lifebuoy  @click="bodyType='activity'"/>
        </ElIcon>
        <template v-if="session.members.length > 0 || session.id === session.userId">
          <ElIcon title="存储" :size="26">
            <Folder  @click="orgCtrl.currentKey = target.directory.key;router.push('/store')"/>
          </ElIcon>          
          <ElIcon title="成员" :size="26">
            <AddressBook  @click="bodyType='member'"/>
          </ElIcon>
        </template>  
        <ElIcon title="二维码" :size="26">
          <Qrcode  @click="command.emitter('executor', 'qrcode', target)"/>
        </ElIcon>
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="groupDetailContent">
      <!-- 聊天 -->
      <template v-if="bodyType==='chat'">
        <ChatBody :chat="session" filter='' />
      </template>
      <!-- 成员 -->
      <template v-else-if="bodyType==='member'">
        <template v-if="session.members.length > 0 || session.id === session.userId">
          <MemberContent :dircetory="target.memberDirectory" />
        </template> 
        <template v-else-if="setting">
          <TargetActivity height="700" :activity="session.activity" />
        </template>
        <template v-else>
          <ChatBody :chat="session" filter='' />;
        </template>
      </template>
      <!-- 动态 -->
      <template v-else-if="bodyType==='activity'">
        <TargetActivity height="700" :activity="session.activity" />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// @import '~antd/es/style/themes/variable';
.img_list_add {
  cursor: pointer;
  width: 50px;
  height: 50px;
  background: #fff;
  border-radius: 2px;
  color: rgba(0, 0, 0, 0.45);
  border: 1px dashed #dcdfe6;
  font-size: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px !important;
}

.img_list_del {
  cursor: pointer;
  width: 50px;
  height: 50px;
  border-radius: 2px;
  border: 1px dashed var(--el-color-danger);
  font-size: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--el-color-danger);
  margin-bottom: 20px !important;
}

.groupDetail {
  position: relative;
  display: flex;
  flex-direction: column;
  .header {
    border-bottom: 1px solid #ebeef5;
    // 
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding: 12px 0;
    color: rgba(0,0,0,.85);
    svg {
      cursor: pointer;
      color: #9498df;
      :hover {
        color: #4f55ca;
      }
    }
    // 
    .left {
      display: flex;
      .txt {
        margin-left: 10px;
        .description {
          color: rgba(0,0,0,.45);
          font-size: 14px;
          line-height: 1.5715;
        }
      }
    }
    .header-action {
      text-wrap: none;
      margin-left: 48px;
      >i {
        margin: 0 8px;
      }
    }
  }
  .title {
    margin-bottom: 4px;
    color: rgba(0,0,0,.85);
    font-size: 14px;
    line-height: 1.5715;
    .number {
      margin-left: 4px;
    }
  }
  &Content {
    height: calc(100vh - 175px);
  }
  &ActionArea {
    width: 100%;
    padding: 34px 70px;
    display: flex;
    justify-content: space-between;
    &Item {
      display: flex;
      flex-direction: column;
      align-items: center;
      &__icon {
        width: 50px;
        height: 50px;
        // TODO:
        // border: 2px solid @primary-color;
        border: 2px solid blue;
        border-radius: 50%;
        padding: 10px;
        &Active {
          // border: 2px solid @primary-color;
          background-color: red;
        }
      }
    }
  }
  .base_info_desc {
    font-size: 12px;
    color: #666;
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
          font-size: 14px;
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
    padding: 6px 0 0 0;
  }

  // 群成员
  .user_list {
    .li_search {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-con {
        font-size: 15px;
        font-weight: 500;
        &-num {
          margin-left: 10px;
        }
      }
      &-inp {
        width: 120px;
      }
    }
    min-height: 188px;

    .find_history {
      cursor: pointer;
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      .find_history_button {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }
    }
  }

  .img_list {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    max-height: 50vh;
    overflow-y: auto;
    margin-bottom: 16px;
    &.con {
      display: flex;
      align-self: center;
      margin-right: 10px;
      cursor: pointer;
      border-radius: 2px;
      max-height: 230px;
      .show_persons {
        display: flex;
        flex-direction: column;
        margin-bottom: 8px;
        .img_list_con_name {
          font-size: 12px;
          width: 40px;
          text-align: center;
        }
      }
      .img_list_con {
        border: 1px solid rgba(0, 0, 0, 0.45);
        width: 40px;
        min-width: 40px;
        height: 40px;
        margin-right: 10px;
      }

      &.img {
        width: 50px;
        height: 50px;
      }

      &.name {
        font-size: 10px;
        line-height: 20px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 50px;
      }
    }

    &.more_btn {
      width: 100%;
      color: #3e5ed8;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      .more_btn_icon {
        margin-left: 6px;
      }
    }
  }

  .setting_con {
    display: flex;
    flex-direction: column;

    .con_label {
      // TODO:
      // text-shadow: @btn-text-shadow;
      width: 100px;
      min-width: 100px;
    }
    .con_value {
      font-size: 13px;
      color: #909399;
    }
    & + .setting_con {
      margin-top: 4px;
    }
  }

  .check_con {
    margin-top: 4px;
    display: flex;
    justify-content: space-between;
    .el_checkbox {
      height: 26px;
    }
  }

  // 底部按钮
  .footer {
    // position: absolute;
    // bottom: 20px;
    // left: 0;
    // right: 0;
    padding-bottom: 30px;
    margin: 0 auto;
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    // :global {
    //   .ogo-btn-primary {
    //     margin-bottom: 16px;
    //   }
    // }
  }
}

</style>