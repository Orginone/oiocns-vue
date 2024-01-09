<script setup lang="ts">
import { command, model, parseAvatar, schema } from '../../../ts/base';
import { DxColumn } from 'devextreme-vue/data-grid';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import { generateUuid } from '@/ts/base/common';
import { ellipsisText, formatDate } from '@/utils';

const prop =  defineProps<{
  field: model.FieldModel,
}>()

  const props: any = {
    caption: prop.field.name,
    fixedPosition: 'left',
    fixed: prop.field.options?.fixed === true,
    visible: prop.field.options?.visible === true,
  };
  const cellRender: any = {};
  switch (prop.field.valueType) {
    case '时间型':
      props.dataType = 'datetime';
      props.width = 200;
      props.headerFilter = {
        groupInterval: 'day',
      };
      props.allowHeaderFiltering = false;
      props.format = 'yyyy年MM月dd日 HH:mm:ss';
      cellRender.calcText = (value: string) => {
        return formatDate(new Date(value), 'yyyy年MM月dd日 HH:mm:ss');
      };
      break;
    case '日期型':
      props.dataType = 'date';
      props.width = 180;
      props.headerFilter = {
        groupInterval: 'day',
      };
      props.allowHeaderFiltering = false;
      props.format = 'yyyy年MM月dd日';
      cellRender.calcText = (value: string) => {
        return formatDate(new Date(value), 'yyyy年MM月dd日');
      };
      break;
    case '选择型':
    case '分类型':
      props.width = 200;
      props.headerFilter = {
        search: {
          enabled: true,
        },
        dataSource: field.lookups,
      };
      props.lookup = {
        dataSource: field.lookups,
        displayExpr: 'text',
        valueExpr: 'value',
      };
      cellRender.calcText = (value: string) => {
        return (field.lookups || []).find((i) => i.value === value)?.text || value;
      };
      break;
    case '数值型':
      props.dataType = 'number';
      props.width = 150;
      props.allowHeaderFiltering = false;
      props.fixed = field.id === 'id';
      break;
    case '用户型':
      props.dataType = 'string';
      props.width = 150;
      props.allowFiltering = false;
      break;
    case '附件型':
      props.dataType = 'string';
      props.width = 150;
      props.allowFiltering = false;
      break;
    default:
      props.dataType = 'string';
      props.width = 180;
      props.allowHeaderFiltering = false;
      break;
  }
  console.log('props',props);
</script>

<template>
  <DxColumn :data-field="props.caption"  :visible="(field.visible === true?true:false)"/>;
</template>
