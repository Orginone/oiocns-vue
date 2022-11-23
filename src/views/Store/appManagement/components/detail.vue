<template>
    <div class="store-detail">
        <i class="icon iconfont icon-jiantou-left"  @click="goback()"></i>
        <div class="detail-main">
            <div class="main-wrap">
                <div class="title-tips">应用信息</div>
                <div class="logo-title">应用图标</div>
                <img class="app-logo" src="@/assets/img/whatsapp.png" alt="" />
                <div class="content">
                    <div class="row">
                        <div class="title">应用名称</div>
                        <div class="app-name">应用名称文本---</div>
                    </div>
                    <div class="row">
                        <div class="title">应用描述</div>
                        <div class="describe">描述描述描述描述描述描述描述描述描述描述</div>
                    </div>
                </div>
                <div class="content-foot">
                    <div class="foot-row">创建人:熊桂英</div>
                    <div class="foot-row">创建时间: 2022-11-08</div>
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
</template>

<script setup lang="ts">
    import { ref, reactive, onMounted, nextTick } from "vue";
    import { useRouter } from 'vue-router'
    const router = useRouter()
    const goback = ()=>{
        router.go(-1)
    }
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
                flex-direction: column;
                .title-tips{
                    font-weight: bold;
                    margin-bottom: 24px;
                    font-size: 16px;
                }
                .logo-title{
                    margin-bottom: 24px;
                    color: #909399;
                    font-size: 14px;
                }
            }
            .app-logo{
                width: 55px;
                height: 55px;
                border-radius: 5px;
                margin-bottom: 10px;
            }
            .content{
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
                .row{
                    display: flex;
                    flex-direction: column;
                    margin-right: 20px;
                    .title{
                        color: #909399;
                        font-size: 12px;
                    }
                }
                .row:nth-child(1n){
                    margin-right: 60px;
                }
                .app-name{
                    margin-top: 10px;
                }
                .describe{
                    margin-top: 10px;
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
                    margin-right: 30px;
                }
            }
        }
        .operation{
            width: 120px;
            display: flex;
            align-items: center;
            .pay-btn{
                width: 72px;
                height: 30px;
                text-align: center;
                line-height: 30px;
                color: #fff;
                background: #154AD8;
                border-radius: 15px;
            }
            .el-dropdown-link{
                transform:rotate(90deg);
            }
        }
    }
</style>
