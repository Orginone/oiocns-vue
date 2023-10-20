<!-- 群动态 -->
<script setup lang="ts">
import orgCtrl from '@/ts/controller';
import { GroupActivity } from '@/ts/core';
import GroupActivityItem from './Group.vue';

const cohortActivity = new GroupActivity(
  orgCtrl.user,
  orgCtrl.chats.filter((i) => i.isMyChat && i.isGroup).map((i) => i.activity),
  false,
)

</script>

<template>
  <GroupActivityItem :activity="cohortActivity"/>
</template>

<style lang="scss" scoped></style>
