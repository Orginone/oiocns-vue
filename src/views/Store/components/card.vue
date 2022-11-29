<template>
  <div class="card-list">
    <div class="card-item" v-for="(item, index) in props.data" :key="index">
      <div class="item-head">
        <div class="item-img">人</div>
        <div class="item-head-content">
          <p>
            <span>{{item?.caption}}
               <!-- <el-tag class="ml-2" type="success">免费</el-tag> -->
            </span>
            <el-dropdown>
              <span class="el-dropdown-link drop-list"> ··· </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="requireItem">查看详情</el-dropdown-item>
                  <el-dropdown-item @click="joinShopCar(scope.row.id)">加入购物车</el-dropdown-item>
                  <el-dropdown-item @click="buyThings(scope.row)">购买</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </p>
          <p>73MB</p>
        </div>
      </div>
      <div class="item-content">
        用于维护精益项目提报信息和申请管理，本数据仅限于企业内部进行项目管理时使用根据...
      </div>
      <div class="tag">
        <el-tag class="tag-item" type="info">类型</el-tag>
      </div>
      <div class="time">创建于 2022-11-02 15:06</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";

// 表格展示数据
const pageStore = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0,
});
const props = defineProps({
  data: {
    type:Array
  },
})

interface ListItem {
  code: string;
  name: string;
  trueName: string;
  teamCode: string;
  remark: string;
}

onMounted(() => {
  remoteMethod();
});
const remoteMethod = () => {};
const requireItem = () => {}

</script>
<style lang="scss">
.drop-link {
  cursor: pointer;
  padding: 2px 10px;
  border-radius: 10px;
}
.drop-link:hover {
  background: var(--el-bg-color-overlay);
}
</style>
<style lang="scss" scoped>
.card-list {
    padding: 10px 0;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    .card-item {
      width: 279px;
      box-sizing: border-box;
      padding: 14px;
      border-radius: 5px;
      margin-right: 12px;
      margin-bottom: 12px;
      border: 1px solid #e9e9e9;
      .item-head {
        display: flex;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
        align-items: center;
        .item-img {
          background: #d4f0fc;
          text-align: center;
          width: 40px;
          height: 40px;
          line-height: 40px;
          border-radius: 50%;
          margin-right: 15px;
          font-size: 14px;
          color: #55b0eb;
        }
      }
      .item-head-content {
        display: flex;
        flex: 1;
        flex-direction: column;
        p:nth-child(1) {
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            margin-right: 5px;
          }
          .drop-list {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
        p:nth-child(2) {
          color: #9c9c9c;
          font-size: 14px;
        }
      }
      .item-content {
        font-size: 12px;
        margin: 12px 0;
        color: #7f7f7f;
      }
      .tag {
        margin: 12px 0;
      }
      .time {
        font-size: 12px;
        color: #7f7f7f;
      }
    }
}
</style>
