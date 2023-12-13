<script setup lang='ts'>

const props = defineProps<{
  chat?: boolean;
  market?: boolean;
  home?: boolean;
  store?: boolean;
  work?: boolean;
  activity?: boolean
  exit?: boolean;
  setting?: boolean;
  myWork?: boolean;
  workDone?: boolean;
  workStart?: boolean;
  selected?: boolean;
  size?: number;
  title?: string;
  type?: string;
  css?: any;
  notAvatar?: boolean;
  className?: string;
}>()

  const size = props.size ?? 22;
  let svgName = 'home';
  if (props.chat) {
    svgName = 'chat';
  } else if (props.work) {
    svgName = 'work';
  } else if (props.setting) {
    svgName = 'setting';
  } else if (props.exit) {
    svgName = 'exit';
  } else if (props.market) {
    svgName = 'market';
  } else if (props.store) {
    svgName = 'store';
  } else if (props.activity) {
    svgName = 'activity'
  } else if (props.workDone) {
    svgName = 'workDone';
  } else if (props.myWork) {
    svgName = 'myWork';
  } else if (props.workStart) {
    svgName = 'workStart';
  } else if (props.type) {
    svgName = props.type;
  }
  if (props.selected) {
    svgName += '-select';
  }
</script>

<template>
  <template v-if="notAvatar">
    <ElImage
      :class="className"
      :height="size"
      :width="size"
      :src="`/svg/${svgName}.svg`"
      :style="css"
    />
  </template>
  <template v-else>
    <ElAvatar
      fit="contain"
      shape="square"
      :size="size"
      :class="className"
      :src="`/svg/${svgName}.svg`"
      :style="{ background: 'transparent', color: '#606060', ...props.css }"
    />
  </template>
</template>

