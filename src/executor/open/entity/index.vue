<template>

</template>

<script lang="ts" setup>
import SchemaForm from '@/components/SchemaForm.vue';
import { TargetModel } from '@/ts/base/model';
import UploadItem from '../../tools/uploadItem.vue';
import { schema } from '@/ts/base';
import { formatZhDate } from '@/utils/tools';
import orgCtrl from '@/ts/controller';
// import EntityIcon from '@/components/Common/GlobalComps/entityIcon';

// 接收参数
const props = defineProps<{
  entity: schema.XEntity;
  finished: () => void;
}>()

onMounted(()=>{

})
</script>

<script lang="ts">
export default {
  name: "EntityForm",
}
</script>

<style>

</style>
  