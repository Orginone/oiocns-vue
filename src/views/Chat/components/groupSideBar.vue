<template>
  <div class="chart-side-wrap" @contextmenu.stop>
    <div class="group-side-bar-search flex" :size="4">
      <el-input
        placeholder="搜索"
        v-model="searchValue"
        prefix-icon="Search"
        @input="filterBySearch"
      />
      <el-button
        icon="CirclePlus"
        type="primary"
        link
        class="refresh"
        @click="targetIsMore"
        @focusout="isMoreClose"
      ></el-button>
    </div>
    <ul class="context-text-wrap more" v-if="isMore">
      <li class="context-menu-item" @click="dialogVisible = true">
        <el-icon><Plus /></el-icon>添加好友
      </li>
    </ul>
    <searchFriend
      v-if="dialogVisible"
      @closeDialog="dialogVisible = false"
      :serachType="1"
      @checksSearch="checksSearch"
    />
    <div
      class="group-side-bar-wrap"
      @contextmenu.prevent="mousePosition.isShowContext = false"
    >
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane
          v-for="val in tabData"
          :label="val.label"
          :name="val.name"
          :key="val.name"
        >
          <!-- 除了会话以外的 tab -->
          <ul
            class="group-con"
            v-for="item in groupList"
            :key="item.spaceId"
            v-show="val.name !== 'zero'"
          >
            <li class="group-con-item">
              <!-- 分组标题 -->
              <div
                class="con-title flex justify-between"
                :class="[openIdArr.includes(item.spaceId) ? 'active' : '']"
                @click="handleOpenSpace(item.spaceId)"
              >
                <span>{{ item.spaceName }}({{ item.chats.length ?? 0 }}) </span>
              </div>
              <!-- 展开的分组下的人员 -->
              <div v-show="openIdArr?.includes(item.spaceId)">
                <div
                  class="con-body"
                  v-for="child in item.chats"
                  :key="child.chatId"
                  @click="personnelContent(child)"
                >
                  <HeadImg
                    :name="child.target.name"
                    :label="child.target.label"
                    :limit="1"
                    :is-square="false"
                    :url="child.target.link ? child.target.link : null"
                  />
                  <div class="group-con-dot" v-if="child.noReadCount">
                    <span>{{ child.noReadCount }}</span>
                  </div>
                  <div class="group-con-show" @click="openChanged(child)">
                    <el-tooltip
                      class="box-item"
                      :disabled="child.target.name.length < 10"
                      :content="child.target.name"
                      placement="right-start"
                    >
                      <p class="group-con-show-name">
                        <span class="group-con-show-name-label">{{
                          child.target.name
                        }}</span>
                      </p>
                    </el-tooltip>
                  </div>
                </div>
              </div>
              <!-- 如果该分组没有被打开 但是有未读消息 则把未读消息会话显示出来 -->
              <!-- <div :class="[
              'con-body',
              chat.curChat.value?.spaceId === item.id && chat.curChat.value?.id === child.id
                ? 'active'
                : ''
            ]" v-for="child in item.chats.filter((v) => v.noRead > 0)" :key="child.id + child.name"
              v-show="!openIdArr?.includes(item.id)"
              @contextmenu.prevent.stop="(e: MouseEvent) => handleContextClick(e, child)">
              <HeadImg :name="child.name" :label="child.label" />
              <div class="group-con-dot" v-if="child.noRead > 0">
                <span>{{ child.noRead }}</span>
              </div>
              <div class="group-con-show" @click="openChanged(child)">
                <el-tooltip class="box-item" :disabled="child.name.length < 10" :content="child.name"
                  placement="right-start">
                  <p class="group-con-show-name">
                    <span class="group-con-show-name-label">{{ child.name }}</span>
                    <span class="group-con-show-name-time">{{ handleFormatDate(child.msgTime) }}
                    </span>
                  </p>
                </el-tooltip>
                <p class="group-con-show-msg">{{ child.showTxt }}</p>
              </div>
            </div> -->
            </li>
          </ul>
          <!-- 会话 tab -->
          <ul
            class="group-con"
            v-for="item in chatList"
            :key="`${item.spaceId}-${item.target.id}`"
            v-show="val.name === 'zero'"
          >
            <li class="group-con-item">
              <div
                class="con-body"
                :class="{
                  'top-session': item.isToping,
                  active:
                    chatRef.chat &&
                    chatRef.chat.spaceId === item.spaceId &&
                    chatRef.chat.target.id === item.target.id,
                }"
                @contextmenu.prevent.stop="(e: MouseEvent) => handleContextClick(e, item)"
                @click="personnelContent(item.target)"
              >
                <HeadImg
                  :name="item.target.name"
                  :label="item.target.label"
                  :limit="1"
                  :is-square="false"
                  :url="item.target.link ? item.target.link : null"
                />
                <div class="group-con-dot" v-if="item.noReadCount > 0">
                  <span>{{ item.noReadCount }}</span>
                </div>
                <div class="group-con-show" @click="openChanged(item)">
                  <el-tooltip
                    class="box-item"
                    :disabled="item.target.name.length < 10"
                    :content="item.target.name"
                    placement="right-start"
                  >
                    <p class="group-con-show-name">
                      <span class="group-con-show-name-label">{{
                        item.target.name
                      }}</span>
                      <span
                        v-if="item.lastMessage"
                        class="group-con-show-name-time"
                        >{{ handleFormatDate(item.lastMessage.updateTime) }}
                      </span>
                    </p>
                  </el-tooltip>
                  <p v-if="item.lastMessage" class="group-con-show-msg">
                    {{ item.lastMessage.showTxt }}
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
      <!-- 鼠标右键 -->
      <ul
        class="context-text-wrap"
        v-show="mousePosition.isShowContext"
        :style="{
          left: `${mousePosition.left}px`,
          top: `${mousePosition.top}px`,
        }"
      >
        <li
          class="context-menu-item"
          v-for="item in mousePosition.selectMenu"
          :key="item.value"
          @click="handleContextChange(item)"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup name="groupSideBar">
