<template>
  <el-dialog
    :model-value="visible"
    title="身份设置"
    width="68%"
    append-to-body
    @close="emit('update:visible', false)"
  >
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
  </el-dialog>
</template>
<script lang="ts" setup>
  import Identity from '../module/identity.vue'
  import Info from '../module/info.vue'
  import User from '../module/user.vue'
  import { ref, onMounted, computed, watch} from 'vue';
  import { setCenterStore } from '@/store/setting'

  const currentData = computed(()=> setCenterStore().identityList)
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    }
  })
  const emit = defineEmits<{
    (e: 'update:visible', isShow: boolean): void
  }>()

  const identity = ref(null);
  const info = ref(null);
  const body = ref(null);
  const selectItem = ref({})
  // 左侧点击
  const itemClick = (selectItem: any)=>{
    const data = currentData.value.filter((i: any) => i?.target?.id === selectItem?.target?.id)
    selectItem.value = selectItem;
    info.value.selectItemChange(data[0]);
    body.value.selectItemChange(data[0]);
  }
  // 列表刷新
  const refresh = ()=>{
    identity.value.refresh();
  }

  watch(()=> props.visible, (newValue) => {
    if(newValue) {
      identity.value?.refresh()
    }
  })

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

</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 0 3px;
  box-sizing: border-box;
  display: flex;

  .tree {
    width: 20%;
  }
  .content{
    width: 80%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    box-shadow: var(--el-box-shadow-light);
    background-color: #e7e7e7;
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
