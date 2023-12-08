<script setup lang="ts">
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import { CommentType } from '@/ts/base/model'
import { XEntity } from '@/ts/base/schema'
import orgCtrl from '@/ts/controller'

const props = defineProps<{
  comment: CommentType;
}>()

const emits = defineEmits<{
  (e: 'onClick', comment: CommentType): void
}>()

// 被回复人
const user = ref<XEntity | null>(null)
onMounted(async()=>{
  user.value = await orgCtrl.user.findEntityAsync(props.comment.replyTo)
})
</script>

<template>
  <div class="comment" @click="emits('onClick', comment)">
    <div class="commentAvatar">
      <EntityIcon :entityId="comment.userId" showName :size="22" color="#003CAB"/>
    </div>
    <div class="commentContent">
      <template v-if="comment.replyTo">
        <span style="margin: 0 4px;">回复</span>
        <span class="highlight">{{user?.name}}</span> 
      </template>
      <span class="highlight">：</span>
      <span class="comment-label">{{comment.label}}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment {
  display: flex;
  align-items: start;
  color: rgba(0,0,0,0.65);
  cursor: default;
  transition: 0.2s;
  padding: 4px;
  &:active {
    background:  rgba(0,0,0,0.05);
  }
  &Avatar {
    word-break: keep-all;
    display: inherit;
  }
  &Content {
    display: flex;
  }
  .comment-label {
    //styleName: 14/CN-Regular;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0em;
    text-align: left;
    //  TODO: color/text & icon/text - color-2
    color: #424A57;

  }
}

.highlight {
  // TODO: color/brand/Focused
  color: #003CAB;
}
</style>
