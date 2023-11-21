<script setup lang="ts">

import { IDirectory, IFile } from '@/ts/core'
import { command } from '@/ts/base'
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import { loadFileMenus } from '@/executor/fileOperate'


const props = defineProps<{dircetory: IDirectory}>()

/** 右键菜单数据 */
const contextMenu = (file?: IFile) => {
  var entity = file || props.dircetory
  if ('targets' in entity) {
    entity = entity.directory
  }
  return {
    items:
      loadFileMenus(entity)?.filter(
        (i) => !['openChat', 'copy', 'parse'].includes(i.key),
      ) ?? [],
    onClick: ({ key }: { key: string }) => {
      command.emitter('executor', key, entity, props.dircetory.key)
    },
  }
}
</script>

<template>
  <div class="member">
    <ElDropdown 
      :trigger="['contextmenu']" 
      class="member-content"
    >
      <div
        @contextmenu="(e) => {
          e.stopPropagation()
        }"
      >
        <!-- 文件卡片 -->
        <ElDropdown 
          v-for="el in dircetory.content()" 
          :key="el.id"
          :trigger="['contextmenu']"
        >
          <ElCard
            :key="el.key"
            @contextMenu="(e) => {
              e.stopPropagation()
            }"
            bodyClass="fileCard"
            shadow="never"
          >
            <div class="fileImage">
              <EntityIcon :entity="el.metadata" :size="50" />
            </div>
            <div class="fileName" :title="el.name">
              <ElText :title="el.name" truncated>
                {{el.name}}
              </ElText>
            </div>
            <div class="fileName" :title="el.typeName">
              <ElText
                style="font-size: 12px;color: #888;"
                :title="el.typeName"
                truncated
              >
                {{el.typeName}}
              </ElText>
            </div>
          </ElCard>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item 
                v-for="item in contextMenu(el).items" :key="item.key"
                @click="contextMenu().onClick(item)"
              >
                <component :is="item.icon.name" v-bind="item.icon.args"/>
                {{item.label}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </ElDropdown>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item 
            v-for="item in contextMenu().items" :key="item.key"
            @click="contextMenu().onClick(item)"
          >
            <component :is="item.icon.name" v-bind="item.icon.args"/>
            {{item.label}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </ElDropdown>
  </div>
</template>

<style lang="scss" scoped>
.member {
  height: 100%;
  overflow: auto;
  &::-webkit-scrollbar {
    background-color: transparent;
  }
  .member-content {
    width: 100%;
    height: 100%;
    .el-tooltip__trigger {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: flex-start;
      gap: 8px;
    }
  }
}


.el-card.el-tooltip__trigger {
  border: none !important;
  background-color: transparent;
}
:deep(.fileCard){
  width: 120px;
  max-width: 120px;
  min-width: 120px;
  cursor: pointer;
  border-radius: 6px;
  width: 100%;
  margin-bottom: 20px;
  flex: 1;
  overflow: auto;
  overflow-x: hidden;  
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  &:hover {
    background-color: #efefef;
  }
}

.fileImage {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.fileName {
  width: 100%;
  text-align: center;
}
.active {
  // TODO:
  // color: @primary-color;
  color: red;
}

</style>
