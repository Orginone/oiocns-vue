<script setup lang="ts">
import TeamIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import { IDEntity, ISession, ITarget, TargetType,IFile } from '@/ts/core'
import ChatBody from './chat/index.vue'
import MemberBody from './member/index.vue'
import { command } from '@/ts/base'
import TargetActivity from '@/components/TargetActivity/index.vue'
import { loadFileMenus } from '@/executor/fileOperate'
import OrgIcons from '@/components/Common/GlobalComps/orgIcons.vue'
import Directory from '@/components/Directory/index.vue'
import { cleanMenus } from '@/utils/tools'

const props = defineProps<{
  target: ITarget;
  session: ISession;
  setting?: boolean;
}>()

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
  <div class="group-detail">
    <div class="group-datail-header">
      <div class="group-datail-header-left">
        <div class="avatar"><TeamIcon :entityId="session.metadata.id" :size="48" /></div>
        <div class="info">
          <div class="info-name">
            <span style="margin-right: 10px;">{{session.chatdata.chatName}}</span>
            <span class="number" v-if="session.members.length > 0">({{session.members.length}})</span>
          </div>
          <div class="info-remark">{{session.metadata.remark}}</div>
        </div>
      </div>
      <div class="group-datail-header-right">
        <a class="action-btn" v-for="flag in actions" :key="flag"
          :title="getTitle(flag)"
          @click="bodyType = flag"
        >
          <OrgIcons :key="bodyType" :type="flag" :selected="bodyType === flag" :size="20" />
        </a>        
      </div>
    </div>
    <div class="group-detail-main" :key="session.key">
      <!-- 聊天 -->
      <ChatBody v-if=" bodyType==='chat'"  :chat="session" filter='' />
      <!-- 动态 -->
      <TargetActivity v-else-if="bodyType==='activity'" height="100%" :activity="session.activity" />      
      <!-- 数据 -->
      <Directory v-else-if="bodyType==='store'" :root="session.target.directory"/>
      <!-- 关系 -->
      <MemberBody v-else-if="bodyType==='relation'" :memberDirectory="session.target.memberDirectory"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.group-detail {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .group-datail-header {
    height: 72px;
    // TODO: color/surface/分割线
    border-bottom: 1px solid #E7E8EB;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24PX;
    .group-datail-header-left {
      height: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      .avatar {
        width: 48px;
        height: 48px;
        border-radius: 8px;
      }
      .info {
        .info-name {
          //styleName: 16/CN-Medium;
          font-family: PingFang SC;
          font-size: 16px;
          font-weight: 500;
          line-height: 24px;
          letter-spacing: 0em;
          text-align: left;
          //  TODO: color/text & icon/text - color-1
          color: #15181D;
        }
        .info-remark {
          max-width: 400px;
          //styleName: 14/EN-Regular;
          font-family: Nunito Sans;
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          letter-spacing: 0em;
          text-align: left;
          //  TODO: color/text & icon/text - color-2
          color: #424A57;
          text-wrap: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
    .group-datail-header-right {
      display: flex;
      gap: 16px;
      .action-btn {
        cursor: pointer;
      }
    }
  }
  .group-detail-main {
    height: 0;
    flex:1 0;
    padding: 16px 24px;
  }
}

</style>
