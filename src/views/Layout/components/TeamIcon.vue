<template>
  <el-icon>
    <component :is="getIcon()" />
  </el-icon>
</template>

<script setup lang="ts">
import { TargetType } from "@orginone/oiocns-ts";
import { defineComponent, h, resolveComponent } from "vue";
const props = defineProps<{
  typeName: TargetType | string
}>();
function getIcon() {
  switch (props.typeName) {
    case '平台':
    case TargetType.Group:
      return "OfficeBuilding";
    case TargetType.Company:
      return "School";
    case TargetType.Section:
    case TargetType.Department:
      return "Home";
    case TargetType.College:
      return "School";
    case TargetType.Laboratory:
      return "School";
    case TargetType.Office:
      return "School";
    case TargetType.Research:
      return "School";
    case TargetType.Working:
      return "School";
    case TargetType.Station:
      return "School";
    case TargetType.Cohort:
      return "School";
    case TargetType.Person:
      return "User";
    default:
      return "School";
  }
}

</script>