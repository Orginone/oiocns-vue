<script setup lang="ts">
import { XEntity } from '@/ts/base/schema';
import orgCtrl from '@/ts/controller';

const props = defineProps<{
  userId: string
}>()

const user = ref<XEntity | null>(null)
onMounted(async()=>{
  user.value = await orgCtrl.user.findEntityAsync(props.userId)
})

</script>

<template>
  <span 
    v-if="user"
    class="name"
  >
    {{user.name}}
  </span>
</template>

<style lang="scss" scoped>
.name {
  color: rgba(0,0,0,0.65);
  font-weight: 700;
}

</style>
