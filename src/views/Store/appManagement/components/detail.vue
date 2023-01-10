<template>
    <div class="store-detail">
        <i class="icon iconfont icon-jiantou-left"  @click="goback()"></i>
        <div class="detail-main">
            <div class="main-wrap">
                <img class="app-logo" src="@/assets/img/whatsapp.png" alt="" />
                <div class="content">
                    <div class="row">
                        <div class="app-name">{{appCtrl?.curProduct?.prod.name}}</div>
                    </div>
                    <div class="row">
                        <div class="describe">{{appCtrl?.curProduct?.prod.remark}}</div>
                    </div>
                    <div class="row row-flex">
                        <div class="describe">版本号：1</div>
                        <div>订阅到期时间 ：2022-09-16 14:13:12.902</div>
                        <div class="help"> 遇到问题? 联系运维</div>
                    </div>
                </div>
            </div>
            <div class="operation">
                <el-dropdown>
                    <span class="el-dropdown-link">
                        ···
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                        <el-dropdown-item>删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
    <div class="list-tabs">
        <div class="tabs-title">已共享信息</div>
        <el-tabs v-model="tabActive" class="demo-tabs" @tab-change="handleClick">
            <el-tab-pane label="组织" name="组织">
                <el-tag v-for="(item,index) in state.list.result" :key="index">{{item.name}}</el-tag>
            </el-tab-pane>
            <el-tab-pane label="职权" name="职权">
                <el-tag v-for="(item,index) in state.list.result" :key="index">{{item.name}}</el-tag>
            </el-tab-pane>
            <el-tab-pane label="身份" name="身份">
                <el-tag v-for="(item,index) in state.list.result" :key="index">{{item.name}}</el-tag>
            </el-tab-pane>
            <el-tab-pane label="人员" name="人员">
                <el-tag v-for="(item,index) in state.list.result" :key="index">{{item.name}}</el-tag>
            </el-tab-pane>
        </el-tabs>
    </div>
    <div class="data-wrap">
        <div class="data-title">资源信息</div>

        <div class="list-data">
            <div class="data-box">
                <div class="box-title">{{appCtrl.curProduct.prod.name}}</div>
                <div class="box-main">
                    <div class="data-row">
                        <p>资源名称</p>
                        <p>{{appCtrl.curProduct.resource[0].resource.name}}</p>
                    </div>
                    <div class="data-row">
                        <p>资源编码</p>
                        <p>{{appCtrl.curProduct.resource[0].resource.code || '-'}}</p>
                    </div>
                    <div class="data-row">
                        <p>资源地址</p>
                        <p>{{appCtrl.curProduct.resource[0].resource.link}}</p>
                    </div>
                </div>
            </div>
            <div class="data-box">
                <div class="box-title">业务信息</div>
                <div class="box-main">
                    <!-- <div class="data-row">
                        <p>资源名称</p>
                        <p>test</p>
                    </div> -->
                </div>
            </div>
            <div class="data-box">
                <div class="box-title">应用插件</div>
                <div class="box-main">
                    <!-- <div class="data-row">
                        <p>资源名称</p>
                        <p>test</p>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, onMounted, nextTick } from "vue";
    import { useRouter } from 'vue-router'
    import { appCtrl } from '@/ts/coreIndex';
    const props = defineProps({
        info: {
            type:Object
        }
    })
    const router = useRouter()
    const state = reactive<any>({
        list:[],
    })
    const goback = ()=>{
        router.go(-1)
    }
    const tabActive = ref<string>('组织')
    const handleClick = () => {
        getList();
    }
    const getList = async () =>{
        state.list = await appCtrl.curProduct.queryExtend(tabActive.value,'0');
    }
    onMounted(async ()=>{
        getList();
        console.log('appCtrl.curProduct',appCtrl.curProduct)
    })
</script>

<style lang="scss" scoped>
    .store-detail{
        width: 100%;
        background: #fff;
        padding: 10px 20px;
        font-size: 14px;
        .icon{
            font-size: 24px;
            margin-bottom: 18px;
        }
        .detail-main{
            color: #303133;
            display: flex;
            justify-content: space-between;
            .main-wrap{
                display: flex;
                // flex-direction: column;
            }
            .app-logo{
                width: 55px;
                height: 55px;
                border-radius: 5px;
                margin-bottom: 10px;
            }
            .content{
                
                display: flex;
                flex-direction: column;
                margin: 0px 10px;
                margin-left: 20px;
                padding-bottom: 20px;
                .row{
                    display: flex;
                    flex-direction: column;
                    margin-right: 20px;
                    .title{
                        color: #909399;
                        font-size: 12px;
                    }
                }
                .row-flex{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-top: 10px;
                    .describe{
                        margin-right: 10px;
                    }
                    .help{
                        margin-left: 10px;
                        color: #214dd0;
                        cursor: pointer;
                    }
                }
                .row:nth-child(1n){
                    margin-right: 60px;
                }
                .app-name{
                    margin-top: 10px;
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
            }
            .content-foot{
                font-size: 12px;
                margin-top: 20px;
                display: flex;
                align-items: center;
                flex: 1;
                .foot-row{
                    color: #909399;
                    margin-right: 40px;
                }
            }
        }
        .operation{
            width: 120px;
            display: flex;
            align-items: center;
            .el-dropdown-link{
                transform:rotate(90deg);
            }
        }
    }
    .list-tabs{
        margin-top: 3px;
        background: #fff;
        
        .tabs-title{
            font-size: 16px;
            padding: 10px 0;
            padding-left: 20px;
        }
        :deep(.el-tabs__nav-scroll){
            padding-left: 20px;
        }
        :deep(.el-tabs__nav-wrap::after){
            content:'';
            width: 0;
        }
        :deep(.el-tabs__content){
            border-top: 1px solid #f0f4f8;
            padding: 20px 0;
            padding-left: 20px;
        }
        :deep(.el-tag){
            margin-right: 10px;
        }
    }
    .data-wrap{
        padding: 15px;
        background: #fff;
        margin-top: 3px;
        .data-title{
            padding:10px 0;
        }
    }
    .list-data{
        padding:18px;
        border: 1px solid #f0f4f8;
        border-radius: 3px;
        .data-box{
            .box-title{
                margin-bottom: 20px;
                position: relative;
            }
            .box-title::after{
                content: '';
                position: absolute;
                width: 3px;
                height: 15px;
                background: #214dd0;
                left:-10px;
                top:2px
            }
            font-size: 14px;
            .box-main{
                display: flex;
                flex: 1;
                .data-row{
                    width: 50%;
                    p{
                        margin-bottom: 10px;

                    }
                    p:nth-child(1){
                        color: #909399;
                    }
                }
            }
        
        }
    }
</style>
