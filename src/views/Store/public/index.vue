<template>
    <div class="main">
        <div class="content">
            <div class="content-title">
                <i class="icon iconfont icon-jiantou-left" @click="goBack"></i>
                <div>应用上架信息</div>
            </div>
            <div class="table">
                <DiyTable :style="{ width: '100%' }" ref="diyTable" :hasTabs="true"
                    :hasTitle="true" :hasTableHead="true" :tableData="state.list" :options="options"
                    :total="pageStore.total" @handleUpdate="handleUpdate" @selectionChange="selectionChange"
                    :tableHead="state.tableHead">
                    <template #expiresTime="scope">
                        永久
                    </template>
                    <template #merchandise.price="scope">
                        免费
                    </template>
                    <template #goodsType="scope">
                        <el-tag v-if="scope.row.merchandise">在售</el-tag>
                        <el-tag v-else type="info">已下架</el-tag>
                    </template>

                    <template #operate="scope">
                        <el-dropdown trigger="click">
                            <span class="el-dropdown-link"> ··· </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="removeShelf(scope.row)">下架</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </template>
                    <template #slot-card>
                        <div class="card-list">
                            <div class="card-item" v-for="(item, index) in state.list" :key="index">
                                <div class="item-head">
                                    <div class="item-img">{{ item.merchandise.caption.substring(0, 1) }}</div>
                                    <div class="item-head-content">
                                        <p>
                                            <span>{{ item.merchandise.caption }}
                                            </span>
                                            <el-dropdown>
                                                <span class="el-dropdown-link drop-list"> ··· </span>
                                                <template #dropdown>
                                                    <el-dropdown-menu>
                                                        <el-dropdown-item @click="removeShelf(item.merchandise)">下架</el-dropdown-item>
                                                    </el-dropdown-menu>
                                                </template>
                                            </el-dropdown>
                                        </p>
                                    </div>
                                </div>
                                <div class="item-content">
                                    {{ item.merchandise.remark }}
                                </div>
                                <div class="tag">
                                    <el-tag v-if="item.merchandise">在售</el-tag>
                                    <el-tag v-else type="info">已下架</el-tag>
                                </div>
                                <div class="time">创建于 {{ item.merchandise.createTime }}</div>
                            </div>
                        </div>
                    </template>
                </DiyTable>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import {
    onMounted,
    reactive,
    ref,
} from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import DiyTable from "@/components/diyTable/index.vue";
import {appCtrl} from '@/ts/coreIndex'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter();
const store = useUserStore();


// 表格展示数据
const pageStore = reactive({
    tableData: [],
    currentPage: 1,
    pageSize: 20,
    total: 0,
});

// 表格变更
const selectionChange = () => {
    console.log("aaa");
};
const options = ref<any>({
    checkBox: false,
    order: true,
    selectLimit: 1,
    noPage: false,
    switchType: true,
    defaultSort: { prop: "createTime", order: "descending" },
    treeProps: {
        children: "children",
        hasChildren: "hasChildren",
    },
});
const state = reactive({
    list: [],
    tableHead: [
        {
            prop: "merchandise.caption",
            name: "name",
            label: "商品名称",
            width: "200",
        },
        {
            prop: "merchandise.sellAuth",
            name: "tag",
            label: "购买属权",
            width: "100",
        },
        {
            type: 'slot',
            name: 'expiresTime',
            label: "使用期限",
            width: "80",
        },
        {
            type: 'slot',
            prop: "merchandise.price",
            name: "merchandise.price",
            label: "价格",
        },
        {
            prop: "merchandise.market.name",
            label: "市场名称",
            width: "150",
        },
        {
            prop: "merchandise.updateTime",
            label: "更新时间",
            width: '200',
        },
        {
            type: 'slot',
            name: 'goodsType',
            label: "商品状态",
            width: "200",
        },
        {
            type: "slot",
            label: "操作",
            fixed: "right",
            align: "center",
            width: "100",
            name: "operate",
        },
    ],
});
const title = ref<string>("");
onMounted(() => {
    // 获取列表
    appCtrl.setCurProduct(router.currentRoute.value.query.id as any);
    setTimeout(() => {
        getProductList();
    }, 1000);
});
const handleUpdate = (page: any) => {
    pageStore.currentPage = page.current;
    pageStore.pageSize = page.pageSize;
    getProductList();
};
// 获取我的应用列表
const getProductList = async (reload = false) => {
    let res = await appCtrl.curProduct?.getMerchandises(reload);
    state.list = ([...(res || [])]);
};
// 下架  
const removeShelf = (item: any) => {
    console.log(item);
    ElMessageBox.confirm(
        `确认下架商品 ${item.merchandise.caption} ?`,
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            const success = await appCtrl.curProduct!.unPublish(item.merchandise.id);
            if (success) {
                ElMessage({
                    type: 'success',
                    message: '商品下架成功',
                })
                getProductList(true);
            } else {
                ElMessage({
                    type: 'error',
                    message: '商品下架失败,请稍后重试',
                })
            }

        })
        .catch(() => {

        })

};
// 返回
const goBack = () => {
  window.history.go(-1)
}

</script>
<style lang="scss">
.el-dropdown-link {
    padding: 2px 10px;
    cursor: pointer;
    border-radius: 10px;
}

.el-dropdown-link:hover {
    background: #1642cb;
    color: #fff;
}
</style>
<style lang="scss" scoped>
.main {
    width: 100%;
    height: 100%;
    display: flex;

    .content {
        width: calc(100vw);
        display: flex;
        flex-direction: column;
        background: #f0f4f8;
        .content-title{
            background: #fff;
            display:flex;
            align-items: center;
            margin-top:3px;
            font-size: 14px;
            padding: 16px;
            i{
                margin-right: 10px;
            }
            border-bottom: 1px solid #ebeef5;
        }
        .table {
            background: #fff;
            height: calc(100vh - 100px);

            .btn-box {
                padding-bottom: 10px;
                width: 80px;
            }
        }
    }
}

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
  