<template>
  <div class="userBox">
    <titleBox title="当前用户" :btns="btns" />
    <div class="userInfoBox">
      <img src="/src/assets/img/头像.png" alt="" class="avatar" />
      <div class="showDetail">
        <div v-for="row in showDetail" class="showDetailRow">
          <p
            v-for="item in row"
            class="detailItem"
            :style="{ width: item.width ? item.width : '300px' }"
          >
            <b class="userLabel">{{ item.label }}：</b>
            <span class="userShowValue">{{
              getDescendantProp(queryInfo, item.field) || "-"
            }}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 更多信息 -->
    <div class="expan">
      <span @click="isExpan = !isExpan">
        <b>{{ isExpan ? "收起" : "更多信息" }}</b>
        <el-icon :class="{ isExpan }">
          <ArrowDownBold />
        </el-icon>
      </span>
    </div>
    <div class="userInfoBox" v-show="isExpan">
      <div class="showDetail">
        <div v-for="row in expanDetail" class="showDetailRow">
          <p
            v-for="item in row"
            class="detailItem"
            :style="{ width: item.width ? item.width : '300px' }"
          >
            <b class="userLabel">{{ item.label }}：</b>
            <span class="userShowValue">{{
              getDescendantProp(queryInfo, item.field) || "-"
            }}</span>
          </p>
        </div>
      </div>
    </div>

    <ChangePasswordDialog v-model="passwordVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, reactive } from "vue";
import { useUserStore } from "@/store/user";
import { getDescendantProp } from "@/utils/tools";
import { storeToRefs } from "pinia";
import { ShowDetailRow } from "../type";
import titleBox, { BtnItem } from "@/components/titleBox/index.vue";
import ChangePasswordDialog from "./ChangePasswordDialog.vue";
import { ElMessage } from "element-plus";
const store = useUserStore();
const { queryInfo } = storeToRefs(store);

// #region 展示信息
const btns = reactive<BtnItem[]>([
  { name: "修改密码", event: changePass },
  // { name: "重置密码", event: resetPass },
]);
const isExpan = ref<boolean>(false);
// 显示配置
const showDetail = reactive<ShowDetailRow[][]>([
  [{ label: "姓名", field: "team.name" }],
  // [
  //   { label: "性别", field: "name" },
  //   { label: "邮箱", field: "name" },
  //   { label: "联系方式", field: "name" },
  // ],
  // [{ label: "地址", field: "name", width: "100%" }],
]);
const expanDetail = reactive<ShowDetailRow[][]>([
  // [
  //   { label: "职位", field: "team.name" },
  //   { label: "级别", field: "team.name" },
  // ],
  // [
  //   { label: "其他信息", field: "name" },
  //   { label: "其他信息", field: "name" },
  // ],
  // [
  //   { label: "其他信息", field: "name" },
  //   { label: "其他信息", field: "name" },
  // ],
]);

// #endregion


const passwordVisible = ref(false);
function changePass() {
  passwordVisible.value = true;
}
function resetPass() {
  ElMessage.warning("不支持该功能");
}

onMounted(() => {  
  store.getQueryInfo(store.userToken);
});
</script>

<style lang="scss" scoped>
.userBox {
  background: #fff;
  border-radius: 5px;
  padding: 20px;

  :deep(.titleBox) {
    flex-direction: unset;
  }
  .userInfoBox {
    padding: 0 37px;
    color: #606266;
    .avatar {
      width: 78px;
      height: 78px;
      border-radius: 50%;
      margin-bottom: 20px;
      margin-top: 14px;
    }
    .showDetail {
      margin-left: 10px;
      font-size: 14px;
      max-width: 1100px;
      .showDetailRow {
        line-height: 20px;
        display: flex;
        padding: 10px 0;
        .detailItem {
          display: flex;
          flex: 1;
        }
      }
    }
  }
  .expan {
    font-size: 14px;
    color: #154ad8;
    text-align: right;
    padding-right: 20px;
    span {
      cursor: pointer;
      user-select: none;
    }
    .el-icon {
      vertical-align: revert;
      font-size: 10px;
      margin-left: 8px;
      transition: transform 0.3s;
      &.isExpan {
        transform: rotateX(180deg);
      }
    }
  }
}
</style>
