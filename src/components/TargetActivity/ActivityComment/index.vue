<script setup lang="ts">
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import { CommentType } from '@/ts/base/model'
import UserInfo from '../UserInfo/index.vue'

defineProps<{
  comment: CommentType;
}>()

const emits = defineEmits<{
  (e: 'onClick', comment: CommentType): void
}>()

</script>

<template>
  <div class="comment" @click="emits('onClick', comment)">
      <div class="commentAvatar">
        <EntityIcon :entityId="comment.userId" showName/>
      </div>
      <div class="commentContent">
        <template v-if="comment.replyTo">
          回复 <UserInfo :userId="comment.replyTo"/> ：
        </template>
        {{comment.label}}
      </div>
    </div>
</template>

<style lang="scss" scoped>
.comment {
  display: flex;
  gap: 4px;
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
    align-items: center;
  }
}

</style>
