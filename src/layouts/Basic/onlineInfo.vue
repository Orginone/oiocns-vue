<script setup lang='ts'>

import { kernel, model, schema } from '@/ts/base'

const props = defineProps<{
  onClose: () => void
}>()

const isOpen = ref(true)

// TODO:
// const key = ref('1')
const onlines = ref<model.OnlineSet>()

watchEffect(() => {
  kernel.onlines().then((value) => {
    onlines.value = value
    console.log(onlines.value);///////////
    
    // TODO:
    // key.value = value.key
  })
})

//TODO: const loadOnlineInfo = (onlines: model.OnlineInfo[]) => {
//     var unAuth: model.OnlineInfo[] = [];
//     onlines
//       .filter((i) => i.userId === '0')
//       .forEach((item) => {
//         var index = unAuth.findIndex((i) => i.remoteAddr === item.remoteAddr);
//         if (index === -1) {
//           item.requestCount = 1;
//           unAuth.push(item);
//         } else {
//           unAuth[index].requestCount = unAuth[index].requestCount + 1;
//         }
//       });
//     return (
//       <List
//         itemLayout="horizontal"
//         dataSource={[
//           ...unAuth,
//           ...onlines
//             .filter((i) => i.userId != '0')
//             .sort(
//               (a, b) =>
//                 new Date(b.onlineTime).getTime() - new Date(a.onlineTime).getTime(),
//             ),
//         ]}
//         renderItem={(item) => <OnlineItem data={item} />}
//       />
//     );
//   };

const tabList = computed(()=>{
  if(!onlines.value) return []
  return [
    {
      name: 'online_user',
      label: `在线用户(${onlines.value.users.length})`,
      // children: loadOnlineInfo(onlines.value.users),
    },
    {
      name: 'online_connection',
      label: `在线数据核(${onlines.value.storages.length})`,
      // children: loadOnlineInfo(onlines.value.storages),
    },
  ]
})
const activeName = ref('online_user')

</script>
<template>
  <ElDrawer v-if="onlines" v-model="isOpen" :width="500" placement="right" @close="props.onClose">
    <ElTabs v-model="activeName">
      <ElTabPane v-for="item in tabList" :key="item.name" 
        :name="item.name" 
        :label="item.label"
      >
        {{ item.label }}
      </ElTabPane>
    </ElTabs>
  </ElDrawer>
</template>

<style lang='scss' scoped>

</style>