import {
  computed,
  isReactive,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { formatDate } from "@/utils/index";
import HeadImg from "@/components/headImg.vue";
import { useRoute } from "vue-router";
import searchFriend from "@/components/searchs/index.vue";
import FriendServices from "@/module/relation/friend";
import Loading from "@/views/Layout/components/loading.vue";
import _ from "lodash";
import { format } from "path";

const routerParams = useRoute().params;
const friendServices = new FriendServices();

const groupChats = ref([]);
const friendsChats = ref([]);
const companyChats = ref([]);
const conversationChats = ref([]);
const tabData = ref([
  { label: "会话", name: "zero" },
  { label: "通讯录", name: "first" },
  // { label: "群组", name: "second" },
  // { label: "单位", name: "third" },
  // { label: "好友", name: "fourth" },
]);
const chatsValue = ref<string>("");

const emit = defineEmits(["openChanged", "update:imgKey"]);
const props = defineProps<{
  chatRef: any;
  imgKey: number;
}>();
// 会话列表搜索关键字
const searchValue = ref<string>("");

const activeName = ref("zero");

// 是否已加载--判断是否需要默认打开
const isMounted = ref<boolean>(false);

const isMore = ref<boolean>(false);

const dialogVisible = ref<boolean>(false);

const targetIsMore = () => {
  isMore.value = !isMore.value;
};

const isMoreClose = () => {
  setTimeout(() => {
    isMore.value = false;
  }, 200);
};

const handleClick = (tab: any, event: Event) => {
  chatsValue.value = tab.props.label;
};

const personnelContent = (val: any) => {
  conversationChats.value.push(val);
  conversationChats.value = [...new Set(conversationChats.value)];
  activeName.value = "zero";
  chatsValue.value = "会话";
  showList.value.forEach((item) => {
    if (chatsValue.value === "会话") {
      item.chats = conversationChats.value;
    }
  });
};

// 右侧头像组件 key 值更新
const updateKey = ref(0);
const openChanged = async (child: any) => {
  await props.chatRef.setCurrent(child);
  updateKey.value++;
  emit("update:imgKey", updateKey.value);
  emit("openChanged", child);
};

/**
 * 初始化会话列表
 */
const chatStandardList = ref<any>([]);
const chatList = ref<any>([]);
const groupStandardList = ref<any>([]);
const groupList = ref<any>([]);

const setTime = ref(0);

watch(
  () => props.chatRef,
  (val) => {
    if (setTime.value < 3) {
      const chatInterval = setInterval(() => {
        console.log(val);

       forMatChats(val)

        setTime.value++;

        if (setTime.value === 3) {
          clearInterval(chatInterval);
        }
      }, 500);
    } else {
      forMatChats(val)
    }
  },
  { deep: true }
);

const forMatChats = (val: any) => {
  chatList.value = getChatList(val);
      chatStandardList.value = getChatList(val);
      groupStandardList.value = getGroupList(val);
      groupList.value = getGroupList(val);

      openIdArr.value = [];
      groupList.value.map((item: any) => {
        item.isOpened && openIdArr.value.push(item.spaceId);
      });
}

/**
 * input 输入筛选功能
 */
const filterBySearch = (val: any) => {
  chatList.value = chatStandardList.value.filter((item: any) =>
    item.target.name.includes(val)
  );

  const temGroupList = _.cloneDeep(groupStandardList);
  groupList.value = temGroupList.value.map((item: any) => {
    item.chats = item.chats.filter((chat: any) =>
      chat.target.name.includes(val)
    );
    return item;
  });
};

/**
 * 获取会话列表，置顶排序
 */
const getChatList = (val: any) => {
  let topChatList = val.chats
    ? val.chats.filter((item: any) => item.isToping)
    : [];

  let normalChatList = val.chats
    ? val.chats.filter((item: any) => !item.isToping)
    : [];
  let tempChats = [...topChatList, ...normalChatList];

  tempChats = handlePhotoLink(tempChats);

  return tempChats;
};

/**
 * 获取通讯录
 */
const getGroupList = (val: any) => {
  const tempGroups = _.cloneDeep(val.groups);
  tempGroups.forEach((item: any) => {
    item.chats = handlePhotoLink(item.chats);
  });

  return tempGroups;
};

/**
 * 处理头像 url
 */
const handlePhotoLink = (arr: any) => {
  return arr.map((item: any) => {
    if (item && item.target.photo && isJsonString(item.target.photo)) {
      item.target.link = JSON.parse(item.target.photo).thumbnail;
    }
    return item;
  });
};

/**
 * 判断是否为 json
 */
const isJsonString = (str: string) => {
  try {
    if (typeof JSON.parse(str) == "object") {
      return true;
    }
  } catch (e) {}

  return false;
};

//根据搜索条件-输出展示列表
const showList = ref([]);

// 时间处理
const handleFormatDate = (timeStr: string) => {
  const nowTime = new Date().getTime();
  const showTime = new Date(timeStr).getTime();

  // 超过一天 展示 月/日
  if (nowTime - showTime > 3600 * 24 * 1000) {
    return formatDate(timeStr, "M月d日");
  }
  // 不超过一天 展示 时/分
  return formatDate(timeStr, "H:mm");
};

type MenuItemType = { value: number; label: string };
const menuList: MenuItemType[] = [
  { value: 1, label: "置顶会话" },
  { value: 2, label: "清空信息" },
  { value: 3, label: "取消置顶" },
  // { value: 4, label: '消息免打扰' },
];
type arrList = {
  id: string;
};

const addFriends = (arr: Array<arrList>) => {
  friendServices.applyJoin(arr);
  dialogVisible.value = false;
};
const checksSearch = (val: any) => {
  if (val.value.length > 0) {
    let arr: Array<arrList> = [];
    val.value.forEach((element: any) => {
      arr.push(element.id);
    });
    addFriends(arr);
  } else {
    dialogVisible.value = false;
  }
};
// 鼠标右键事件
const mousePosition: {
  left: number;
  top: number;
  isShowContext: boolean;
  selectedItem: ImMsgChildType;
  selectMenu?: MenuItemType[];
} = reactive({
  left: 0,
  top: 0,
  isShowContext: false,
  selectedItem: {} as ImMsgChildType,
});
const handleContextClick = (e: MouseEvent, item: any) => {
  if (!item) {
    return;
  }
  mousePosition.left = e.pageX - 60;
  mousePosition.top = e.pageY - 48;
  mousePosition.isShowContext = true;
  mousePosition.selectedItem = item;
  mousePosition.selectMenu = item.isToping
    ? menuList.slice(1, 3)
    : menuList.slice(0, 2);
};
// 关闭右侧点击出现的弹框
const closecontextmenu = () => {
  mousePosition.isShowContext = false;
};
// 页面加载完毕，点击其他位置则隐藏菜单
onMounted(() => {
  window.addEventListener("click", closecontextmenu);
  window.addEventListener("contextmenu", closecontextmenu);
});

// 页面卸载前给他删了
onBeforeUnmount(() => {
  window.removeEventListener("click", closecontextmenu);
  window.removeEventListener("contextmenu", closecontextmenu);
});

const openIdArr = ref<string[]>([]);
const handleOpenSpace = (selectedID: string) => {
  const isOpen = openIdArr.value.includes(selectedID);
  if (isOpen) {
    openIdArr.value = openIdArr.value.filter(
      (item: string) => item !== selectedID
    );
  } else {
    openIdArr.value = [...openIdArr.value, selectedID];
  }
};
// 右键菜单点击
const handleContextChange = (item: MenuItemType) => {
  // console.log('右键菜单点击', item, mousePosition.selectedItem)
  switch (item.value) {
    case 1:
      {
        props.chatRef.setToping(mousePosition.selectedItem as any);
        chatList.value = getChatList(props.chatRef);
        chatStandardList.value = getChatList(props.chatRef);
      }
      break;
    case 2:
      // props.clearHistoryMsg()
      break;
    case 3:
      {
        props.chatRef.setToping(mousePosition.selectedItem as any);
        chatList.value = getChatList(props.chatRef);
        chatStandardList.value = getChatList(props.chatRef);
      }
      break;

    default:
      break;
  }
};
</script>

<style lang="scss">
.chart-side-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid var(--el-border-color); // #d8d8d8;
  background-color: var(--el-bg-color);

  .more {
    width: 150px;
    margin-top: 45px;
    margin-left: 150px;
  }
}

