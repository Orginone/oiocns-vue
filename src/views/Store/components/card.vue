<template>
  <div class="card-list">
    <div class="card-item" v-for="(item, index) in props.data" :key="index">
      <div class="item-head">
        <div class="item-img">{{item.name}}</div>
        <div class="item-head-content">
          <p>
            <span>{{item.name}}
               <!-- <el-tag class="ml-2" type="success">免费</el-tag> -->
            </span>
            <slot name="slot-menu" :row="item"></slot>
          </p>
          <!-- <p>73MB</p> -->
        </div>
      </div>
      <div class="item-content">
        {{item.}}
      </div>
      <div class="tag">
        <el-tag class="tag-item" type="info">类型</el-tag>
      </div>
      <div class="time">创建于 {{item?.['name']}}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Obj } from "@popperjs/core";
import { onMounted } from "vue";
const props = defineProps({
  data:{}
})
onMounted(() => {

});

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
          color: #0C4EFF;
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






<div class="card-list">
  <div
    class="card-item"
    v-for="(item, index) in state.ownProductList"
    :key="index"
  >
    <div class="item-head">
      <div class="item-img">{{ item.name.substring(0,1) }}</div>
      <div class="item-head-content">
        <p>
          <span
            >{{ item.name }}
            <!-- <el-tag class="ml-2" type="success">免费</el-tag> -->
          </span>
            <el-dropdown>
              <span class="el-dropdown-link drop-list"> ··· </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="
                      scope.row?.['authority'] == '所属权' &&
                      scope.row?.['belongId'] ==
                        store.workspaceData.id
                    "
                    link
                    type="primary"
                    @click="
                      handleCommand('own', 'putaway', scope.row)
                    "
                    >上架</el-dropdown-item
                  >
                  <el-dropdown-item
                    link
                    type="primary"
                    v-if="
                      scope.row?.['belongId'] ==
                      store.workspaceData.id
                    "
                    @click="handleCommand('own', 'share', scope.row)"
                  >
                    共享</el-dropdown-item
                  >
                  <el-dropdown-item
                    link
                    type="primary"
                    v-if="authority.IsCompanySpace()"
                    @click="
                      handleCommand('own', 'distribution', scope.row)
                    "
                    >分配
                  </el-dropdown-item>
                  <el-dropdown-item
                    link
                    type="primary"
                    @click="goDetail(scope.row?.['id'])"
                  >
                    查看详情
                  </el-dropdown-item>
                  <el-dropdown-item
                    link
                    type="primary"
                    @click="deleteApp(scope.row)"
                    >移除应用</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="
                      scope.row?.['resourcesList'] &&
                      scope.row?.['resourcesList']?.length > 0
                    "
                  >
                    <el-dropdown trigger="hover" placement="top-end">
                      流程业务
                      <template #dropdown>
                        <el-dropdown-menu
                          style="padding-left: 10px; min-width: 100px"
                        >
                          <el-dropdown-item
                            v-for="resource in scope.row
                              .resourcesList"
                            :key="resource.formId"
                            @click="enterProcess(resource)"
                            >{{ resource.business }}</el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
        </p>
        <!-- <p>73MB</p> -->
      </div>
    </div>
    <div class="item-content">
      {{item.name}}
    </div>
    <div class="tag">
      <el-tag class="tag-item" type="info">类型</el-tag>
    </div>
    <div class="time">创建于 {{ item.name }}</div>
  </div>
</div>