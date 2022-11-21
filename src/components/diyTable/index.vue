<template>
  <div class="diy-table">
    <div class="diy-table__header" v-if="hasTableHead">
      <div class="diy-table__header--left" style="width: 100%">
        <div class="header-title" v-if="hasTitle">
          {{ tableName }}
        </div>
        <div class="header-tabs"  v-if="hasTabs">
          <slot name="slot-tabs"></slot>
        </div>
      </div>
      <div class="diy-table__header--right">
        <div class="header-buttons">
          <slot name="buttons"></slot>
        </div>
      </div>
    </div>
    <slot name="slot-title"></slot>
    <div class="diy-table__btn">
      <div>
        <slot name="slot-select"></slot>
      </div>
      <div>
        <slot name="slot-buttons"></slot>
      </div>
    </div>
    <div class="diy-table__body" ref='bodyBox' >
      <div class="diy-table__body-box">
        <el-table
          v-if="showType == 1"
          ref="diyTable"
          :style="{ width: '100%', height: '100%' }"
          class="table-row-sty"
          tooltip-effect="dark"
          :header-cell-style="getRowClass"
          :row-style="{ height: '44px' }"
          :cell-style="cellStyle"
          :data="[...tableData,...tableData]"
          row-key="id"
          lazy
          :load="loadNode"
          v-bind="options"
          v-loading="loading"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          stripe
          :default-expand-all="options.expandAll ? options.expandAll : false"
          @select="select"
          @select-all="selectAll"
          @selection-change="handleSelectionChange"
          @cell-mouse-enter="handleMouseEnter"
          @sort-change="handleSortChange"
          @row-click="handleRowClick"
        >
          <el-table-column
            v-if="options.checkBox"
            type="selection"
            highlight-current-row
            :selectable="checkSelectable"
            width="50"
          >
          </el-table-column>
          <el-table-column
            v-if="options.order"
            type="index"
            label="序号"
            width="70"
          ></el-table-column>
          <template v-for="(item, index) in tableHead" :key="'column' + index">
            
            <el-table-column v-if="item.type === 'slot'" v-bind="item" :sortable="item.sortable">
              <template #default="scope">
                <div v-if="scope.row.saleStatus === 3 && item.name == 'operate'"></div>
                <slot v-else :name="item.name" :row="scope.row" :index="scope.$index"></slot>
              </template>
              <template slot="header" #header="scope">
                {{ scope.column.label }}
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type === 'expand'" type="expand">
              <template #default="scope">
                <slot :name="item.name" :row="scope.row" :index="scope.$index"></slot>
              </template>
            </el-table-column>
            <el-table-column v-else v-bind="item"></el-table-column>
          </template>
        </el-table>
        <div class="card-wrap" :style="{'max-height':bodyHeight+'px'}">
          <slot v-if="showType == 2" name="slot-card"></slot>
        </div>
      </div>
    </div>
    <div class="diy-table-footer">
      <div class="footer-left">
          <i :class="showType ==1?'switch-active':''"  class="type-list iconfonts icons-table-icon2" @click="checkSwitchType(1)"></i>
          <i :class="showType ==2?'switch-active':''"  class="type-card iconfonts icons-suolvetuqiehuan"  @click="checkSwitchType(2)"></i>
      </div>
      <div class="footer-pagination" v-if="!options.noPage">
        <div class="pagination">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            v-bind="page"
            :pager-count="5"
            style="text-align: right"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { stubFalse } from 'lodash'
  import { ref, reactive, toRefs, computed, onMounted, watch,nextTick } from 'vue'
  import titleBox, { BtnItem, TabType } from "@/components/titleBox/index.vue";
  import { useUserStore } from '@/store/user'
  import { TabPaneName } from 'element-plus';

  const store = useUserStore()
  const bodyBox = ref(null);
  const bodyHeight = ref<number>(100);
  const showType = ref<number>(1) //显示类型 1 表格 2 卡片
  interface User {
    id: number
    date: string
    name: string
    hasChildren?: boolean
    children?: User[]
  }
  type Props = {
    tableName?: string  //表格名称
    titleBtns?: BtnItem[], // 按钮列表
    tabOption?: TabType[], // tab列表
    activeName?: string | number, // tab列表
    // hasTableHead?: boolean //是否显示表格头
    // hasTitle?: boolean //是否显示标题
    // hasTabs?: boolean //是否显示table切换
    tableHead: any[] //表格头数据
    tableData?: any[] //表格数据
    checkList?: any[] //选中的项
    pageSizes?: any[] //每个页数
    total?: number //总数
    loading?: boolean //是否在加载状态
    options?: {
      expandAll?: boolean //是否全部展开
      checkBox?: any //选中的
      order?: any //是否显示序号
      noPage?: boolean  //是否显示页码
      selectLimit?: number //限制选择个数，默认20
    }
    batchOperate?: any[] 
    queryParams?: any[]
    cell?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    tableName: '',
    titleBtns: () => [],
    tabOption: () => [],
    activeName: '',
    // hasTableHead: false,
    // hasTitle: true,
    // hasTabs: false,
    total: 0,
    loading: false,
    pageSizes: () => [20, 30, 50],
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
    batchOperate: () => [],
    queryParams: () => [],
    cell: false
  })

  const {
    tableName,
    // hasTableHead,
    // hasTitle,
    // hasTabs,
    tableHead,
    tableData,
    options,
    batchOperate
    // queryParams,
    // cell
  } = toRefs(props)

  const handleCurrent: any = computed(() => {
    return (state.page.currentPage - 1) * state.page.pageSize
  })

  const state = reactive({
    loading: false,
    multipleSelection: [], //多选
    //分页信息
    page: {
      total: 0, // 总条数
      currentPage: 1, // 当前页
      current: handleCurrent, // 返回给接口的当前页数
      pageSize: 20, // 每页条数
      pageSizes: [20, 30, 50], // 分页数量列表
      layout: 'total, prev, pager, next, sizes'
    },
    isAllSelect: false
  })

  defineExpose({
    state
  })

  const { loading, multipleSelection, page, isAllSelect } = toRefs(state)

  const diyTable = ref(null)

  const emit = defineEmits([
    'changeTab',
    'handleLazyTree',
    'handleCommand',
    'hideDrop',
    'handleSortChange',
    'handleRowClick',
    'handleUpdate',
    'select',
    'selectionChange'
  ])

  watch(
    () => props.total,
    (val, old) => {
      state.page.total = val
    }
  )
  watch(
    () => props.pageSizes,
    (val, old) => {
      state.page.pageSizes = val
    }
  )

  const cellStyle = ({
    row,
    column,
    rowIndex,
    columnIndex
  }: {
    row: any
    column: any
    rowIndex: number
    columnIndex: number
  }) => {
    if (row.saleStatus === 3) {
      return {
        backgroundColor: 'var(--el-color-primary-light-9)', //  'rgb(245, 246, 252)',
        cursor: 'no-drop',
        color: 'gainsboro'
      }
    } else {
      return { padding: '0px' }
    }
  }

  const changeTab = (name: TabPaneName) => {
    emit('changeTab', name)
  }

  const loadNode = (row: User, treeNode: unknown, resolve: (date: User[]) => void) => {
    emit('handleLazyTree', row, (res: any) => {
      res.forEach((el: any) => {
        checkSelectable(el)
      })
      resolve(res)
    })
  }

  const checkSelectable = (row: any) => {
    if (props.checkList) {
      if (props.checkList.find((v) => v.id == row.id)) {
        console.log('row', row)
        return false
      }
    }
    if (props.options.selectLimit > 0) {
      if (props.options.selectLimit < multipleSelection.value.length) {
        var obj = multipleSelection.value[multipleSelection.value.length - 1]
        diyTable.value.clearSelection()
        diyTable.value!.toggleRowSelection(obj, undefined)
      }
      return true
    } else {
      if (row.children && !row.below) {
        if (row.children.length !== 0) {
          return false
        } else {
          return true
        }
      } else if (row.below == true) {
        return false
      } else if (row.saleStatus === 3) {
        return false
      } else {
        return true
      }
    }
  }

  const handleSelectionChange = (val: any) => {
    multipleSelection.value = val
    emit('selectionChange', multipleSelection.value)
  }

  const select = (selection: any, row: any) => {
    emit('select', selection, row)
  }
  const checkSwitchType = (type:number) =>{
    showType.value = type;
  }
  /**
   * el-pagination 分页配置
   */
  const handleSizeChange = (val: any) => {
    diyTable.value.clearSelection()
    isAllSelect.value = true
    selectAll(false, false)
    page.value.pageSize = val
    page.value.currentPage = 1
    emit('handleUpdate', { pageSize: page.value.pageSize, current: page.value.current })
  }
  const handleCurrentChange = (val: any) => {
    diyTable.value.clearSelection()
    isAllSelect.value = true
    selectAll(false, false)
    page.value.currentPage = val
    emit('handleUpdate', { pageSize: page.value.pageSize, current: page.value.current })
  }
  onMounted(() => {
    nextTick(()=>{
      bodyHeight.value = bodyBox.value.clientHeight
    })

  })
  /**
   * 鼠标进入表格是隐藏groupselect的drop
   */
  const handleMouseEnter = () => {
    emit('hideDrop')
  }

  const handleRowClick = (row: any) => {
    emit('handleRowClick', row)
  }

  /**
   * 表头排序
   */
  const handleSortChange = (e: any) => {
    emit('handleSortChange', e)
  }

  /**
   * handleCommand 批量操作
   */
  const handleCommand = (command: any) => {
    emit('handleCommand', command)
  }
  /**
   * 初始化页码
   */
  const initPage = () => {
    page.value.currentPage = 1
  }
  /**
   * el-table 表格配置
   */
  //配置表头背景
  const getRowClass = ({
    row,
    column,
    rowIndex,
    columnIndex
  }: {
    row: any
    column: any
    rowIndex: number
    columnIndex: number
  }) => {
    if (rowIndex === 0) {
      return {
        background: 'var(--el-color-primary-light-9)', // '#F5F6FC',
        color: 'var(--el-text-color-primary)', // '#333333',
        height: '36px',
        padding: '2px 0'
      }
    } else {
      return {}
    }
  }
  /**
   * 全选事件
   */
  const selectAll = (selection: any, first: any) => {
    if (!first) {
      isAllSelect.value = !isAllSelect
    }
    if (isAllSelect) {
      if (selection) {
        selection.map((el: any) => {
          if (el.children) {
            el.children.map((j: any) => {
              toggleSelection(j, isAllSelect)
            })
            if (el.children.length > 0) {
              selectAll(el.children, true)
            }
          }
        })
      }
    } else {
      diyTable.value.clearSelection()
    }
  }
  const toggleSelection = (rows: any, select: any) => {
    if (select) {
      diyTable.value.toggleRowSelection(rows, select)
    } else {
      diyTable.value.clearSelection()
    }
  }
