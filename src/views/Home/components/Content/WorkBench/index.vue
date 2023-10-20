<script setup lang="ts">
import orgCtrl from '@/ts/controller';
import { formatSize } from '@/ts/base/common';
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate';
import AppCard from './AppCard.vue';
import EntrysCard from './EntrysCard.vue';
import { PriceTag,Menu } from '@element-plus/icons-vue';

const router = useRouter();

// 状态
const state = reactive({
  chat: {
    loaded: false,
    msgCount: 0,
    friendCount: 0,
    groupCount: 0,
    companyCount: 0
  },
  work: {
    loaded: false,
    todoCount: 0,
    doneCount: 0,
    applyCount: 0
  },
  storage: {
    files: 0,
    fileSize: 0,
    objects: 0,
    totalSize: 0,
    fsUsedSize: 0,
    fsTotalSize: 0
  },
  application: {
    loaded: false,
    all: [], // 所有
    commonUse: [], // 常用
    mine: [], // 我的
    share: [], // 共享
    allAppShow: false, // 全部应用弹框
  }
})
/** 快捷操作配置 */ 
const entrys = [
  {
    label: '添加好友',
    cmd: 'joinFriend',
  },
  {
    label: '申请存储',
    cmd: 'joinFriend',
  },
  {
    label: '创建群组',
    cmd: 'newCohort',
  },
  {
    label: '加入群聊',
    cmd: 'joinCohort',
  },
  {
    label: '设立单位',
    cmd: 'newCompany',
  },
  {
    label: '加入单位',
    cmd: 'joinCompany',
  },
]
// 订阅各种变更
useFlagCmdEmitter('session',()=>{
  state.chat.loaded = false;
  state.chat.msgCount = 0;
  state.chat.friendCount = 0;
  state.chat.groupCount = 0;
  // 通过控制器获取所有相关会话，遍历所有相关会话
  for (const item of orgCtrl.chats) {
    // 未读
    if (item.isMyChat) {
      state.chat.msgCount+=item.chatdata.noReadCount
    }
    // 其它计数
    if (item.isFriend) {
      if(item.typeName==='人员') state.chat.friendCount++;
      else if (item.typeName==='单位') state.chat.companyCount++;
      if(item.isGroup) state.chat.groupCount++;
    }
  }
  // TODO:可能有问题
  if(orgCtrl.chats.length>1){
    state.chat.loaded = true
  }
})
useFlagCmdEmitter('work',()=>{
  state.work.loaded = false
  state.work.todoCount = orgCtrl.work.todos.length
  orgCtrl.work.loadApplyCount().then((v) => {
    state.work.applyCount = v
  })
  orgCtrl.work.loadCompletedCount().then((v) => {
    state.work.doneCount = v
  })
  // TODO:
  // console.log(orgCtrl.work);
  if(orgCtrl.work?._todoLoaded===true){
    state.work.loaded = true;
  }
  
})
useFlagCmdEmitter('applications',async()=>{
  state.application.loaded = true;
  state.application.all = await orgCtrl.loadApplications();
  state.application.commonUse = state.application.all.filter(item => {
    return item.cache.tags?.includes('常用')
  })
  state.application.mine = state.application.all.filter(item => {
    return item.metadata.createUser === item.userId
  })
  state.application.share = state.application.all.filter(item => {
    return item.metadata.createUser !== item.userId
  })
  
  state.application.loaded = true

})
//获取存储信息
orgCtrl.user.getDiskInfo().then((value) => {
  state.storage.files = value.files
  state.storage.fileSize = value.fileSize
  state.storage.objects = value.objects
  state.storage.totalSize = value.totalSize
  state.storage.fsUsedSize = value.fsUsedSize
  state.storage.fsTotalSize = value.fsTotalSize
});

</script>

