<script setup lang="ts">
import TeamIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import { IDEntity, ISession, ITarget, TargetType,IFile } from '@/ts/core'
import ChatBody from './chat/index.vue'
import { command } from '@/ts/base'
import TargetActivity from '@/components/TargetActivity/index.vue'
import { loadFileMenus } from '@/executor/fileOperate'
import OrgIcons from '@/components/Common/GlobalComps/orgIcons.vue'
import Directory from '@/components/Directory/index.vue'
import DirectoryViewer from '@/components/Directory/views/index.vue'
import { cleanMenus } from '@/utils/tools'

const props = defineProps<{
  target: ITarget;
  session: ISession;
  setting?: boolean;
}>()

// TODO:
console.log(props.session);


const actions = ref<string[]>()
const bodyType=ref(props.setting ? 'activity' : 'chat')

watch(() => props.session, () => {
  const newActions: string[] = []
  if (props.session.target.typeName === TargetType.Storage) {
    newActions.push('relation', 'activity');
  } else {
    if (props.session.isMyChat && props.session.target.typeName !== TargetType.Group) {
      newActions.push('chat');
    }
    newActions.push('activity');
    if (props.session.id === props.session.target.id) {
      newActions.push('store', 'relation');
    }
  }
  if (props.session.target.hasRelationAuth()) {
    newActions.push('setting');
  }
  actions.value = newActions
  if (!newActions.includes(bodyType.value)) {
    if (props.setting && newActions.includes('relation')) {
      bodyType.value = 'relation'
    } else {
      bodyType.value = newActions[0]
    }
  }
},{immediate:true})

const getTitle = (flag: string) => {
  switch (flag) {
    case 'chat':
      return '沟通';
    case 'activity':
      return '动态';
    case 'store':
      return '数据';
    case 'relation':
      return '关系';
    default:
      return '设置';
  }
}

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
          <!-- 标签 -->
          <div class="description">
            <ElTag
              v-for="label in session.groupTags.filter(i=>i.length>0)" 
              :key="label" 
              :type="label === '置顶' ? 'danger' : 'success'"
            >
              {{ label }}
            </ElTag>
          </div>
        </div>
        
      </div>
      <!-- 头部-右侧action -->
      <div class="header-action">
        <a v-for="flag in actions" :key="flag"
          :title="getTitle(flag)"
          @click="bodyType = flag"
        >
          <OrgIcons :key="bodyType" :type="flag" :selected="bodyType === flag" :size="26" />
        </a>        
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="groupDetailContent" :key="session.key">
      <!-- 聊天 -->
      <ChatBody v-if=" bodyType==='chat'"  :chat="session" filter='' />
      <!-- 动态 -->
      <TargetActivity v-else-if="bodyType==='activity'" height="700" :activity="session.activity" />      
      <!-- 数据 -->
      <Directory v-else-if="bodyType==='store'" :root="session.target.directory"/>
      <!-- 关系 -->
      <DirectoryViewer v-else-if="bodyType==='relation'" 
        extraTags
        :initTags="['成员']"
        :currentTag='"成员"'
        :selectFiles="[]"
        :content="session.target.memberDirectory.content()"
        :fileOpen="()=>{}"
        :contextMenu="(entity: IDEntity | undefined) => {
          const file = (entity as IFile) || session.target.memberDirectory;
          return {
            items: cleanMenus(loadFileMenus(file)) || [],
            onClick: (key: string) => {
              command.emitter('executor', key, file)
            },
          }
        }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
  height: 100%;
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
      display: flex;
      gap: 10px;
      margin-left: 48px;
      >a {
        cursor: pointer;
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
    height: 0;
    flex:1 0;
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