</script>

<style lang="scss" scoped>
  .diy-table {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 18px;

    // &__header {
    //   display: flex;
    //   flex-direction: row;
    //   justify-content: space-between;
    //   align-items: flex-end;

    //   .header-title {
    //     font-size: 16px;
    //     font-weight: bold;
    //     color: rgba(48, 49, 51, 1);
    //     padding: 0 0 8px;
    //     i {
    //       font-size: 20px;
    //       color: rgba(21, 74, 216, 1);
    //     }
    //   }

    //   .header-tabs {
    //     width: 100%;
    //     display: flex;
    //     height: 35px;
    //     align-items: center;
    //     justify-content: space-between;
    //   }

    //   .header-buttons {
    //     display: flex;
    //   }
    // }

    &__btn {
      display: flex;
      justify-content: space-between;
    }

    &__body {
      width: 100%;
      height: 100px; //避免el-table无限变高
      display: flex;
      flex: 1;
      // margin-top: 10px;

      &-box {
        width: 1vw;
        flex: auto;
      }
    }
    .card-wrap{
      overflow-y: auto;
    }
    .diy-table-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 10px;
      .switch-active{
        background: #154ad8;
        color: #fff;
        border-radius: 15px;
      }
      .footer-pagination {
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
      .footer-left{
        .type-list,.type-card{
          font-size: 16px;
          color: #c0c4cc;
          padding: 3px 15px;
        }
      }
    }
  }
  .el-dropdown-menu {
    width: 110px;
  }
  .table-row-sty tr:hover,
  .table-row-sty tbody tr.el-table__row.not-read:hover {
    cursor: pointer;
    color: #2da1f8;
  }
  .tableClass {
    background-color: #edf2fc;
    cursor: no-drop;
  }
  // @media screen and (max-width: 1280px) {
  //   .diy-table__header {
  //     display: flex;
  //     display: none;
  //     flex-wrap: wrap;
  //   }
  // }
  :deep(.el-table__header-wrapper .el-checkbox) {
    display: none;
  }
</style>
