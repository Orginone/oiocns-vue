<template>
    <div class="managerApproval">
      <MarketCard> </MarketCard>
      <div class="tabList">
        <DiyTable
          ref="diyTable"
          :hasTitle="false"
          :tableData="state.applyList"
          :tableHead="state.tableHead"
        >
          <template #operate="scope"> </template>
        </DiyTable>
      </div>
    </div>
  </template>
  <script lang="ts" setup>
    import $services from '@/services'
    import { onMounted, reactive, ref } from 'vue'
    import MarketCard from '@/components/marketCard/index.vue'
  
    import { ElMessage } from 'element-plus'
    import DiyTable from '@/components/diyTable/index.vue'
    const diyTable = ref(null)
    const state = reactive({
      applyList: [],
      tableHead: []
    })
  
    onMounted(() => {
      starterAppApprovalList()
    })
  
    //查询上架申请
    const starterAppApprovalList = async () => {
      await $services.appstore
        .searchPublishApply({
          data: {
            offset: 0,
            limit: 10,
            filter: ''
          }
        })
        .then((res: ResultType) => {
          if (res.success) {
            const { result = [], total = 0 } = res.data
            state.applyList = []
            state.applyList = result?.map(
              (item: {
                product: { name: any; code: any; source: any; authority: any; typeName: any }
              }) => {
                return {
                  ...item,
                  productCode: item.product.code,
                  productName: item.product.name,
                  productSource: item.product.source,
                  productAuthority: item.product.authority,
                  productTypeName: item.product.typeName
                }
              }
            )
            state.tableHead = [
              {
                prop: 'productCode',
                label: '应用编号'
              },
              {
                prop: 'productName',
                label: '应用名称'
              },
              {
                prop: 'productSource',
                label: '应用来源'
              },
              {
                prop: 'productAuthority',
                label: '应用权限'
              },
              {
                prop: 'productTypeName',
                label: '应用类型'
              },
              {
                prop: 'price',
                label: '价格'
              },
              {
                prop: 'days',
                label: '使用期限'
              },
              {
                prop: 'createTime',
                label: '创建时间',
                width: '200'
              }
            ]
          }
        })
    }
  </script>
  
  <style lang="scss" scoped>
    .managerApproval {
      width: 100%;
      height: 100%;
      background-color: #fff;
      .tabList {
        width: 100%;
        height: calc(100vh - 130px);
        padding-left: 6px;
      }
    }
  </style>
  