<script setup lang="ts">
import { Sunny } from '@element-plus/icons-vue';
import SearchInput from '@/components/SearchInput/index.vue';
import { XTarget } from '@/ts/base/schema';
import orgCtrl from '@/ts/controller';
import { TargetType, companyTypes } from '@/ts/core';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import CheckCardGroup from './CheckCardGroup.vue'
import CheckCard from './CheckCard.vue'

const props = defineProps<{
  [key: string]: any;
  searchType: TargetType;
  searchCallback: (target: XTarget[]) => void;
}>()

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
  <!-- 输入框 -->
  <SearchInput
    :value="searchKey"
    :placeholder="searchPlace"
    :onChange="onChange"
  />
  <!-- 多选卡片组 -->
  <div class="check-card-group"
    v-if="dataSource.length > 0"
  >
    <ElRow :gutter="16" style="width: 100%;">
      <ElCol 
        v-for="target in dataSource" 
        :key="target.id"  
        :span="24"
      >
        <CheckCard
          style="width: 100%;"
          class="card"
          :checkedValue="checked"
          :value="target.id"
          :onChange="(value: any) => {
            if(checked.includes(value)){
              checked.splice(checked.indexOf(value), 1)
              return
            }
            checked = [value]
            let checkObjs: XTarget[] = [];
            for (const target of dataSource) {
              if (value.includes(target.id)) {
                checkObjs.push(target);
              }
            }
            props.searchCallback(checkObjs)
          }"
        >
          <template #avatar>
            <TeamIcon :entityId="target.id" :size="60" />
          </template>
          <template #title>
            <ElSpace>
              {{target.name}}
              <ElTag>账号：{{target.code}}</ElTag>
            </ElSpace>
          </template>
          <template #description>
            <div style="margin-top: 16px;">
              <div>
                简介：{{target.remark}}
              </div>
            </div>
          </template>
        </CheckCard>
      </ElCol>
    </ElRow>
  </div>
  
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