<template>
  <div class="content">
    <!-- 沟通&办事&存储 -->
    <div class="cardGroup">
      <!-- 沟通 -->
      <div class="cardItem" @click="router.push('/chat')">
        <div class="cardItemHeader">
          <span class="title">沟通</span>
          <span class="remind" v-if="state.chat.msgCount > 0">{{ `未读消息·${state.chat.msgCount}条` }}</span>
        </div>
        <div class="cardItemViewer" v-loading="!state.chat.loaded">
          <ElSpace wrap :size="2" spacer="|">
            <div class="dataItem">
              <div class="dataItemTitle">好友(人)</div>
              <div class="dataItemNumber">{{ state.chat.friendCount }}</div>
            </div>
            <div class="dataItem">
              <div class="dataItemTitle">群组(个)</div>
              <div class="dataItemNumber">{{ state.chat.groupCount }}</div>
            </div>
            <div class="dataItem">
              <div class="dataItemTitle">单位(个)</div>
              <div class="dataItemNumber">{{ state.chat.companyCount }}</div>
            </div>
          </ElSpace>
        </div>
      </div>
      <!-- 办事 -->
      <div class="cardItem" @click="router.push('/work')">
        <div class="cardItemHeader">
          <span class="title">办事</span>
        </div>
        <div class="cardItemViewer" v-loading="!state.work.loaded">
            <ElSpace wrap :size="2" spacer="|">
              <div class="dataItem">
                <div class="dataItemTitle">待办(件)</div>
                <div class="dataItemNumber">{{ state.work.todoCount }}</div>
              </div>
              <div class="dataItem">
                <div class="dataItemTitle">已办(件)</div>
                <div class="dataItemNumber">{{ state.work.doneCount }}</div>
              </div>
              <div class="dataItem">
                <div class="dataItemTitle">发起(件)</div>
                <div class="dataItemNumber">{{ state.work.applyCount }}</div>
              </div>
            </ElSpace>
          </div>
      </div>
      <!-- 存储 -->
      <div class="cardItem" @click="router.push('/store')">
        <div class="cardItemHeader">
          <span class="title">存储</span>
        </div>
        <div class="cardItemViewer">
            <ElSpace wrap :size="2" spacer="|">
              <div class="dataItem">
                <div class="dataItemTitle">{{`文件(${state.storage.files})个`}}</div>
                <div class="dataItemNumber">{{formatSize(state.storage.fileSize)}}</div>
              </div>
              <div class="dataItem">
                <div class="dataItemTitle">{{ `数据(${state.storage.objects})个` }}</div>
                <div class="dataItemNumber">{{ formatSize(state.storage.totalSize) }}</div>
              </div>
              <div class="dataItem">
                <div class="dataItemTitle">{{ `硬件(${formatSize(state.storage.fsUsedSize)})` }}</div>
                <div class="dataItemNumber">{{ formatSize(state.storage.fsTotalSize) }}</div>
              </div>
            </ElSpace>
          </div>
      </div>
    </div>
    <!-- 快捷操作&常用应用 -->
    <div class="cardGroup">
      <!-- 快捷操作卡片 -->
      <div class="cardItem" >
        <div class="cardItemHeader">
          <span class="title">快捷操作</span>
          <span class="extraBtn">
            <ElButton 
              text
              size="small"
              @click="router.push('/setting')"
            >
              <ElIcon><PriceTag/></ElIcon> <span>更多操作</span>
            </ElButton>
          </span>
        </div>
        <div class="cardItemViewer" style="max-width: 500px;">
          <ElSpace wrap  spacer="|">
            <EntrysCard v-for="item in entrys" :key="item.cmd" :menu="item"/>
          </ElSpace>
          </div>
      </div>
      <!-- 常用应用卡片 -->
      <div class="cardItem">
        <div class="cardItemHeader">
          <span class="title">常用应用</span>
          <span class="extraBtn">
            <ElButton 
              text 
              size="small"
              @click="state.application.allAppShow = true"
            >
              <ElIcon><Menu/></ElIcon> <span>全部应用</span>
            </ElButton>
          </span>
        </div>
        <div class="cardItemViewer"  v-loading="!state.application.loaded">
          <ElSpace wrap :size="2" spacer="|">
            <AppCard v-for="item in state.application.commonUse" :key="item.id" :app="item"/>
          </ElSpace>
        </div>
        <!-- 常用应用-弹框 -->
        <ElDialog v-model="state.application.allAppShow" title="全部应用" width="800px">
          <!-- 常用应用 -->
          <div class="appGroupTitle" v-if="state.application.commonUse.length">常用应用</div>
          <ElSpace wrap :size="2" spacer="|">
            <AppCard v-for="item in state.application.commonUse" :key="item.id" :app="item"/>
          </ElSpace>
          <!-- 我的应用 -->
          <div class="appGroupTitle" v-if="state.application.mine.length">我的应用</div>
          <ElSpace wrap :size="2" spacer="|">
            <AppCard v-for="item in state.application.mine" :key="item.id" :app="item"/>
          </ElSpace>
          <!-- 共享应用 -->
          <div class="appGroupTitle" v-if="state.application.share.length">共享应用</div>
          <ElSpace wrap :size="2" spacer="|">
            <AppCard v-for="item in state.application.share" :key="item.id" :app="item"/>
          </ElSpace>
        </ElDialog>
      </div>
    </div>
    <!-- 日历 -->
    <!-- TODO: -->
    <div class="calendar">
      <div class="cardItem">
        <div class="cardItemHeader">
          <span class="title">日历</span>
          <span className={cls.extraBtn}>
            <ElButton type="text" size="small">
              <!-- TODO:图标 -->
              <ImPlus /> <span>创建日程</span>
            </ElButton>
          </span>
        </div>
        <ElCalendar />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  width: 100%;
  color: #4c4c4c;
  height: calc(100vh - 200px);
  box-sizing: border-box;
  padding: 12px;
  gap: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
  background-color: #f1f1f1;
  background: linear-gradient(#f5f5f5f5, #f1f1f1);
  .cardGroup {
    display: flex;
    gap: 16px;
    width: 100%;
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    .cardItem {
      min-width: 400px;
      height: 180px;
      border-radius: 6px;
      padding: 16px;
      cursor: pointer;
      background-color: #ffffff;
      border: 1px solid #ffffff;
      box-shadow: 0 0 2px 2px #ededed;
    }
  }

  .calendar {
    width: 100%;
    border-radius: 6px;
    background-color: #ffffff;
    border: 1px solid #ffffff;
    .cardItem {
      padding: 16px;
    }
  }
}

