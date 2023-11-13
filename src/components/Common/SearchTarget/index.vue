<script setup lang="ts">
import { Sunny } from '@element-plus/icons-vue';
import SearchInput from '@/components/SearchInput/index.vue';
// import styles from './index.module.less';
import { XTarget } from '@/ts/base/schema';
import orgCtrl from '@/ts/controller';
import { TargetType, companyTypes } from '@/ts/core';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'

const props = defineProps<{
  [key: string]: any;
  searchType: TargetType;
  searchCallback: (target: XTarget[]) => void;
}>()

// const tableProps: CompanySearchTableProps = props;
const checked = ref<string[]>([])
const searchKey = ref<string>()
const dataSource = ref<XTarget[]>([])
const searchPlace = ref<string>()

// 设置placeholder
switch (props.searchType) {
  case TargetType.Person:
  searchPlace.value = '请输入用户的账号'  
  break;
  case TargetType.Company:
    searchPlace.value = '请输入单位的社会统一信用代码';
    break;
  case TargetType.Group:
    searchPlace.value = '请输入群组的编码';
    break;
  case TargetType.Cohort:
    searchPlace.value = '请输入群组的编码';
    break;
}


// 搜索逻辑
const onChange = async (value:string) => {
  searchKey.value = value
  if (value) {
    const res: XTarget[] = [];
    switch (props.searchType) {
      case TargetType.Person:
        res.push(
          ...(await orgCtrl.user.searchTargets(value, [
            TargetType.Person,
          ])),
        );
        break;
      case TargetType.Company:
      case TargetType.University:
      case TargetType.Hospital:
        res.push(
          ...(await orgCtrl.user.searchTargets(value, companyTypes)),
        );
        break;
      case TargetType.Group:
        res.push(
          ...(await orgCtrl.user.searchTargets(value, [
            TargetType.Group,
          ])),
        );
        break;
      case TargetType.Cohort:
        res.push(
          ...(await orgCtrl.user.searchTargets(value, [
            TargetType.Cohort,
          ])),
        );
        break;
      case TargetType.Storage:
        res.push(
          ...(await orgCtrl.user.searchTargets(value, [
            TargetType.Storage,
          ])),
        );
        break;
    }
    dataSource.value = res
    checked.value = res.map((i) => i.id)
    props.searchCallback(res);
  }
}
</script>

<template>
<div class="search-card">
  <SearchInput
    :value="searchKey"
    :placeholder="searchPlace"
    :onChange="onChange"
  />
   TODO:多选卡片组
    <!-- <CheckCard.Group
    v-if="dataSource.length > 0"
      bordered={false}
      multiple
      value={checked}
      style={{ width: '100%' }}
      onChange={(value: any) => {
        setChecked(value);
        let checkObjs: XTarget[] = [];
        for (const target of dataSource) {
          if (value.includes(target.id)) {
            checkObjs.push(target);
          }
        }
        tableProps.searchCallback(checkObjs);
      }}>
      <Row gutter={16} style={{ width: '100%' }}>
        {dataSource.map((target) => (
          <Col span={24} key={target.id}>
            <CheckCard
              bordered
              style={{ width: '100%' }}
              className={`${styles.card}`}
              avatar={<TeamIcon entityId={target.id} size={60} />}
              title={
                <Space>
                  {target.name}
                  <Tag color="blue">账号：{target.code}</Tag>
                </Space>
              }
              value={target.id}
              key={target.id}
              description={
                <Descriptions column={2} size="small" style={{ marginTop: 16 }}>
                  <Descriptions.Item label="简介" span={2}>
                    {target.remark}
                  </Descriptions.Item>
                </Descriptions>
              }
            />
          </Col>
        ))}
      </Row>
    </CheckCard.Group> -->
    
    <!-- 结果 -->
    <ElResult 
      v-if="searchKey && dataSource.length == 0" 
      title="抱歉，没有查询到相关的结果"
    >
      <template #icon>
        <ElIcon><Sunny/></ElIcon>
      </template>
    </ElResult>
</div>
</template>

<style lang="scss" scoped>
// @import (reference) '~antd/es/style/themes/variable';

// :global {
//   .ogo-avatar-lg {
//     width: 60px;
//     height: 60px;
//     line-height: 60px;
//     border-radius: 50%;
//   }
// }

.search-card {
  min-height: 300px;
  // background-color: @item-hover-bg;
  padding: 24px;
  .card {
    width: 306px;
    margin-top: 24px;
    .description {
      // TODO:
      // margin-top: @margin-xs;
    }
  }

  .company-select-type {
    border: 1px solid #5ba0e7;
  }

  .company-no-select-type {
    border: 1px solid #000;
  }
}

</style>
