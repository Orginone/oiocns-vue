<template>
  <div class="zhanwei">
    <div class="zhanweicebian">侧边导航占位</div>
    <div class="zhanweiright">
      <div class="zhanweibr">面包屑占位</div>
      <div class="mine">
        <!-- title组件 (可能有全局组件) -->
        <div class="titleBox">
          <p class="title">当前用户</p>
          <div class="btns">
            <span class="titlebtn" @click="changePass">修改密码</span>
            <span class="titlebtn" @click="resetPass">重置密码</span>
          </div>
        </div>
        <div class="userInfoBox">
          <img src="/src/assets/img/头像.png" alt="" class="avatar">
          <div v-for="row in showDetail" class="showDetail">
            <div v-for="item in row" class="showDetailRow">
              <b class="userLabel">{{ item.label }}:</b>
              <span class="userShowValue">{{ queryInfo[item.field] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, reactive } from "vue";
import Bucket from "@/module/cloud/bucket";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
const store = useUserStore();
const { queryInfo } = storeToRefs(store);
const showDetail = reactive([
  [{ label: '姓名', field: 'name' }],
  [{ label: '姓名', field: 'name' }, { label: '姓名', field: 'name' }, { label: '姓名', field: 'name' }],
  [{ label: '地址', field: 'name' }],

])

const changePass = () => {
  console.log("changePass");
};
const resetPass = () => {
  console.log("resetPass");
};

onMounted(() => {
  store.getQueryInfo(store.userToken)
  console.log(queryInfo);
})



</script>
<style lang="scss" scoped>
.mine {
  background: #fff;
  border-radius: 5px;
  padding: 20px;

  .titleBox {
    display: flex;
    justify-content: space-between;

    .title {
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      color: #303133;
    }

    .titlebtn {
      font-size: 14px;
      line-height: 18px;
      color: #154ad8;
      cursor: pointer;
      user-select: none;
      margin: 0 16px;
    }
  }

  .userInfoBox {
    padding: 0 37px;
    margin-top: 28px;

    .avatar {
      width: 78px;
      height: 78px;
      border-radius: 50%;
      margin-bottom: 20px;
    }

    .showDetail {
      margin-left: 10px;
      font-size: 14px;
      width: 700px;
      line-height: 20px;
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      .showDetailRow {

      }
    }
  }
}

// 占位
.zhanwei {
  height: 100%;
  // background-color: #fff;
  display: flex;

  .zhanweicebian {
    width: 220px;
    height: 100%;
    background: #fff;
  }

  .zhanweiright {
    padding: 5px 8px;
    flex: 1;

    .zhanweibr {
      height: 63px;
      margin-bottom: 5px;
      background: #fff;
    }
  }
}
</style>