.cardItemHeader {
  .title {
    font-weight: bolder;
    font-size: 18px;
  }
  .remind {
    font-size: 12px;
    color: #ff0404;
    background-color: #fde8e0;
    padding: 2px 6px;
    margin-left: 7px;
    border-radius: 20px;
  }
  .extraBtn {
    float: right;
    font-size: 14px;
    color: #686868;
    cursor: pointer;
    padding-top: 4px;
    span {
      margin-left: 2px;
      margin-bottom: 2px;
    }
    :hover {
      color:#3838b9;
    }
  }
}

.cardItemViewer {
  padding-top: 12px;
  height: 100px;
  // .linkBtn {
  //   margin: 10px;
  //   height: 35px;
  //   width: 90px;
  //   background-color: #f5f5f5;
  //   &:hover {
  //     // TODO:
  //     // background: @active-background;
  //     background-color: red;
  //   }
  // }
  .appGroupTitle {
    font-weight: bolder;
    font-size: 18px;
    padding: 16px 2px;
  }
  .dataItem {
    min-width: 120px;
    padding: 16px;
    text-align: center;
    &Title{
      color: #686868;
      font-size: 14px;
      margin-bottom: 10px;
    }
    &Number{
      font-weight: bold;
      color: #313131;
      font-size: 28px;
    }
    &:hover {
      border-radius: 10px;
      // TODO:改为变量
      background-color: #e6f1ff;
    }
  }
}

</style>
