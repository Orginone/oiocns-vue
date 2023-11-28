<template>
  <div class="search-card">
    <SearchInput 
      :value="searchKey"
      :placeholder="searchPlace"
      :onChange="onChange()"
    />

    <Result v-if="searchKey && dataSource.length == 0" title="抱歉，没有查询到相关的结果" />
  </div>
</template>
  
<script lang="ts" setup>
import SearchInput from '@/components/SearchInput/index.vue';
import { XTarget } from '@/ts/base/schema';
import orgCtrl from '@/ts/controller';
import { TargetType, companyTypes } from '@/ts/core';
// import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import { ref } from 'vue'

// 接收参数
const props = defineProps<{
  [key: string]: any;
  autoSelect?: boolean;
  searchType: TargetType;
  searchCallback: (target: XTarget[]) => void;
}>()

let checked = ref(<string[]>([]))
let searchKey = ref('')
let dataSource = ref(<XTarget[]>([]))
let searchPlace = ref('')
const dialogVisible = ref(true)

const onChange = async(event: any) => {
  searchKey.value = event.target.value;
  if (event.target.value) {
    const res: XTarget[] = [];
    switch (props.searchType) {
      case TargetType.Person:
        res.push(
          ...(await orgCtrl.user.searchTargets(event.target.value, [
            TargetType.Person,
          ])),
        );
        break;
      case TargetType.Company:
      case TargetType.University:
      case TargetType.Hospital:
        res.push(
          ...(await orgCtrl.user.searchTargets(event.target.value, companyTypes)),
        );
        break;
      case TargetType.Group:
        res.push(
          ...(await orgCtrl.user.searchTargets(event.target.value, [
            TargetType.Group,
          ])),
        );
        break;
      case TargetType.Cohort:
        res.push(
          ...(await orgCtrl.user.searchTargets(event.target.value, [
            TargetType.Cohort,
          ])),
        );
        break;
      case TargetType.Storage:
        res.push(
          ...(await orgCtrl.user.searchTargets(event.target.value, [
            TargetType.Storage,
          ])),
        );
        break;
    }
    dataSource.value = res;
    if (props.autoSelect) {
      checked.value = res.map((i) => i.id);
      props.searchCallback(res);
    }
  }
}

onMounted(()=>{
  switch (props.searchType) {
    case TargetType.Person:
      searchPlace.value = '请输入用户的账号';
      break;
    case TargetType.Company:
      searchPlace.value = '请输入单位的社会统一信用代码';
      break;
    case TargetType.Group:
      searchPlace.value = '请输入组织集群的编码';
      break;
    case TargetType.Cohort:
      searchPlace.value = '请输入群组的编码';
      break;
  }
})
</script>

<script lang="ts">
export default {
  name: "SearchTarget",
}
</script>

<style scoped>

</style>
