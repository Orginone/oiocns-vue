<script setup lang="ts">
import orgCtrl from '@/ts/controller'
import { formatSize } from '@/ts/base/common'
import { model } from '@/ts/base'
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate'
import AppCard from './AppCard.vue'
import EntrysCard from './EntrysCard.vue'
import fullScreenModal from '@/components/Common/fullScreenModal.vue'
import { Dropbox,Stack,Bubbles2,List,Plus } from '@/icons/im'
import { IApplication, TargetType } from '@/ts/core'
import DataItem from './DataItem.vue'

const router = useRouter();

/** 快捷操作配置 */ 
const entrys = [
  {label: '添加好友',cmd: 'joinFriend',icon: 'joinFriend'},
  {label: '申请存储',cmd: 'joinStorage',icon: '存储资源'},
  {label: '创建群组',cmd: 'newCohort',icon: '群组'},
  {label: '加入群聊',cmd: 'joinCohort',icon: 'joinCohort'},
  {label: '设立单位',cmd: 'newCompany', icon: '单位'},
  {label: '加入单位',cmd: 'joinCompany', icon: 'joinCompany'},
]
// 沟通data
const msgCount = ref(0)
const {loaded: chatLoaded,key:chatKey} = useFlagCmdEmitter('session', () => {
  msgCount.value =
    orgCtrl.chats
      .map((i) => {
        return i.isMyChat ? i.badgeCount : 0;
      })
      .reduce((total, count) => total + count, 0)
})

// 办事data
const todoCount=ref(0)
const applyCount=ref(0)
const copysCount=ref(0)
const completedCount=ref(0)
const workId = orgCtrl.subscribe(() => {
  todoCount.value = orgCtrl.work.todos.length
  orgCtrl.work.loadTaskCount('发起的').then((v) => {
    applyCount.value=v
  })
  orgCtrl.work.loadTaskCount('抄送').then((v) => {
    copysCount.value = v
  })
  orgCtrl.work.loadTaskCount('已办').then((v) => {
    completedCount.value = v
  })
})
onBeforeUnmount(()=>orgCtrl.unsubscribe(workId))

// 应用data
const allAppShow = ref(false)
const application = ref<IApplication[]>([])
const commonUse = computed<IApplication[]>(() => {
  return application.value.filter(item => {
    return item.cache.tags?.includes('常用')
  }) as IApplication[]
})
const mine = computed<IApplication[]>(() => {
  return application.value.filter(item => {
    return item.metadata.createUser === item.userId
  }) as IApplication[]
})
const share = computed<IApplication[]>(() => {
  return application.value.filter(item => {
    return item.metadata.createUser!== item.userId
  }) as IApplication[]
})
const {loaded: appLoaded} = useFlagCmdEmitter('applications',async()=>{
  application.value = await orgCtrl.loadApplications()
})
// 数据data
const noStore=ref(false)
const diskInfo = ref<model.DiskInfoType>()
orgCtrl.user.getDiskInfo().then((value) => {
  diskInfo.value = value
  noStore.value = (value === undefined)
})

</script>

