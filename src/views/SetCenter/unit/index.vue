<template>
    <div class="main">
      <div class="container mainBox">
        <div class="content">
          <div class="info">
            <Info ref="info" />
          </div>
        </div>
      </div>
    </div>
  </template>
  <script lang="ts" setup>
    import Info from './components/info.vue'
    import $services from '@/services'
    import { ref, onMounted } from 'vue'
    import { useUserStore } from '@/store/user'
    import { storeToRefs } from 'pinia'
    import { ElMessage } from 'element-plus'

    const store = useUserStore()
    const { workspaceData } = storeToRefs(store)
  
    const info = ref(null)
    // 加载单位
    const loadOrgTree = () => {
      $services.company.getCompanyTree({}).then((res: any) => {
        nodeClick(res.data)
      })
    }
    // 给相应组件传值
    const nodeClick = (selectItem: any) => {
      info.value.selectItemChange(selectItem)
    }
    //获取部门信息
    onMounted(() => {
      if(store?.workspaceData?.name != '个人空间') {
        loadOrgTree()
      } else {
        ElMessage({
          message: '当前处于个人空间',
          type: 'warning'
        })
      }
    })


  </script>
  <style lang="scss" scoped>
    /*拖拽区鼠标悬停样式*/
    :deep(.el-select) {
      width: 100%;
    }
    .main {
      width: 100%;
      height: 100%;
    }
    .container {
      width: 100%;
      height: 100%;
      background: #f0f2f5;
      padding: 3px 0;
      box-sizing: border-box;
  
      .content {
        height: 100%;
        background-color: var(--el-bg-color-overlay);
        box-sizing: border-box;
        overflow: hidden;
        .info {
          padding: 0 0 3px 0;
          box-sizing: border-box;
        }
      }
    }
  </style>
  