<script setup lang="ts">
import { IActivity,IActivityMessage,MessageType } from '@/ts/core';
import { ActivityType } from '@/ts/base/model';
import { XEntity } from '@/ts/base/schema';
import orgCtrl from '@/ts/controller';
import { parseHtmlToText, showChatTime } from '@/utils/tools';
import ActivityComment from '../ActivityComment/index.vue'
import ActivityResource from '@/components/Activity/ActivityResource/index.vue'
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import { Bin, LikeOutlined, MessageOutlined } from '@/icons/im';

const props = defineProps<{
  hideResource?: boolean;
  item: IActivityMessage;
  activity: IActivity;
}>()
// 
const metadata = ref<ActivityType>(null)
// 订阅
let id = ''
onMounted(() => {
  metadata.value = props.item.metadata
  id = props.item.subscribe(()=>{
    metadata.value = props.item.metadata
  })
})
// 取消订阅
onBeforeUnmount(()=>{
  props.item.unsubscribe(id)
})

// 评论
const replyTo = ref<XEntity | null>(null)
const commenting = ref(false)
const comment = ref('')
const handleReply = async (userId: string = '') => {
  replyTo.value = null
  if (userId) {
    const user = await orgCtrl.user.findEntityAsync(userId);
    user && (replyTo.value = user)
  }
  commenting.value = true
};
</script>

<template>
  <li class="activity-item" v-if="metadata">
    <div class="activity-item-avatar">
      <EntityIcon :entityId="metadata.createUser" :size="45" />
    </div>
    <div class="activity-item-right"> 
      <div class="activity-creater-name">
        {{ activity.metadata.name }}
      </div>
      <div class="activity-content">
        <div class="activity-content-text" v-if="metadata.typeName===MessageType.Text">
          {{metadata.content}}
        </div>
        <div class="activity-content-link" v-else-if="metadata.typeName===MessageType.Html"> 
          <!-- 普通链接 -->
          <template v-if="hideResource">
            <div 
              style="
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{parseHtmlToText(metadata.content)}}
            </div>
          </template>
          <!-- 超链接 -->
          <div v-else v-html="metadata.content"></div>
        </div>
        <div class="activity-content-file-list" v-if="!hideResource">
          <ActivityResource :fileList="metadata.resource"/>
        </div>
      </div>
      <div class="activity-info">
        <div class="publish-time">
            发布于{{showChatTime(item.metadata.createTime)}}
        </div>
        <div class="operates-wrap" v-if="!hideResource">
          <!-- 点赞按钮 -->
          <div class="operates-btn" @click="async ()=>await item.like()">
            <template v-if="metadata.likes.includes(orgCtrl.user.id)">
              <ElIcon :size="24"><LikeOutlined/></ElIcon> <span>取消</span>
            </template>
            <template v-else>
              <ElIcon :size="24"><LikeOutlined /></ElIcon> <span>点赞</span>
            </template>
          </div>
          <!-- 评论按钮 -->
          <div class="operates-btn" @click="handleReply()">
            <ElIcon :size="24"><MessageOutlined /></ElIcon> <span>评论</span>
          </div>
          <div class="operates-btn" v-if="item.canDelete" @click="item.delete()">
            <ElIcon size="24"><Bin /></ElIcon> <span>删除</span>
          </div>
        </div>
      </div>
      <div class="activity-like-and-comment">
        <template v-if="metadata.likes.length">
          <!-- TODO: 点赞评论数 -->
          <template v-if="hideResource">
            <!-- TODO: 点赞数 -->
            <span  v-if="metadata.likes.length" style="font-size: 18px;color: #888" >
              <ElIcon :size="18" color="#cb4747"><LikeOutlined/></ElIcon>
              <b style="margin-left: 6px">{{metadata.likes.length}}</b>
            </span>
            <!-- TODO:评论数 -->
            <span  v-if="metadata.comments.length" style="font-size: 18px;color: #888">
              <ElIcon :size="18" color="#4747cb"><MessageOutlined/></ElIcon>
              <b :style="{ marginLeft: '6px' }">{{metadata.comments.length}}</b>
            </span>
          </template>
          <!-- 点赞列表 -->
          <div class="activity-like-list" v-else>
            <ElIcon :size="22" color="#cb4747"><LikeOutlined /></ElIcon>
            <div v-for="userId in metadata.likes"  :key="userId">
              <EntityIcon :entityId="userId" showName :gap="4"/>
            </div>
          </div>
        </template>   
        <div class="avtivity-comment-list" v-if="!hideResource && metadata.comments.length" >
          <ActivityComment
            v-for="item in metadata.comments"
            :key="item.time"
            :comment="item"
            @click="handleReply(item.userId)"
          />
        </div>
        <div class="activity-comment-input" v-if="commenting" >
          <input
            :placeholder="replyTo ? `回复${replyTo.name} :` : ''"
            v-model="comment"
          />
          <ElButton
            type="primary"
            size="small"
            @click="async () => {
              await item.comment(comment, replyTo?.id)
              commenting = false
              comment = ''
            }"
          >
            发送
          </ElButton>
        </div>             
      </div>
    </div>
  </li>
</template>

<style lang="scss" scoped>
  .activity-item {
    border-radius: 6px;
    padding: 24px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    gap: 16px;
    background-color: #FFFFFF;
    box-shadow: 0px 1px 2px 0px #1018280F,
      0px 1px 3px 0px #1018281A;
    .activity-item-right {
      width: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
      .activity-creater-name {
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
      .activity-content {
        //styleName: 14/CN-Medium;
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 500;
        line-height: 22px;
        letter-spacing: 0em;
        text-align: left;
        //  TODO: color/text & icon/text - color-2
        color: #424A57;
        .activity-content-file-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
      }
      .activity-info {
        display: flex;
        justify-content: space-between;
        .publish-time {
          //styleName: 12/CN-Regular;
          font-family: PingFang SC;
          font-size: 12px;
          font-weight: 400;
          line-height: 20px;
          letter-spacing: 0em;
          text-align: left;
          //  TODO: color/text & icon/text - color-2
          color: #424A57;
        }
        .operates-wrap {
          display: flex;
          gap: 48px;
          .operates-btn {
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            //styleName: 14/CN-Regular;
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: 400;
            // TODO: color/text & icon/text - color-1
            color: #15181D;
          }
        }
      }
      .activity-like-and-comment {
        display: flex;
        flex-direction: column;
        gap: 8px;
        .activity-like-list,.avtivity-comment-list {
          border-radius: 8px;
          padding: 4px 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          //  TODO: color/surface/次要容器背景
          background-color: #F7F8FA;
        }
        .avtivity-comment-list {
          flex-direction: column;
          gap: 12px;
        }
      }
      .activity-comment-input {
        border-radius: 8px;
        border: 1px solid #E7E8EB;
        background-color: #FFFFFF;
        padding: 9px 16px;
        display: flex;
        gap: 12px;
        input {
          flex: 1;
          border: 0;
          outline: 0;
        }
      }
    }
  }


</style>
