<template>
  <div class="user-relations">
    <UserInfo />
    <div class="body">
      <div class="tab-wrap">
        <el-tabs v-model="currentTab">
          <el-tab-pane label="部门" name="dept"/>
          <el-tab-pane label="工作组" name="job"/>
          <el-tab-pane label="岗位" name="identity"/>
          <el-tab-pane label="应用" name="app"/>
        </el-tabs>  
      </div>
      <component :is="components[currentTab]" />    
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, shallowRef } from 'vue';
import type { Component } from 'vue';
import dept from "./dept.vue";
import job from "./job.vue";
import identity from "./identity.vue";
import app from "./app.vue";
import UserInfo from "../components/UserInfo.vue";

const currentTab = ref("dept");
const components: Record<string, Component> = {
  dept,
  job,
  identity,
  app
};

</script>
<style lang="scss">
.user-relations {
  margin-top: 5px;
  display: flex;
  flex-direction: column;

  > .body {
    flex: auto;
    margin-top: 5px;
    background-color: white;
    display: flex;
    flex-direction: column;
    .tab-wrap {
      padding: 16px 16px 0 16px;
    }
    > :last-child {
      flex: 1; 
   }
  }
  
}
</style>