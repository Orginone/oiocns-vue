<template>
    <div class="store-detail">
        <div class="detail-main">
            <div class="main-wrap">
                <div class="title-tips">应用管理</div>
                <div class="content">
                    <div class="row">
                        <div class="app-title">应用分配  <span>编辑</span></div>
                        <div class="app-list">
                            <div class="app-item">
                                <div class="app-name">应用角色A</div>
                                <div class="app-color">张三</div>
                            </div>
                            <div class="app-item">
                                <div class="app-name">应用角色A</div>
                                <div class="app-color">张三</div>
                            </div>
                            <div class="app-item">
                                <div class="app-name">应用角色A</div>
                                <div class="app-color">张三</div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";

</script>

<style lang="scss" scoped>
    .store-detail{
        width: 100%;
        background: #fff;
        padding: 10px 20px;
        font-size: 14px;
        margin-top: 4px;
        .detail-main{
            color: #303133;
            display: flex;
            justify-content: space-between;
            .main-wrap{
                display: flex;
                flex-direction: column;
                .title-tips{
                    font-weight: bold;
                    margin-bottom: 20px;
                    font-size: 16px;
                    
                }
            }
            .app-title{
                span{
                    color: #154AD8;
                    margin-left: 20px;
                }
            }
            .content{
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
                .app-list{
                    margin-left: 80px;
                    display: flex;
                    flex-wrap: wrap;
                }
                .app-item{
                    font-size: 14px;
                    margin-top: 10px;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    .app-name{
                        margin: 5px 0px;
                        color: #666;
                    }
                    .app-color{
                        background: #e4f2da;
                        padding: 3px 4px;
                        border-radius: 15px;
                        text-align: center;
                        font-size: 12px;
                    }
                }
            }
        }
    }
</style>