<template>
  <div class="workbench-content">
    <!-- 组-快捷操作 -->
    <div class="cardGroup">
      <div class="cardItem" >
        <div class="cardItem-header">
          <span class="title">快捷操作</span>
          <span class="extraBtn">
            <div @click="router.push('/setting')">
              <ElIcon :size="14"><Stack/></ElIcon> <span>更多操作</span>
            </div>
          </span>
        </div>
        <div class="cardItem-viewer">
          <ElSpace wrap spacer="|"  :size="6">
            <EntrysCard v-for="item in entrys" :key="item.cmd" :menu="item"/>
          </ElSpace>
          </div>
      </div>      
    </div>
    <!-- 组-沟通、办事 -->
    <div class=" cardGroup">
      <!-- 沟通卡片 -->
      <div class="cardItem" @click="router.push('/chat')" v-loading="!chatLoaded">
        <div class="cardItem-header">
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
        <div class="cardItem-viewer">
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
        <div class="cardItem-header">
          <span class="title">办事</span>
          <span class="extraBtn">
            <div>
              <ElIcon :size="14"><List /></ElIcon>
              <span>
                待办<b>{{todoCount}}</b>件
              </span>
            </div>
          </span>
        </div>
        <div class="cardItem-viewer">
            <ElSpace wrap :size="2" spacer="|">
              <DataItem title="待办" :number="todoCount" />
              <DataItem title="已办" :number="completedCount" />
              <DataItem title="抄送" :number="copysCount" />
              <DataItem title="发起的" :number="applyCount" />
            </ElSpace>
          </div>
      </div>
    </div>
    <!-- 组-数据 -->
    <div class="cardGroup">
      <!-- 数据卡片 -->
      <div class="cardItem" @click="router.push('/store')">
        <div class="cardItem-header">
          <span class="title">数据</span>
          <span class="extraBtn">
            <div>
              <ElIcon :size="14"><Plus /></ElIcon>
              <span>管理数据</span>
            </div>
          </span>          
        </div>
        <div class="cardItem-viewer">
            <ElSpace wrap :size="2" spacer="|">
              <template v-if="diskInfo">
                <DataItem title="关系(个)" 
                  :number="orgCtrl.chats.filter((i) => i.isMyChat && i.typeName !== TargetType.Group,).length"
                  :size="-1"
                  :info="`共计:${orgCtrl.chats.length}个`"
                />
                <DataItem title="数据集(个)" :number="diskInfo.collections" :size="diskInfo.dataSize"/>
                <DataItem title="对象数(个)" :number="diskInfo.objects" :size="diskInfo.totalSize"/>
                <DataItem title="文件(个)" :number="diskInfo.filesCount" :size="diskInfo.filesSize"/>
                <DataItem title="硬件" :number="formatSize(diskInfo.fsUsedSize)" :size="diskInfo.fsTotalSize"/>
              </template>
              <h3 v-if="noStore" style="color:red">
                `您还未申请存储资源，
                您将无法使用本系统，
                请申请加入您的存储资源群（用来存储您的数据），
                个人用户试用存储群为（orginone_data），
                申请通过后请在关系中激活使用哦！`
              </h3>
            </ElSpace>
          </div>
      </div>
    </div>
    <!-- 组-常用应用 -->
    <div class="cardGroup">
      <!-- 常用应用卡片 -->
      <div class="cardItem" v-loading="!appLoaded">
        <div class="cardItem-header">
          <span class="title">常用应用</span>
          <span class="extraBtn" @click="allAppShow = true">
            <div><ElIcon :size="14"><Dropbox/></ElIcon> <span>全部应用</span></div>
          </span>
        </div>
        <div class="cardItem-viewer">
          <ElSpace wrap :size="2" spacer="|">
            <AppCard v-for="item in commonUse" :key="item.id" :app="item"/>
          </ElSpace>
        </div>
        <!-- 常用应用-弹框 -->
        <fullScreenModal 
          width="60vw"
          bodyHeight="60vh"
          :open="allAppShow"
          :onCancel="()=>allAppShow = false"
        >
           <!-- 常用应用 -->
            <div class="appGroupTitle" v-if="commonUse.length">常用应用</div>
            <ElSpace wrap :size="2" spacer="|">
              <AppCard v-for="item in commonUse" :key="item.id" :app="item"/>
            </ElSpace>
            <!-- 我的应用 -->
            <div class="appGroupTitle" v-if="mine.length">我的应用</div>
            <ElSpace wrap :size="2" spacer="|">
              <AppCard v-for="item in mine" :key="item.id" :app="item"/>
            </ElSpace>
            <!-- 共享应用 -->
            <div class="appGroupTitle" v-if="share.length">共享应用</div>
            <ElSpace wrap :size="2" spacer="|">
              <AppCard v-for="item in share" :key="item.id" :app="item"/>
            </ElSpace>
        </fullScreenModal>
      </div>
    </div>
    <!-- 日历 -->
    <div class="calendar">
      <div class="cardItem">
        <div class="cardItem-header">
          <span class="title">日历</span>
          <!-- <span class="extraBtn">
            <div><ElIcon><Plus /></ElIcon> <span>创建日程</span></div>
          </span> -->
        </div>
        <ElCalendar />
      </div>
    </div>
  </div>
</template>

<!-- <style lang="scss" scoped>
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

</style> -->

<style lang="less" scoped>
.workbench-content {
  width: 100%;
  color: #4c4c4c;
  height: calc(100vh - 300px);
  box-sizing: border-box;
  padding: 12px;
  gap: 16px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
  .cardGroup {
    display: flex;
    gap: 16px;
    width: 100%;
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    .cardItem {
      width: 100%;
      min-height: 180px;
      border-radius: 6px;
      padding: 16px;
      cursor: pointer;
      background-color: #ffffff;
      border: 1px solid #ffffff;
      // box-shadow: 0 0 2px 2px #ededed;
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

  .cardItem-header {
    .title {
      font-weight: bolder;
      font-size: 17px;
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
      color: #585858;
      cursor: pointer;
      padding-top: 4px;
      span {
        margin-left: 2px;
        margin-bottom: 2px;
      }
      &:hover {
        color: #3838b9;
      }
    }
  }
}
.cardItem-viewer {
  padding-top: 12px;
  min-height: 100px;
  .linkBtn {
    height: 40px;
    display: flex;
    padding: 8px 30px;
    background-color: #f5f5f5;
    &:hover {
      background: @active-background;
    }
  }
  .appCard {
    padding: 12px;
    text-align: center;
    cursor: pointer;
    min-width: 120px;
    .appName {
      font-size: 14px;
      font-weight: bold;
    }
    .teamName {
      color: #686868;
      font-size: 12px;
    }
    &:hover {
      border-radius: 10px;
      background: @active-background;
    }
  }
  .appGroup-title {
    font-weight: bolder;
    font-size: 18px;
    padding: 16px 2px;
  }
  .dataItem {
    min-width: 120px;
    padding: 16px;
    text-align: center;
    &Title {
      color: #686868;
      font-size: 14px;
      margin-bottom: 10px;
    }
    &Number {
      font-weight: bold;
      color: #313131;
      font-size: 28px;
    }
    &:hover {
      border-radius: 10px;
      background: @active-background;
    }
  }
}
</style>
