<template>
    <div class="footer-pagination">
        <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-bind="page"
        :pager-count="5"
        style="text-align: right; margin-top: 10px"
        ></el-pagination>
    </div>
</template>
  
  <script setup lang="ts">
    import { ref, reactive, toRefs, computed, onMounted } from 'vue'
    type Props = {
      tableName: string
      hasTableHead: boolean
      hasTitle: boolean
      hasTabs: boolean
      tableHead: any[]
      tableData: any[]
      checkList?: any[]
    }
    const props = withDefaults(defineProps<Props>(), {
      tableName: '',
      hasTableHead: false,
      hasTitle: true,
      hasTabs: false,
      tableHead: () => [],
      tableData: () => [],
      options: () => {
        return {
          expandAll: false,
          checkBox: false,
          order: true,
          noPage: false,
          selectLimit: 0
        }
      },
    })
  
    const handleCurrent: any = computed(() => {
      return (state.page.currentPage - 1) * state.page.pageSize
    })
  
    const state = reactive({
      //分页信息
      page: {
        total: 0, // 总条数
        currentPage: 1, // 当前页
        current: handleCurrent, // 返回给接口的当前页数
        pageSize: 20, // 每页条数
        pageSizes: [20, 30, 50], // 分页数量列表
        layout: 'total, prev, pager, next, sizes'
      },
    })
  
    defineExpose({
      state
    })
  
    const { page } = toRefs(state)
    
    const emit = defineEmits([
      'handleUpdate',
    ])

    /**
     * el-pagination 分页配置
     */
    const handleSizeChange = (val: any) => {
      page.value.pageSize = val
      page.value.currentPage = 1
      emit('handleUpdate', page.value)
    }
    const handleCurrentChange = (val: any) => {
      page.value.currentPage = val
      emit('handleUpdate', page.value)
    }
    /*
     * 初始化页码
     */
    const initPage = () => {
      page.value.currentPage = 1
    }
    onMounted(()=>{
        initPage()
    })
  </script>
  
  <style lang="scss" scoped>
    .footer-pagination{
        float: right;
        overflow: hidden;
        display: flex;
        flex-direction: column-reverse;
        & :deep(.btn-prev) {
          border-radius: 16px;
        }
        & :deep(.el-pager > .number) {
          border-radius: 4px;
        }
        & :deep(.btn-next) {
          border-radius: 16px;
        }
        & :deep(.el-pagination__sizes .el-input__inner) {
          border-radius: 16px;
          // background: rgba(231, 239, 252, 1);
          border-color: transparent;
        }
    }
  </style>
  