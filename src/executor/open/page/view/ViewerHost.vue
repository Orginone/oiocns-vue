<script setup lang='ts'>
import {
  IPageContext,
  PageContext,
} from '../../../design/pageBuilder/render/PageContext'

const props = defineProps<{
  ctx: IPageContext<'view'>
}>()
const RootRender = props.ctx.view.components.rootRender as any
// TODO:提供上下文给子组件
provide('PageContext',props.ctx)
</script>
<template>
  <!-- <PageContext.Provider value={ctx}> -->
    <div class="o-page-host page-host--view">
      <RootRender :element="ctx.view.rootElement" />
    </div>
  <!-- </PageContext.Provider> -->
</template>

<style lang='scss' scoped>

</style>