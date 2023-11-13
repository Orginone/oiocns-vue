<script setup lang="ts">
import orgCtrl from '@/ts/controller';
import { parseAvatar, schema } from '@/ts/base';
import useAsyncLoad from '@/hooks/useAsyncLoad'
import ShareIconItem from './ShareIconItem.vue';
import { Ref } from 'vue';

export interface teamTypeInfo {
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

</script>

<template>
  <!-- entity -->
  <template v-if="entity">
    <ShareIconItem
      v-bind="props"
      :share="{
        name: entity.name,
        typeName: entity.typeName,
        avatar: parseAvatar(entity.icon),
      }"
    />
  </template>
  <!-- entityId -->
  <template v-else-if="entityId">
    <!-- <div v-loading="!loaded">  -->
      <ShareIconItem
        v-if="loadedEntity"
        v-bind="props"
        :share="{
          name: loadedEntity.name,
          typeName: loadedEntity.typeName,
          avatar: parseAvatar(loadedEntity.icon),
        }"
      />
  </template>
  <!-- typeName -->
  <template v-else-if="typeName">
    <ShareIconItem v-bind="props" />
  </template>

</template>

<style lang="scss" scoped></style>

  