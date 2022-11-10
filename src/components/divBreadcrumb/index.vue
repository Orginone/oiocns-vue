<template>
  <div class="example-container">
    <div class="content">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="(item, index) in breadList"
          :key="index"
          :to="{ path: item.path }"
        >
          <el-dropdown @command="handleCommand" v-if="!!item.children.length" placement="bottom-start">
            <span style="cursor: pointer">
              <el-icon
                :size="12"
                v-if="item?.meta?.icon"
                color="#3e5ed8"
                class="breadcrumbIcon"
              >
                <component :is="item?.meta?.icon" /> </el-icon
              >{{ item?.meta?.title ?? "工作台" }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(childrenitem, childrenindex) in item?.children"
                  :command="childrenitem.path"
                  :key="childrenindex"
                  :disabled="currentRoute === childrenitem.path"
                  >{{ childrenitem.meta?.title }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span style="cursor: pointer" v-else>
            <el-icon
              :size="12"
              v-if="item?.meta?.icon"
              color="#3e5ed8"
              class="breadcrumbIcon"
            >
              <component :is="item?.meta?.icon" /> </el-icon
            >{{ item?.meta?.title ?? "工作台" }}
          </span>
        </el-breadcrumb-item>
      </el-breadcrumb>

      <el-row style="padding: 0 15px">
        <el-button type="text" @click="showSearchDrawer = true">
          <el-icon :size="18"><Search /></el-icon>
        </el-button>
        <el-button type="text" @click="showShareDrawer = true">
          <el-icon :size="18"><Promotion /></el-icon>
        </el-button>
        <el-button type="text">
          <el-icon :size="18"><ChatLineSquare /></el-icon>
        </el-button>
        <el-button type="text">
          <el-icon :size="18"><MoreFilled /></el-icon>
        </el-button>
      </el-row>
      <!-- 搜索抽屉 -->
      <el-drawer v-model="showSearchDrawer" direction="rtl" size="22%">
        <template #header>
          <h4 style="color: #505050">筛选</h4>
        </template>
        <template #default>
            <my-form 
              ref="myFormRef"
              :list="formList"
              @submitForm="searchPage"
            />
        </template>
        <template #footer>
          <div style="flex: auto">
            <el-button @click="handleReset">重置</el-button>
            <el-button color="#0f39d1" @click="handleFilter">筛选</el-button>
          </div>
        </template>
      </el-drawer>
      <!-- 分享抽屉 -->
      <el-drawer v-model="showShareDrawer" direction="rtl" size="22%">
        <template #header>
          <h4 style="color: #505050">分享</h4>
        </template>
        <template #default>
            <div>
              <el-row>
                <div style="margin-bottom: 10px;margin-top: -20px;">页面访问链接</div>
                <div class="sharecopy">
                  <div class="sharecopy-content">{{aaa}}</div>
                  <div class="sharecopy-btn" @click.stop="copyCode(aaa)">复制</div>
                </div>
                <div
                  v-for="(item, index) in shareList"
                  :key="index"
                  class="share-list-item"
                >
                  <img :src="item.src">
                  <div class="share-cell-content">
                    <div class="share-cell-title">{{ item.title }}</div>
                    <div class="share-cell-desc">{{ item.introduction }}</div>
                  </div>
                  <div class="share-cell-switch" v-if="item.status != undefined">
                    <el-switch v-model="item.status" style="--el-switch-on-color: #0f39d1"/>
                    <el-button v-show="item.status" small link type="primary">修改可见范围</el-button>
                  </div>
                </div>
              </el-row>
            </div>
        </template>
      </el-drawer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { ref, reactive, watch, computed } from "vue";
import { useRouter } from "vue-router";
import MyForm from './components/MyForm.vue'
import userIcon from '@/assets/img/userIcon.png'
import groupIcon from '@/assets/img/groupIcon.png'
import departmentIcon from '@/assets/img/departmentIcon.png'
import { ElMessage } from 'element-plus'

const aaa = ref('https://www.baidu.com')
// 打开分享抽屉
const showShareDrawer = ref(false)
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
  navigator.clipboard.writeText('woshidashuaige')
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

// 打开搜索抽屉
const showSearchDrawer = ref(false);
// 搜索表单信息
const formList = reactive([
  { label: '单据编号', propName: 'applyNumber', placeholder: '请输入' },
  { type: 'date-picker', label: '审核时间',  propName: 'startTime', pickerType: 'date', format: 'YYYY-MM-DD', valueFormat: 'YYYY-MM-DD', placeholder: '请选择日期' },
  { type: 'date-picker', label: '记账时间',  propName: 'startTime2',  pickerType: 'daterange', format: 'YYYY-MM-DD', valueFormat: 'YYYY-MM-DD' },
  { type: 'select', label: '处置方式', propName: 'status', placeholder: '请选择', options: [] },
  { type: 'select', label: '状态', propName: 'status', placeholder: '请选择', options: [] },
  { type: 'select', label: '接受状态', propName: 'status', placeholder: '请选择', options: [] },
  { type: 'select', label: '是否核销', propName: 'status', placeholder: '请选择', options: [] },
  ]
)
const myFormRef = ref()
// 重置搜索条件
const handleReset = () => {
  myFormRef.value.resetForm()
};
// 筛选条件
const handleFilter = () => {
  myFormRef.value.submitForm()
};
// 可以取到子组件传递过来的数据
const searchPage =  (ruleForm: any)=> {
  console.log(ruleForm, 'ruleForm');
}

const router = useRouter();
// 全部路由信息
const breadList = ref([]);

const handleCommand = (command: string) => {
  router.push({ path: command });
};

// 获取当前路由
const currentRoute = computed(() => router.currentRoute.value.fullPath);

watch(
  () => router.currentRoute.value,
  (newValue, oldValue) => {
    breadList.value = newValue?.matched;
  },
  { immediate: true }
);
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
.example-container {
  height: 56px;
  background: #f0f2f5;
  padding-bottom: 3px;
  box-sizing: border-box;

  .content {
    height: 100%;
    padding-left: 20px;
    background-color: var(--el-bg-color-overlay);
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .breadcrumbIcon {
      margin-right: 5px;
    }
  }
}
::v-deep .el-drawer > .el-drawer__header {
  background-color: #ffffff !important;
  height: 60px !important;
  border-bottom: 1px solid #f0f2f5;
}
::v-deep .el-drawer > .el-drawer__footer {
  border-top: 1px solid #f0f2f5;
}
::v-deep .el-drawer__body {
  overflow: hidden !important;
}
</style>
