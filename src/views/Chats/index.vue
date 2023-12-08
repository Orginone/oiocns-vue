<script setup lang="ts">
import Content from './content/index.vue'
import * as config from './config/menuOperate'
import MainLayout from '@/components/MainLayout/index.vue'
import useMenuUpdate from '@/hooks/useMenuUpdate'
import { Search } from '@element-plus/icons-vue'
import { command } from '@/ts/base'

// 搜索关键词
const filter = ref<string>('')
const {key, rootMenu, selectMenu,onSelectMenu:setSelectMenu} = useMenuUpdate(config.loadChatMenu)

</script>

<template>
  <template v-if="selectMenu&&rootMenu">
    <MainLayout
      preview-flag="chat"
      :selectMenu="selectMenu"
      :onSelect="async (data) => setSelectMenu(data)"
      :siderMenuData="rootMenu"
      right-show
    >
      <div class="list-main">
        <div class="title">沟通</div>
        <div class="content">
          <div class="search">
            <div class="search-input-container">
              <div class="icon"><ElIcon :size="20"><Search/></ElIcon></div>
              <input 
                type="text"
                v-model="filter"
                style="height: 30px; font-size: 15px;"
                placeholder="搜索"
                clearable
                :prefix-icon="Search"
              /> 
            </div>
            <div class="addBtn">
              +
            </div>
          </div>
          <div class="content-main">
            <Content :filter="filter" />
          </div>
        </div>

      </div>
      
    </MainLayout>
  </template>
</template>

<style lang="scss" scoped>
.list-main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  .title {
    width: 40px;
    height: 28px;
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    // TODO: color/text & icon/text - color-1
    color: #15181D;
  }
  .content {
    height: 0;
    flex:1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    .search {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      .search-input-container {
        flex:1;
        align-items: center;
        height: 40px;
        border-radius: 8px;
        border: 1px solid transparent;
        padding: 3px 12px;
        // TODO: color/surface/次要容器背景
        background-color: #F7F8FA;
        display: flex;
        gap: 8px;
        .icon {
          width: 20px;
          height: 20px;
        }
        input {
          width: 100%;
          height: 100%;;
          border: none;
          outline: none;
          background-color: transparent;
        }
      }
      .search-input-container:focus-within {
        // TODO:
        // border-color: #409EFF;
      }
      .addBtn {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        // TODO: color/surface/次要容器背景
        background-color: #F7F8FA;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:hover {
          // TODO:
          background-color: #E6F7FF;
        }
      }
    }
    .content-main {
      height: 0;
      flex:1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
}
</style>

