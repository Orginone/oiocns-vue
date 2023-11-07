<script setup lang="ts">
import data from "emoji-mart-vue-fast/data/all.json"
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src"
import "emoji-mart-vue-fast/css/emoji-mart.css";

const props = defineProps<{
  onSelect?: (emoji: any) => void
}>()

let emojiIndex = new EmojiIndex(data)

</script>

<template>
  <Picker 
    :data="emojiIndex" 
    set="facebook"
    @select="onSelect"
    :i18n="{ search: '搜索', categories: { recent: '最近使用' } }"

  />
</template>

<style lang="scss" scoped>

</style>
