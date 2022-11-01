<template>
  <div>
    <el-table :data="state.tableData" style="width: 100%">
      <el-table-column
        v-for="(item, index) in tableHead"
        :key="index"
        :prop="item.prop"
        :label="item.label"
      />
      <el-table-column>
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleClick(scope.row)"
            >取消申请</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        small
        background
        layout="prev, pager, next"
        :total="50"
        class="mt-4"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import $services from '@/services'
  import { onMounted, reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'

  const current = ref(0)
  onMounted(() => {
    getData()
  })
  const getData = () => {
    $services.person
      .getAllApply({
        data: {
          offset: current.value,
          limit: 10
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          state.tableData = res.data.result
          // let arr = []
          // res.data.result.forEach((el: any) => {
          //   arr.push(el.team)
          // })
          // state.tableData = arr
          // console.log(state.tableData)
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
  const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
    current.value = val
  }

  const handleClick = (item: any) => {
    console.log('click', item)
    $services.person
      .cancelJoin({
        data: {
          id: item.id
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '取消申请成功',
            type: 'success'
          })
          getData()
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
  let state = reactive({ tableData: [] })
  const tableHead = [
    {
      prop: 'team[name]',
      label: '名称'
    },
    {
      prop: 'team[remark]',
      label: '备注'
    }
  ]
</script>

<style lang="scss" scoped>
  .page {
    background: #fff;
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    padding-right: 20px;
  }
</style>
