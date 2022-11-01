<template>
  <div style="width: 100%; height: 100px">
    <DiyTable
      ref="diyTable"
      :tableName="tableName"
      :tableData="state.tableData"
      :tableHead="state.tableHead"
    >
      <template #unit="scope">
        <div>{{ scope.row.groupName }}</div>
      </template>
      <template #groupCode="scope">
        <div>{{ scope.row.groupName }}</div>
      </template>
    </DiyTable>
  </div>
  <div style="width: 100%; height: 200px;background-color: pink;">
    <QrCodeCustom />
  </div>

</template>

<script setup lang="ts">
  import DiyTable from '@/components/diyTable/index.vue'
  import { nextTick, onMounted, reactive, ref } from 'vue'
  import QrCodeCustom from '@/components/qrCode/index.vue'
  const diyTable = ref(null)
  const tableName = ref('集团列表')
  const state = reactive({
    tableData: [
      {
        createTime: '2021-02-05 13:15:32',
        createUser: -1,
        depth: 6,
        groupCode: 'CJGLJT',
        groupDescription: '超管集团',
        groupName: '超级管理集团',
        id: '1357558453686837250',
        isCreate: 1,
        isDeleted: 0,
        linkMan: '',
        linkPhone: '',
        socialCreditCode: '',
        status: -1,
        tenantCode: '000000',
        type: 1,
        unitName: '',
        updateTime: '',
        updateUser: -1
      }
    ],
    tableHead: [
      {
        prop: 'groupCode',
        label: '集团编码',
        width: '180',
        name: 'groupCode'
      },
      {
        prop: 'groupName',
        label: '集团名称',
        width: '240'
      },
      {
        prop: 'groupDescription',
        label: '集团简介',
        width: '330'
      },
      {
        prop: 'unitName',
        label: '管理单位',
        width: '240',
        type: 'slot',
        name: 'unit'
      },
      {
        prop: 'createTime',
        label: '加入时间',
        minWidth: '180'
      },
      {
        type: 'slot',
        label: '操作',
        fixed: 'right',
        align: 'center',
        width: '80',
        name: 'operate'
      }
    ],
    options: {
      checkBox: true,
      order: true,
      defaultSort: { prop: 'createTime', order: 'descending' },
      treeProps: {
        children: 'children',
        hasChildren: 'hasChildren'
      }
    }
  })
  onMounted(() => {
    nextTick(() => {
      diyTable.value.state.loading = false
      console.log('====', diyTable.value)
      diyTable.value.state.page.total = state.tableData.length
    })
  })
</script>

<style scoped></style>
