<script setup lang="ts">
import orgCtrl from '@/ts/controller';
import { GroupActivity } from '@/ts/core';
import GroupActivityItem from './Group.vue';

const friendsActivity = new GroupActivity(
  orgCtrl.user,
  [orgCtrl.user.session.activity, ...orgCtrl.user.memberChats.map((i) => i.activity)],
  true,
)
console.log('friendsActivity', friendsActivity);/////////////////////////////////////


</script>

<template>
  <GroupActivityItem :activity="friendsActivity"/>
</template>

<style lang="scss" scoped></style>
