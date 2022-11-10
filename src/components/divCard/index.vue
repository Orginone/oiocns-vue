<template>
  <div class="card-main">
    <div class="card-main-list">
      <div class="list-item" v-for="(item, index) in cardList" :key="index">
        <div class="row row-left">
          <img src="@/assets/img/whatsapp.png" alt="" />
          <div class="version">{{item.version}}</div>
        </div>
        <div class="row row-content">
          <div class="title">
            <span>{{item.title}}</span>
            <span>
                <slot name="dropdown"></slot>
            </span>
          </div>
          <div class="describe">{{item.describe}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";

const props = withDefaults(
  defineProps<{
    cardList?: Array<any>; // 渲染表单项数据
  }>(),
  {
    cardList: () => [
        {
            title: '资产监管',
            version: 'V 1.01',
            describe: '资产内控资产内控资产内控资产内控资产内控'
        },
        {
            title: '资产内控',
            version: 'V 1.03',
            describe: '资产内控资产内控资产内控资产内控资产内控'
        },
        {
            title: '房产管理',
            version: 'V 1.2',
            describe: '资产内控资产内控资产内控资产内控资产内控'
        },
    ]
  }
);
</script>
<style lang="scss">
.drop-link {
  cursor: pointer;
  padding: 2px 10px;
  border-radius: 10px;
}
.drop-link:hover {
  background: var(--el-bg-color-overlay);
}
</style>
<style lang="scss" scoped>
.card-main {
  width: 100%;
  background: #fff;
  margin-bottom: 6px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  max-height: 200px;
  .card-main-list {
    display: flex;
    flex-wrap: nowrap;
    height: 102px;
    flex: 1;
  }
  .list-item {
    width: 187px;
    min-width: 187px;
    height: 102px;
    display: flex;
    flex-wrap: nowrap;
    border: 1px solid #eee;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 18px 12px;
    margin-right: 10px;
    .row {
      img {
        width: 52px;
        height: 52px;
        border-radius: 10px;
      }
      .version {
        font-size: 12px;
        color: #c0c4cc;;
        margin-top: 5px;
      }
      .title {
        color: #303133;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span:nth-child(2n) {
          display: flex;
          align-items: center;
        }
      }
      .describe {
        color: #606266;
        font-size: 12px;
        -webkit-line-clamp: 2;
        margin-top: 3px;

        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .row-left {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 10px;
    }
  }
}
</style>
