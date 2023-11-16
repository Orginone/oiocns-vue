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
  <li class="listItem" v-if="metadata">
    <div class="listItemMeta"> 
      <!-- 发布者头像 -->
      <div class="listItemMetaAvatar" style="margin-right: 16px;">
        <EntityIcon :entity="activity.metadata" :size="50" />
      </div>
      <div class="listItemMetaContent">
        <!-- 发布者名称 -->
        <div class="listItemMetaContentTitle">
          {{ activity.metadata.name }}
        </div>
        <!-- 标签 -->
        <ElTag class="listItemTag"
          v-for="(item,index) in metadata.tags" :key="index"
          color="processing"
        >
          {{ item }}
        </ElTag>
        <!--  -->
        <div class=" listItemDescription activityItem">
          <!-- 内容 -->
          <div class="activityItemContent">
            <!-- 文字 -->
            <template v-if="metadata.typeName===MessageType.Text">
              <div>
                {{metadata.content}}
              </div>
            </template>
            <!-- 链接地址 -->
            <template v-else-if="metadata.typeName===MessageType.Html"> 
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
            </template>
            <!-- 图片 -->
            <div class="activityItemImageList" v-if="!hideResource">
              <div class="previewGroup"
                style="
                  max-width: 600px;
                  display: -webkit-box;
                  display: -ms-flexbox;
                  display: flex;
                  -ms-flex-wrap: wrap;
                  flex-wrap: wrap;
                  -webkit-box-align: start;
                  -ms-flex-align: start;
                  align-items: flex-start;
                  -webkit-box-pack: start;
                  -ms-flex-pack: start;
                  justify-content: flex-start;
                  gap: 8px;
                "
              >
                <ActivityResource
                  :fileList="metadata.resource"
                  :maxWidth="600"
                />
              </div>
              <!-- <Image.PreviewGroup>
                {ActivityResource(metadata.resource, 600)}
              </Image.PreviewGroup> -->
            </div>
          </div>
          <!-- 发布时间和操作 -->
          <div class="activityItemFooter">
            <!-- 发布时间 -->
            <div style="display: flex;align-items: center;color: rgba(0,0,0,.45)">
              <EntityIcon :entityId="metadata.createUser" showName />
              <span class="activityTime">
                发布于{{showChatTime(item.metadata.createTime)}}
              </span>
            </div>
            <!-- 操作 -->
            <div v-if="!hideResource">
              <ElSpace spacer="|" wrap :size="2">
                <!-- 点赞按钮 -->
                <ElButton @click="async ()=>await item.like()" text size="small">
                  <template v-if="metadata.likes.includes(orgCtrl.user.id)">
                    <ElIcon color="#cb4747"><LikeOutlined/></ElIcon> <span>取消</span>
                  </template>
                  <template v-else>
                    <ElIcon><LikeOutlined /></ElIcon> <span>点赞</span>
                  </template>
                </ElButton>
                <!-- 评论按钮 -->
                <ElButton @click="handleReply()" text size="small">
                  <ElIcon><MessageOutlined /></ElIcon> <span>评论</span>
                </ElButton>
                <ElButton v-if="item.canDelete" text size="small" @click="item.delete()">
                  <ElIcon><Bin /></ElIcon> <span>删除</span>
                </ElButton>
              </ElSpace>
            </div>

          </div>
          <!-- 点赞评论数|点赞列表 -->
          <div class="activityItemFooterLikes"
            :style="{display: metadata.likes.length ? 'flex' : 'none'}"
          >
            <!-- 点赞评论数 -->
            <template v-if="hideResource">
              <!-- 点赞数 -->
              <span 
                v-if="metadata.likes.length"
                style="font-size: 18px;color: #888"
              >
                <ElIcon :size="18" color="#cb4747"><LikeOutlined/></ElIcon>
                <b style="margin-left: 6px">{{metadata.likes.length}}</b>
              </span>
              <!-- 评论数 -->
              <span 
                v-if="metadata.comments.length"
                style="font-size: 18px;color: #888"
              >
                <ElIcon :size="18" color="#4747cb"><MessageOutlined/></ElIcon>
                <b :style="{ marginLeft: '6px' }">{{metadata.comments.length}}</b>
              </span>
            </template>
            <!-- 点赞列表 -->
            <template v-else>
              <ElIcon :size="18" color="#cb4747"><LikeOutlined /></ElIcon>
              <div
                v-for="userId in metadata.likes" 
                :key="userId" 
                :style="{ alignItems: 'center', display: 'flex' }"
              >
                <EntityIcon :entityId="userId" showName/>
              </div>
            </template>
          </div>

          <!-- 评论列表 -->
          <div class="activityItemCommentList"
            v-if="!hideResource && metadata.comments.length"  
          >
            <ActivityComment
              v-for="item in metadata.comments"
              :key="item.time"
              :comment="item"
              @click="handleReply(item.userId)"
            />
          </div>
          <!-- 回复 -->
          <div
            class="activityItemCommentInputBox"
            :style="{ display: commenting ? 'flex' : 'none' }"
          >
            <ElInput
              :placeholder="replyTo ? `回复${replyTo.name} :` : ''"
              rows="1"
              v-model="comment"
              type="textarea"
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
    </div>
  </li>
</template>

<style lang="scss" scoped>
  .listItem {
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
    .listItemMeta {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      -webkit-box-align: start;
      -ms-flex-align: start;
      align-items: flex-start;
      max-width: 100%;
      .listItemMetaContent {
        flex: 1;
        .listItemMetaContentTitle {
          margin-top: 12px;
          font-weight: bold;
          margin-right: 10px;
        }
      }
    }
  }

.activityItem {
  padding: 8px 0;
  // TODO:
  // border-bottom: 1px solid @border-color-base;
  border-bottom: 1px solid #e6f1ff;
  &Header {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    gap: 6px;
  }
  &ImageList {
    max-width: 600px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 8px;
    img {
      object-fit: cover; /* 这会保持图像的纵横比并居中截取部分内容 */
      object-position: center center; /* 图像在容器中水平和垂直居中 */
    }
  }
  &Footer {
    display: flex;
    align-items: center;
    margin: 8px 0;
    justify-content: space-between;
    &Likes {
      flex: 1;
      background-color: #f2f2f2;
      border-radius: 4px;
      display: flex;
      align-items: center;
      padding: 4px;
      gap: 16px;
      font-size: 12px;
      flex-wrap: wrap;
      color: rgba(0,0,0,0.65);
    }
  }

  &CommentInputBox {
    transition: 0.2s;
    margin-top: 16px;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    &SendBtn {
      color: var(--el-color-primary);
    }
  }

  &CommentList {
    margin-top: 8px;
    width: 100%;
    padding: 4px;
    border-radius: 4px;
    background-color: #f2f2f2;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  :deep(a) {
    color:#154ad8;
  }
}
.activityTime {
  font-weight: bold;
  margin-left: 6px;
  font-size: 12px;
}

</style>
