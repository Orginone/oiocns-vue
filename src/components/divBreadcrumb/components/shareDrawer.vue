<template>
  <el-drawer :model-value="showShareDrawer" @close="emit('update:showShareDrawer', false)" direction="rtl" size="22%">
    <template #header>
      <h4 style="color: #505050">分享</h4>
    </template>
    <template #default>
      <div>
        <el-row>
          <div style="margin-bottom: 10px; margin-top: -20px">页面访问链接</div>
          <div class="sharecopy">
            <div class="sharecopy-content">{{ copyHttps }}</div>
            <div class="sharecopy-btn" @click.stop="copyCode(copyHttps)">复制</div>
          </div>
          <div
            v-for="(item, index) in shareList"
            :key="index"
            class="share-list-item"
          >
            <img :src="item.src" />
            <div class="share-cell-content">
              <div class="share-cell-title">{{ item.title }}</div>
              <div class="share-cell-desc">{{ item.introduction }}</div>
            </div>
            <div class="share-cell-switch" v-if="item.status != undefined">
              <el-switch
                v-model="item.status"
                style="--el-switch-on-color: #0f39d1"
              />
              <el-button v-show="item.status" small link type="primary"
                >修改可见范围</el-button
              >
            </div>
          </div>
        </el-row>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import userIcon from '@/assets/img/userIcon.png'
import groupIcon from '@/assets/img/groupIcon.png'
import departmentIcon from '@/assets/img/departmentIcon.png'
import { ElMessage } from 'element-plus'

const props = defineProps<{
    showShareDrawer: boolean; 
}>()

const emit = defineEmits<{
    (e: 'update:showShareDrawer', isShow: boolean): void
}>()

const copyHttps = ref('https://www.baidu.com')

const shareList = reactive([
  {
    title: '分享到个人',
    introduction: '发布并与个人分享链接',
    status: true,
    src: userIcon
  },
  {
    title: '分享到群组',
    introduction: '发布并与群组分享链接',
    status: false,
    src: groupIcon
  },
  {
    title: '分享到部门',
    introduction: '发布并与部门分享链接',
    status: undefined,
    src: departmentIcon
  }
])

// 复制链接
const copyCode = (needCopyText: string) => {
  let copyInput = document.createElement('input')
  copyInput.value = needCopyText
  document.body.appendChild(copyInput)
  copyInput.select()
  document.execCommand('Copy')
  ElMessage({
    message: '复制成功',
    type: 'success'
  })
  copyInput.remove()
}

</script>

<style lang="scss" scoped>
.sharecopy {
  width: 100%;
  height: 33px;
  margin-top: 10px;
  line-height: 33px;
  display: flex;
  box-sizing: border-box;
  .sharecopy-content{
    background-color: var(--el-disabled-bg-color);
    box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
    color: var(--el-disabled-text-color);
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    width: 82%;
    padding: 0 10px;
    font-size: 14px;
    overflow: hidden;
    text-overflow:ellipsis;
  }

  .sharecopy-btn{
    width: 18%;
    text-align: center;
    font-size: 14px;
    box-shadow: 0 1px 0 0 var(--el-input-border-color) inset, 0 -1px 0 0 var(--el-input-border-color) inset, -1px 0 0 0 var(--el-input-border-color) inset;
    background-color: var(--el-fill-color-light);
    color: var(--el-color-info);
    border: 1px solid #dcdfe6;
    border-left: 0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    cursor: pointer;
  }
  .sharecopy-btn:hover {
    background-color: #e7ecfb;
    color: #5e82e4;
  }
}
.share-list-item {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0px;
  border-bottom: 1px solid hsla(0, 0%, 60%, 0.15);
  .share-cell-content {
    flex: 1;
    margin-left: 10px;
    .share-cell-title {
      color: #424242;
      font-size: 15px;
      font-weight: bold;
    }
    .share-cell-desc {
      font-size: 13px;
      color: #d3d3d3;
    }
  }
  .share-cell-switch {
    width: 38%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
