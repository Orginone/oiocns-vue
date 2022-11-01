<template>
  <el-card
    class="shop-card-wrap app-card-item"
    shadow="hover"
    :class="class"
    @mouseleave="handleWatchMouseOver('')"
    @mousleover="handleWatchMouseOver(info.id)"
    body-style="height:100%;"
  >
    <div class="app-card-item-con">
      <div class="app-card-item-con-top flex">
        <!-- <HeadImg :name="info.name" :url="appImg" :imgWidth="48" :limit="1" :isSquare="false" /> -->
        <slot name="icon"></slot>
        <div class="app-con" v-if="!cardContent">
          <!-- 标题 -->
          <div class="app-con-title">
            {{ info.name }}
          </div>
          <!-- 副标题 -->
          <div class="app-card-item-con-belong">
            <slot name="description"></slot>
          </div>
        </div>
        <slot v-else name="content"></slot>
      </div>
      <div class="app-card-item-body">
        <slot name="body"></slot>
        <slot name="footer"></slot>
      </div>
      <div class="app-tag">
        <!-- 商店卡片特有 -->
        <el-tag
          size="small"
          v-if="props.type == 'market' && !info.public"
          style="margin-right: 10px"
          :type="info.public ? 'success' : 'danger'"
          >{{ info.public ? '公开' : '私有' }}</el-tag
        >
        <el-tag
          size="small"
          v-if="props.type == 'market' && info.id != softwareId"
          style="margin-right: 10px"
          >{{ info.belongId == authority.getUserId() ? '创建的' : '加入的' }}</el-tag
        >

        <!-- 应用卡片特有 -->
        <el-tag
          size="small"
          v-if="
            props.type == 'soft' &&
            (info.endTime == undefined || new Date().getTime() < formartDateTime(info?.endTime))
          "
          style="margin-right: 10px"
          :type="authority.IsApplicationAdmin([info.belongId]) ? 'success' : ''"
          >{{ authority.IsApplicationAdmin([info.belongId]) ? '可管理' : '可使用' }}</el-tag
        >
        <el-tag
          size="small"
          v-if="props.type == 'soft' && new Date().getTime() > formartDateTime(info?.endTime)"
          style="margin-right: 10px"
          :type="'danger'"
          >失效</el-tag
        >
        <el-tag v-if="props.type == 'soft'" style="margin-right: 10px">{{ info.source }}</el-tag>

        <!-- 应用卡片特有 end -->
      </div>
      <div class="app-card-item-option">
        <slot name="option"></slot>
        <!--<div class="option-unit">
            <slot name="rightIcon"  @click.stop></slot>
          </div>
            <el-divider direction="vertical"></el-divider>
          <div class="option-unit">
            <slot name="mainOption"></slot>
          </div> -->
      </div>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { useUserStore } from '@/store/user'
  import { storeToRefs } from 'pinia'
  import { chat } from '@/module/chat/orgchat'
  import authority from '@/utils/authority'
  // hoverItem--鼠标移入item的id 用于展示按钮区域
  const store = useUserStore()
  const { queryInfo } = storeToRefs(store)
  const { workspaceData } = storeToRefs(store)
  const state: { hoverItem: string } = reactive({ hoverItem: '' })
  type shopInfoType = {
    key?: string
    info: ProductType
    type?: string
    createUser?: string
    overId?: string //当前鼠标移入id
    cardContent?: boolean // 卡片内容是否自定义
    softwareId?: string
    class?: any
  }
  const systemTime = ref<number>()
  const props = defineProps<shopInfoType>()
  const { info } = props
  const emit = defineEmits(['handleMouseOver'])
  const handleWatchMouseOver = (selectId: string) => {
    // emit('handleMouseOver', selectId)
    state.hoverItem = selectId || ''
  }
  const formartDateTime = (dateStr: any) => {
    if (dateStr) {
      var timestamp = new Date(dateStr).getTime()
      return timestamp
    } else {
      return new Date().getTime() + 1000
    }
  }
</script>

<style lang="scss" scoped>
.app-card-item:nth-child(4n) {
    margin-right: 0;
  }
  @media not screen and (min-width: 1300px) {
    /* styles */
    .app-card-item {
      width: calc(33% - 15px) !important;
    }

    .app-card-item:nth-child(3n) {
      margin-right: 0;
    }

    .app-card-item:nth-child(4n) {
      margin-right: 10px;
    }
  }

  .app-card-item {
    position: relative;
    width: calc(25% - 8px);
    min-width: 200px;
    max-height: 204px;
    margin-bottom: 10px;
    margin-right: 10px;

    // background-color: aqua;
    &-con {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      // padding: 24px;
      height: 100%;

      &-top {
        // flex: 1;
        padding-bottom: 12px;
      }

      .app-con-title {
        // color: #000000d9;
        font-size: 16px;
        font-weight: 400;
        padding-bottom: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        // padding-right: 40px;
      }

      &-desc {
        padding: 10px 0;
        max-height: 70px;
        font-size: 14px;
        font-weight: 400;
        color: var(--el-color-info);
        overflow: hidden;
        text-overflow: 5;
        display: -webkit-box; //将对象作为弹性伸缩盒子模型显示。
        -webkit-box-orient: vertical; // 从上到下垂直排列子元素
        -webkit-line-clamp: 3; //显示的行数
        // white-space: nowrap;
      }

      &-belong {
        font-size: 14px;
        color: var(--el-color-info);
      }
    }

    &-body {
      flex: 1;
      padding-bottom: 10px;
    }

    &-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      max-height: 48px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      // padding: 0 30px;
      background-color: #f7f7f7;

      .btn {
        padding: 6px 10px;
      }
    }

    &-option {
      display: flex;
      align-items: center;
      // border-top: 1px solid var(--el-border-color);
      // display: none;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: var(--el-fill-color-light);
      height: 0;
      overflow: hidden;
    }

    &:hover {
      .app-card-item-option {
        height: auto;
      }
    }

    position: relative;
  }

  .dropdwon-active {
    .app-card-item-option {
      height: auto;
    }
  }

  // 副标题描述样式
  .app-card-item-con-belong {
    // margin-top: 10px;
    font-size: 12px;
    font-weight: 400;
    color: var(--el-text-color-secondary);
    display: flex;
    align-content: center;
  }
</style>
<style lang="scss">
  .app-card-item .option-unit {
    flex: 1;
    text-align: center;
    cursor: pointer;
    line-height: 48px;
    font-size: 14px;
    position: relative;

    &:hover {
      color: var(--el-color-primary);
    }
  }
</style>
