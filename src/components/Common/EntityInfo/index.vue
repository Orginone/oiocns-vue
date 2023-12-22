<!-- 机构信息内容 -->
<script setup lang='ts'>
import { IEntity } from '@/ts/core'
import { schema } from '@/ts/base'
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import useCtrlUpdate from '@/hooks/useCtrlUpdate'
import { formatZhDate } from '@/utils/tools'
import copy from "copy-to-clipboard"
import { CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
const props = defineProps<{
  entity: IEntity<schema.XEntity>;
  other?: any;
  extra?: any;
  column?: number;
  onForm?:(item:IEntity<schema.XEntity>)=>void;
}>()

const [tkey] = useCtrlUpdate(props.entity)
const ellipsis = ref(true)

</script>

<template>
    <ElCard class="company-dept-content">
      <ElDescriptions
        :title="`${entity.typeName}[${entity.name}]基本信息`"
        :border="true"
        :column="column ?? 3"
        :key="tkey"
      >
        <template #extra>
          <div class="extra" v-for="(item,index) in extra" :key="index">
             <el-icon @click='onForm(item)' v-if="item.key=='新增'"><Plus /></el-icon>
             <el-icon @click='onForm(item)' v-if="item.key=='编辑'"><Setting /></el-icon>
             <el-icon @click='onForm(item)' v-if="item.key=='删除'"><Delete /></el-icon>
          </div>
        </template>
        <ElDescriptionsItem label="名称">
          <div style="display: flex;">
            <EntityIcon :entity="entity.metadata" showName />
            <ElButton type="primary" :icon="CopyDocument" link @click="copy(entity.metadata.name)&&ElMessage.success('复制成功')"/>
          </div>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="代码">
          {{entity.code}}
          <ElButton type="primary" :icon="CopyDocument" link @click="copy(entity.code)&&ElMessage.success('复制成功')"/>
        </ElDescriptionsItem>
        <!-- TODO: -->
        {{other}}
        <ElDescriptionsItem label="类型">{{entity.typeName}}</ElDescriptionsItem>
        <ElDescriptionsItem label="归属" v-if="entity.metadata.belongId != entity.id">
          <EntityIcon :entityId="entity.metadata.belongId" showName />
        </ElDescriptionsItem>
        <ElDescriptionsItem label="创建人" v-if="entity.metadata.createUser != entity.id">
          <EntityIcon :entityId="entity.metadata.createUser" showName />
        </ElDescriptionsItem>
        <ElDescriptionsItem label="创建时间">
          {{formatZhDate(entity.metadata.createTime)}}
        </ElDescriptionsItem>
        <!-- 更新人与更新时间 -->
        <template v-if="entity.metadata.createUser != entity.metadata.updateUser">
          <ElDescriptionsItem label="更新人">
            <EntityIcon :entityId="entity.metadata.updateUser" showName />
          </ElDescriptionsItem>
          <ElDescriptionsItem label="更新时间">
            {{formatZhDate(entity.metadata.updateTime)}}
          </ElDescriptionsItem>
        </template>
        <ElDescriptionsItem label="描述信息">
          <ElText
            style="width: 200px;"
            :truncated="ellipsis"
            :line-clamp = "ellipsis?2:99"
          >
            {{entity.remark}}
          </ElText>
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>
</template>

<style lang='scss' scoped>
  .extra{
    display: inline-block;
    margin-left: 10px;
  }
</style>