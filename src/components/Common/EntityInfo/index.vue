<!-- 机构信息内容 -->
<script setup lang='ts'>
// import { Card, Descriptions, Typography } from 'antd'
import { IEntity } from '@/ts/core'
import { schema } from '@/ts/base'
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import useCtrlUpdate from '@/hooks/useCtrlUpdate'
import { formatZhDate } from '@/utils/tools'
const props = defineProps<{
  entity: IEntity<schema.XEntity>;
  other?: any;
  extra?: any;
  column?: number;
}>()

const [tkey] = useCtrlUpdate(props.entity)
const ellipsis = ref(true)

</script>

<template>
    <ElCard class="company-dept-content">
      <ElDescriptions
        :title="`${entity.typeName}[${entity.name}]基本信息`"
        :extra="extra"
        :border="true"
        :column="column ?? 3"
        :key="tkey"
      >
        <ElDescriptionsItem label="名称">
          TODO:
          <!-- <Typography.Paragraph
            :copyable="{
              text: entity.id,
              tooltips: [entity.id, '复制成功'],
            }"
          >
            <EntityIcon entity={entity.metadata} showName />
          </Typography.Paragraph> -->
        </ElDescriptionsItem>
        <ElDescriptionsItem label="代码">
          TODO:
          <!-- <Typography.Paragraph
            copyable={{
              text: entity.code,
              tooltips: [entity.code, '复制成功'],
            }}>
            {entity.code}
          </Typography.Paragraph> -->
        </ElDescriptionsItem>
        {{other}}
        <ElDescriptionsItem label="类型">{{entity.typeName}}</ElDescriptionsItem>
        <ElDescriptionsItem label="归属" v-if="entity.metadata.belongId != entity.id">
          <EntityIcon :entityId="entity.metadata.belongId" showName />
        </ElDescriptionsItem>
        <ElDescriptionsItem label="创建人" v-if="entity.metadata.createUser != entity.id">
          <EntityIcon entityId={entity.metadata.createUser} showName />
        </ElDescriptionsItem>
        <ElDescriptionsItem label="创建时间">
          {{formatZhDate(entity.metadata.createTime)}}
        </ElDescriptionsItem>
        <template v-if="entity.metadata.createUser != entity.metadata.updateUser">
          <ElDescriptionsItem label="更新人">
            <EntityIcon entityId={entity.metadata.updateUser} showName />
          </ElDescriptionsItem>
          <ElDescriptionsItem label="更新时间">
            {{formatZhDate(entity.metadata.updateTime)}}
          </ElDescriptionsItem>
        </template>
      </ElDescriptions>
      <ElDescriptions
        v-if="entity.remark && entity.remark.length > 0"
        :border="true"
        :column="column ?? 3"
      >
        <ElDescriptionsItem label="描述信息" :span="column ?? 3">
          TODO:
          <!-- <Typography.Paragraph
            ellipsis={ellipsis ? { rows: 2, expandable: true, symbol: '更多' } : false}>
            {entity.remark}
          </Typography.Paragraph> -->
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>
</template>

<style lang='scss' scoped>
.dept-content-box {
  background-color: #eff4f9;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.company-dept-title {
  display: flex;
  justify-content: space-between;
}

.company-dept-content {
  // margin-bottom: 8px !important;
  // :global {
  //   .ogo-card-body {
  //     padding: 20px;
  //     color: #606266;
  //     .ogo-descriptions-header {
  //       margin-bottom: 8px;
  //     }
  //   }
  // }
  .descriptions {
    text-align: 'left';
    color: '#606266';
    width: 120px;
  }
}
.dept-wrap-pages {
  // height: calc(100% - 200px);
  flex: 1;
  overflow: hidden;
  // :global {
  //   .ogo-card {
  //     height: 100%;
  //   }
  //   .ogo-card-body {
  //     padding: 0;
  //     height: calc(100% - 68px);
  //   }
  // }
}
.pages-wrap {
  flex: 1;
  .page-content-table {
    // :global {
    //   .ogo-card.ogo-card-bordered.ogo-card-contain-tabs {
    //     border: none;
    //   }

    //   .ogo-card-head {
    //     border: none;
    //     padding: 0 24px;
    //   }

    //   .ogo-tabs-nav::before {
    //     border: none !important;
    //   }

    //   .ogo-card-body {
    //     padding: 4px;
    //   }

    //   .ogo-tabs-tab {
    //     padding: 7px 0 !important;
    //     font-size: 13px !important;
    //   }
    // }
  }
  .page-content-table {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}

</style>