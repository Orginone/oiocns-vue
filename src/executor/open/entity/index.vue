<script setup lang='ts'>
// import { ProFormColumnsType } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm'
import { TargetModel } from '@/ts/base/model'
import UploadItem from '../../tools/uploadItem';
import { schema } from '@/ts/base';
import { formatZhDate } from '@/utils/tools';
import orgCtrl from '@/ts/controller';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';

const props = defineProps<{
  entity: schema.XEntity;
  finished: () => void;
}>()

</script>
<template>
<ElDialog>

</ElDialog>
</template>

<style lang='scss' scoped>

</style>