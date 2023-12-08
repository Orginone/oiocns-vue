<script setup lang='ts'>

const props = defineProps<{
  src: string
}>()

const audioRef = ref(null)
const totalTime = ref(0)
// 获取总时长
onMounted(() => {
  audioRef.value.oncanplay = ()=>{
    totalTime.value = Math.floor(audioRef.value.duration)
  }
})
// 播放暂停控制
const playAudio = ()=>{
  if(audioRef.value.paused){
    audioRef.value.play()
  }else{
    audioRef.value.pause()
  }
}
</script>
<template>
  <div class="voice-bar" @click="playAudio">
    <audio :src="src" ref="audioRef" controls style="display:none"/>
    <!-- TODO: -->
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.7559 1.75952C13.9809 3.98753 15.2307 7.0076 15.2307 10.1564C15.2307 13.3052 13.9809 16.3253 11.7559 18.5533" stroke="white" stroke-width="1.25" stroke-linejoin="round"/>
      <path d="M7.7793 5.73682C8.35966 6.31718 8.82003 7.00618 9.13413 7.76446C9.44822 8.52275 9.60988 9.33547 9.60988 10.1562C9.60988 10.977 9.44822 11.7897 9.13413 12.548C8.82003 13.3063 8.35966 13.9953 7.7793 14.5757" stroke="white" stroke-width="1.25" stroke-linejoin="round"/>
      <path d="M2.69646 10.8193C3.06258 11.1854 3.65617 11.1854 4.02229 10.8193C4.3884 10.4532 4.3884 9.8596 4.02229 9.49348C3.65617 9.12736 3.06258 9.12736 2.69646 9.49348C2.33035 9.8596 2.33035 10.4532 2.69646 10.8193Z" fill="white"/>
    </svg>
    <span class="time">{{totalTime}}”</span>
  </div>
</template>

<style lang='scss' scoped>
.voice-bar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
  .time {
    //styleName: 14/CN-Regular;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0em;
    text-align: left;

  }
}
</style>