<script setup lang="ts">
import { model, schema } from '@/ts/base';
import GenerateColumn from './columns.vue';
import { DxDataGrid, DxColumn, DxFilterRow, DxSearchPanel } from 'devextreme-vue/data-grid';
import { FullThingColumns } from '@/config/column';

 const  props= defineProps<{
  beforeSource?: schema.XThing[] ;
  fields: model.FieldModel[] | any;
  dataIndex?: 'attribute' | 'property';
  dataMenus?: {
    items: ItemType[];
    onMenuClick: (key: string, data: any) => void;
  };
 }>();
  const fields = ref(FullThingColumns(props.fields)) 
  fields.value.forEach((element:any) => {
    element.visible = false;
    if( element.options){
      if(element.options.visible ===true){
        element.visible = true;
      }
    }
  });
  fields.value.forEach(element =>{
    console.log('fields',element.visible);
  })
</script>
<template>
  <DxDataGrid 
    :allow-column-reordering="true">
    <DxFilterRow :visible="true" />
    <DxSearchPanel :visible="true" />
    <DxColumn v-for="field in fields" :data-field="field.name" :visible="(field.visible === true?true:false)"></DxColumn>
  </DxDataGrid>
</template>