<script setup lang="ts">
import orgCtrl from '@/ts/controller';
import { parseAvatar, schema } from '@/ts/base';
import useAsyncLoad from '@/hooks/useAsyncLoad'
import ShareIconItem from './ShareIconItem.vue';
import { Ref } from 'vue';

export interface teamTypeInfo {
  gap?: number;
  color?: string;

  size?: number;
  entityId?: string;
  entity?: schema.XEntity;
  typeName?: string;
  notAvatar?: boolean;
  title?: string;
  showName?: boolean;

}



const props = defineProps<teamTypeInfo>()

let loaded: Ref<boolean>
let loadedEntity: Ref<any> | undefined

if(props.entityId) {
  [loaded, loadedEntity] = useAsyncLoad(() =>
    orgCtrl.user.findEntityAsync(props.entityId!),
  )
}

const getShare = (ent: schema.XEntity)=>{
  return {
    name: ent.name,
    typeName: ent.typeName,
    avatar: parseAvatar(ent.icon),
  }
}

</script>

<template>
  <ShareIconItem v-if="entity" v-bind="props" :share="getShare(entity)"/>
  <ShareIconItem v-else-if="typeName" v-bind="props" />
  <ShareIconItem v-else-if="entityId && loadedEntity" v-bind="props" :share="getShare(loadedEntity)"/>  
</template>

<style lang="scss" scoped>

</style>

  