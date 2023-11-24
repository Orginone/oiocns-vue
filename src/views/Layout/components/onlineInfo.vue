<script setup lang='ts'>
import { kernel, model, schema } from '@/ts/base'
const props = defineProps<{
  onClose: () => void
}>()

const key = ref('1')
const onlines=ref<model.OnlineSet>()

const id = kernel.onlineNotify.subscribe((k) => {
  kernel.onlines().then((value) => {
    onlines.value = value
    key.value = k
  })
})

onBeforeUnmount(() => {
  kernel.onlineNotify.unsubscribe(id)
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

</script>
<template>
  <template v-if="onlines">
    <ElDrawer open :width="500" placement="right" onClose={() => onClose()}>
      <ElTabs
        key={key}
        centered
        items={[
          {
            key: 'online_user',
            label: `在线用户(${onlines.users.length})`,
            children: loadOnlineInfo(onlines.users),
          },
          {
            key: 'online_connection',
            label: `在线数据核(${onlines.storages.length})`,
            children: loadOnlineInfo(onlines.storages),
          },
        ]}
      />
  </ElDrawer>
  </template>
</template>

<style lang='scss' scoped>

</style>