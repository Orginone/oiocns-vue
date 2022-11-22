<template>
<div class="container">
    <i-table />
</div>
</template>
<script lang="ts" setup>
import iTable from './components/table.vue'

</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    background-color: var(--el-bg-color-overlay);;
    margin-top: 3px;
    box-sizing: border-box;
}
</style>