<script setup lang='ts'>
import UploadItem from '../../tools/uploadItem.vue'
import { schema } from '@/ts/base'
import { formatZhDate } from '@/utils/tools'
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import { TargetType } from '@orginone/oiocns-ts'
import { IFile } from '@/ts/core'

const props = defineProps<{
  entity: schema.XEntity | IFile;
  finished: () => void;
}>()

const isOpen = ref(true)

console.log('@props.entity',props.entity);

</script>


<template>
<ElDialog
  :title="entity.name"
  v-model="isOpen"
  :width="640"
  @close="finished"
  top="100px"
>
  <ElRow class="row" :gutter="24">
    <ElCol :span="24" title="图标">
      <div class="col-title">图标</div>
      <div class="col-content">
        <UploadItem
          readonly
          :typeName="entity.typeName"
          :icon="(entity as schema.XEntity)?.icon || (entity as IFile)?.metadata?.icon"
        />
      </div>
      
    </ElCol>
    <ElCol :span="12" title="名称">
      <div class="col-title">名称</div>
      <div class="col-content">{{entity.name}}</div>
    </ElCol>
    <ElCol :span="12" title="类型">
      <div class="col-title">类型</div>
      <div class="col-content">{{entity.typeName}}</div>
    </ElCol>
    <ElCol :span="12" title="代码">
      <div class="col-title">代码</div>
      <div class="col-content">{{entity.code}}</div>
    </ElCol>
    <!-- TODO: -->
    <ElCol :span="12" title="简称">
      <div class="col-title">简称</div>
      <div class="col-content">-</div>
    </ElCol>
    <!-- TODO: -->
    <ElCol :span="12" title="标识">
      <div class="col-title">标识</div>
      <div class="col-content">-</div>
    </ElCol>
    <ElCol :span="12" title="归属" v-if="entity.belongId !== entity.id && entity.typeName!==TargetType.Person">
      <div class="col-title">归属</div>
      <div class="col-content">
        <EntityIcon :entityId="entity.belongId" showName />
      </div>
    </ElCol>
    <ElCol :span="12" title="创建人" v-if="entity.createUser !== entity.id && entity.typeName!==TargetType.Person">
      <div class="col-title">创建人</div>
      <div class="col-content">
        <EntityIcon :entityId="entity.createUser" showName />
      </div>
    </ElCol>
    <ElCol :span="12" title="创建时间">
      <div class="col-title">创建时间</div>
      <div class="col-content">{{ formatZhDate(entity.createTime) }}</div>
    </ElCol>
    <ElCol :span="12" title="更新人" v-if="entity.updateUser != entity.createUser">
      <div class="col-title">更新人</div>
      <div class="col-content">
        <EntityIcon ：entityId="entity.updateUser" showName />  
      </div>
    </ElCol>
    <ElCol :span="12" title="更新时间" v-if="entity.createTime != entity.updateTime">
      <div class="col-title">更新时间</div>
      <div class="col-content">{{ formatZhDate(entity.updateTime) }}</div>
    </ElCol>
    <ElCol :span="24" title="简介">
      <div class="col-title">简介</div>
      <div class="col-content">
        {{ entity.remark }}
      </div>
    </ElCol>
  </ElRow>
</ElDialog>
</template>

<style lang='scss' scoped>
.row {
  padding:24px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
.col-title {
  padding: 0 0 8px;
  line-height: 1.5715;
  white-space: initial;
  text-align: left;
  color: rgba(0,0,0,.45);
  font-size: 14px;
}
.col-content {
  margin-bottom: 24px;
  max-width: 100%;
  color: rgba(0,0,0,.85);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
}
</style>