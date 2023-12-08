<script setup lang="ts">
import { teamTypeInfo } from './index.vue'
import InfoMore from './InfoMore.vue'
import { ShareIcon } from '@/ts/base/model'
import TypeIcon from '../typeIcon.vue'


interface shareIconInfo extends teamTypeInfo {
  share?: ShareIcon;
  color?: string;
  gap?: number;
}

const props = defineProps<shareIconInfo>()

const size = props.size ?? 22
const fontSize = size > 14 ? 14 : size
const gap = (props.gap || 6)+'px'


</script>

<template>
  <!-- share -->
  <template v-if="share">
    <!-- 有缩略图 -->
    <template v-if="share.avatar?.thumbnail">
      <div class="share-avatar" :class="{'showInfoMore':entity&&size>18}" :title="title ?? ''">
        <InfoMore :entity="props?.entity" :size="size"/>
        <ElAvatar shape="square" :size="size" :src="share.avatar.thumbnail" />
        <strong class="pickupName" v-if="showName" 
          :style="{ marginLeft: gap, fontSize: fontSize, color: color || 'none'}"
        >
          {{share.name}}
        </strong>
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
          <strong class="pickupName" v-if="showName" :style="{ marginLeft: '6px', fontSize: fontSize }">{{share.name}}</strong>
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
      <strong class="pickupName" v-if="showName" :style="{ marginLeft: '6px', fontSize: fontSize }">{{entity?.id}}</strong>
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
.pickupName {
  //styleName: 14/CN-Regular;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  //  TODO: 
  color: #15181D;
}
</style>
