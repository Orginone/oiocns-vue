<script setup lang="ts">
import { teamTypeInfo } from './index.vue'
import InfoMore from './InfoMore.vue'
import { ShareIcon } from '@/ts/base/model'
import TypeIcon from '../typeIcon.vue'


interface shareIconInfo extends teamTypeInfo {
  share?: ShareIcon;
}

const props = defineProps<shareIconInfo>()

const size = props.size ?? 22;
const fontSize = size > 14 ? 14 : size;

</script>

<template>
  <!-- share -->
  <template v-if="share">
    <!-- 有缩略图 -->
    <template v-if="share.avatar?.thumbnail">
      <div class="share-avatar" :class="{'showInfoMore':entity&&size>18}" :title="title ?? ''">
        <InfoMore :entity="props?.entity" :size="size"/>
        <ElAvatar shape="square" :size="size" :src="share.avatar.thumbnail" />
        <b v-if="showName" :style="{ marginLeft: '6px', fontSize: fontSize }">{{share.name}}</b>
      </div>     
    </template>
    <!-- 无缩略图 -->
    <template v-else>
      <!-- 非头像 -->
      <template v-if="notAvatar">
        <TypeIcon
          avatar
          :iconType="share.typeName || typeName || '其它'"
          :size="size"
        />
      </template>
      <!-- 是头像 -->
      <template v-else>
        <div class="share-avatar" :class="{'showInfoMore':entity&&size>18}">
          <InfoMore :entity="props?.entity" :size="size"/>
          <ElAvatar
            shape="square"
            :size="size"
            style="background: transparent; color:#606060"
          >
            <TypeIcon
              avatar
              :iconType="share.typeName || typeName || '其它'"
              :size="size"
            />            
          </ElAvatar>
          <b v-if="showName" :style="{ marginLeft: '6px', fontSize: fontSize }">{{share.name}}</b>
        </div>        
      </template>
    </template>
  </template>
  <!-- 非share -->
  <template v-else>
    <div style="cursor: pointer;display: contents;" :title="title ?? ''">
      <ElAvatar
        :size="size"
        style="background-color: transparent;color: #606060;"
      >
        <TypeIcon avatar iconType='其它' :size='size' />
      </ElAvatar>
      <strong v-if="showName" :style="{ marginLeft: '6px', fontSize: fontSize }">{{entity?.id}}</strong>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.share-avatar {
  position: relative;
  display: flex;
  align-items: center;
  
  &.showInfoMore {
    // margin: 12px 0 0 12px;
  }
}
</style>
