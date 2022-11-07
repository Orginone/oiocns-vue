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
          <div class="showDetail">
            <div v-for="row in showDetail" class="showDetailRow">
              <p v-for="item in row" class="detailItem" :style="{ width: item.width ? item.width : '300px' }">
                <b class="userLabel">{{ item.label }}：</b>
                <span class="userShowValue">{{ getDescendantProp(queryInfo, item.field) || '-' }}</span>
              </p>
            </div>
          </div>
        </div>
        <!-- 更多信息 -->
        <div class="expan">
          <span @click="isExpan = !isExpan">
            <b>{{ isExpan ? '收起' : '更多信息' }}</b>
            <el-icon :class="{ isExpan }">
              <ArrowDownBold />
            </el-icon>
          </span>
        </div>
        <div class="userInfoBox" v-show="isExpan">
          <div class="showDetail">
            <div v-for="row in expanDetail" class="showDetailRow">
              <p v-for="item in row" class="detailItem" :style="{ width: item.width ? item.width : '300px' }">
                <b class="userLabel">{{ item.label }}：</b>
                <span class="userShowValue">{{ getDescendantProp(queryInfo, item.field) || '-' }}</span>
              </p>
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
import { getDescendantProp } from "@/utils/tools";
import { ShowDetailRow } from './type'

const store = useUserStore();
const { queryInfo } = storeToRefs(store);
// 是否展开更多信息
const isExpan = ref(false)
// 显示配置
const showDetail = reactive<ShowDetailRow[][]>([
  [{ label: '姓名', field: 'team.name' }],
  [{ label: '性别', field: 'name' }, { label: '邮箱', field: 'name' }, { label: '联系方式', field: 'name' }],
  [{ label: '地址', field: 'name', width: '100%' }],
])
const expanDetail = reactive<ShowDetailRow[][]>([
  [{ label: '职位', field: 'team.name' }, { label: '级别', field: 'team.name' }],
  [{ label: '其他信息', field: 'name' }, { label: '其他信息', field: 'name' }],
  [{ label: '其他信息', field: 'name' }, { label: '其他信息', field: 'name' }],
])

const changePass = () => {
  console.log("changePass");
};
const resetPass = () => {
  console.log("resetPass");
};

onMounted(() => {
  store.getQueryInfo(store.userToken)
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
    color: #606266;

    .avatar {
      width: 78px;
      height: 78px;
      border-radius: 50%;
      margin-bottom: 20px;
      margin-top: 28px;
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

    span {
      cursor: pointer;
      user-select: none;
    }

    .el-icon {
      vertical-align: revert;
      font-size: 10px;
      margin-left: 8px;
      transition: transform .3s;

      &.isExpan {
        transform: rotateX(180deg);
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
