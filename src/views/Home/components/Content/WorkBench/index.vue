<script setup lang="ts">
import orgCtrl from '@/ts/controller'
import { formatSize } from '@/ts/base/common'
import { command, model } from '@/ts/base';
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate'
import AppCard from './AppCard.vue'
import EntrysCard from './EntrysCard.vue'
import fullScreenModal from '@/components/Common/fullScreenModal.vue'
import { Dropbox,Stack,Bubbles2,List,Plus } from '@/icons/im'
import { IApplication, TargetType } from '@/ts/core'
import DataItem from './DataItem.vue'

const router = useRouter();

// 状态
const state = reactive({
  work: {
    loaded: false,
    todoCount: 0,
    applyCount: 0,
    copysCount: 0,
    completedCount: 0,
  },
  application: {
    all: [], // 所有
    commonUse: [], // 常用
    mine: [], // 我的
    share: [], // 共享
    allAppShow: false, // 全部应用弹框
  }
})
/** 快捷操作配置 */ 
const entrys = [
  {label: '添加好友',cmd: 'joinFriend',icon: 'joinFriend'},
  {label: '申请存储',cmd: 'joinStorage',icon: '存储资源'},
  {label: '创建群组',cmd: 'newCohort',icon: '群组'},
  {label: '加入群聊',cmd: 'joinCohort',icon: 'joinCohort'},
  {label: '设立单位',cmd: 'newCompany', icon: '单位'},
  {label: '加入单位',cmd: 'joinCompany', icon: 'joinCompany'},
]
// 订阅沟通变更
const msgCount = ref(0)
const {loaded: chatLoaded,key:chatKey} = useFlagCmdEmitter('session', () => {
  msgCount.value =
    orgCtrl.chats
      .map((i) => {
        return i.isMyChat ? i.badgeCount : 0;
      })
      .reduce((total, count) => total + count, 0)
})
// 订阅办事变更
let workId = ''
onMounted(() => {
  workId = orgCtrl.subscribe(() => {
    state.work.todoCount = orgCtrl.work.todos.length
    orgCtrl.work.loadTaskCount('我发起的').then((v) => {
      state.work.applyCount = v
    });
    orgCtrl.work.loadTaskCount('抄送我的').then((v) => {
      state.work.copysCount = v
    });
    orgCtrl.work.loadTaskCount('已办事项').then((v) => {
      state.work.completedCount = v
    });
  })
})
onBeforeUnmount(() => {
  orgCtrl.unsubscribe(workId)
})

useFlagCmdEmitter('applications',async()=>{
  state.application.all = await orgCtrl.loadApplications()
  state.application.commonUse = state.application.all.filter(item => {
    return item.cache.tags?.includes('常用')
  })
  state.application.mine = state.application.all.filter(item => {
    return item.metadata.createUser === item.userId
  })
  state.application.share = state.application.all.filter(item => {
    return item.metadata.createUser !== item.userId
  }) 
})
//获取存储信息
const diskInfo = ref<model.DiskInfoType>()
onMounted(() => {
  orgCtrl.user.getDiskInfo().then((value) => {
    diskInfo.value = value
  })
})

</script>

