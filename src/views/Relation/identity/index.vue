<template>
  <div class="container" ref="container">
    <div class="tree">
      <Identity ref="identity" @itemClick="itemClick"/>
    </div>
    <div class="content">
      <div class="info" ref="infoWrap">
        <Info ref="info" @refresh="refresh"/>
      </div>
      <div class="body" ref="bodyWrap" :style="{height:tabHeight+'px'}">
        <User ref="body" :selectItem="selectItem" :tabHeight='tabHeight'/>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import Identity from './identity.vue'
  import Info from './info.vue'
  import User from './user.vue'
  import { ref, onMounted, watch} from 'vue';

  const identity = ref(null);
  const info = ref(null);
  const body = ref(null);
  const selectItem = ref({})
  // 左侧点击
  const itemClick = (selectItem: any)=>{
    selectItem.value = selectItem;
    info.value.selectItemChange(selectItem);
    body.value.selectItemChange(selectItem);
  }
  // 列表刷新
  const refresh = ()=>{
    identity.value.refresh();
  }

  const screenHeight = ref<number>(0)
  window.addEventListener('resize',function () {
    if(container.value && infoWrap.value){
      tabHeight.value=container.value.clientHeight - 6 - infoWrap.value.clientHeight
    }
  })
  const container = ref(null)
  const infoWrap = ref(null)
  const tabHeight = ref<number>(400)
  onMounted(() => {
    if(container.value && infoWrap.value){
      tabHeight.value=container.value.clientHeight - 6 - infoWrap.value.clientHeight
    }
  })
  watch(
    () => screenHeight.value,
    (newValue, oldValue) => {

    },
    { immediate: true }
  )

</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 3px;
  box-sizing: border-box;
  display: flex;

  .tree {
    width: 20%;
  }
  .content{
    width: 80%;
    height: 100%;
    // padding:0 3px;
    box-sizing: border-box;
    // background: var(--el-bg-color-overlay);
    overflow: hidden;
    .info{
      padding :  0  0 3px;
      box-sizing: border-box;
    }
    .body{
      height: 400px;
    }
  }
}
</style>
