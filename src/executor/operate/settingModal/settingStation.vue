<script setup lang="ts">
import { IAuthority, IBelong } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import MainLayout from '@/components/MainLayout/index.vue';
import useMenuUpdate from '@/hooks/useMenuUpdate'
import EntityInfo from '@/components/Common/EntityInfo/index.vue';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { Controller } from '@/ts/controller';
import { IEntity } from '@/ts/core';
import { command, schema } from '@/ts/base'
import AuthForm from './subModal/authForm';

const props = defineProps<{
    space: IBelong;
    finished: () => void;
}>()
const operateKey = ref<string>('');
const setOperateKey = (val:string) => {
    operateKey.value = val;
}
const onIconForm  = (item:any) => {
    console.log('item',item);
};
/** 加载设置模块菜单 */
const loadSettingMenu = (authority: IAuthority): MenuItemType => {
  return {
    key: '超级管理权',
    label: '超级管理权',
    itemType: 'Tab',
    item: authority,
    menus: loadAuthorityMenus(authority),
    children: createMenu(authority.children),
    icon:{name:EntityIcon, props:{notAvatar:true, entity:authority.metadata, size:18}},
  };
};
const {key, rootMenu, selectMenu,onSelectMenu} = useMenuUpdate(()=>loadSettingMenu(props.space.superAuth!),new Controller(props.space.superAuth!.key),)
/** 创建团队菜单 */
const createMenu = (authoritys: IAuthority[]): MenuItemType[] => {
  const result: any[] = [];
  for (const auth of authoritys) {
    result.push({
      key: auth.key,
      item: auth,
      label: auth.name,
      itemType: '权限',
      menus: loadAuthorityMenus(auth),
      icon:{name:EntityIcon, args:{notAvatar:true, entity:auth.metadata, size:18}},
      children: createMenu(auth.children),
    });
  }
  return result;
};

/** 加载右侧菜单 */
const loadAuthorityMenus = (item: IAuthority) => {
  const items: OperateMenuType[] = [];
  if (item.space.hasRelationAuth()) {
    items.push({
      key: '新增',
      icon:{name:EntityIcon, args:{notAvatar:true, entity:item.metadata, size:18}},
      label: '新增权限',
      model: 'outside',
    });
    if (item.metadata.belongId == item.space.id) {
      items.push(
        {
          key: '编辑',
          icon:{name:EntityIcon, args:{notAvatar:true, entity:item.metadata, size:18}},
          label: '编辑权限',
        },
        {
          key: '删除',
          icon:{name:EntityIcon, args:{notAvatar:true, entity:item.metadata, size:18}},
          label: '删除权限',
          beforeLoad: async () => {
            return await item.delete();
          },
        },
      );
    }
  }
  return items;
};
</script>

<template>
  <!-- 内容区 -->
  <FullScreenModal
    v-if="selectMenu && rootMenu"
    open
    :title="space.name ?? '选择文件'"
    :onCancel="()=>finished()"
    destroyOnClose
    width='80vw'
    top="5vh"
    bodyHeight='60vh'
  >
    <MainLayout
      leftShow
      :selectMenu="selectMenu"
      :hiddenHead = true
      :onSelect="async (data) => {
        console.log('data', data);
        onSelectMenu(data);
      }"
      :onMenuClick="(_, key) => {
        if (key == '删除') {
            onSelectMenu(selectMenu?.parentMenu || rootMenu);
        } else {
            setOperateKey(key);
        }
      }"
      :siderMenuData="rootMenu"
      preview-flag="dialog"
    >
        <EntityInfo :entity="(selectMenu.item as IEntity<schema.XEntity>)"  :onForm="(item:any) => {  onIconForm(item);  }" :extra="selectMenu.menus">
        </EntityInfo>
    </MainLayout>
  </FullScreenModal>
  <!-- 表单 -->
  <ElDialog
  :title="title"
  v-model="isOpen"
  :width="640"
  @close="finished"
  top="100px"
>
  <ElForm
    ref="targetFormRef"
    :model="ruleForm"
    :rules="rules"
  >
    <ElRow class="row" :gutter="24"> 
      <ElCol :span="24" title="图标">
        <div class="col-content">
          <ElFormItem label="图标">
            <UploadItem
              :readonly="readonly"
              :typeName="typeName"
              :icon="initialValue.icon"
              :directory="props.current.directory"
              :onChanged="icon=>ruleForm.icon=icon"
            />
          </ElFormItem>
        </div>
      </ElCol>
      <ElCol :span="12" title="名称">
        <div class="col_content">
          <ElFormItem prop="name" required label="名称"> 
            <ElInput v-model="ruleForm.name" placeholder="请输入名称"/>
          </ElFormItem>
        </div>
      </ElCol>
      <ElCol :span="12" title="类型">
        <div class="col-content">
          <ElFormItem prop="typeName" required label="类型">
            <ElSelect v-model="ruleForm.typeName" >
              <ElOption v-for="item in types" :key="item" :label="item" :value="item" />
            </ElSelect>
          </ElFormItem>
        </div>
      </ElCol>
      <ElCol :span="12" :title="tcodeLabel">
        <div class="col-content">
          <ElFormItem prop="code" required :label="tcodeLabel">
            <ElInput v-model="ruleForm.code" placeholder="请输入代码"/>
          </ElFormItem>
        </div>
      </ElCol>
      <slot v-if="readonly">
        <ElCol :span="12" v-for="(item,index) in flexForm" :key="index" :title="item.title">
          <div class="col-content">
            <ElFormItem :props="item.dataIndex" required :label="item.title">
              <ElInput :readonly="item.readonly" v-if="!item.types" v-model="item.value" placeholder="请输入代码"/>
              <EntityIcon  v-else :entityId="item.value" showName />
            </ElFormItem>
          </div>
        </ElCol>
      </slot>
      <ElCol :span="24" title="简介">
        <div class="col-content">
          <ElFormItem prop="remark" required label="简介">
            <ElInput v-model="ruleForm.remark" type="textarea" :rows="3" placeholder="请输入简介"/>
          </ElFormItem>
        </div>
      </ElCol>
    </ElRow>
  </ElForm>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="isOpen = false;props.finished()">取消</el-button>
      <el-button type="primary" @click="handleSubmit">
        确定
      </el-button>
    </span>
  </template>
  </ElDialog>
</template>

<style scoped>
.row {
  padding: 24px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
.col-content {
  margin-bottom: 24px;
  max-width: 100%;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
}
.el-form-item {
  display: flex;
  flex-direction: column;
  &:deep(.el-form-item__label) {
    justify-content: start;
    padding: 0 0 8px;
    line-height: 1.5715;
    white-space: initial;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
  &:deep(.el-textarea__inner),
  &:deep(.el-input__wrapper) {
    background-color: #f2f4f9;
  }
}
.el-select {
  width: 100%;
}
</style>