<template>
  <div class="content">
    <!-- 行——快捷操作 -->
    <div class="cardGroup">
      <!-- 快捷操作卡片 -->
      <div class="cardItem" >
        <div class="cardItemHeader">
          <span class="title">快捷操作</span>
          <span class="extraBtn">
            <div @click="router.push('/setting')">
              <ElIcon :size="14"><Stack/></ElIcon> <span>更多操作</span>
            </div>
          </span>
        </div>
        <div class="cardItemViewer">
          <ElSpace wrap  spacer="|">
            <EntrysCard v-for="item in entrys" :key="item.cmd" :menu="item"/>
          </ElSpace>
          </div>
      </div>      
    </div>
    <!-- 行——沟通&办事 -->
    <div class=" cardGroup">
      <!-- 沟通卡片 -->
      <div class="cardItem" @click="router.push('/chat')" v-loading="!chatLoaded">
        <div class="cardItemHeader">
          <span class="title">沟通</span>
          <span class="extraBtn">
            <div>
              <ElIcon :size="14"><Bubbles2 /></ElIcon>
              <span>
                未读<b>{{msgCount}}</b>条
              </span>
            </div>
          </span>
        </div>
        <div class="cardItemViewer">
          <ElSpace wrap :size="2" spacer="|">
            <DataItem title="好友(人)" :number="orgCtrl.user.members.length" :key="chatKey"/>
            <DataItem title="同事(个)" 
              :number="
                orgCtrl.user.companys
                  .map((i) => i.members.map((i) => i.id))
                  .reduce(
                    (ids, current) => [
                      ...ids,
                      ...current.filter((i) => !ids.includes(i)),
                    ],
                    [],
                  ).length
              "
              />
            <DataItem title="群聊(个)" :number="orgCtrl.chats.filter((i) => i.isMyChat && i.isGroup).length" />
            <DataItem title="单位(家)" :number="orgCtrl.user.companys.length" />
          </ElSpace>
        </div>
      </div>
      <!-- 办事卡片 -->
      <div class="cardItem" @click="router.push('/work')">
        <div class="cardItemHeader">
          <span class="title">办事</span>
          <span class="extraBtn">
            <div>
              <ElIcon :size="14"><List /></ElIcon>
              <span>
                待办<b>{{state.work.todoCount}}</b>件
              </span>
            </div>
          </span>
        </div>
        <div class="cardItemViewer">
            <ElSpace wrap :size="2" spacer="|">
              <DataItem title="待办事项" :number="state.work.todoCount" />
              <DataItem title="已办事项" :number="state.work.completedCount" />
              <DataItem title="我发起的" :number="state.work.applyCount" />
              <DataItem title="抄送我的" :number="state.work.copysCount" />
            </ElSpace>
          </div>
      </div>
    </div>
    <!-- 数据 -->
    <div class="cardGroup">
      <!-- 数据卡片 -->
      <div class="cardItem" @click="router.push('/store')">
        <div class="cardItemHeader">
          <span class="title">数据</span>
          <span class="extraBtn">
            <div>
              <ElIcon :size="14"><Plus /></ElIcon>
              <span>管理数据</span>
            </div>
          </span>          
        </div>
        <div class="cardItemViewer">
            <ElSpace wrap :size="2" spacer="|">
              <template v-if="diskInfo">
                <DataItem title="关系(个)" 
                  :number="orgCtrl.chats.filter((i) => i.isMyChat && i.typeName !== TargetType.Group,).length"
                  :size="-1"
                  :info="`共计:${orgCtrl.chats.length}个`"
                />
                <DataItem title="数据集(个)" :number="diskInfo.collections" :size="diskInfo.dataSize"/>
                <DataItem title="对象数(个)" :number="diskInfo.objects" :size="diskInfo.totalSize"/>
                <DataItem title="文件(个)" :number="diskInfo.files" :size="diskInfo.fileSize"/>
                <DataItem title="硬件" :number="formatSize(diskInfo.fsUsedSize)" :size="diskInfo.fsTotalSize"/>
              </template>
            </ElSpace>
          </div>
      </div>
    </div>
    <!-- 常用应用 -->
    <div class="cardGroup">
      <!-- 常用应用卡片 -->
      <div class="cardItem">
        <div class="cardItemHeader">
          <span class="title">常用应用</span>
          <span class="extraBtn" @click="state.application.allAppShow = true">
            <div><ElIcon :size="14"><Dropbox/></ElIcon> <span>全部应用</span></div>
          </span>
        </div>
        <div class="cardItemViewer">
          <ElSpace wrap :size="2" spacer="|">
            <AppCard v-for="item in state.application.commonUse" :key="item.id" :app="item"/>
          </ElSpace>
        </div>
        <!-- 常用应用-弹框 -->
        <fullScreenModal 
          width="60vw"
          bodyHeight="60vh"
          :open="state.application.allAppShow"
          :onCancel="()=>{state.application.allAppShow = false}"
        >
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
        </fullScreenModal>
      </div>
    </div>
    <!-- 日历 -->
    <div class="calendar">
      <div class="cardItem">
        <div class="cardItemHeader">
          <span class="title">日历</span>
          <span class="extraBtn">
            <div><ElIcon><Plus /></ElIcon> <span>创建日程</span></div>
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
      flex: 1;
      min-width: 400px;
      // height: 180px;
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
    font-size: 14px !important;
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
  // height: 100px;
  // .linkBtn {
  //   margin: 10px;
  //   height: 35px;
  //   width: 90px;
  //   background-color: #f5f5f5;
  //   &:hover {
  //     // background: @active-background;
  //     background-color: red;
  //   }
  // }
  .appGroupTitle {
    font-weight: bolder;
    font-size: 18px;
    padding: 16px 2px;
  }
  // .dataItem {
  //   min-width: 120px;
  //   padding: 16px;
  //   text-align: center;
  //   &Title{
  //     color: #686868;
  //     font-size: 14px;
  //     margin-bottom: 10px;
  //   }
  //   &Number{
  //     font-weight: bold;
  //     color: #313131;
  //     font-size: 28px;
  //   }
  //   &:hover {
  //     border-radius: 10px;
  //     // TODO:改为变量
  //     background-color: #e6f1ff;
  //   }
  // }
}

</style>