.group-side-bar-search {
  display: flex;
  align-items: center;
  padding: 10px;

  .refresh {
    .el-icon {
      font-size: 20px;
    }

    color: var(--el-color-primary);
  }
}

.group-side-bar-wrap {
  width: 100%;
  height: calc(100vh - 112px);
  padding: 0 10px 10px;
  overflow-y: auto;

  // position: relative;
  &:hover ::-webkit-scrollbar {
    overflow: visible;
    width: 6px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    min-height: 10px;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-corner {
    background: transparent;
  }

  &::-webkit-scrollbar-track-piece {
    // margin: 10px 0;
    border-radius: 4px;
  }

  &::-webkit-scrollbar {
    background: #fff;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d8d8d8;
  }

  &::-webkit-scrollbar-thumb:vertical:hover {
    background-color: #e1e1e1;
  }

  &::-webkit-scrollbar-thumb:vertical:active {
    background-color: var(--el-primary-color-light-5);
  }

  .group-con {
    // // 头像
    // &-img {
    //   width: 35px;
    //   height: 35px;
    //   margin-right: 10px;
    // }

    &-item {
      cursor: pointer;

      .con-title {
        font-size: 16px;
        font-weight: bold;
        padding: 10px 0;
        color: var(--el-text-color);

        &.active {
          color: var(--el-color-primary);
          border-bottom: none;
        }
      }

      .con-body {
        position: relative;
        display: flex;
        justify-content: space-between;
        padding: 5px;

        // background-color: var(--el-menu-bg-color);
        &:hover,
        &.active {
          // border-radius: 6px;
          color: var(--el-menu-active-color);
          background-color: var(--el-menu-hover-bg-color);
        }

        border-bottom: 1px solid var(--el-border-color);
      }

      .con-body + .con-body {
        // margin-top: 10px;
      }

      .top-session {
        background-color: var(--el-fill-color);
      }
    }

    .group-con-show {
      width: 100%;

      &-name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;

        &-label {
          font-size: 14px;
          font-weight: bold;
          max-width: 140px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        &-time {
          color: #a8a8a8;
          font-size: 12px;
        }
      }

      &-msg {
        max-width: 180px;
        text-overflow: ellipsis;
        max-height: 24px;
        overflow: hidden;
        white-space: nowrap;
        font-size: 10px;
        padding-top: 5px;
        color: #787878;
      }
    }

    &-dot {
      position: absolute;
      left: 35px;
      top: -5px;
      min-width: 18px;
      width: max-content;
      height: 20px;
      background-color: #fa2222;
      border-radius: 50%;
      font-size: 10px;
      color: #ffffff;
      padding: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: scale(80%);
    }
  }
}

.context-text-wrap {
  position: absolute;
  background-color: var(--el-bg-color);
  width: 130px;
  height: max-content;
  padding: 10px;
  border: 1px solid var(--el-border-color);
  box-shadow: var(--el-box-shadow);
  z-index: 999;

  .context-menu-item {
    padding: 5px;
    cursor: pointer;
    line-height: 30px;
    border-bottom: 1px solid var(--el-border-color);

    &:hover {
      background-color: #e3e3e3;
    }
  }
}
</style>
