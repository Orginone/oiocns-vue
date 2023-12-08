<script setup lang="ts">
import GroupContent from './GroupContent/index.vue'
import SendBox from './SendBox/index.vue'
import ChatShareForward from './ChatShareForward/index.vue';
import { ISession, IMessage } from '@/ts/core';
// import { RiShareForwardLine } from '@/icons/ri';
import { Promotion,Close,Delete } from '@element-plus/icons-vue'
// import { AiOutlineClose } from '@/icons/ai';

const props = defineProps<{ 
  chat: ISession
  filter: string 
}>()

const writeContent=ref<any>(null); // 重新编辑
const citeText=ref<string>(''); // 引用值
const enterCiteMsg=ref<string | any>(); // 回车赋值
const forwardMessage=ref<IMessage[]>([]);
const showShareForward=ref(false);
const multiSelectShow=ref(false);
const btachType=ref<string>('');
/**
 * @description: 重新编辑
 * @param {string} write
 * @return {*}
 */
const handleReWrites = (write: string) => {
  writeContent.value = write
}
/** 逐条转发 */
const multiSingleSend = () => {
  if(forwardMessage.value.length){
    showShareForward.value = true
    btachType.value = 'single'
  }else {
    ElMessage.warning('请选择需要转发的消息')
  }
  
}
/** 合并转发 */
const multiBatchSend = () => {
  if(forwardMessage.value.length){
    showShareForward.value = true
    btachType.value = 'merge'
  }else {
    ElMessage.warning('请选择需要转发的消息')
  }
}
/** 批量删除 */
const multiDelete = async() => {
  if(forwardMessage.value.length===0) return ElMessage.warning('请选择需要删除的消息')
  const res = await Promise.all(forwardMessage.value.map(item=> props.chat.deleteMessage(item.id)))
  if(res) return ElMessage.success('删除成功')
}
</script>

<template>
  <div class="chart_page">
    <!-- 聊天记录区域 -->
    <GroupContent
      :chat="chat"
      :key="chat.key"
      :multiSelectShow="multiSelectShow"
      :handleReWrites="handleReWrites"
      :filter="filter"
      :citeText="(text: any) => citeText=text"
      :forward="(item: IMessage) => {
        btachType='single'
        forwardMessage=[item]
        showShareForward=true        
      }"
      :multiSelectMsg="(item: IMessage, checked) => {
        if (checked) {
          // 添加到转发消息数组中
          forwardMessage=[...forwardMessage, item]
        } else {
          // 从转发消息数组中移除
          forwardMessage=forwardMessage.filter((itm: IMessage) => itm.id !== item.id)
        }
      }"
      :multiSelectFn="(multi: boolean) => multiSelectShow=multi"
      :enterCiteMsg="enterCiteMsg"
    />
    <!-- 输入区 -->
    <div class="chart_input" v-if="!multiSelectShow">
      <SendBox
        :chat="chat"
        :writeContent="writeContent"
        :citeText="(citeText as any)"
        :closeCite="(e: string) => citeText = e" 
      />
    </div>
    <!-- 多选操作 -->
    <div class="chart_mulit_select" v-else>
      <div class="chart_mulit_select_actions_wrap">
        <!-- 逐条转发 -->
        <div class="chart_mulit_select_action" @click="multiSingleSend">
          <span class="chart_mulit_select_icon">
            <ElIcon :size="22" ><Promotion/></ElIcon>
          </span>
          <span class="chart_mulit_select_txt">逐条转发</span>
        </div>
        <!-- 合并转发 -->
        <div class="chart_mulit_select_action" @click="multiBatchSend">
          <span class="chart_mulit_select_icon">
            <ElIcon :size="22" ><Promotion/></ElIcon>
          </span>
          <span class="chart_mulit_select_txt">合并转发</span>
        </div>
        <!-- 批量删除 -->
        <div class="chart_mulit_select_action" @click="multiDelete" >
          <span class="chart_mulit_select_icon">
            <ElIcon :size="22" ><Delete/></ElIcon>
          </span>
          <span class="chart_mulit_select_txt">批量删除</span>
        </div>
      </div>
      <div class="close-btn">
        <ElIcon :size="24" @click="multiSelectShow=false"><Close style="cursor: pointer;"/></ElIcon>
      </div>
    </div>
  </div>
  <!-- 选择转发对象对话框 -->
  <ChatShareForward
    v-if="forwardMessage.length>0 && showShareForward"
    :open="showShareForward"
    :message="forwardMessage"
    :btachType="btachType"
    :onShow="(val: boolean) => {
      showShareForward=val
      multiSelectShow=false
      forwardMessage=[]
    }"
  />
</template>

<style lang="less" scoped>
.chart_page {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  overflow: hidden;
  background-color: #FCFCFC;
  .chart_mulit_select {
    padding: 0 24px;
    //  TODO: color/surface/次要容器背景
    background-color: #F7F8FA;
    display: flex;
    justify-content: end;
    align-items: center;
    .chart_mulit_select_actions_wrap {
      flex: 1;
      display: flex;
      justify-content: center;
      gap: 10px;
      padding: 16px 0;
      .chart_mulit_select_action {
        width: 200px;
        display: flex;
        gap: 10px;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        .chart_mulit_select_icon {
          border-radius: 4px;
          padding: 10px;
          background-color: #FFFFFF;
        } 
        .chart_mulit_select_txt {
          //styleName: 14/CN-Regular;
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          letter-spacing: 0em;
          text-align: left;
          // TODO: color/text & icon/text - color-3
          color: #6F7686;
        }       
      }      
    }


  }
}
</style>
